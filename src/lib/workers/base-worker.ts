import { Job, Worker } from 'bullmq';

import { connection } from '../queue/client';

export abstract class BaseWorker<T = unknown> {
  protected worker: Worker<T>;

  constructor(queueName: string, concurrency = 5) {
    this.worker = new Worker<T>(
      queueName,
      async (job: Job<T>) => {
        try {
          return await this.process(job);
        } catch (error) {
          console.error(`Job ${job.id} failed:`, error);
          throw error;
        }
      },
      {
        connection,
        concurrency,
        limiter: {
          max: 10,
          duration: 1000,
        },
      },
    );

    this.worker.on('completed', (job) => {
      console.log(`Job ${job.id} completed`);
    });

    this.worker.on('failed', (job, error) => {
      console.error(`Job ${job?.id} failed:`, error);
    });
  }

  abstract process(job: Job<T>): Promise<unknown>;

  async close() {
    await this.worker.close();
  }
}
