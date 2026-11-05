import { NextResponse, type NextRequest } from 'next/server';

import { serverError, unauthorized } from '@/lib/http';
import { authenticate } from '@/lib/supabase/server';

/**
 * GET /api/files?limit=50&offset=0
 * Lists the signed-in user's conversions, newest first, in the shape the
 * dashboard renders.
 */
export async function GET(request: NextRequest) {
  const { user, supabase } = await authenticate();
  if (!user || !supabase) {
    return unauthorized();
  }

  const { searchParams } = new URL(request.url);
  const limit = clamp(Number(searchParams.get('limit') ?? 50), 1, 100);
  const offset = clamp(Number(searchParams.get('offset') ?? 0), 0, 100_000);

  const { data, error, count } = await supabase
    .from('conversions')
    .select(
      'id, original_file_url, converted_file_url, original_format, output_format, status, credits_used, error_message, created_at, completed_at',
      { count: 'exact' },
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return serverError(error.message);
  }

  const files = (data ?? []).map((row) => ({
    id: row.id,
    filename: fileNameOf(row.original_file_url, row.output_format),
    status: row.status,
    original_format: row.original_format,
    output_format: row.output_format,
    credits_used: Number(row.credits_used ?? 0),
    error_message: row.error_message,
    download_url: row.status === 'complete' ? row.converted_file_url : null,
    created_at: row.created_at,
    completed_at: row.completed_at,
  }));

  return NextResponse.json({ files, total: count ?? 0, limit, offset });
}

/** Recovers the uploaded name from `<user>/<timestamp>-<name>` storage paths. */
function fileNameOf(url: string | null, outputFormat: string | null): string {
  if (!url) return `conversion.${outputFormat ?? 'svg'}`;
  const last = decodeURIComponent(new URL(url).pathname.split('/').pop() ?? '');
  return last.replace(/^\d+-/, '') || `conversion.${outputFormat ?? 'svg'}`;
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(Math.trunc(value), min), max);
}
