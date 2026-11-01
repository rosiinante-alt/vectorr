import { NextResponse, type NextRequest } from 'next/server';

import { serverError, unauthorized } from '@/lib/http';
import { authenticate } from '@/lib/supabase/server';

/**
 * GET /api/files?limit=50&offset=0
 * Lists the signed-in user's files, newest first.
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
    .from('files')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return serverError(error.message);
  }

  return NextResponse.json({ files: data ?? [], total: count ?? 0, limit, offset });
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(Math.trunc(value), min), max);
}
