import { NextResponse } from 'next/server';

import { creditManager } from '@/lib/credits/credit-manager';
import { serverError, unauthorized } from '@/lib/http';
import { authenticate } from '@/lib/supabase/server';

export async function GET() {
  const { user, supabase } = await authenticate();
  if (!user || !supabase) return unauthorized();

  try {
    const { balance, tier } = await creditManager.getBalance(supabase, user.id);
    return NextResponse.json({ balance, tier });
  } catch (error) {
    return serverError(error instanceof Error ? error.message : 'Could not read credits');
  }
}