import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { PRICING_TIERS } from "@/lib/credits/constants";

export const metadata: Metadata = {
  title: "Vectroy Pro — Pricing for Shops & Agencies | Vectroy",
  description:
    "Vectroy Pro tier pricing for print shops, Etsy sellers, and agencies. Bulk vectorization, priority queue, commercial licensing, and API access.",
  alternates: { canonical: "/pro" },
  openGraph: {
    title: "Vectroy Pro — Pricing for Shops & Agencies",
    description:
      "Bulk vectorization pricing for print shops, Etsy sellers, and agencies.",
    type: "website",
    url: "/pro",
  },
};

const PRO_HIGHLIGHTS = [
  {
    title: "Bulk queue priority",
    body: "Your jobs jump ahead of the free queue during peak hours — the same day, not the same week.",
  },
  {
    title: "Commercial licensing",
    body: "Convert client artwork at volume without per-project licensing questions.",
  },
  {
    title: "Unlimited team seats",
    body: "Bring the whole studio. Everyone shares one credit pool and one history.",
  },
  {
    title: "API access",
    body: "Wire vectorization straight into your own storefront, print server, or workflow tool.",
  },
];

const USE_CASES = [
  {
    title: "Etsy sellers",
    body: "Prep 50 listings a week — mockups, listing images, and vector-ready print files.",
    stat: "~2,500",
    statLabel: "vectorizations / month",
  },
  {
    title: "Print shops",
    body: "Turn customer uploads into production-ready vector art without hiring an operator.",
    stat: "12×",
    statLabel: "faster than manual tracing",
  },
  {
    title: "Agencies",
    body: "Batch-convert client logo libraries and keep everything in one shared workspace.",
    stat: "10",
    statLabel: "seats included",
  },
];

export default function ProPage() {
  const pro = PRICING_TIERS.PRO;
  const teamPro = PRICING_TIERS.TEAM_PRO;
  const enterprise = PRICING_TIERS.ENTERPRISE;

  return (
    <div className="flex min-h-svh flex-col">
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

      <main id="main" className="flex-1 py-12 sm:py-16 lg:py-20">
        <div className="wrap">
          {/* Hero */}
          <div className="mx-auto max-w-[760px] text-center mb-16">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-[13px] font-medium text-accent">
              Pro tier
            </div>
            <h1 className="display mb-4 text-[clamp(32px,5vw,54px)] leading-tight">
              Volume vectorization, priced for shops
            </h1>
            <p className="mb-8 text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              Pro gives you a priority queue, commercial licensing, batch
              processing, and API access — for makers and studios that convert
              every day.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] bg-accent px-6 py-3 font-medium text-bg-primary hover:opacity-90 transition-opacity"
              >
                See full pricing
              </Link>
              <Link
                href="/convert"
                className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] border border-border px-6 py-3 font-medium text-text-primary hover:border-accent transition-colors"
              >
                Try it free
              </Link>
            </div>
          </div>

          {/* Pricing tiers */}
          <div className="grid gap-6 lg:grid-cols-3 mb-20">
            {/* Pro */}
            <article className="rounded-[var(--radius-xl)] bg-bg-secondary p-6 shadow-[var(--shadow-1)]">
              <h2 className="text-lg font-semibold text-text-primary mb-1">
                {pro.name}
              </h2>
              <p className="text-sm text-text-secondary mb-4">{pro.description}</p>
              <p className="mb-5">
                <span className="text-3xl font-semibold text-text-primary">
                  ${pro.price}
                </span>
                <span className="text-sm text-text-tertiary"> / month</span>
              </p>
              <ul className="space-y-2 mb-6">
                {pro.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-text-secondary"
                  >
                    <svg
                      className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className="block text-center rounded-[var(--radius-md)] bg-accent px-4 py-2 text-sm font-medium text-bg-primary hover:opacity-90 transition-opacity"
              >
                Choose {pro.name}
              </Link>
            </article>

            {/* Team Pro */}
            <article className="rounded-[var(--radius-xl)] bg-bg-secondary p-6 shadow-[var(--shadow-1)] ring-2 ring-accent">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                Most popular for studios
              </div>
              <h2 className="text-lg font-semibold text-text-primary mb-1">
                {teamPro.name}
              </h2>
              <p className="text-sm text-text-secondary mb-4">
                {teamPro.description}
              </p>
              <p className="mb-5">
                <span className="text-3xl font-semibold text-text-primary">
                  ${teamPro.price}
                </span>
                <span className="text-sm text-text-tertiary"> / month</span>
              </p>
              <ul className="space-y-2 mb-6">
                {teamPro.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-text-secondary"
                  >
                    <svg
                      className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className="block text-center rounded-[var(--radius-md)] bg-accent px-4 py-2 text-sm font-medium text-bg-primary hover:opacity-90 transition-opacity"
              >
                Choose {teamPro.name}
              </Link>
            </article>

            {/* Enterprise */}
            <article className="rounded-[var(--radius-xl)] bg-bg-secondary p-6 shadow-[var(--shadow-1)]">
              <h2 className="text-lg font-semibold text-text-primary mb-1">
                {enterprise.name}
              </h2>
              <p className="text-sm text-text-secondary mb-4">
                {enterprise.description}
              </p>
              <p className="mb-5">
                <span className="text-3xl font-semibold text-text-primary">
                  Custom
                </span>
              </p>
              <ul className="space-y-2 mb-6">
                {enterprise.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-text-secondary"
                  >
                    <svg
                      className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="block text-center rounded-[var(--radius-md)] border border-border px-4 py-2 text-sm font-medium text-text-primary hover:border-accent transition-colors"
              >
                Talk to sales
              </Link>
            </article>
          </div>

          {/* Highlights */}
          <section className="mb-20">
            <h2 className="text-[clamp(22px,3vw,32px)] font-semibold text-text-primary text-center mb-10">
              What Pro adds
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PRO_HIGHLIGHTS.map((h) => (
                <div
                  key={h.title}
                  className="rounded-[var(--radius-xl)] bg-bg-secondary p-6"
                >
                  <h3 className="font-semibold text-text-primary mb-2">
                    {h.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {h.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Use cases */}
          <section className="mb-20">
            <h2 className="text-[clamp(22px,3vw,32px)] font-semibold text-text-primary text-center mb-10">
              Built for volume
            </h2>
            <div className="grid gap-6 lg:grid-cols-3">
              {USE_CASES.map((u) => (
                <div
                  key={u.title}
                  className="rounded-[var(--radius-xl)] bg-bg-secondary p-6"
                >
                  <h3 className="font-semibold text-text-primary mb-2">
                    {u.title}
                  </h3>
                  <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                    {u.body}
                  </p>
                  <p className="text-2xl font-semibold text-accent">{u.stat}</p>
                  <p className="text-xs text-text-tertiary">{u.statLabel}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ-ish CTA */}
          <section className="rounded-[var(--radius-xl)] bg-bg-secondary p-10 text-center">
            <h2 className="display text-[clamp(24px,3.5vw,36px)] mb-3">
              Not sure which tier fits?
            </h2>
            <p className="text-text-secondary mb-6 max-w-[560px] mx-auto">
              Start free and upgrade when your volume demands it. No annual
              lock-in required.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] bg-accent px-6 py-3 font-medium text-bg-primary hover:opacity-90 transition-opacity"
            >
              Compare all plans
            </Link>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
