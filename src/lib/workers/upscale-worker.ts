import type { Job } from 'bullmq';

import { upscaleImage, type UpscaleResult } from '../ai/replicate-client';
import { BaseWorker } from './base-worker';

export interface UpscaleJobData {
  imageUrl: string;
  scale?: 2 | 4;
}

/** Standalone upscaling, for callers that need a larger raster and nothing else. */
export class UpscaleWorker extends BaseWorker<UpscaleJobData> {
  constructor(concurrency = 5) {
    super('upscale', concurrency);
  }

  async process(job: Job<UpscaleJobData>): Promise<UpscaleResult> {
    await job.updateProgress(10);
    const result = await upscaleImage(job.data.imageUrl, job.data.scale ?? 2);
    await job.updateProgress(100);
    return result;
  }
}