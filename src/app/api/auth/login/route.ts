import { NextResponse, type NextRequest } from 'next/server';

import { jsonError, readJson } from '@/lib/http';
import { clientKey, rateLimit, LIMITS } from '@/lib/rate-limit';
import { createSupabaseServerClient, ConfigurationError } from '@/lib/supabase/server';
import { isValidEmail } from '@/lib/validation';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/**
 * POST /api/auth/login
 * Body: { "email": "user@example.com" }
 *
 * Sends a Supabase magic link. The link lands on /api/auth/callback, which
 * exchanges the code for a session cookie.
 */
export async function POST(request: NextRequest) {
  const limiter = rateLimit(clientKey(request, 'login'), LIMITS.login.limit, LIMITS.login.windowMs);
  if (!limiter.allowed) {
    return NextResponse.json(
      { error: 'Too many login attempts. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(limiter.retryAfterSeconds) } },
    );
  }

  const body = await readJson(request);
  const email = body.email;

  if (!isValidEmail(email)) {
    return jsonError('Invalid email', 400);
  }

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch (err) {
    if (err instanceof ConfigurationError) {
      return jsonError(err.message, 500);
    }
    throw err;
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${SITE_URL}/api/auth/callback`,
    },
  });

  if (error) {
    return jsonError(error.message, 400);
  }

  // Always the same response shape, whether or not the address exists — do not
  // leak account existence.
  return NextResponse.json({ message: 'Check your email for the login link' });
}
