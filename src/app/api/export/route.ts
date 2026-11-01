import { NextResponse, type NextRequest } from 'next/server';

import { createExport } from '@/lib/export';
import { jsonError, readJson, unauthorized } from '@/lib/http';
import { clientKey, rateLimit, LIMITS } from '@/lib/rate-limit';
import { authenticate } from '@/lib/supabase/server';

/**
 * POST /api/export
 * Body: { "file_id": "<uuid>", "format": "svg" }
 *
 * MVP: re-materialises the original SVG as an export record. Raster/PDF
 * conversion lands in Tier 2 behind this same endpoint.
 */
export async function POST(request: NextRequest) {
  const { user, supabase } = await authenticate();
  if (!user || !supabase) {
    return unauthorized();
  }

  const limiter = rateLimit(
    clientKey(request, 'export'),
    LIMITS.export.limit,
    LIMITS.export.windowMs,
  );
  if (!limiter.allowed) {
    return jsonError('Too many exports. Try again later.', 429, {
      retryAfterSeconds: limiter.retryAfterSeconds,
    });
  }

  const body = await readJson(request);
  const result = await createExport({
    supabase,
    userId: user.id,
    fileId: (body.file_id ?? body.fileId) as string,
    format: body.format,
  });

  if (!result.ok) {
    return result.response;
  }
  return NextResponse.json(result.record, { status: 201 });
}
