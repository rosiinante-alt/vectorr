import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { ALTERNATIVES } from "@/lib/alternatives-configs";
import type { Alternative } from "@/lib/alternatives-configs";

export const metadata: Metadata = {
  title: "Vectroy vs Alternatives — Compare Vectorization Tools | Vectroy",
  description:
    "Compare Vectroy with Vectorizer.AI, Vector Magic, Adobe Illustrator, Inkscape, and other vectorization tools. See which features each tool offers.",
  alternates: { canonical: "/alternative" },
  openGraph: {
    title: "Vectroy vs Alternatives — Compare Vectorization Tools",
    description:
      "Side-by-side comparison of Vectroy with popular vectorization tools.",
    type: "website",
    url: "/alternative",
  },
};

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 text-emerald-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      className="h-4 w-4 text-text-tertiary"
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
  );
}

function AlternativeCard({ alt }: { alt: Alternative }) {
  return (
    <article
      id={alt.slug}
      className="rounded-[var(--radius-xl)] bg-bg-secondary overflow-hidden shadow-[var(--shadow-1)]"
    >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-0.5">
              Vectroy&nbsp;vs&nbsp;{alt.name}
            </h2>
            <p className="text-sm text-text-tertiary">{alt.category}</p>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-bg-tertiary text-text-secondary">
            {alt.pricing}
          </span>
        </div>
        <p className="text-sm text-text-secondary">{alt.description}</p>
      </div>

      <div className="p-6 grid sm:grid-cols-2 gap-6">
        {/* Strengths / Weaknesses */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-2">
            {alt.name} strengths
          </p>
          <ul className="space-y-1 mb-4">
            {alt.strengths.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-text-secondary">
                <CheckIcon />
                {s}
              </li>
            ))}
          </ul>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-2">
            Limitations
          </p>
          <ul className="space-y-1">
            {alt.weaknesses.map((w) => (
              <li key={w} className="flex items-center gap-2 text-sm text-text-secondary">
                <XIcon />
                {w}
              </li>
            ))}
          </ul>
        </div>

        {/* Feature comparison table */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-2">
            Feature comparison
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-1 text-text-tertiary font-normal">
                  Feature
                </th>
                <th className="text-center py-1 text-text-tertiary font-normal w-16">
                  {alt.name.split(" ")[0]}
                </th>
                <th className="text-center py-1 text-accent font-semibold w-16">
                  Vectroy
                </th>
              </tr>
            </thead>
            <tbody>
              {alt.features.map((f) => (
                <tr key={f.name} className="border-t border-border">
                  <td className="py-1.5 text-text-secondary">{f.name}</td>
                  <td className="py-1.5 text-center">
                    <span className="inline-flex justify-center">
                      {f.them ? <CheckIcon /> : <XIcon />}
                    </span>
                  </td>
                  <td className="py-1.5 text-center">
                    <span className="inline-flex justify-center">
                      {f.us ? <CheckIcon /> : <XIcon />}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vectroy advantage */}
      <div className="px-6 pb-6">
        <div className="rounded-[var(--radius-md)] bg-accent/5 border border-accent/20 p-4">
          <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">
            Why switch to Vectroy
          </p>
          <p className="text-sm text-text-secondary">{alt.vectroyAdvantage}</p>
        </div>
        <div className="mt-4">
          <Link
            href="/convert"
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Try Vectroy free
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function AlternativePage() {
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
          <div className="mx-auto max-w-[720px] text-center mb-6">
            <h1 className="display mb-4 text-[clamp(32px,5vw,52px)] leading-tight">
              How Vectroy compares
            </h1>
            <p className="text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              Side-by-side comparisons with popular vectorization tools — so
              you can decide what fits your workflow.
            </p>
          </div>

          {/* Jump links */}
          <nav aria-label="Jump to comparison" className="mb-12">
            <ul className="flex flex-wrap gap-2 justify-center">
              {ALTERNATIVES.map((alt) => (
                <li key={alt.id}>
                  <a
                    href={`#${alt.slug}`}
                    className="px-4 py-1.5 rounded-full text-sm font-medium border border-border text-text-secondary hover:border-accent hover:text-text-primary transition-colors"
                  >
                    vs {alt.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Cards */}
          <div className="space-y-10">
            {ALTERNATIVES.map((alt) => (
              <AlternativeCard key={alt.id} alt={alt} />
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
