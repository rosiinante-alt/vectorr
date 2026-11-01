import { NextResponse, type NextRequest } from 'next/server';

import { createSupabaseRouteClient, type CookieToSet } from '@/lib/supabase/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/**
 * GET /api/auth/callback?code=...
 *
 * Supabase magic-link/OAuth redirect target. Exchanges the one-time code for a
 * session, writes the auth cookies, then forwards to /dashboard (or /login on
 * failure).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  // Cookies must land on the redirect response, not a request-scoped store.
  const received: CookieToSet[] = [];
  const supabase = createSupabaseRouteClient(
    () => [],
    (cookiesToSet) => received.push(...cookiesToSet),
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=invalid_code`);
  }

  const response = NextResponse.redirect(`${SITE_URL}/dashboard`);
  for (const { name, value, options } of received) {
    response.cookies.set(name, value, options);
  }
  return response;
}
