import { NextResponse, type NextRequest } from 'next/server';

import { badRequest, readJson, serverError, unauthorized } from '@/lib/http';
import { vectorizeQueue } from '@/lib/queue/queues';
import type { VectorizeJobData } from '@/lib/queue/types';
import { clientKey, rateLimit, LIMITS } from '@/lib/rate-limit';
import { authenticate } from '@/lib/supabase/server';
import { STORAGE_BUCKET } from '@/lib/validation';

/** Raster formats accepted by the `conversions.original_format` constraint. */
const SOURCE_FORMATS = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'heic', 'tiff', 'bmp'] as const;
const OUTPUT_FORMATS = ['svg', 'dxf', 'eps', 'pdf'] as const;

const JOB_TTL_MS = 24 * 60 * 60 * 1000;

type SourceFormat = (typeof SOURCE_FORMATS)[number];
type OutputFormat = (typeof OUTPUT_FORMATS)[number];

function isSourceFormat(value: unknown): value is SourceFormat {
  return typeof value === 'string' && (SOURCE_FORMATS as readonly string[]).includes(value);
}

function isOutputFormat(value: unknown): value is OutputFormat {
  return typeof value === 'string' && (OUTPUT_FORMATS as readonly string[]).includes(value);
}

/**
 * Storage path of an uploaded object, or null when `value` is already an
 * absolute URL that Replicate can fetch directly.
 */
function storagePathOf(value: string): string | null {
  if (/^https?:\/\//i.test(value)) return null;
  return value.replace(/^\/+/, '');
}

/**
 * POST /api/convert
 *
 * Queues a raster → vector conversion.
 *
 * Body: `{ fileUrl, originalFormat, outputFormat?, preprocessing? }`
 *
 * `fileUrl` is either an absolute public URL or the path of an object already
 * in the `vector-files` bucket. Private objects are handed to the worker as a
 * signed URL, because Replicate fetches inputs over the public internet.
 *
 * Responds 202 with `{ conversionId, jobId }`; poll `GET /api/jobs/[id]` for
 * progress.
 */
export async function POST(request: NextRequest) {
  const { user, supabase } = await authenticate();
  if (!user || !supabase) {
    return unauthorized();
  }

  const limiter = rateLimit(
    clientKey(request, 'convert'),
    LIMITS.upload.limit,
    LIMITS.upload.windowMs,
  );
  if (!limiter.allowed) {
    return NextResponse.json(
      {
        error: 'Too many conversions. Try again later.',
        details: { retryAfterSeconds: limiter.retryAfterSeconds },
      },
      { status: 429, headers: { 'Retry-After': String(limiter.retryAfterSeconds) } },
    );
  }

  const body = await readJson(request);
  const fileUrl = typeof body.fileUrl === 'string' ? body.fileUrl.trim() : '';
  if (!fileUrl) {
    return badRequest('"fileUrl" is required');
  }

  if (body.originalFormat !== undefined && !isSourceFormat(body.originalFormat)) {
    return badRequest(`"originalFormat" must be one of: ${SOURCE_FORMATS.join(', ')}`);
  }

  const outputFormat: OutputFormat = isOutputFormat(body.outputFormat) ? body.outputFormat : 'svg';

  const rawPreprocessing =
    body.preprocessing && typeof body.preprocessing === 'object'
      ? (body.preprocessing as Record<string, unknown>)
      : {};

  const preprocessing: NonNullable<VectorizeJobData['preprocessing']> = {
    removeBg: rawPreprocessing.removeBg === true,
    upscale:
      rawPreprocessing.upscale === '2x' || rawPreprocessing.upscale === '4x'
        ? rawPreprocessing.upscale
        : undefined,
  };

  // Resolve the object to a URL the worker (and Replicate) can read. Objects in
  // the private bucket must be signed; absolute URLs are used as-is.
  let originalFileUrl = fileUrl;
  const storagePath = storagePathOf(fileUrl);
  if (storagePath) {
    const { data: signed, error: signError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(storagePath, JOB_TTL_MS);

    if (signError || !signed) {
      return badRequest('Could not read that file. Upload it first.', {
        detail: signError?.message ?? 'Signing failed',
      });
    }
    originalFileUrl = signed.signedUrl;
  }

  // Fall back to the extension when the caller does not declare a format.
  const extension = fileUrl.split('.').pop()?.toLowerCase() ?? '';
  const originalFormat: SourceFormat = isSourceFormat(body.originalFormat)
    ? body.originalFormat
    : isSourceFormat(extension)
      ? extension
      : 'png';

  const { data: conversion, error: insertError } = await supabase
    .from('conversions')
    .insert({
      user_id: user.id,
      original_file_url: originalFileUrl,
      original_format: originalFormat,
      output_format: outputFormat,
      preprocessing,
      status: 'pending',
    })
    .select()
    .single();

  if (insertError || !conversion) {
    return serverError(insertError?.message ?? 'Failed to create conversion');
  }

  try {
    const job = await vectorizeQueue.add(
      'vectorize',
      {
        conversionId: conversion.id,
        userId: user.id,
        originalFileUrl,
        preprocessing,
        outputFormat,
      } satisfies VectorizeJobData,
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: { age: JOB_TTL_MS, count: 1000 },
        removeOnFail: { age: JOB_TTL_MS },
      },
    );

    await supabase.from('conversions').update({ job_id: job.id }).eq('id', conversion.id);

    return NextResponse.json({ conversionId: conversion.id, jobId: job.id }, { status: 202 });
  } catch (error) {
    // The row exists but nothing will process it; mark it failed rather than
    // leaving it pending forever.
    await supabase
      .from('conversions')
      .update({
        status: 'failed',
        error_message: 'Could not queue the conversion',
      })
      .eq('id', conversion.id);

    return serverError(
      error instanceof Error ? `Queue unavailable: ${error.message}` : 'Queue unavailable',
    );
  }
}