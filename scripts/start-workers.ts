#!/usr/bin/env ts-node

/**
 * Starts all BullMQ workers to process queued jobs.
 * Run this alongside `npm run dev` during development.
 * 
 * Usage:
 *   npm run workers
 *   
 * Or directly:
 *   ts-node scripts/start-workers.ts
 */

import { VectorizeWorker } from '../src/lib/workers/vectorize-worker';
import { UpscaleWorker } from '../src/lib/workers/upscale-worker';
import { RemoveBgWorker } from '../src/lib/workers/remove-bg-worker';
import { BatchWorker } from '../src/lib/workers/batch-worker';
import { StyleTransferWorker } from '../src/lib/workers/style-transfer-worker';

console.log('🚀 Starting Vectorr workers...\n');

const vectorizeWorker = new VectorizeWorker(2); // 2 concurrent vectorize jobs
const upscaleWorker = new UpscaleWorker(2);
const removeBgWorker = new RemoveBgWorker(2);
const batchWorker = new BatchWorker(); // 1 batch at a time
const styleTransferWorker = new StyleTransferWorker(2); // 2 concurrent style transfers

const allWorkers = [vectorizeWorker, upscaleWorker, removeBgWorker, batchWorker, styleTransferWorker];

console.log('✓ VectorizeWorker listening on "vectorize" queue');
console.log('✓ UpscaleWorker listening on "upscale" queue');
console.log('✓ RemoveBgWorker listening on "remove-bg" queue');
console.log('✓ BatchWorker listening on "batch" queue');
console.log('✓ StyleTransferWorker listening on "style-transfer" queue');
console.log('\n📡 Workers ready. Press Ctrl+C to stop.\n');

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⏸️  Shutting down workers...');
  await Promise.all(allWorkers.map((worker) => worker.close()));
  console.log('✓ All workers stopped.');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⏸️  Received SIGTERM, shutting down...');
  await Promise.all(allWorkers.map((worker) => worker.close()));
  process.exit(0);
});
