/**
 * Shared vocabulary for batch processing.
 *
 * The database is the source of truth for batch state: `batch_jobs` holds the
 * aggregate counters and a child `batch_files` row tracks every individual
 * file. BullMQ only carries the work between the API and the worker.
 */

export const MAX_BATCH_FILES = 50;
export const MAX_BATCH_FILE_BYTES = 10 * 1024 * 1024; // 10 MB, same as single upload
export const MAX_BATCH_BYTES = MAX_BATCH_FILES * MAX_BATCH_FILE_BYTES;

/**
 * Storage bucket for uploads and results. Both use the existing `vector-files`
 * bucket that single conversions already write to.
 */
export const BATCH_BUCKET = 'vector-files';

export const BATCH_IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const;

export type BatchStatus = 'pending' | 'processing' | 'complete' | 'failed' | 'partial';
export type BatchFileStatus = 'pending' | 'processing' | 'complete' | 'failed';

/** Mirrors the `conversions.output_format` check constraint. */
export type BatchOutputFormat = 'svg' | 'dxf' | 'eps' | 'ai' | 'pdf' | 'cdr' | 'lottie' | 'dst' | 'pes' | 'jef' | 'gcode';

export const BATCH_OUTPUT_FORMATS: readonly BatchOutputFormat[] = [
  'svg',
  'dxf',
  'eps',
  'ai',
  'pdf',
  'cdr',
  'lottie',
  'dst',
  'pes',
  'jef',
  'gcode',
];

export interface BatchPreprocessing {
  removeBg?: boolean;
  /** `false` and `"none"` both mean "do not upscale". */
  upscale?: '2x' | '4x' | false;
  destination?: 'web' | 'cricut' | 'laser' | 'print';
}

/**
 * Normalised, validated batch options. `preprocessing` is what actually gets
 * persisted in the `batch_jobs.preprocessing` jsonb column, with
 * `output_format` folded in because the table has no column of its own for it.
 */
export interface BatchOptions {
  preprocessing: BatchPreprocessing;
  outputFormat: BatchOutputFormat;
}

export interface BatchFileRecord {
  id: string;
  batch_id: string;
  file_url: string;
  status: BatchFileStatus;
  result_url: string | null;
  error_message: string | null;
  credits_used: string | number | null;
  created_at: string;
  completed_at: string | null;
}

export interface BatchJobRecord {
  id: string;
  user_id: string;
  team_id: string | null;
  status: BatchStatus;
  total_files: number;
  completed_files: number;
  failed_files: number;
  zip_url: string | null;
  zip_expires_at: string | null;
  preprocessing: Record<string, unknown>;
  created_at: string;
  completed_at: string | null;
}

export interface BatchFileProgress {
  id: string;
  status: BatchFileStatus;
  resultUrl: string | null;
  errorMessage: string | null;
  creditsUsed: number;
  createdAt: string;
  completedAt: string | null;
}

/** Returned by POST /api/batch and echoed back when the batch is enqueued. */
export interface CreatedBatch extends BatchJobRecord {
  jobId: string | null;
}

/** Shape returned by both batch API routes and consumed by the UI. */
export interface BatchStatusResponse {
  id: string;
  status: BatchStatus;
  totalFiles: number;
  completedFiles: number;
  failedFiles: number;
  /** 0–100, derived from the per-file counters. */
  progress: number;
  preprocessing: BatchPreprocessing;
  outputFormat: BatchOutputFormat;
  createdAt: string;
  completedAt: string | null;
  files: BatchFileProgress[];
}