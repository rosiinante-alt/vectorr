import type { Job } from 'bullmq';

import { BatchWorker } from '@/lib/workers/batch-worker';
import type { ConversionEngine } from '@/lib/batch/conversion-engine';
import type { BatchJobData } from '@/lib/queue/types';

/** Records every call so the test can assert on persisted state. */
function createFakeSupabase() {
  const updates: Array<{ table: string; values: unknown }> = [];
  const uploads: Array<{ path: string }> = [];
  const rpcCalls: Array<{ fn: string; args: unknown }> = [];
  let currentStatus = 'processing';

  const client = {
    from(table: string) {
      const builder = {
        update(values: unknown) {
          updates.push({ table, values });
          if (table === 'batch_jobs' && values && typeof values === 'object') {
            const status = (values as Record<string, unknown>).status;
            if (typeof status === 'string') currentStatus = status;
          }
          return builder;
        },
        select() {
          return builder;
        },
        eq() {
          return builder;
        },
        async maybeSingle() {
          return { data: { status: currentStatus }, error: null };
        },
        then(resolve: (value: unknown) => unknown) {
          return Promise.resolve({ data: null, error: null }).then(resolve);
        },
      };
      return builder;
    },
    storage: {
      from() {
        return {
          upload: async (path: string) => {
            uploads.push({ path });
            return { data: { path }, error: null };
          },
          getPublicUrl: (path: string) => ({ data: { publicUrl: `https://cdn.test/${path}` } }),
        };
      },
    },
    rpc: async (fn: string, args: unknown) => {
      rpcCalls.push({ fn, args });
      return { data: true, error: null };
    },
  };

  return { client: client as never, updates, uploads, rpcCalls };
}

function makeJob(data: BatchJobData) {
  const progress: number[] = [];
  const job = {
    data,
    updateProgress: async (value: number) => {
      progress.push(value);
    },
  } as unknown as Job<BatchJobData>;
  return { job, progress };
}

/** Constructs a worker without leaking a Redis connection per instance. */
const createWorker = (...args: ConstructorParameters<typeof BatchWorker>) => new BatchWorker(...args);

const jobData: BatchJobData = {
  batchId: 'batch-1',
  userId: 'user-1',
  files: [
    { fileId: 'f1', url: 'https://cdn.test/1.png' },
    { fileId: 'f2', url: 'https://cdn.test/2.png' },
  ],
  preprocessing: { removeBg: true, output_format: 'svg' },
  outputFormat: 'svg',
};

function engine(overrides: Partial<ConversionEngine> = {}): ConversionEngine {
  return {
    removeBackground: jest.fn(async (url: string) => ({ outputUrl: `${url}?nobg` })),
    upscaleImage: jest.fn(async () => ({ outputUrl: 'https://cdn.test/upscaled.png' })),
    vectorizeImage: jest.fn(async () => ({ svg: '<svg><path d="M0 0"/></svg>' })),
    ...overrides,
  };
}

// BaseWorker constructs a real BullMQ Worker, which opens a Redis socket. The
// tests only exercise `process`, so the worker is stubbed out entirely.
jest.mock('bullmq', () => ({
  ...jest.requireActual('bullmq'),
  Worker: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    close: jest.fn().mockResolvedValue(undefined),
  })),
}));

