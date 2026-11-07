'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export function SignOutButton() {
  const router = useRouter();

  // Posts to the route handler so the client bundle stays free of the
  // Supabase SDK.
  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  return (
    <Button variant="ghost" size="md" onClick={handleSignOut}>
      Sign out
    </Button>
  );
}