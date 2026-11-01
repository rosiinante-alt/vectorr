import { NextResponse, type NextRequest } from 'next/server';

import { badRequest, notFound, serverError, unauthorized } from '@/lib/http';
import { authenticate } from '@/lib/supabase/server';
import { isValidUuid, STORAGE_BUCKET } from '@/lib/validation';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/files/:id
 *
 * Returns the file record plus a short-lived signed URL for inline preview.
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

  return NextResponse.json({
    ...file,
    preview_url: signError ? null : signed?.signedUrl ?? null,
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
