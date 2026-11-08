import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { SubscribeButton } from "@/components/subscribe-button";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { PRICING_TIERS, CREDIT_COSTS } from "@/lib/credits/constants";
import { trackPricingView } from "@/lib/analytics/events";

export const metadata: Metadata = {
  title: "Pricing — Vectroy",
  description:
    "Simple credit-based pricing for PNG/JPG/WEBP to SVG conversion. Start with 5 free credits.",
};

const tierOrder = ["FREE", "STARTER", "PLUS", "PRO", "TEAM", "AGENCY"] as const;

// Reads searchParams (resume=) on request, so it blocks rather than
// prerendering into a static shell (Cache Components is enabled).
export const instant = false;

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ resume?: string }>;
}) {
  const { resume } = await searchParams;
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
        <PricingContent resume={resume} />
      </main>

      <SiteFooter />
    </>
  )
}

function PricingContent({ resume }: { resume?: string }) {
  // Track pricing page view (client-side)
  if (typeof window !== 'undefined') {
    trackPricingView()
  }
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

        <section className="pb-16" aria-labelledby="tiers-heading">
          <h2 id="tiers-heading" className="visually-hidden">
            Plans
          </h2>
          <div className="wrap">
            <ul className="grid gap-5 lg:grid-cols-3 xl:grid-cols-5">
              {tierOrder.map((key) => {
                const tier = PRICING_TIERS[key];
                const isPlus = key === "PLUS";

                return (
                  <li
                    key={key}
                    className={
                      "flex flex-col rounded-[var(--radius-xl)] bg-white p-7 " +
                      (isPlus
                        ? "shadow-[inset_0_0_0_2px_var(--accent),0_2px_6px_rgba(0,0,0,0.05),0_18px_40px_-14px_rgba(0,0,0,0.16)]"
                        : "shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]")
                    }
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-[17px] font-semibold tracking-[-0.02em]">
                        {tier.name}
                      </h3>
                      {isPlus && <Badge tone="accent">Most popular</Badge>}
                    </div>

                    <p className="mt-4 flex items-baseline gap-2">
                      <span className="tabular text-[46px] leading-none font-bold tracking-[-0.04em]">
                        ${tier.price}
                      </span>
                      {tier.interval && (
                        <span className="text-[14.5px] text-text-tertiary">
                          /{tier.interval}
                        </span>
                      )}
                    </p>

                    <p className="mt-4 text-[15px] leading-relaxed text-text-secondary">
                      {tier.description}
                    </p>

                    <div className="mt-6">
                      {tier.planKey === null ? (
                        <ButtonLink
                          href="/convert"
                          size="lg"
                          variant="secondary"
                          className="w-full"
                        >
                          Get started
                        </ButtonLink>
                      ) : (
                        <SubscribeButton
                          planKey={tier.planKey}
                          variant={isPlus ? "primary" : "secondary"}
                          autoStart={resume === tier.planKey}
                        >
                          Subscribe
                        </SubscribeButton>
                      )}
                    </div>
                    <ul className="mt-6 grid gap-3 border-t border-[var(--border)] pt-6">
                      {tier.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex gap-2.5 text-[14.5px] leading-snug"
                        >
                          <svg
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                            className="mt-0.5 h-4 w-4 flex-none text-success-text"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M4 10.5l4 4 8-9" />
                          </svg>
                          <span className="text-text-primary">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ── Credit costs ───────────────────────────────────── */}
        <section
          className="pb-20 bg-bg-secondary py-20"
          aria-labelledby="costs-heading"
        >
          <div className="wrap">
            <h2
              id="costs-heading"
              className="display max-w-[760px] text-[clamp(28px,4vw,44px)]"
            >
              Credit costs per operation.
            </h2>
            <p className="mt-5 max-w-[620px] text-[17px] leading-relaxed text-text-secondary">
              Each operation costs a fraction of a credit. Run as many as you
              need within your plan.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Vectorize",
                  cost: CREDIT_COSTS.VECTORIZE,
                  desc: "PNG/JPG/WEBP → SVG conversion",
                },
                {
                  name: "Remove background",
                  cost: CREDIT_COSTS.REMOVE_BG,
                  desc: "AI background removal",
                },
                {
                  name: "Upscale 2×",
                  cost: CREDIT_COSTS.UPSCALE_2X,
                  desc: "Double resolution",
                },
                {
                  name: "Upscale 4×",
                  cost: CREDIT_COSTS.UPSCALE_4X,
                  desc: "Quadruple resolution",
                },
                {
                  name: "Style Transfer",
                  cost: CREDIT_COSTS.STYLE_TRANSFER,
                  desc: "Apply artistic styles",
                },
                {
                  name: "Premium export",
                  cost: CREDIT_COSTS.EXPORT_PREMIUM,
                  desc: "DXF, EPS, G-code, DST formats",
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="rounded-[var(--radius-lg)] bg-white px-5 py-4 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-[16px] font-semibold">{item.name}</h3>
                    <span className="tabular font-mono text-[15px] font-semibold text-accent">
                      {item.cost.toFixed(2)}cr
                    </span>
                  </div>
                  <p className="mt-1 text-[14px] text-text-secondary">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-[14px] text-text-tertiary">
              Credits are deducted only when jobs succeed. Failed operations cost
              nothing.
            </p>
          </div>
        </section>

        {/* ── Comparison ─────────────────────────────────────── */}
        <section className="py-20" aria-labelledby="compare-heading">
          <div className="wrap">
            <h2
              id="compare-heading"
              className="display max-w-[760px] text-[clamp(28px,4vw,44px)]"
            >
              Why choose Vectroy?
            </h2>
            <p className="mt-5 max-w-[620px] text-[17px] leading-relaxed text-text-secondary">
              Fast, accurate vectorization with all the formats you need for Cricut,
              laser cutting, embroidery, and print.
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
