import { Queue } from 'bullmq';

import { connection } from './client';

function createLazyQueue(name: string): Queue {
  let queue: Queue | undefined;

  return new Proxy({} as Queue, {
    get(_target, property) {
      queue ??= new Queue(name, { connection });
      const value = Reflect.get(queue, property, queue) as unknown;
      return typeof value === 'function' ? value.bind(queue) : value;
    },
  });
}

export const vectorizeQueue = createLazyQueue('vectorize');
export const removeBgQueue = createLazyQueue('remove-bg');
export const upscaleQueue = createLazyQueue('upscale');
export const batchQueue = createLazyQueue('batch');
export const exportQueue = createLazyQueue('export');
export const aiGenerateQueue = createLazyQueue('ai-generate');
export const styleTransferQueue = createLazyQueue('style-transfer');
