import { Suspense } from "react";
import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { ButtonLink } from "@/components/ui/button";
import { TierCards } from "@/components/pricing/tier-cards";
import { CostEstimator } from "@/components/pricing/cost-estimator";

export default function PricingPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader
        authSlot={
          <Suspense fallback={null}>
            <AuthSlot />
          </Suspense>
        }
      />

      <main id="main" className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="py-16 text-center sm:py-24">
          <div className="wrap">
            <h1 className="display mx-auto max-w-[760px] text-[clamp(32px,5vw,56px)]">
              Simple, credit-based pricing.
            </h1>
            <p className="mx-auto mt-5 max-w-[560px] text-[17px] text-text-secondary">
              Pay for what you use. Credits never expire, and failed jobs are
              never charged.
            </p>
          </div>
        </section>

        {/* ── Tier cards (client island — annual toggle lives here) */}
        <TierCards />

        {/* ── One-time purchase ─────────────────────────────────── */}
        <section className="py-16" aria-labelledby="one-time-heading">
          <div className="wrap">
            <div className="mx-auto max-w-2xl rounded-[var(--radius-xl)] bg-white p-10 text-center shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]">
              <p className="text-[13px] font-semibold uppercase tracking-widest text-text-tertiary">
                Just one file?
              </p>
              <h2
                id="one-time-heading"
                className="mt-3 text-[32px] font-bold tracking-[-0.03em]"
              >
                $6.99 one-time
              </h2>
              <p className="mx-auto mt-4 max-w-sm text-[16px] leading-relaxed text-text-secondary">
                Need to convert a single logo? Pay once, download immediately,
                keep the file forever — no account required.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <ButtonLink href="/convert" size="lg">
                  Convert now
                </ButtonLink>
                <ButtonLink href="/pricing#tiers" size="lg" variant="secondary">
                  Compare plans
                </ButtonLink>
              </div>
              <ul className="mx-auto mt-8 grid max-w-xs gap-2 text-left text-[14px] text-text-secondary">
                {[
                  "Any format: SVG, DXF, EPS, PDF, PNG",
                  "Full-resolution output",
                  "No watermarks",
                  "30-day re-download link",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <svg
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className="h-4 w-4 flex-none text-success-text"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 10.5l4 4 8-9" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Cost estimator (client island) ───────────────────── */}
        <CostEstimator />

        {/* ── Why Vectroy ──────────────────────────────────────── */}
        <section className="py-20" aria-labelledby="compare-heading">
          <div className="wrap">
            <h2
              id="compare-heading"
              className="display max-w-[760px] text-[clamp(28px,4vw,44px)]"
            >
              Why choose Vectroy?
            </h2>
            <p className="mt-5 max-w-[620px] text-[17px] leading-relaxed text-text-secondary">
              Fast, accurate vectorization with all the formats you need for
              Cricut, laser cutting, embroidery, and print.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                {
                  title: "No credit card for free tier",
                  body: "Start with 5 free credits. Try the full conversion flow before paying anything.",
                },
                {
                  title: "Credits never expire",
                  body: "Unused credits roll over indefinitely. No monthly pressure to use them up.",
                },
                {
                  title: "Cancel anytime",
                  body: "Keep your converted files forever. Canceling doesn't take your work with it.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[var(--radius-xl)] bg-white p-6 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]"
                >
                  <h3 className="text-[17px] font-semibold tracking-[-0.02em]">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-text-secondary">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-14 text-center">
              <ButtonLink href="/convert" size="lg">
                Convert your first image
              </ButtonLink>
              <p className="mt-4 text-[14px] text-text-tertiary">
                5 free credits · no signup required ·{" "}
                <Link
                  href="/login"
                  className="text-accent-ink underline underline-offset-[3px]"
                >
                  sign in
                </Link>{" "}
                to track your usage
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
