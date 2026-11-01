import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { SupabaseClient } from '@supabase/supabase-js';

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new ConfigurationError(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Request-scoped Supabase client that carries the user's auth cookie and is
 * therefore subject to Row-Level Security. Use this for anything acting on
 * behalf of the signed-in user.
 */
export async function createSupabaseServerClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component or Route Handler where the cookie
            // store is read-only. Session refresh is handled by middleware.
          }
        },
      },
    },
  );
}

export interface CookieToSet {
  name: string;
  value: string;
  options?: CookieOptions;
}

/**
 * Client for routes that answer with a redirect and must therefore attach
 * Set-Cookie headers to the outgoing response rather than a request store.
 * `readCookies` may be empty when no prior session needs to be read.
 */
export function createSupabaseRouteClient(
  readCookies: () => CookieToSet[],
  setCookies: (cookies: CookieToSet[]) => void,
): SupabaseClient {
  return createServerClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    {
      cookies: {
        getAll: readCookies,
        setAll: setCookies,
      },
    },
  );
}

/**
 * Service-role client. Bypasses RLS — only for trusted server-side operations
 * such as writing audit entries or resolving a signed download URL.
 */
export function createSupabaseAdminClient(): SupabaseClient {
  return createServerClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    { cookies: { getAll: () => [], setAll: () => {} } },
  );
}

export interface AuthedUser {
  id: string;
  email: string | null;
}

export type AuthResult =
  | { user: AuthedUser; supabase: SupabaseClient; error: null }
  | { user: null; supabase: null; error: string };

/**
 * Resolves the signed-in user. Uses `getUser()` (not `getSession()`), which
 * validates the JWT against Supabase rather than trusting the cookie payload.
 */
export async function authenticate(): Promise<AuthResult> {
  let supabase: SupabaseClient;
  try {
    supabase = await createSupabaseServerClient();
  } catch (err) {
    return {
      user: null,
      supabase: null,
      error: err instanceof Error ? err.message : 'Supabase is not configured',
    };
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return { user: null, supabase: null, error: 'Unauthorized' };
  }

  return {
    user: { id: data.user.id, email: data.user.email ?? null },
    supabase,
    error: null,
  };
}
