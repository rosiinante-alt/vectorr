import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import LoginClient from './login-client';

// Reads the session cookie on every request, so it blocks rather than
// prerendering into a static shell (Cache Components is enabled).
export const instant = false;

export default async function LoginPage() {
  // Check if user is already logged in
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    redirect('/dashboard');
  }

  return <LoginClient />;
}

