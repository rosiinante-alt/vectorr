import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pricing — Vectorr",
  description:
    "Free for 3 optimizations a month. Pro and Team plans are coming soon.",
};

interface Tier {
  name: string;
  price: string;
  period: string;
  yearly?: string;
  blurb: string;
  cta: string;
  href: string;
  featured?: boolean;
  comingSoon?: boolean;
  features: string[];
}

const tiers: Tier[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    blurb: "For the one stubborn file you need to shrink today.",
    cta: "Start optimizing",
    href: "/dashboard",
    features: [
      "3 optimizations a month",
      "Up to 1 MB per SVG",
      "SVG export",
      "Per-plugin savings report",
      "Local estimate without an account",
    ],
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    yearly: "$79/year — about $6.58/mo",
    blurb: "For designers shipping vectors into real products.",
    cta: "Join the Pro waitlist",
    href: "/login",
    featured: true,
    comingSoon: true,
    features: [
      "Everything in Free, without the monthly cap",
      "Coordinate precision control (2 · 3 · 5 decimals)",
      "Priority support",
    ],
  },
  {
    name: "Team",
    price: "$29",
    period: "per month",
    yearly: "$249/year — about $20.75/mo",
    blurb: "For design-system and print teams with a lot of icons.",
    cta: "Join the waitlist",
    href: "/login",
    comingSoon: true,
    features: [
      "Everything in Pro",
      "Batch optimization, up to 50 files",
      "ZIP download with per-file reports",
      "Shared history",
      "API access",
    ],
  },
];

