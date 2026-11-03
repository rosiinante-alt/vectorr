import { NextResponse, type NextRequest } from 'next/server';

import { serverError, unauthorized } from '@/lib/http';
import { authenticate } from '@/lib/supabase/server';

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

/**
 * GET /api/credits/transactions?limit=50
 *
 * The caller's own credit history, newest first. Row-Level Security restricts
 * the table to the signed-in user's rows.
 */
export async function GET(request: NextRequest) {
  const { user, supabase } = await authenticate();
  if (!user || !supabase) return unauthorized();

  const requested = Number(new URL(request.url).searchParams.get('limit') ?? DEFAULT_LIMIT);
  const limit = Number.isFinite(requested)
    ? Math.min(Math.max(Math.trunc(requested), 1), MAX_LIMIT)
    : DEFAULT_LIMIT;

  const { data, error } = await supabase
    .from('credit_transactions')
    .select('id, amount, balance_after, reason, conversion_id, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return serverError(error.message);

  return NextResponse.json({
    transactions: (data ?? []).map((row) => ({
      ...row,
      amount: Number(row.amount),
      balance_after: Number(row.balance_after),
    })),
  });
}