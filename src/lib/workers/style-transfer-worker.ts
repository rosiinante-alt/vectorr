import type { Job } from 'bullmq';

import { applyStyleTransfer } from '../ai/style-transfer-service';
import { createSupabaseAdminClient } from '../supabase/server';
import { BaseWorker } from './base-worker';

export interface StyleTransferJobData {
  /** `ai_generations.id` row of type `style_transfer`. */
  styleTransferId: string;
  userId: string;
  imageUrl: string;
  presetId: string;
  customParams?: Record<string, unknown>;
}

const BUCKET = 'ai-generations';

/**
 * Runs a queued style transfer and records the result.
 *
 * Uses the service-role client because the worker has no user session; RLS would
 * otherwise reject every read and write. The job already carries the owning
 * user id, so the row is still scoped to that user on update.
 */
export class StyleTransferWorker extends BaseWorker<StyleTransferJobData> {
  constructor(concurrency = 5) {
    super('style-transfer', concurrency);
  }

  async process(job: Job<StyleTransferJobData>) {
    const { styleTransferId, userId, imageUrl, presetId, customParams } = job.data;
    const supabase = createSupabaseAdminClient();

    try {
      await job.updateProgress(10);

      const styledImageUrl = await applyStyleTransfer({
        imageUrl,
        presetId,
        customParams,
        onProgress: (percent) => void job.updateProgress(percent),
      });

      await job.updateProgress(70);

      const response = await fetch(styledImageUrl);
      if (!response.ok) {
        throw new Error(`Could not download styled image: ${response.status}`);
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.byteLength === 0) {
        throw new Error('Styled image was empty');
      }

      const fileName = `${userId}/${styleTransferId}.png`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, buffer, { contentType: 'image/png', upsert: true });

      if (uploadError) {
        throw new Error(`Could not store styled image: ${uploadError.message}`);
      }

      // The bucket is private, so a long-lived signed URL is what the UI can
      // actually render. Re-signing is a separate concern from the row.
      const { data: signed, error: signError } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(fileName, 60 * 60 * 24 * 7);

      if (signError || !signed) {
        throw new Error(`Could not sign styled image URL: ${signError?.message ?? 'no URL'}`);
      }

      await job.updateProgress(95);

      const { error: updateError } = await supabase
        .from('ai_generations')
        .update({
          status: 'complete',
          result_url: signed.signedUrl,
          completed_at: new Date().toISOString(),
        })
        .eq('id', styleTransferId)
        .eq('user_id', userId);

      if (updateError) {
        throw new Error(`Could not record style transfer: ${updateError.message}`);
      }

      await job.updateProgress(100);
      return { success: true, outputUrl: signed.signedUrl };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      await supabase
        .from('ai_generations')
        .update({ status: 'failed', error_message: message })
        .eq('id', styleTransferId)
        .eq('user_id', userId);

      throw error;
    }
  }
}