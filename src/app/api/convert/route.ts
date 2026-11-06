import { NextResponse, type NextRequest } from 'next/server';

import { badRequest, readJson, serverError, unauthorized } from '@/lib/http';
import { vectorizeQueue } from '@/lib/queue/queues';
import type { VectorizeJobData } from '@/lib/queue/types';
import { clientKey, rateLimit, LIMITS } from '@/lib/rate-limit';
import { authenticate, createSupabaseAdminClient } from '@/lib/supabase/server';
import { STORAGE_BUCKET } from '@/lib/validation';
import { CREDIT_COSTS } from '@/lib/credits/constants';
import { creditManager } from '@/lib/credits/credit-manager';

/** Raster formats accepted by the `conversions.original_format` constraint. */
const SOURCE_FORMATS = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'heic', 'tiff', 'bmp'] as const;
const OUTPUT_FORMATS = [
  'svg',
  'dxf',
  'eps',
  'pdf',
  'gcode',
  'dst',
  'pes',
  'jef',
  '3mf',
  'stl',
  'obj',
  'color-separation',
] as const;

const JOB_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_UPLOAD_SIZE = 50 * 1024 * 1024; // 50 MB

type SourceFormat = (typeof SOURCE_FORMATS)[number];
type OutputFormat = (typeof OUTPUT_FORMATS)[number];

function isSourceFormat(value: unknown): value is SourceFormat {
  return typeof value === 'string' && (SOURCE_FORMATS as readonly string[]).includes(value);
}

function isOutputFormat(value: unknown): value is OutputFormat {
  return typeof value === 'string' && (OUTPUT_FORMATS as readonly string[]).includes(value);
}

