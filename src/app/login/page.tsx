import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import LoginClient from './login-client';

// Force dynamic rendering since we use cookies via Supabase
export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ plan?: string; next?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { plan, next } = await searchParams;

  // A signed-in buyer who landed here from a plan button goes straight back to
  // checkout; everyone else goes to their intended destination or dashboard.
  let afterAuth = '/dashboard';
  if (next === 'checkout' && plan) {
    afterAuth = `/pricing?resume=${encodeURIComponent(plan)}`;
  } else if (next && next !== 'checkout') {
    // Direct return to tool page (e.g., /upscale, /remove-bg)
    afterAuth = next.startsWith('/') ? next : `/${next}`;
  }

  // Check if user is already logged in
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect(afterAuth);
  }

  return <LoginClient plan={plan} next={next} />;
}