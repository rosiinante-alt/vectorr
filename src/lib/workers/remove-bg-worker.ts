import type { Job } from 'bullmq';

import { removeBackground, type RemoveBgResult } from '../ai/replicate-client';
import { BaseWorker } from './base-worker';

export interface RemoveBgJobData {
  imageUrl: string;
}

/** Standalone background removal, for callers that need a cut-out and nothing else. */
export class RemoveBgWorker extends BaseWorker<RemoveBgJobData> {
  constructor(concurrency = 5) {
    super('remove-bg', concurrency);
  }

  async process(job: Job<RemoveBgJobData>): Promise<RemoveBgResult> {
    await job.updateProgress(10);
    const result = await removeBackground(job.data.imageUrl);
    await job.updateProgress(100);
    return result;
  }
}