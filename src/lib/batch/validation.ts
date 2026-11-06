import type { BatchOutputFormat, BatchOptions, BatchPreprocessing } from './types';
import { BATCH_OUTPUT_FORMATS, MAX_BATCH_FILES } from './types';
import { CREDIT_COSTS } from '../credits/constants';

/**
 * Credits deducted per converted file in a batch. Deliberately identical to the
 * `conversions.credits_used` default so a batch of N files costs exactly what N
 * single conversions would — batching is a convenience, not a discount.
 */
export const CREDITS_PER_BATCH_FILE = CREDIT_COSTS.VECTORIZE;

/** Per-file price including preprocessing, matching a single /api/convert call. */
export function batchFileCost(preprocessing: BatchPreprocessing = {}): number {
  const cost =
    CREDIT_COSTS.VECTORIZE +
    (preprocessing.removeBg ? CREDIT_COSTS.REMOVE_BG : 0) +
    (preprocessing.upscale === '2x' ? CREDIT_COSTS.UPSCALE_2X : 0) +
    (preprocessing.upscale === '4x' ? CREDIT_COSTS.UPSCALE_4X : 0);
  return Math.round(cost * 100) / 100;
}

export function batchCreditCost(fileCount: number, preprocessing: BatchPreprocessing = {}): number {
  // Round to 2dp to stay within numeric(6,2) and avoid float drift like 0.6000001.
  return Math.round(fileCount * batchFileCost(preprocessing) * 100) / 100;
}

export function isBatchOutputFormat(value: unknown): value is BatchOutputFormat {
  return typeof value === 'string' && (BATCH_OUTPUT_FORMATS as readonly string[]).includes(value);
}

function normalizePreprocessing(raw: unknown): BatchPreprocessing {
  const source = raw !== null && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const preprocessing: BatchPreprocessing = {};

  if (typeof source.removeBg === 'boolean') preprocessing.removeBg = source.removeBg;
  if (source.upscale === '2x' || source.upscale === '4x' || source.upscale === false) {
    preprocessing.upscale = source.upscale;
  }
  if (
    source.destination === 'web' ||
    source.destination === 'cricut' ||
    source.destination === 'laser' ||
    source.destination === 'print'
  ) {
    preprocessing.destination = source.destination;
  }

  return preprocessing;
}

/**
 * Reads batch options back out of a persisted `batch_jobs.preprocessing` value.
 * `output_format` rides along inside that jsonb because the table has no
 * dedicated column for it.
 */
export function parseBatchOptions(preprocessing: unknown): BatchOptions {
  const source = preprocessing !== null && typeof preprocessing === 'object'
    ? (preprocessing as Record<string, unknown>)
    : {};
  const { output_format: outputFormat, ...rest } = source;

  return {
    preprocessing: normalizePreprocessing(rest),
    outputFormat: isBatchOutputFormat(outputFormat) ? outputFormat : 'svg',
  };
}

export interface BatchValidationResult {
  ok: boolean;
  error?: string;
  value?: BatchOptions;
}

/** Validates the client-supplied options half of a batch request. */
export function validateBatchOptions(preprocessing: unknown, outputFormat: unknown): BatchValidationResult {
  const format = outputFormat ?? 'svg';
  if (!isBatchOutputFormat(format)) {
    return {
      ok: false,
      error: `Unsupported output format. Allowed: ${BATCH_OUTPUT_FORMATS.join(', ')}`,
    };
  }

  return {
    ok: true,
    value: { preprocessing: normalizePreprocessing(preprocessing), outputFormat: format },
  };
}

export function validateBatchFileCount(count: number): string | null {
  if (!Number.isInteger(count) || count < 1) return 'At least one file is required';
  if (count > MAX_BATCH_FILES) return `Maximum ${MAX_BATCH_FILES} files per batch`;
  return null;
}

/** Persisted form of `BatchOptions`, ready for the `preprocessing` jsonb column. */
export function toPersistedPreprocessing(options: BatchOptions): Record<string, unknown> {
  return { ...options.preprocessing, output_format: options.outputFormat };
}

export function fileExtension(format: BatchOutputFormat): string {
  return format === 'lottie' ? 'json' : format;
}

export function contentTypeFor(format: BatchOutputFormat): string {
  switch (format) {
    case 'svg':
      return 'image/svg+xml';
    case 'pdf':
      return 'application/pdf';
    case 'lottie':
      return 'application/json';
    default:
      return 'application/octet-stream';
  }
}

export function progressPercent(completed: number, failed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round(((completed + failed) / total) * 100));
}