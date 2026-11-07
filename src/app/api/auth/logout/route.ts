import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/lib/supabase/server';

/**
 * POST /api/auth/logout
 *
 * Clears the session server-side so the browser bundle never needs the
 * Supabase SDK just to offer a sign-out button.
 */
export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    // Already signed out, or Supabase is unconfigured: nothing to clear.
  }

  return NextResponse.json({ ok: true });
}