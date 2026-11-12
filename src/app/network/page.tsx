import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";

export const metadata: Metadata = {
  title: "Partner Network — Resellers & Agencies | Vectroy",
  description:
    "Join the Vectroy partner network. Reseller margins, white-label options, API access, and co-marketing for design agencies and print shops.",
  alternates: { canonical: "/network" },
  openGraph: {
    title: "Partner Network — Resellers & Agencies",
    description:
      "Reseller margins, white-label vectorization, and API access for agencies and print shops.",
    type: "website",
    url: "/network",
  },
};

const BENEFITS = [
  {
    title: "20% recurring margin",
    body: "Earn on every subscription your referrals bring in, for as long as they stay subscribed.",
  },
  {
    title: "White-label available",
    body: "Ship vectorization under your own brand — no Vectroy marks on the output or the invoice.",
  },
  {
    title: "API-first access",
    body: "Embed conversion directly in the tools your clients already use.",
  },
  {
    title: "Priority support",
    body: "A named contact for partner-tier issues, with an SLA on production outages.",
  },
  {
    title: "Co-marketing kit",
    body: "Logos, landing page copy, and launch assets so you can market the partnership from day one.",
  },
  {
    title: "Volume pricing",
    body: "Discounted credit rates once your referral volume crosses committed thresholds.",
  },
];

const PARTNER_TYPES = [
  {
    title: "Design agencies",
    body: "Turn client artwork into production files without adding a production operator to your payroll.",
    example: "Resell prep and vectorization as part of your brand or packaging retainer.",
  },
  {
    title: "Print shops",
    body: "Automate the vector prep step so your operators spend their time on cutting, printing, and finishing.",
    example: "Auto-accept artwork uploads and queue vector-ready files to your RIP.",
  },
  {
    title: "SaaS builders",
    body: "Add vectorization as a feature in your own product with a single API integration.",
    example: "Offer SVG export as a paid add-on to your design or e-commerce platform.",
  },
  {
    title: "Marketplaces & educators",
    body: "Teach and sell vector skills with a tool that runs in the browser on any device.",
    example: "Give students a workspace for course exercises and keep margins on upgrades.",
  },
];

const STEPS = [
  { step: "01", title: "Apply", body: "Tell us about your business and how you plan to use vectorization." },
  { step: "02", title: "Review", body: "We reply within two business days with a partner agreement." },
  { step: "03", title: "Onboard", body: "Get your margin tracking, API keys, and co-marketing assets." },
  { step: "04", title: "Launch", body: "Ship it. We track referrals and pay out monthly." },
];

export default function NetworkPage() {
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
          <div className="mx-auto max-w-[780px] text-center mb-16">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-[13px] font-medium text-accent">
              Partner program
            </div>
            <h1 className="display mb-4 text-[clamp(32px,5vw,54px)] leading-tight">
              The Vectroy partner network
            </h1>
            <p className="mb-8 text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              Resell vectorization, embed it in your product, or use it to
              deliver faster for your clients. Partners earn a recurring margin
              on everything they bring in.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] bg-accent px-6 py-3 font-medium text-bg-primary hover:opacity-90 transition-opacity"
            >
              Apply to join
            </Link>
          </div>

          {/* Benefits */}
          <section className="mb-20">
            <h2 className="text-[clamp(22px,3vw,32px)] font-semibold text-text-primary text-center mb-10">
              What partners get
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  className="rounded-[var(--radius-xl)] bg-bg-secondary p-6"
                >
                  <h3 className="font-semibold text-text-primary mb-2">
                    {b.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {b.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Partner types */}
          <section className="mb-20">
            <h2 className="text-[clamp(22px,3vw,32px)] font-semibold text-text-primary text-center mb-10">
              Who it fits
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {PARTNER_TYPES.map((p) => (
                <div
                  key={p.title}
                  className="rounded-[var(--radius-xl)] bg-bg-secondary p-6"
                >
                  <h3 className="font-semibold text-text-primary mb-2">
                    {p.title}
                  </h3>
                  <p className="text-sm text-text-secondary mb-3 leading-relaxed">
                    {p.body}
                  </p>
                  <p className="text-sm text-text-tertiary italic">e.g. {p.example}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Steps */}
          <section className="mb-20">
            <h2 className="text-[clamp(22px,3vw,32px)] font-semibold text-text-primary text-center mb-10">
              How to join
            </h2>
            <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s) => (
                <li
                  key={s.step}
                  className="rounded-[var(--radius-xl)] bg-bg-secondary p-6"
                >
                  <span className="text-sm font-mono font-semibold text-accent">
                    {s.step}
                  </span>
                  <h3 className="font-semibold text-text-primary mt-2 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {s.body}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* CTA */}
          <section className="rounded-[var(--radius-xl)] bg-bg-secondary p-10 text-center">
            <h2 className="display text-[clamp(24px,3.5vw,36px)] mb-3">
              Let&apos;s build this together
            </h2>
            <p className="text-text-secondary mb-6 max-w-[560px] mx-auto">
              Applications are reviewed within two business days. No minimum
              volume required to start.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] bg-accent px-6 py-3 font-medium text-bg-primary hover:opacity-90 transition-opacity"
            >
              Apply now
            </Link>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
