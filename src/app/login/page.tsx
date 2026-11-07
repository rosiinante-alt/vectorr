import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import LoginClient from './login-client';

// Reads the session cookie on every request, so it blocks rather than
// prerendering into a static shell (Cache Components is enabled).
export const instant = false;

type SearchParams = Promise<{ plan?: string; next?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { plan, next } = await searchParams;

  // A signed-in buyer who landed here from a plan button goes straight back to
  // checkout; everyone else keeps the plain dashboard redirect.
  const afterAuth =
    next === 'checkout' && plan
      ? `/pricing?resume=${encodeURIComponent(plan)}`
      : '/dashboard';

  // Check if user is already logged in
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect(afterAuth);
  }

  return <LoginClient plan={plan} next={next} />;
}