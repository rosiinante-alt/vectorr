import type { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

import { badRequest, notFound, serverError } from '@/lib/http';
import { isValidUuid, STORAGE_BUCKET, validateExportFormat } from '@/lib/validation';

export interface CreateExportInput {
  supabase: SupabaseClient;
  userId: string;
  fileId: string;
  format: unknown;
}

export type CreateExportResult =
  | { ok: true; record: Record<string, unknown> }
  | { ok: false; response: NextResponse };

/**
 * Shared core for both export endpoints:
 *   POST /api/export            { file_id, format }
 *   POST /api/files/:id/export  { format }
 */
export async function createExport({
  supabase,
  userId,
  fileId,
  format,
}: CreateExportInput): Promise<CreateExportResult> {
  if (!isValidUuid(fileId)) {
    return { ok: false, response: badRequest('Invalid or missing file_id') };
  }

  const formatCheck = validateExportFormat(format);
  if (!formatCheck.ok || !formatCheck.value) {
    return { ok: false, response: badRequest(formatCheck.error ?? 'Invalid format') };
  }

  const { data: file, error: findError } = await supabase
    .from('files')
    .select('id, filename, file_path')
    .eq('id', fileId)
    .eq('user_id', userId)
    .maybeSingle();

  if (findError) {
    return { ok: false, response: serverError(findError.message) };
  }
  if (!file) {
    return { ok: false, response: notFound('File not found') };
  }

  const { data: blob, error: downloadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .download(file.file_path);

  if (downloadError || !blob) {
    return { ok: false, response: serverError(downloadError?.message ?? 'Failed to read file from storage') };
  }

  const { data: record, error: insertError } = await supabase
    .from('exports')
    .insert({
      file_id: file.id,
      format: formatCheck.value,
      file_path: file.file_path,
      file_size_bytes: blob.size,
    })
    .select()
    .single();

  if (insertError || !record) {
    return { ok: false, response: serverError(insertError?.message ?? 'Failed to create export record') };
  }

  await supabase
    .from('audit_log')
    .insert({ user_id: userId, action: 'export', resource_id: record.id });

  return { ok: true, record };
}
