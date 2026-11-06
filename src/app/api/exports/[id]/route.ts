import { NextResponse, type NextRequest } from 'next/server';

import { badRequest, notFound, serverError, unauthorized } from '@/lib/http';
import { authenticate } from '@/lib/supabase/server';
import { isValidUuid, STORAGE_BUCKET } from '@/lib/validation';

type RouteContext = { params: Promise<{ id: string }> };

const CONTENT_TYPES: Record<string, string> = {
  svg: 'image/svg+xml',
  png: 'image/png',
  pdf: 'application/pdf',
  dxf: 'image/vnd.dxf',
  eps: 'application/postscript',
  gcode: 'text/plain; charset=utf-8',
  dst: 'application/octet-stream',
  pes: 'application/octet-stream',
  jef: 'application/octet-stream',
  '3mf': 'application/vnd.ms-package.3dmanufacturing-3dmodel+xml',
  stl: 'model/stl',
  obj: 'model/obj',
  'color-separation': 'application/zip',
};

/**
 * GET /api/exports/:id?download=1
 *
 * Streams the export back. `exports` has no direct owner column, so ownership
 * is resolved by joining through `files` — the RLS policies permit the read
 * only when that file belongs to the caller.
 */
export async function GET(request: NextRequest, { params }: RouteContext) {
  const { user, supabase } = await authenticate();
  if (!user || !supabase) {
    return unauthorized();
  }

  const { id } = await params;
  if (!isValidUuid(id)) {
    return badRequest('Invalid export id');
  }

  const { data: record, error: findError } = await supabase
    .from('exports')
    .select('id, format, file_path, files!inner(id, filename, user_id)')
    .eq('id', id)
    .eq('files.user_id', user.id)
    .maybeSingle();

  if (findError) {
    return serverError(findError.message);
  }
  if (!record) {
    return notFound('Export not found');
  }

  const { data: blob, error: downloadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .download(record.file_path);

  if (downloadError || !blob) {
    return serverError(downloadError?.message ?? 'Failed to read export from storage');
  }

  const nested = record.files as unknown;
  const file = Array.isArray(nested) ? nested[0] : nested;
  const filename = (file as { filename?: string } | null)?.filename ?? `export.${record.format}`;

  const inline = new URL(request.url).searchParams.get('download') !== '1';
  const headers: Record<string, string> = {
    'Content-Type': CONTENT_TYPES[record.format] ?? 'application/octet-stream',
    'Content-Length': String(blob.size),
    'Cache-Control': 'private, max-age=0, must-revalidate',
  };
  if (!inline) {
    headers['Content-Disposition'] = `attachment; filename="${filename.replace(/"/g, '')}"`;
  }

  return new NextResponse(await blob.arrayBuffer(), { status: 200, headers });
}
