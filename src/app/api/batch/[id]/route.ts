import { NextResponse, type NextRequest } from 'next/server';

import { BatchError, batchManager } from '@/lib/batch/batch-manager';
import { jsonError, serverError, unauthorized } from '@/lib/http';
import { authenticate } from '@/lib/supabase/server';
import { isValidUuid } from '@/lib/validation';

/**
 * GET /api/batch/[id]
 * Polled by the batch status page. Ownership is enforced by both the query
 * filter and the `batch_jobs` RLS policy.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, supabase } = await authenticate();
  if (!user || !supabase) return unauthorized();

  const { id } = await params;
  if (!isValidUuid(id)) return jsonError('Invalid batch id', 400);

  try {
    return NextResponse.json(await batchManager.getBatchStatus(id, user.id, supabase));
  } catch (error) {
    if (error instanceof BatchError) return jsonError(error.message, error.status);
    console.error('Failed to load batch:', error);
    return serverError('Failed to load batch');
  }
}