function storagePathOf(value: string): string | null {
  if (/^https?:\/\//i.test(value)) return null;
  return value.replace(/^\/+/, '');
}

/**
 * POST /api/convert
 *
 * Queues a raster → vector conversion.
 *
 * Accepts either:
 * 1. multipart/form-data with "file", "outputFormat", "removeBg", "upscale"
 * 2. application/json with { fileUrl, originalFormat, outputFormat?, preprocessing? }
 *
 * Responds 202 with `{ conversionId, jobId, creditCost, remainingBalance }`;
 * poll `GET /api/jobs/[id]` for progress.
 */
export async function POST(request: NextRequest) {
  const { user, supabase } = await authenticate();
  if (!user || !supabase) {
    return unauthorized();
  }

  const adminSupabase = createSupabaseAdminClient();

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

  const contentType = request.headers.get('content-type') || '';
  let originalFileUrl = '';
  let originalFormat: SourceFormat = 'png';
  let outputFormat: OutputFormat = 'svg';
  let preprocessing: NonNullable<VectorizeJobData['preprocessing']> = {
    removeBg: false,
    upscale: undefined,
  };

  if (contentType.includes('multipart/form-data')) {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (err) {
      return badRequest('Failed to parse form data');
    }

    const fileCandidate = formData.get('file');
    if (!(fileCandidate instanceof File)) {
      return badRequest('File is required in "file" field');
    }

    if (fileCandidate.size > MAX_UPLOAD_SIZE) {
      return badRequest('File exceeds maximum size of 50 MB');
    }

    const extFromName = fileCandidate.name.split('.').pop()?.toLowerCase() || '';
    if (!isSourceFormat(extFromName)) {
      return badRequest(`Unsupported file format. Must be one of: ${SOURCE_FORMATS.join(', ')}`);
    }
    originalFormat = extFromName;

    const requestedOutput = formData.get('outputFormat');
    if (isOutputFormat(requestedOutput)) {
      outputFormat = requestedOutput;
    }

    preprocessing = {
      removeBg: formData.get('removeBg') === 'true',
      upscale:
        formData.get('upscale') === '2x' || formData.get('upscale') === '4x'
          ? (formData.get('upscale') as '2x' | '4x')
          : undefined,
    };

    // Upload file to Supabase storage
    const safeName = fileCandidate.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${user.id}/${Date.now()}-${safeName}`;
    const buffer = Buffer.from(await fileCandidate.arrayBuffer());

    const { error: uploadError } = await adminSupabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, buffer, {
        contentType: fileCandidate.type || 'image/png',
        upsert: true,
      });

    if (uploadError) {
      return serverError(`Failed to upload file to storage: ${uploadError.message}`);
    }

    // Get signed URL for Replicate access
    const { data: signed, error: signError } = await adminSupabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(storagePath, JOB_TTL_MS);

    if (signError || !signed?.signedUrl) {
      return serverError('Failed to generate accessible URL for conversion');
    }

    originalFileUrl = signed.signedUrl;
  } else {
    // JSON body
    const body = await readJson(request);
    const fileUrl = typeof body.fileUrl === 'string' ? body.fileUrl.trim() : '';
    if (!fileUrl) {
      return badRequest('"fileUrl" is required');
    }

    if (body.originalFormat !== undefined && !isSourceFormat(body.originalFormat)) {
      return badRequest(`"originalFormat" must be one of: ${SOURCE_FORMATS.join(', ')}`);
    }

    if (isOutputFormat(body.outputFormat)) {
      outputFormat = body.outputFormat;
    }

    const rawPreprocessing =
      body.preprocessing && typeof body.preprocessing === 'object'
        ? (body.preprocessing as Record<string, unknown>)
        : {};

    preprocessing = {
      removeBg: rawPreprocessing.removeBg === true,
      upscale:
        rawPreprocessing.upscale === '2x' || rawPreprocessing.upscale === '4x'
          ? rawPreprocessing.upscale
          : undefined,
    };

    originalFileUrl = fileUrl;
    const storagePath = storagePathOf(fileUrl);
    if (storagePath) {
      const { data: signed, error: signError } = await adminSupabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(storagePath, JOB_TTL_MS);

      if (signError || !signed) {
        return badRequest('Could not read that file. Upload it first.', {
          detail: signError?.message ?? 'Signing failed',
        });
      }
      originalFileUrl = signed.signedUrl;
    }

    const extension = fileUrl.split('.').pop()?.toLowerCase() ?? '';
    originalFormat = isSourceFormat(body.originalFormat)
      ? body.originalFormat
      : isSourceFormat(extension)
        ? extension
        : 'png';
  }

  // Calculate required credits
  const creditCost =
    CREDIT_COSTS.VECTORIZE +
    (preprocessing.removeBg ? CREDIT_COSTS.REMOVE_BG : 0) +
    (preprocessing.upscale === '2x' ? CREDIT_COSTS.UPSCALE_2X : 0) +
    (preprocessing.upscale === '4x' ? CREDIT_COSTS.UPSCALE_4X : 0);

  // Check user credit balance
  const balance = await creditManager.getBalance(adminSupabase, user.id);
  if (balance.balance < creditCost) {
    return NextResponse.json(
      {
        error: `Insufficient credits. This conversion requires ${creditCost.toFixed(2)} credits, but you have ${balance.balance.toFixed(2)}.`,
        creditCost,
        remainingBalance: balance.balance,
      },
      { status: 402 },
    );
  }

  // Record conversion in database
  const { data: conversion, error: insertError } = await adminSupabase
    .from('conversions')
    .insert({
      user_id: user.id,
      original_file_url: originalFileUrl,
      original_format: originalFormat,
      output_format: outputFormat,
      preprocessing,
      credits_used: creditCost,
      status: 'pending',
    })
    .select()
    .single();

  if (insertError || !conversion) {
    return serverError(insertError?.message ?? 'Failed to create conversion record');
  }

  // Deduct credits
  try {
    const charged = await creditManager.deductCredits(
      adminSupabase,
      user.id,
      creditCost,
      'conversion',
      conversion.id,
    );

    if (!charged) {
      await adminSupabase.from('conversions').delete().eq('id', conversion.id);
      return NextResponse.json(
        {
          error: `Insufficient credits. You need ${creditCost.toFixed(2)} credits to run this conversion.`,
          creditCost,
          remainingBalance: balance.balance,
        },
        { status: 402 },
      );
    }
  } catch (deductErr) {
    console.error('Credit deduction error:', deductErr);
    await adminSupabase.from('conversions').delete().eq('id', conversion.id);
    return serverError('Could not process credit transaction');
  }

  // Queue background worker job
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

    return NextResponse.json(
      {
        conversionId: conversion.id,
        jobId: job.id,
        creditCost,
        remainingBalance: Number(Math.max(0, balance.balance - creditCost).toFixed(2)),
      },
      { status: 202 },
    );
  } catch (queueError) {
    await adminSupabase
      .from('conversions')
      .update({
        status: 'failed',
        error_message: 'Could not queue the conversion',
      })
      .eq('id', conversion.id);

    // Refund credits since queue failed
    try {
      await creditManager.addCredits(adminSupabase, user.id, creditCost, 'refund');
    } catch {
      // Ignored
    }

    return serverError(
      queueError instanceof Error ? `Queue unavailable: ${queueError.message}` : 'Queue unavailable',
    );
  }
}
