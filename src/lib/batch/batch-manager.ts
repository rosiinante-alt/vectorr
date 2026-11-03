import type { SupabaseClient } from '@supabase/supabase-js';

import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { batchQueue } from '@/lib/queue/queues';
import type { BatchJobData } from '@/lib/queue/types';

import type {
  BatchFileRecord,
  BatchJobRecord,
  BatchOptions,
  BatchStatusResponse,
  CreatedBatch,
} from './types';
import {
  BATCH_BUCKET,
  MAX_BATCH_FILES,
} from './types';
import {
  parseBatchOptions,
  progressPercent,
  toPersistedPreprocessing,
  validateBatchFileCount,
} from './validation';

export class BatchError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
    this.name = 'BatchError';
  }
}

export interface CreateBatchInput {
  userId: string;
  files: File[];
  options: BatchOptions;
  client: SupabaseClient;
}

/** Collapses an uploaded filename to something safe for a storage key. */
function storageSafeName(name: string, index: number): string {
  const base = name.split(/[/\\]/).pop() ?? 'file';
  const cleaned = base.replace(/[^\w.\-]+/g, '_').replace(/^_+|_+$/g, '');
  return `${String(index).padStart(2, '0')}-${cleaned || 'file'}`;
}

export class BatchManager {
  constructor(
    private readonly adminFactory: () => SupabaseClient = createSupabaseAdminClient,
    private readonly enqueue: (data: BatchJobData) => Promise<{ id?: string | null }> = async (data) =>
      batchQueue.add('batch', data),
  ) {}

  /**
   * Creates the `batch_jobs` row, uploads every source file, writes one
   * `batch_files` row per file, and only then hands the batch to BullMQ.
   *
   * Ordering matters: the queue is the last step so a worker can never pick up a
   * batch whose rows are still being written. Any failure before that point
   * deletes the half-built batch (cascading to `batch_files`) and its stored
   * objects.
   */
  async createBatch({ userId, files, options, client }: CreateBatchInput): Promise<CreatedBatch> {
    const countError = validateBatchFileCount(files.length);
    if (countError) throw new BatchError(countError, files.length > MAX_BATCH_FILES ? 413 : 400);

    const { data: batch, error: batchError } = await client
      .from('batch_jobs')
      .insert({
        user_id: userId,
        total_files: files.length,
        status: 'pending',
        preprocessing: toPersistedPreprocessing(options),
      })
      .select('*')
      .single<BatchJobRecord>();

    if (batchError || !batch) {
      throw new BatchError(batchError?.message ?? 'Could not create batch', 500);
    }

    const uploadedPaths: string[] = [];

    try {
      // Upload concurrently but bounded, so 50 large files do not open 50 sockets.
      const fileRows: Array<{ batch_id: string; file_url: string; status: 'pending' }> = [];
      const concurrency = 5;

      for (let start = 0; start < files.length; start += concurrency) {
        const slice = files.slice(start, start + concurrency);
        const uploaded = await Promise.all(
          slice.map(async (file, offset) => {
            const index = start + offset;
            const path = `batch/${userId}/${batch.id}/source/${storageSafeName(file.name, index)}`;
            // Workers read these without a user cookie, so uploads go through
            // the admin client; the key is scoped by the user id.
            const { error: uploadError } = await this.adminFactory()
              .storage.from(BATCH_BUCKET)
              .upload(path, file, { contentType: file.type || 'application/octet-stream', upsert: false });

            if (uploadError) throw new BatchError(`Upload failed for ${file.name}: ${uploadError.message}`, 502);
            uploadedPaths.push(path);

            const { data: publicUrl } = this.adminFactory().storage.from(BATCH_BUCKET).getPublicUrl(path);
            return { batch_id: batch.id, file_url: publicUrl.publicUrl, status: 'pending' as const };
          }),
        );
        fileRows.push(...uploaded);
      }

      const { data: batchFiles, error: filesError } = await client
        .from('batch_files')
        .insert(fileRows)
        .select('id, file_url')
        .order('created_at', { ascending: true });

      if (filesError || !batchFiles) {
        throw new BatchError(filesError?.message ?? 'Could not record batch files', 500);
      }

      const job = await this.enqueue({
        batchId: batch.id,
        userId,
        files: batchFiles.map((row) => ({ fileId: row.id as string, url: row.file_url as string })),
        preprocessing: toPersistedPreprocessing(options),
        outputFormat: options.outputFormat,
      });

      const { data: queued, error: queueError } = await client
        .from('batch_jobs')
        .update({ status: 'processing' })
        .eq('id', batch.id)
        .select('*')
        .single<BatchJobRecord>();

      if (queueError || !queued) {
        throw new BatchError(queueError?.message ?? 'Could not mark batch as queued', 500);
      }

      // The row id is what the UI polls; the BullMQ id is kept only for logs.
      return { ...queued, jobId: job.id ?? null } as CreatedBatch;
    } catch (error) {
      await this.cleanupFailedCreate(batch.id, uploadedPaths, client);
      throw error;
    }
  }

  async getBatchStatus(batchId: string, userId: string, client: SupabaseClient): Promise<BatchStatusResponse> {
    const { data: batch, error } = await client
      .from('batch_jobs')
      .select('*')
      .eq('id', batchId)
      .eq('user_id', userId)
      .maybeSingle<BatchJobRecord>();

    if (error) throw new BatchError(error.message, 500);
    if (!batch) throw new BatchError('Batch not found', 404);

    const { data: files, error: filesError } = await client
      .from('batch_files')
      .select('id, batch_id, file_url, status, result_url, error_message, credits_used, created_at, completed_at')
      .eq('batch_id', batchId)
      .order('created_at', { ascending: true });

    if (filesError) throw new BatchError(filesError.message, 500);

    return toStatusResponse(batch, (files ?? []) as BatchFileRecord[]);
  }

  async listUserBatches(userId: string, client: SupabaseClient, limit = 10): Promise<BatchStatusResponse[]> {
    const { data, error } = await client
      .from('batch_jobs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(Math.min(Math.max(limit, 1), 50));

    if (error) throw new BatchError(error.message, 500);
    return (data ?? []).map((batch) => toStatusResponse(batch as BatchJobRecord, []));
  }

  /**
   * Removes an abandoned batch and its stored objects. Best-effort: a failed
   * cleanup is logged rather than masking the original error.
   */
  private async cleanupFailedCreate(batchId: string, paths: string[], client: SupabaseClient) {
    try {
      if (paths.length > 0) {
        await this.adminFactory().storage.from(BATCH_BUCKET).remove(paths);
      }
      await client.from('batch_jobs').delete().eq('id', batchId);
    } catch (error) {
      console.error(`Failed to clean up batch ${batchId}:`, error);
    }
  }
}

function toStatusResponse(batch: BatchJobRecord, files: BatchFileRecord[]): BatchStatusResponse {
  const options = parseBatchOptions(batch.preprocessing);

  return {
    id: batch.id,
    status: batch.status,
    totalFiles: batch.total_files,
    completedFiles: batch.completed_files,
    failedFiles: batch.failed_files,
    progress: progressPercent(batch.completed_files, batch.failed_files, batch.total_files),
    preprocessing: options.preprocessing,
    outputFormat: options.outputFormat,
    createdAt: batch.created_at,
    completedAt: batch.completed_at,
    files: files.map((file) => ({
      id: file.id,
      status: file.status,
      resultUrl: file.result_url,
      errorMessage: file.error_message,
      creditsUsed: Number(file.credits_used ?? 0),
      createdAt: file.created_at,
      completedAt: file.completed_at,
    })),
  };
}

export const batchManager = new BatchManager();