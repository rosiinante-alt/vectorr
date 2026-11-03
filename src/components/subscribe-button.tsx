'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';

/**
 * Starts a Polar checkout for a catalog plan.
 *
 * The request carries only the plan key; the server attaches the buyer's
 * identity to the checkout from the session, so nothing here can influence
 * which account the credits land on.
 */
export function SubscribeButton({
  planKey,
  children,
  variant = 'secondary',
}: {
  planKey: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setPending(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planKey }),
      });

      if (response.status === 401) {
        // Signing in first keeps the plan in the URL so it can be resumed.
        window.location.href = `/login?next=${encodeURIComponent('/pricing')}`;
        return;
      }

      const body = (await response.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!response.ok || !body.url) {
        setError(body.error ?? 'Could not start checkout. Please try again.');
        return;
      }

      window.location.href = body.url;
    } catch {
      setError('Could not reach the checkout. Check your connection and try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-2">
      <Button
        type="button"
        size="lg"
        variant={variant}
        className="w-full"
        onClick={startCheckout}
        disabled={pending}
      >
        {pending ? 'Opening checkout…' : children}
      </Button>
      {error && (
        <p role="alert" className="text-[13px] leading-snug text-error">
          {error}
        </p>
      )}
    </div>
  );
}