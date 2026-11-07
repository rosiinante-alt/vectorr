'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { Button } from '@/components/ui/button';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type Mode = 'signin' | 'signup';
type State =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'error'; message: string };

/** Extracts error from URL search params. Wrapped in Suspense separately. */
function ErrorHandler({ onError }: { onError: (message: string) => void }) {
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');

  useEffect(() => {
    if (urlError) {
      const errorMessages: Record<string, string> = {
        auth_failed: 'Authentication failed. Please try again.',
        missing_code: 'That sign-in link was missing its code. Request a new one.',
        invalid_code: 'That sign-in link has expired or was already used. Request a new one.',
      };
      onError(errorMessages[urlError] || 'An error occurred');
    }
  }, [urlError, onError]);

  return null;
}

function LoginForm({ plan, next }: { plan?: string; next?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [state, setState] = useState<State>({ kind: 'idle' });

  // A buyer who arrived from a plan button returns to that plan instead of the
  // dashboard, so the checkout they intended to start resumes immediately.
  const afterAuth =
    next === 'checkout' && plan
      ? `/pricing?resume=${encodeURIComponent(plan)}`
      : '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ kind: 'loading' });

    const supabase = createSupabaseBrowserClient();

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setState({ kind: 'error', message: 'Passwords do not match' });
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          },
        });

        if (error) {
          setState({ kind: 'error', message: error.message });
          return;
        }

        if (data.user) {
          // Successfully signed up — resume the intended plan if there was one
          router.push(afterAuth);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setState({ kind: 'error', message: error.message });
          return;
        }

        if (data.user) {
          // Successfully signed in — resume the intended plan if there was one
          router.push(afterAuth);
        }
      }
    } catch (error) {
      setState({
        kind: 'error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    }
  };

  const handleGoogleSignIn = async () => {
    setState({ kind: 'loading' });
    const supabase = createSupabaseBrowserClient();

    try {
      const callback = new URL('/api/auth/callback', window.location.origin);
      if (next === 'checkout' && plan) {
        callback.searchParams.set('plan', plan);
        callback.searchParams.set('next', 'checkout');
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callback.toString(),
        },
      });

      if (error) {
        setState({ kind: 'error', message: error.message });
      }
    } catch (error) {
      setState({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Failed to sign in with Google',
      });
    }
  };

  const isLoading = state.kind === 'loading';
  const canSubmit =
    email.trim().length > 0 &&
    password.length > 0 &&
    (mode === 'signin' || confirmPassword.length > 0);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main" className="flex-1 py-16 sm:py-24">
        <div className="wrap">
          <div className="mx-auto max-w-[440px]">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2.5 text-[16px] font-semibold tracking-[-0.015em] text-text-primary">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-6 w-6 text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 18L12 5l8 13z" />
                <path d="M8.5 18L12 12l3.5 6" />
              </svg>
              Vectroy
            </div>

            <h1 className="display mt-6 text-center text-[clamp(28px,4vw,38px)]">
              {mode === 'signin' ? 'Welcome back' : 'Create account'}
            </h1>

            {/* Error handler from URL */}
            <Suspense fallback={null}>
              <ErrorHandler
                onError={(message) => setState({ kind: 'error', message })}
              />
            </Suspense>

            {/* Error message */}
            {state.kind === 'error' && (
              <div
                role="alert"
                className="mt-6 rounded-[var(--radius-md)] bg-error-wash px-4 py-3 text-[14.5px] text-error"
              >
                {state.message}
              </div>
            )}

            <div className="mt-8 rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-1)]">
              {/* Mode toggle */}
              <div className="mb-6 flex gap-1 rounded-[var(--radius-md)] bg-bg-secondary p-1">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`flex-1 rounded-[var(--radius-sm)] px-4 py-2.5 text-[14.5px] font-semibold transition-colors ${
                    mode === 'signin'
                      ? 'bg-white text-text-primary shadow-[var(--shadow-1)]'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`flex-1 rounded-[var(--radius-sm)] px-4 py-2.5 text-[14.5px] font-semibold transition-colors ${
                    mode === 'signup'
                      ? 'bg-white text-text-primary shadow-[var(--shadow-1)]'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Sign up
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[14px] font-semibold text-text-secondary"
                    >
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@studio.com"
                      disabled={isLoading}
                      className="mt-2 h-12 w-full rounded-[var(--radius-md)] bg-white px-3.5 text-[16px] shadow-[inset_0_0_0_1px_var(--border-strong)] transition-shadow placeholder:text-text-tertiary focus:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--accent)] disabled:opacity-55"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-[14px] font-semibold text-text-secondary"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      disabled={isLoading}
                      className="mt-2 h-12 w-full rounded-[var(--radius-md)] bg-white px-3.5 text-[16px] shadow-[inset_0_0_0_1px_var(--border-strong)] transition-shadow placeholder:text-text-tertiary focus:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--accent)] disabled:opacity-55"
                    />
                  </div>

                  {/* Confirm Password (signup only) */}
                  {mode === 'signup' && (
                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="block text-[14px] font-semibold text-text-secondary"
                      >
                        Confirm password
                      </label>
                      <input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        required
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        disabled={isLoading}
                        className="mt-2 h-12 w-full rounded-[var(--radius-md)] bg-white px-3.5 text-[16px] shadow-[inset_0_0_0_1px_var(--border-strong)] transition-shadow placeholder:text-text-tertiary focus:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--accent)] disabled:opacity-55"
                      />
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={!canSubmit || isLoading}
                  className="mt-6 w-full"
                >
                  {isLoading
                    ? mode === 'signin'
                      ? 'Signing in…'
                      : 'Creating account…'
                    : mode === 'signin'
                      ? 'Sign in'
                      : 'Create account'}
                </Button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-[var(--border)]" />
                <span className="text-[13px] text-text-tertiary">or</span>
                <div className="h-px flex-1 bg-[var(--border)]" />
              </div>

              {/* Google OAuth */}
              <Button
                variant="secondary"
                size="lg"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              {/* Signup note */}
              {mode === 'signup' && (
                <p className="mt-4 text-center text-[13.5px] text-text-tertiary">
                  5 free credits on signup
                </p>
              )}
            </div>

            <p className="mt-6 text-center text-[13.5px] leading-relaxed text-text-tertiary">
              {mode === 'signin' ? (
                <>
                  You can preview an SVG without signing in — the estimate runs in your browser.
                  Signing in is only needed to run the real optimization and download the result.
                </>
              ) : (
                <>
                  By creating an account, you agree to our Terms of Service and Privacy Policy.
                </>
              )}
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

export default function LoginClient({ plan, next }: { plan?: string; next?: string }) {
  return <LoginForm plan={plan} next={next} />;
}
