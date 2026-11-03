import type { Job } from 'bullmq';
import type { SupabaseClient } from '@supabase/supabase-js';

import { BaseWorker } from './base-worker';
import { batchCreditCost, contentTypeFor, CREDITS_PER_BATCH_FILE, fileExtension, parseBatchOptions } from '../batch/validation';
import { convertBatchFile, type ConversionEngine } from '../batch/conversion-engine';
import { BATCH_BUCKET, type BatchPreprocessing } from '../batch/types';
import type { BatchJobData } from '../queue/types';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

interface BatchFileOutcome {
  fileId: string;
  status: 'complete' | 'failed';
  resultUrl?: string;
  error?: string;
}

/**
 * Processes a batch one file at a time.
 *
 * Sequential on purpose: each file costs money at Replicate and a batch can hold
 * 50 of them, so one batch must never fan out into 50 concurrent calls. The
 * queue-level concurrency (2) then bounds simultaneous batches at 2.
 */
export class BatchWorker extends BaseWorker<BatchJobData> {
  constructor(
    private readonly adminFactory: () => SupabaseClient = createSupabaseAdminClient,
    private readonly engineFactory?: () => Promise<ConversionEngine>,
  ) {
    super('batch', 2);
  }

  async process(job: Job<BatchJobData>) {
    const { batchId, userId, files } = job.data;
    const supabase = this.adminFactory();
    const { preprocessing, outputFormat } = parseBatchOptions(job.data.preprocessing ?? {});

    try {
      await supabase.from('batch_jobs').update({ status: 'processing' }).eq('id', batchId);

      const engine = this.engineFactory ? await this.engineFactory() : undefined;
      const outcomes: BatchFileOutcome[] = [];

      for (const [index, file] of files.entries()) {
        await supabase
          .from('batch_files')
          .update({ status: 'processing' })
          .eq('id', file.fileId);

        try {
          const { content, contentType } = await convertBatchFile(
            { sourceUrl: file.url, preprocessing: preprocessing as BatchPreprocessing, outputFormat },
            engine,
          );

          const resultPath = `batch/${userId}/${batchId}/results/${file.fileId}.${fileExtension(outputFormat)}`;
          const { error: uploadError } = await supabase.storage
            .from(BATCH_BUCKET)
            .upload(resultPath, content, {
              contentType: contentType || contentTypeFor(outputFormat),
              upsert: true,
            });

          if (uploadError) throw new Error(`Result upload failed: ${uploadError.message}`);

          const { data: publicUrl } = supabase.storage.from(BATCH_BUCKET).getPublicUrl(resultPath);

          await supabase
            .from('batch_files')
            .update({
              status: 'complete',
              result_url: publicUrl.publicUrl,
              error_message: null,
              credits_used: CREDITS_PER_BATCH_FILE,
              completed_at: new Date().toISOString(),
            })
            .eq('id', file.fileId);

          outcomes.push({ fileId: file.fileId, status: 'complete', resultUrl: publicUrl.publicUrl });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error';

          await supabase
            .from('batch_files')
            .update({
              status: 'failed',
              error_message: message,
              completed_at: new Date().toISOString(),
            })
            .eq('id', file.fileId);

          outcomes.push({ fileId: file.fileId, status: 'failed', error: message });
        }

        // Counters are written after every file so the status API reflects live
        // progress rather than only the final tally.
        const completed = outcomes.filter((outcome) => outcome.status === 'complete').length;
        const failed = outcomes.length - completed;

        await supabase
          .from('batch_jobs')
          .update({ completed_files: completed, failed_files: failed })
          .eq('id', batchId);

        await job.updateProgress(Math.round(((index + 1) / files.length) * 100));
      }

      const completed = outcomes.filter((outcome) => outcome.status === 'complete').length;
      const failed = outcomes.length - completed;
      const allFailed = completed === 0 && failed > 0;

      await supabase
        .from('batch_jobs')
        .update({
          status: allFailed ? 'failed' : failed > 0 ? 'partial' : 'complete',
          completed_files: completed,
          failed_files: failed,
          completed_at: new Date().toISOString(),
        })
        .eq('id', batchId);

      await this.deductCredits(supabase, userId, completed, batchId);

      // A partial batch is still a useful result, so only a total failure throws.
      if (allFailed) {
        throw new Error(`All ${failed} file(s) failed to convert`);
      }

      return { success: true, completed, failed, results: outcomes };
    } catch (error) {
      // Only touch the batch row if it has not already been finalised above.
      const { data: current } = await supabase
        .from('batch_jobs')
        .select('status')
        .eq('id', batchId)
        .maybeSingle();

      if (current && current.status !== 'failed') {
        await supabase
          .from('batch_jobs')
          .update({
            status: 'failed',
            completed_at: new Date().toISOString(),
          })
          .eq('id', batchId);
      }

      throw error;
    }
  }

  /**
   * Charges the batch as a whole, once, for the files that actually converted.
   * `deduct_credits` returns false on an insufficient balance; that is logged
   * rather than thrown because the work has already been done and paid for
   * upstream — failing the job here would not un-spend it.
   */
  private async deductCredits(
    supabase: SupabaseClient,
    userId: string,
    completedFiles: number,
    batchId: string,
  ) {
    if (completedFiles <= 0) return;

    const amount = batchCreditCost(completedFiles);
    const { data, error } = await supabase.rpc('deduct_credits', {
      p_user_id: userId,
      p_amount: amount,
      p_reason: 'batch_conversion',
      p_conversion_id: null,
    });

    if (error) {
      console.error(`Credit deduction failed for batch ${batchId}:`, error.message);
      return;
    }

    if (data === false) {
      console.warn(`Insufficient credits for batch ${batchId}; ${amount} credits were not charged`);
    }
  }
}