describe('BatchWorker.process', () => {
  beforeEach(() => jest.spyOn(console, 'warn').mockImplementation(() => {}));
  afterEach(() => jest.restoreAllMocks());

  it('processes every file sequentially and marks the batch complete', async () => {
    const fake = createFakeSupabase();
    const fakeEngine = engine();
    const worker = createWorker(1, () => fake.client, async () => fakeEngine);
    const { job, progress } = makeJob(jobData);

    const result = (await worker.process(job)) as { completed: number; failed: number };

    expect(result).toMatchObject({ completed: 2, failed: 0 });
    expect(progress).toEqual([50, 100]);
    // One background removal per file, in order.
    expect(fakeEngine.removeBackground).toHaveBeenCalledTimes(2);
    expect(fakeEngine.vectorizeImage).toHaveBeenCalledTimes(2);
    // No upscaling was requested.
    expect(fakeEngine.upscaleImage).not.toHaveBeenCalled();

    expect(fake.uploads.map((u) => u.path)).toEqual([
      'batch/user-1/batch-1/results/f1.svg',
      'batch/user-1/batch-1/results/f2.svg',
    ]);

    const finalBatchUpdate = fake.updates
      .filter((u) => u.table === 'batch_jobs' && (u.values as Record<string, unknown>).status)
      .pop();
    expect(finalBatchUpdate?.values).toMatchObject({
      status: 'complete',
      completed_files: 2,
      failed_files: 0,
    });

    expect(fake.rpcCalls).toEqual([
      {
        fn: 'deduct_credits',
        args: { p_user_id: 'user-1', p_amount: 0.54, p_reason: 'batch_conversion', p_conversion_id: null },
      },
    ]);
  });

  it('records a failed file and finishes the batch as partial', async () => {
    const fake = createFakeSupabase();
    let call = 0;
    const fakeEngine = engine({
      vectorizeImage: jest.fn(async () => {
        call += 1;
        if (call === 2) throw new Error('Replicate exploded');
        return { svg: '<svg/>' };
      }),
    });
    const worker = createWorker(1, () => fake.client, async () => fakeEngine);
    const { job } = makeJob(jobData);

    const result = (await worker.process(job)) as { completed: number; failed: number };

    expect(result).toMatchObject({ completed: 1, failed: 1 });

    const failedFileUpdate = fake.updates.find(
      (u) => u.table === 'batch_files' && (u.values as Record<string, unknown>).status === 'failed',
    );
    expect(failedFileUpdate?.values).toMatchObject({ error_message: 'Replicate exploded' });

    const finalBatchUpdate = fake.updates
      .filter((u) => u.table === 'batch_jobs' && (u.values as Record<string, unknown>).status)
      .pop();
    expect(finalBatchUpdate?.values).toMatchObject({ status: 'partial', completed_files: 1, failed_files: 1 });

    // Only the successfully converted file is charged.
    expect(fake.rpcCalls[0].args).toMatchObject({ p_amount: 0.27 });
  });

  it('throws and marks the batch failed when every file fails', async () => {
    const fake = createFakeSupabase();
    const fakeEngine = engine({
      vectorizeImage: jest.fn(async () => {
        throw new Error('nope');
      }),
    });
    const worker = createWorker(1, () => fake.client, async () => fakeEngine);
    const { job } = makeJob(jobData);

    await expect(worker.process(job)).rejects.toThrow('All 2 file(s) failed to convert');

    const finalBatchUpdate = fake.updates
      .filter((u) => u.table === 'batch_jobs' && (u.values as Record<string, unknown>).status)
      .pop();
    expect(finalBatchUpdate?.values).toMatchObject({ status: 'failed', completed_files: 0, failed_files: 2 });

    // Nothing converted, so nothing is charged.
    expect(fake.rpcCalls).toHaveLength(0);
  });

  it('marks the batch failed when the result upload fails', async () => {
    const fake = createFakeSupabase();
    const failingStorage = fake.client as unknown as {
      storage: { from: () => { upload: unknown; getPublicUrl: unknown } };
    };
    const originalFrom = failingStorage.storage.from;
    failingStorage.storage.from = () => ({
      ...originalFrom(),
      upload: async () => ({ data: null, error: { message: 'quota exceeded' } }),
    });

    const worker = createWorker(1, () => fake.client, async () => engine());
    const { job } = makeJob({ ...jobData, files: [jobData.files[0]] });

    await expect(worker.process(job)).rejects.toThrow();

    const failedFileUpdate = fake.updates.find(
      (u) => u.table === 'batch_files' && (u.values as Record<string, unknown>).status === 'failed',
    );
    expect(failedFileUpdate?.values).toMatchObject({
      error_message: 'Result upload failed: quota exceeded',
    });
  });

  it('warns instead of throwing when credits are insufficient', async () => {
    const fake = createFakeSupabase();
    (fake.client as unknown as { rpc: unknown }).rpc = async () => ({ data: false, error: null });

    const worker = createWorker(1, () => fake.client, async () => engine());
    const { job } = makeJob({ ...jobData, files: [jobData.files[0]] });

    await expect(worker.process(job)).resolves.toMatchObject({ completed: 1 });
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Insufficient credits'));
  });
});