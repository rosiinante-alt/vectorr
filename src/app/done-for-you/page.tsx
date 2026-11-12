import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";

export const metadata: Metadata = {
  title: "Done-For-You Vectorization Service | Vectroy",
  description:
    "Send us your raster artwork and get hand-tuned, production-ready vector files back. Manual tracing, cleanup, and redraw by vector specialists.",
  alternates: { canonical: "/done-for-you" },
  openGraph: {
    title: "Done-For-You Vectorization Service",
    description:
      "Manual, specialist vectorization for artwork that needs more than an automated trace.",
    type: "website",
    url: "/done-for-you",
  },
};

const TIERS = [
  {
    name: "Single logo",
    price: "$29",
    unit: "per logo",
    turnaround: "24 hours",
    includes: [
      "Up to 2 color variations",
      "Clean paths, no stray anchors",
      "Editable, layered file",
      "SVG, PDF, EPS, and AI",
      "Two revision rounds",
    ],
    featured: false,
  },
  {
    name: "Brand pack",
    price: "$79",
    unit: "up to 5 logos",
    turnaround: "48 hours",
    includes: [
      "Everything in Single logo",
      "Consistent color palette",
      "Social avatar set",
      "Monochrome variants",
      "Four revision rounds",
    ],
    featured: true,
  },
  {
    name: "Full artwork set",
    price: "$249",
    unit: "up to 20 assets",
    turnaround: "5 days",
    includes: [
      "Everything in Brand pack",
      "Illustration cleanup",
      "Print-ready prep (CMYK)",
      "DXF for laser cutting",
      "Unlimited revisions",
    ],
    featured: false,
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Upload",
    body: "Send PNG, JPG, or a rough sketch. Add notes about what must stay exactly as-is.",
  },
  {
    step: "02",
    title: "We trace",
    body: "A vector specialist redraws your artwork by hand in Illustrator — no automated trace shortcuts.",
  },
  {
    step: "03",
    title: "You review",
    body: "Get a proof link with a side-by-side preview. Request changes directly on the proof.",
  },
  {
    step: "04",
    title: "You download",
    body: "Final files delivered as clean, layered source plus every export format you need.",
  },
];

const GOOD_FIT = [
  "Logos with fine detail or hand-drawn linework",
  "Illustrations that need cleanup, not just tracing",
  "Artwork for laser cutting, CNC, or vinyl",
  "Brand guidelines that need consistent asset families",
  "Print jobs that must pass a prepress check",
];

const NOT_A_FIT = [
  "Simple flat-color logos — use the automatic converter",
  "Urgent same-hour jobs",
  "Trademark or patent searches",
  "Full graphic design or branding services",
];

export default function DoneForYouPage() {
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
              Human service
            </div>
            <h1 className="display mb-4 text-[clamp(32px,5vw,54px)] leading-tight">
              Done-for-you vectorization
            </h1>
            <p className="mb-8 text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              Some artwork deserves a real redraw, not an automatic trace. Send
              it over and our vector specialists hand-build clean, production-ready
              vector files.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] bg-accent px-6 py-3 font-medium text-bg-primary hover:opacity-90 transition-opacity"
            >
              Start a request
            </Link>
          </div>

          {/* Tiers */}
          <section className="mb-20">
            <h2 className="text-[clamp(22px,3vw,32px)] font-semibold text-text-primary text-center mb-10">
              Fixed prices, no surprises
            </h2>
            <div className="grid gap-6 lg:grid-cols-3">
              {TIERS.map((tier) => (
                <article
                  key={tier.name}
                  className={`rounded-[var(--radius-xl)] bg-bg-secondary p-6 shadow-[var(--shadow-1)] ${
                    tier.featured ? "ring-2 ring-accent" : ""
                  }`}
                >
                  {tier.featured && (
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                      Most chosen
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-text-primary mb-1">
                    {tier.name}
                  </h3>
                  <p className="mb-4">
                    <span className="text-3xl font-semibold text-text-primary">
                      {tier.price}
                    </span>
                    <span className="text-sm text-text-tertiary"> {tier.unit}</span>
                  </p>
                  <p className="text-xs text-text-tertiary mb-4">
                    Typical turnaround: {tier.turnaround}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {tier.includes.map((inc) => (
                      <li
                        key={inc}
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
                        {inc}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`block text-center rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium transition-opacity ${
                      tier.featured
                        ? "bg-accent text-bg-primary hover:opacity-90"
                        : "border border-border text-text-primary hover:border-accent"
                    }`}
                  >
                    Choose {tier.name}
                  </Link>
                </article>
              ))}
            </div>
          </section>

          {/* Process */}
          <section className="mb-20">
            <h2 className="text-[clamp(22px,3vw,32px)] font-semibold text-text-primary text-center mb-10">
              How it works
            </h2>
            <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PROCESS.map((p) => (
                <li
                  key={p.step}
                  className="rounded-[var(--radius-xl)] bg-bg-secondary p-6"
                >
                  <span className="text-sm font-mono font-semibold text-accent">
                    {p.step}
                  </span>
                  <h3 className="font-semibold text-text-primary mt-2 mb-2">
                    {p.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {p.body}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* Fit checklist */}
          <section className="grid gap-6 lg:grid-cols-2 mb-20">
            <div className="rounded-[var(--radius-xl)] bg-bg-secondary p-6">
              <h2 className="font-semibold text-text-primary mb-4">
                This is right for you if…
              </h2>
              <ul className="space-y-2.5">
                {GOOD_FIT.map((g) => (
                  <li
                    key={g}
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
                    {g}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[var(--radius-xl)] bg-bg-secondary p-6">
              <h2 className="font-semibold text-text-primary mb-4">
                Use the automatic converter instead if…
              </h2>
              <ul className="space-y-2.5">
                {NOT_A_FIT.map((g) => (
                  <li
                    key={g}
                    className="flex items-start gap-2 text-sm text-text-secondary"
                  >
                    <svg
                      className="h-4 w-4 mt-0.5 shrink-0 text-text-tertiary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    {g}
                  </li>
                ))}
              </ul>
              <Link
                href="/convert"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
              >
                Convert it automatically
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-[var(--radius-xl)] bg-bg-secondary p-10 text-center">
            <h2 className="display text-[clamp(24px,3.5vw,36px)] mb-3">
              Got artwork that needs real craft?
            </h2>
            <p className="text-text-secondary mb-6 max-w-[560px] mx-auto">
              Tell us what you&apos;re making and we&apos;ll quote it within one
              business day.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] bg-accent px-6 py-3 font-medium text-bg-primary hover:opacity-90 transition-opacity"
            >
              Request a quote
            </Link>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
