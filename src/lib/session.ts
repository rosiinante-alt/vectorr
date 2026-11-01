import { cookies } from "next/headers";

/**
 * Cheap server-side session probe for rendering.
 *
 * Supabase stores its session in cookies named `sb-<ref>-auth-token` (split into
 * `.0`, `.1`, … when large). We only need to know whether the user is plausibly
 * signed in — route handlers still verify properly via `authenticate()`, so this
 * never has to be authoritative.
 */
export async function hasSessionCookie(): Promise<boolean> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return false;
  const store = await cookies();
  return store.getAll().some((cookie) => /^sb-.+-auth-token/.test(cookie.name));
}