export default function PricingPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main" className="flex-1">
        <section className="py-16 text-center sm:py-24">
          <div className="wrap">
            <h1 className="display mx-auto max-w-[760px] text-[clamp(32px,5vw,56px)]">
              Priced for the job nobody else does.
            </h1>
            <p className="mx-auto mt-5 max-w-[560px] text-[17px] text-text-secondary">
              Tracing is cheap because it is easy. Fixing the vector you already own
              is neither — so that is what you pay for.
            </p>
          </div>
        </section>

        <section className="pb-16" aria-labelledby="tiers-heading">
          <h2 id="tiers-heading" className="visually-hidden">
            Plans
          </h2>
          <div className="wrap">
            <ul className="grid gap-5 lg:grid-cols-3">
              {tiers.map((tier) => (
                <li
                  key={tier.name}
                  className={
                    "flex flex-col rounded-[var(--radius-xl)] bg-white p-7 " +
                    (tier.featured
                      ? "shadow-[inset_0_0_0_2px_var(--accent),0_2px_6px_rgba(0,0,0,0.05),0_18px_40px_-14px_rgba(0,0,0,0.16)]"
                      : "shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]")
                  }
                >
                  <div className="flex items-center gap-2">
                    <h3 className="text-[17px] font-semibold tracking-[-0.02em]">
                      {tier.name}
                    </h3>
                    {tier.featured && <Badge tone="accent">Most popular</Badge>}
                    {tier.comingSoon && <Badge tone="neutral">Coming soon</Badge>}
                  </div>

                  <p className="mt-4 flex items-baseline gap-2">
                    <span className="tabular text-[46px] leading-none font-bold tracking-[-0.04em]">
                      {tier.price}
                    </span>
                    <span className="text-[14.5px] text-text-tertiary">
                      {tier.period}
                    </span>
                  </p>
                  {tier.yearly && (
                    <p className="mt-2 text-[13.5px] text-success-text">
                      {tier.yearly}
                    </p>
                  )}

                  <p className="mt-4 text-[15px] leading-relaxed text-text-secondary">
                    {tier.blurb}
                  </p>

                  <div className="mt-6">
                    <ButtonLink
                      href={tier.href}
                      size="lg"
                      variant={tier.featured ? "primary" : "secondary"}
                      className="w-full"
                    >
                      {tier.cta}
                    </ButtonLink>
                  </div>
                  <ul className="mt-6 grid gap-3 border-t border-[var(--border)] pt-6">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-2.5 text-[14.5px] leading-snug">
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
              ))}
            </ul>

            <div className="mx-auto mt-10 max-w-[560px] rounded-[var(--radius-xl)] bg-bg-secondary px-6 py-7 text-center">
              <h2 className="text-[17px] font-semibold tracking-[-0.02em]">
                Just one file?
              </h2>
              <p className="mt-2 text-[15px] text-text-secondary">
                Skip the subscription. A single-file unlock is coming with paid
                plans — until then, the free tier covers 3 files a month.
              </p>
              <div className="mt-5 flex justify-center">
                <ButtonLink href="/dashboard" variant="secondary">
                  Optimize a file free
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        {/* ── Comparison ─────────────────────────────────────── */}
        <section
          id="compare"
          className="scroll-mt-20 bg-bg-secondary py-20"
          aria-labelledby="compare-heading"
        >
          <div className="wrap">
            <h2
              id="compare-heading"
              className="display max-w-[760px] text-[clamp(28px,4vw,44px)]"
            >
              What you are actually buying.
            </h2>
            <p className="mt-5 max-w-[620px] text-[17px] leading-relaxed text-text-secondary">
              The incumbents treat optimization as a checkbox on the way to their
              real product. Here it is the product.
            </p>

            <div className="mt-10 overflow-x-auto rounded-[var(--radius-lg)] bg-white shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]">
              <table className="w-full min-w-[680px] border-collapse text-left">
                <caption className="visually-hidden">
                  Vectorr compared with other vector tools
                </caption>
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="border-b border-[var(--border)] bg-bg-secondary px-4 py-3.5 text-[13.5px] font-semibold text-text-secondary"
                    >
                      Need
                    </th>
                    <th
                      scope="col"
                      className="border-b border-[var(--border)] bg-accent-wash px-4 py-3.5 text-[13.5px] font-semibold text-accent-ink"
                    >
                      Vectorr
                    </th>
                    <th
                      scope="col"
                      className="border-b border-[var(--border)] bg-bg-secondary px-4 py-3.5 text-[13.5px] font-semibold text-text-secondary"
                    >
                      Illustrator
                    </th>
                    <th
                      scope="col"
                      className="border-b border-[var(--border)] bg-bg-secondary px-4 py-3.5 text-[13.5px] font-semibold text-text-secondary"
                    >
                      SVGO
                    </th>
                    <th
                      scope="col"
                      className="border-b border-[var(--border)] bg-bg-secondary px-4 py-3.5 text-[13.5px] font-semibold text-text-secondary"
                    >
                      Figma
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Shrink an existing SVG", "Yes", "Manual", "Yes, CLI", "Export and hope"],
                    ["Per-plugin byte attribution", "Yes", "No", "No", "No"],
                    ["Works without installing", "Yes", "No", "No", "Browser only"],
                    ["Batch a whole icon set", "Soon", "Scripted", "Scripted", "No"],
                    ["Color / palette audit", "Soon", "Manual", "Partial", "No"],
                    ["Price", "Free / $9", "~$23/mo", "Free", "$16/seat"],
                  ].map(([need, vectorr, illustrator, svgo, figma]) => (
                    <tr key={need}>
                      <th
                        scope="row"
                        className="border-b border-[var(--border)] px-4 py-3.5 text-[15px] font-semibold text-text-primary"
                      >
                        {need}
                      </th>
                      <td className="border-b border-[var(--border)] bg-accent-wash/60 px-4 py-3.5 text-[15px] font-medium text-text-primary">
                        {vectorr}
                      </td>
                      <td className="border-b border-[var(--border)] px-4 py-3.5 text-[15px] text-text-secondary">
                        {illustrator}
                      </td>
                      <td className="border-b border-[var(--border)] px-4 py-3.5 text-[15px] text-text-secondary">
                        {svgo}
                      </td>
                      <td className="border-b border-[var(--border)] px-4 py-3.5 text-[15px] text-text-secondary">
                        {figma}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-[13.5px] text-text-tertiary">
              Illustrator&apos;s price is an approximate monthly figure and moves with
              Adobe&apos;s plans. Figma is priced per seat.
            </p>
          </div>
        </section>

        {/* ── Metering note ──────────────────────────────────── */}
        <section className="py-20" aria-labelledby="metering-heading">
          <div className="wrap">
            <h2
              id="metering-heading"
              className="display max-w-[760px] text-[clamp(28px,4vw,44px)]"
            >
              Metered in files, not credits.
            </h2>
            <ul className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                {
                  title: "No credit arithmetic",
                  body: "Optimization is CPU work measured in milliseconds. You get a file count, not a currency to top up.",
                },
                {
                  title: "Failed jobs cost nothing",
                  body: "If an optimization fails, it does not count against your month. Ever.",
                },
                {
                  title: "Cancel without losing work",
                  body: "Every optimized file stays downloadable. Leaving does not take your exports with it.",
                },
              ].map((item) => (
                <li
                  key={item.title}
                  className="rounded-[var(--radius-xl)] bg-white p-6 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]"
                >
                  <h3 className="text-[17px] font-semibold tracking-[-0.02em]">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-text-secondary">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-14 text-center">
              <ButtonLink href="/dashboard" size="lg">
                Optimize your first file
              </ButtonLink>
              <p className="mt-4 text-[14px] text-text-tertiary">
                Free · no signup to preview ·{" "}
                <Link
                  href="/login"
                  className="text-accent-ink underline underline-offset-[3px]"
                >
                  sign in
                </Link>{" "}
                when you want the real thing
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
