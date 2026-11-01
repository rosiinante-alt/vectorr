import { NextResponse, type NextRequest } from 'next/server';

import { createExport } from '@/lib/export';
import { jsonError, readJson, unauthorized } from '@/lib/http';
import { clientKey, rateLimit, LIMITS } from '@/lib/rate-limit';
import { authenticate } from '@/lib/supabase/server';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/files/:id/export
 * Body: { "format": "svg" }  (optional, defaults to svg)
 *
 * Alias of POST /api/export with the file id in the path.
 */
export async function POST(request: NextRequest, { params }: RouteContext) {
  const { user, supabase } = await authenticate();
  if (!user || !supabase) {
    return unauthorized();
  }

  const limiter = rateLimit(
    clientKey(request, 'export', user.id),
    LIMITS.export.limit,
    LIMITS.export.windowMs,
  );
  if (!limiter.allowed) {
    return jsonError('Too many exports. Try again later.', 429, {
      retryAfterSeconds: limiter.retryAfterSeconds,
    });
  }

  const { id } = await params;
  const body = await readJson(request);

  const result = await createExport({
    supabase,
    userId: user.id,
    fileId: id,
    format: body.format,
  });

  if (!result.ok) {
    return result.response;
  }
  return NextResponse.json(result.record, { status: 201 });
}
