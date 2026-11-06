import type { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

import { badRequest, notFound, serverError } from '@/lib/http';
import { isValidUuid, STORAGE_BUCKET, validateExportFormat } from '@/lib/validation';
import { exportFile } from '@/lib/exporters';

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

  let output: Buffer | string;
  try {
    const source = await blob.text();
    if (formatCheck.value === 'png') {
      const sharp = (await import('sharp')).default;
      output = await sharp(Buffer.from(source)).png().toBuffer();
    } else {
      output = await exportFile(formatCheck.value, source);
    }
  } catch (error) {
    return { ok: false, response: badRequest(error instanceof Error ? error.message : 'Export failed') };
  }

  const outputBuffer = Buffer.isBuffer(output) ? output : Buffer.from(output);
  const extension = formatCheck.value === 'color-separation' ? 'zip' : formatCheck.value;
  const outputPath = `exports/${userId}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(outputPath, outputBuffer, { upsert: false, contentType: {
      svg: 'image/svg+xml', png: 'image/png', pdf: 'application/pdf', dxf: 'image/vnd.dxf', eps: 'application/postscript',
      gcode: 'text/plain', dst: 'application/octet-stream', pes: 'application/octet-stream', jef: 'application/octet-stream',
      '3mf': 'application/vnd.ms-package.3dmanufacturing-3dmodel+xml', stl: 'model/stl', obj: 'model/obj',
      'color-separation': 'application/zip',
    }[formatCheck.value] });
  if (uploadError) return { ok: false, response: serverError(uploadError.message) };

  const { data: record, error: insertError } = await supabase
    .from('exports')
    .insert({
      file_id: file.id,
      format: formatCheck.value,
      file_path: outputPath,
      file_size_bytes: outputBuffer.length,
    })
    .select()
    .single();

  if (insertError || !record) {
    await supabase.storage.from(STORAGE_BUCKET).remove([outputPath]);
    return { ok: false, response: serverError(insertError?.message ?? 'Failed to create export record') };
  }

  await supabase
    .from('audit_log')
    .insert({ user_id: userId, action: 'export', resource_id: record.id });

  return { ok: true, record };
}
