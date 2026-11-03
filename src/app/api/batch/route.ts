import { NextResponse, type NextRequest } from 'next/server';

import { BatchError, batchManager } from '@/lib/batch/batch-manager';
import { MAX_BATCH_BYTES, MAX_BATCH_FILES } from '@/lib/batch/types';
import { validateBatchFileCount, validateBatchOptions } from '@/lib/batch/validation';
import { badRequest, jsonError, serverError, unauthorized } from '@/lib/http';
import { clientKey, rateLimit } from '@/lib/rate-limit';
import { authenticate } from '@/lib/supabase/server';

/** Batches are far heavier than single uploads, so the window is generous. */
const BATCH_LIMITS = { limit: 5, windowMs: 10 * 60 * 1000 }; // 5 batches per 10 minutes

/**
 * POST /api/batch
 * multipart/form-data:
 *   files            one or more image files (png, jpeg, webp; 10 MB each, 50 total)
 *   preprocessing    JSON string, e.g. {"removeBg":true,"upscale":"2x"}
 *   outputFormat     one of the supported output formats (default "svg")
 */
export async function POST(request: NextRequest) {
  const { user, supabase } = await authenticate();
  if (!user || !supabase) return unauthorized();

  const limiter = rateLimit(clientKey(request, 'batch'), BATCH_LIMITS.limit, BATCH_LIMITS.windowMs);
  if (!limiter.allowed) {
    return jsonError('Too many batches. Try again later.', 429, {
      retryAfterSeconds: limiter.retryAfterSeconds,
    });
  }

  // Reject an oversized body before buffering every file into memory.
  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > MAX_BATCH_BYTES + 1024 * 1024) {
    return jsonError(`Batch too large. Maximum ${MAX_BATCH_FILES} files of 10 MB each.`, 413);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return badRequest('Expected multipart/form-data with "files" fields');
  }

  const files = formData.getAll('files').filter((entry): entry is File => entry instanceof File);
  const countError = validateBatchFileCount(files.length);
  if (countError) return badRequest(countError);

  let preprocessing: unknown = {};
  const rawPreprocessing = formData.get('preprocessing');
  if (typeof rawPreprocessing === 'string' && rawPreprocessing.trim()) {
    try {
      preprocessing = JSON.parse(rawPreprocessing);
    } catch {
      return badRequest('preprocessing must be valid JSON');
    }
  }

  const options = validateBatchOptions(preprocessing, formData.get('outputFormat') ?? undefined);
  if (!options.ok || !options.value) return badRequest(options.error ?? 'Invalid batch options');

  try {
    const batch = await batchManager.createBatch({
      userId: user.id,
      files,
      options: options.value,
      client: supabase,
    });

    return NextResponse.json(batch, { status: 201 });
  } catch (error) {
    if (error instanceof BatchError) return jsonError(error.message, error.status);
    console.error('Failed to create batch:', error);
    return serverError('Failed to create batch');
  }
}

/**
 * GET /api/batch?limit=10
 * Recent batches for the signed-in user, newest first.
 */
export async function GET(request: NextRequest) {
  const { user, supabase } = await authenticate();
  if (!user || !supabase) return unauthorized();

  const rawLimit = Number(request.nextUrl.searchParams.get('limit') ?? 10);
  const limit = Number.isFinite(rawLimit) ? rawLimit : 10;

  try {
    return NextResponse.json({ batches: await batchManager.listUserBatches(user.id, supabase, limit) });
  } catch (error) {
    if (error instanceof BatchError) return jsonError(error.message, error.status);
    console.error('Failed to list batches:', error);
    return serverError('Failed to list batches');
  }
}