import { NextResponse, type NextRequest } from 'next/server';

import { badRequest, jsonError, serverError, unauthorized } from '@/lib/http';
import { clientKey, rateLimit, LIMITS } from '@/lib/rate-limit';
import { authenticate } from '@/lib/supabase/server';
import {
  MAX_FILE_BYTES,
  sniffSvg,
  STORAGE_BUCKET,
  validateUpload,
} from '@/lib/validation';

/**
 * POST /api/files/upload
 * multipart/form-data, field "file" (an .svg, max 10 MB).
 *
 * Uploads to Supabase Storage under `<user_id>/<timestamp>-<name>.svg`, then
 * creates the `files` row and an audit entry.
 */
export async function POST(request: NextRequest) {
  const { user, supabase } = await authenticate();
  if (!user || !supabase) {
    return unauthorized();
  }

  const limiter = rateLimit(
    clientKey(request, 'upload', user.id),
    LIMITS.upload.limit,
    LIMITS.upload.windowMs,
  );
  if (!limiter.allowed) {
    return jsonError('Too many uploads. Try again later.', 429, {
      retryAfterSeconds: limiter.retryAfterSeconds,
    });
  }

  // Reject oversized bodies before buffering them into memory.
  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > MAX_FILE_BYTES + 64 * 1024) {
    return badRequest('File too large (max 10MB)');
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return badRequest('Expected multipart/form-data with a "file" field');
  }

  const candidate = formData.get('file');
  const file = candidate instanceof File ? candidate : null;

  const validation = validateUpload(file);
  if (!validation.ok || !file || !validation.value) {
    return badRequest(validation.error ?? 'Invalid file');
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (!sniffSvg(buffer.subarray(0, 4096).toString('utf8'))) {
    return badRequest('File does not contain an <svg> root element');
  }

  const { filename, size } = validation.value;
  const storagePath = `${user.id}/${Date.now()}-${filename}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, buffer, { contentType: 'image/svg+xml', upsert: false });

  if (uploadError) {
    return serverError(uploadError.message);
  }

  const { data: dbFile, error: dbError } = await supabase
    .from('files')
    .insert({
      user_id: user.id,
      filename,
      original_size_bytes: size,
      file_path: storagePath,
      status: 'ready',
    })
    .select()
    .single();

  if (dbError || !dbFile) {
    // Roll back the orphaned object so storage does not drift from the DB.
    await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
    return serverError(dbError?.message ?? 'Failed to create file record');
  }

  // Audit failures must not fail the request.
  await supabase
    .from('audit_log')
    .insert({ user_id: user.id, action: 'upload', resource_id: dbFile.id });

  return NextResponse.json(dbFile, { status: 201 });
}
