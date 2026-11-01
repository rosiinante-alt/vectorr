import type { Metadata } from "next";
import { Suspense } from "react";

import { SignInForm } from "@/components/sign-in-form";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { hasSessionCookie } from "@/lib/session";

export const metadata: Metadata = {
  title: "Sign in — Vectorr",
  description: "Sign in to Vectorr with a one-time email link.",
};

const ERROR_MESSAGES: Record<string, string> = {
  missing_code: "That sign-in link was missing its code. Request a new one.",
  invalid_code:
    "That sign-in link has expired or was already used. Request a new one.",
};

/**
 * The signed-in branch reads cookies, and searchParams reads request-time data.
 * Both are kept inside this component under Suspense so the shell prerenders.
 */
async function LoginPanel({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const signedIn = await hasSessionCookie();

  const message = error ? ERROR_MESSAGES[error] : undefined;

  return (
    <>
      {message && (
        <p
          role="alert"
          className="mb-5 rounded-[var(--radius-md)] bg-error-wash px-4 py-3 text-[14.5px] text-error"
        >
          {message}
        </p>
      )}

      <div className="rounded-[var(--radius-xl)] bg-white p-6 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]">
        {signedIn ? (
          <>
            <h2 className="text-[19px] font-semibold tracking-[-0.022em]">
              You&apos;re signed in
            </h2>
            <p className="mt-2 text-[15px] text-text-secondary">
              Head to the app to optimize a file.
            </p>
            <a
              href="/dashboard"
              className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-accent px-6 text-[16px] font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              Open the app
            </a>
          </>
        ) : (
          <SignInForm />
        )}
      </div>
    </>
  );
}

function LoginPanelFallback() {
  return (
    <div
      aria-hidden="true"
      className="rounded-[var(--radius-xl)] bg-white p-6 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]"
    >
      <div className="h-[200px]" />
    </div>
  );
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main" className="flex-1 py-16 sm:py-24">
        <div className="wrap">
          <div className="mx-auto max-w-[440px]">
            <h1 className="display text-[clamp(28px,4vw,38px)]">
              Sign in to Vectorr
            </h1>
            <p className="mt-3 text-[16px] text-text-secondary">
              Magic link only — no password to remember or reset.
            </p>

            <div className="mt-8">
              <Suspense fallback={<LoginPanelFallback />}>
                <LoginPanel searchParams={searchParams} />
              </Suspense>
            </div>

            <p className="mt-6 text-[13.5px] leading-relaxed text-text-tertiary">
              You can preview an SVG without signing in — the estimate runs in your
              browser. Signing in is only needed to run the real optimization and
              download the result.
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
