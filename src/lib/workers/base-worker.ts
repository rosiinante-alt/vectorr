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
      if (!job || !BaseWorker.isFinalAttempt(job)) return;

      this.onFinalFailure(job, error).catch((hookError) => {
        console.error(`Final-failure handler for job ${job.id} failed:`, hookError);
      });
    });
  }

  /** True once BullMQ will not retry the job again. */
  static isFinalAttempt(job: Job): boolean {
    const attempts = job.opts.attempts ?? 1;
    return job.attemptsMade >= attempts;
  }

  abstract process(job: Job<T>): Promise<unknown>;

  /**
   * Runs once, after the last retry has failed. Subclasses mark the row failed
   * and refund the customer here, so a job that later succeeds on retry is
   * never refunded.
   */
  protected async onFinalFailure(_job: Job<T>, _error: Error): Promise<void> {}

  async close() {
    await this.worker.close();
  }
}
