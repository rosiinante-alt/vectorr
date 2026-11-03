import type { Job } from 'bullmq';

import { removeBackground, upscaleImage, vectorizeImage } from '../ai/replicate-client';
import { exportFile } from '../exporters';
import { createSupabaseAdminClient } from '../supabase/server';
import type { VectorizeJobData } from '../queue/types';
import { STORAGE_BUCKET } from '../validation';
import { BaseWorker } from './base-worker';

const CONTENT_TYPES: Record<string, string> = {
  svg: 'image/svg+xml',
  dxf: 'image/vnd.dxf',
  eps: 'application/postscript',
  pdf: 'application/pdf',
  gcode: 'text/plain',
  dst: 'application/octet-stream',
  pes: 'application/octet-stream',
  jef: 'application/octet-stream',
};

/**
 * Turns an uploaded raster image into vector output.
 *
 * Status is reported to the caller through both the `conversions` row (the
 * user-facing status) and BullMQ job progress (the polling endpoint).
 *
 * Workers run outside a request scope, so they use the service-role client
 * rather than the cookie-bound server client.
 */
export class VectorizeWorker extends BaseWorker<VectorizeJobData> {
  constructor(concurrency = 3) {
    super('vectorize', concurrency);
  }

  async process(job: Job<VectorizeJobData>) {
    const { conversionId, userId, originalFileUrl, preprocessing, outputFormat = 'svg' } = job.data;
    const supabase = createSupabaseAdminClient();

    const update = (patch: Record<string, unknown>) =>
      supabase.from('conversions').update(patch).eq('id', conversionId);

    try {
      await update({ status: 'processing' });

      let workingUrl = originalFileUrl;

      // Background removal runs before upscaling so the upscaler does not spend
      // resolution on pixels that are about to be discarded.
      if (preprocessing?.removeBg) {
        await job.updateProgress(20);
        const { outputUrl } = await removeBackground(workingUrl);
        workingUrl = outputUrl;
      }

      if (preprocessing?.upscale === '2x' || preprocessing?.upscale === '4x') {
        await job.updateProgress(40);
        const { outputUrl } = await upscaleImage(workingUrl, preprocessing.upscale === '4x' ? 4 : 2);
        workingUrl = outputUrl;
      }

      await job.updateProgress(60);
      const { svg } = await vectorizeImage(workingUrl);

      // Non-SVG destinations are derived from the traced SVG locally.
      await job.updateProgress(80);
      const payload = outputFormat === 'svg' ? svg : await exportFile(outputFormat, svg);

      const storagePath = `${userId}/${conversionId}.${outputFormat}`;
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, payload, {
          contentType: CONTENT_TYPES[outputFormat] ?? 'application/octet-stream',
          upsert: true,
        });

      if (uploadError) throw new Error(uploadError.message);

      const { data: signed, error: signError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(storagePath, 60 * 60 * 24 * 7);

      if (signError || !signed) {
        throw new Error(signError?.message ?? 'Could not sign converted file URL');
      }

      await update({
        status: 'complete',
        converted_file_url: signed.signedUrl,
        completed_at: new Date().toISOString(),
        error_message: null,
      });

      await job.updateProgress(100);

      return { success: true, convertedFileUrl: signed.signedUrl };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';

      // A failed status write must not mask the original failure.
      try {
        await update({ status: 'failed', error_message: message });
      } catch {
        // Ignored: the job error below is the one that matters.
      }

      throw error;
    }
  }
}