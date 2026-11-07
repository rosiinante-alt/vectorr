'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

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
  autoStart = false,
}: {
  planKey: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  /** Open checkout on mount — set when a buyer just signed in for this plan. */
  autoStart?: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const startedRef = useRef(false);

  // Resume a checkout the buyer already chose before signing in. The ref keeps
  // React's double-mount in development from opening two Polar sessions.
  useEffect(() => {
    if (!autoStart || startedRef.current) return;
    startedRef.current = true;
    void startCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

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
        // Checkout needs a session. Carry the chosen plan through login so the
        // buyer resumes at the checkout they already picked instead of having
        // to find the pricing page again.
        router.push(`/login?plan=${encodeURIComponent(planKey)}&next=checkout`);
        return;
      }

      const body = (await response.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!response.ok || !body.url) {
        setError(body.error ?? 'Could not start checkout. Please try again.');
        return;
      }

      // External Polar-hosted page, so a full navigation rather than a route push.
      window.location.assign(body.url);
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