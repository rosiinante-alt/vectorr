import { NextResponse, type NextRequest } from 'next/server';

import { badRequest, notFound, serverError, unauthorized } from '@/lib/http';
import { authenticate } from '@/lib/supabase/server';
import { isValidUuid, STORAGE_BUCKET } from '@/lib/validation';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/files/:id
 *
 * Returns the file record plus a short-lived signed URL for inline preview,
 * optimization report (if present), and the user's quota status.
 * Ownership is enforced by the RLS policy on `files`.
 */
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { user, supabase } = await authenticate();
  if (!user || !supabase) {
    return unauthorized();
  }

  const { id } = await params;
  if (!isValidUuid(id)) {
    return badRequest('Invalid file id');
  }

  const { data: file, error } = await supabase
    .from('files')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    return serverError(error.message);
  }
  if (!file) {
    return notFound('File not found');
  }

  const { data: signed, error: signError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(file.file_path, 60 * 10);

  // Fetch quota for the current billing period
  const currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
  const { data: quotaData } = await supabase
    .from('optimization_quota')
    .select('count')
    .eq('user_id', user.id)
    .eq('year_month', currentMonth)
    .single();

  const FREE_TIER_LIMIT = 3;
  const used = quotaData?.count ?? 0;
  const quota = {
    used,
    limit: FREE_TIER_LIMIT,
    remaining: Math.max(0, FREE_TIER_LIMIT - used),
  };

  // Extract optimization report from metadata if present
  const metadata = (file.metadata || {}) as Record<string, unknown>;
  const optimization = metadata.optimization as
    | {
        originalSizeBytes: number;
        optimizedSizeBytes: number;
        savedBytes: number;
        savedPercent: number;
        optimizations: Array<{
          id: string;
          label: string;
          savedBytes: number;
          count: number;
        }>;
        exportId: string;
        optimizedAt: string;
        precision: number;
      }
    | undefined;

  return NextResponse.json({
    ...file,
    preview_url: signError ? null : signed?.signedUrl ?? null,
    quota,
    ...(optimization && {
      originalSizeBytes: optimization.originalSizeBytes,
      optimizedSizeBytes: optimization.optimizedSizeBytes,
      savedPercent: optimization.savedPercent,
      optimization,
    }),
  });
}

/**
 * DELETE /api/files/:id
 *
 * Removes the DB row (exports cascade), then the storage object. The audit
 * entry keeps the id after deletion — `resource_id` has no foreign key by design.
 */
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { user, supabase } = await authenticate();
  if (!user || !supabase) {
    return unauthorized();
  }

  const { id } = await params;
  if (!isValidUuid(id)) {
    return badRequest('Invalid file id');
  }

  const { data: file, error: findError } = await supabase
    .from('files')
    .select('id, file_path')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (findError) {
    return serverError(findError.message);
  }
  if (!file) {
    return notFound('File not found');
  }

  const { error: deleteError } = await supabase.from('files').delete().eq('id', file.id);
  if (deleteError) {
    return serverError(deleteError.message);
  }

  await supabase.storage.from(STORAGE_BUCKET).remove([file.file_path]);
  await supabase
    .from('audit_log')
    .insert({ user_id: user.id, action: 'delete', resource_id: file.id });

  return NextResponse.json({ deleted: true, id: file.id });
}
