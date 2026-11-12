import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { HOW_TO_GUIDES } from "@/lib/how-to-configs";
import { buildHowToSchema } from "@/lib/how-to-configs";
import type { HowToGuide } from "@/lib/how-to-configs";

export const metadata: Metadata = {
  title: "How-To Guides — Vectorization Workflows | Vectroy",
  description:
    "Step-by-step guides for every vectorization workflow: logos, Cricut, laser cutting, batch processing, background removal, and more.",
  alternates: { canonical: "/how-to" },
  openGraph: {
    title: "How-To Guides — Vectorization Workflows",
    description: "Step-by-step guides for vectorizing logos, photos, craft files, and more.",
    type: "website",
    url: "/how-to",
  },
};

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-600",
  Intermediate: "bg-amber-500/10 text-amber-600",
  Advanced: "bg-rose-500/10 text-rose-600",
};

function GuideCard({ guide }: { guide: HowToGuide }) {
  const schema = buildHowToSchema(guide);
  return (
    <article
      id={guide.id}
      className="rounded-[var(--radius-xl)] bg-bg-secondary p-6 shadow-[var(--shadow-1)]"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-1">
            {guide.title}
          </h2>
          <p className="text-sm text-text-secondary">{guide.description}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              DIFFICULTY_COLOR[guide.difficulty] ?? "bg-bg-tertiary text-text-secondary"
            }`}
          >
            {guide.difficulty}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-bg-tertiary text-text-secondary">
            {guide.duration}
          </span>
        </div>
      </div>

      {/* Steps */}
      <ol className="space-y-2 mb-5">
        {guide.steps.map((step, i) => (
          <li key={i} className="flex gap-3 text-sm text-text-secondary">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>

      {/* Tips */}
      {guide.tips.length > 0 && (
        <div className="rounded-[var(--radius-md)] bg-bg-tertiary p-3 mb-5">
          <p className="text-xs font-semibold text-text-tertiary mb-1 uppercase tracking-wide">
            Tips
          </p>
          <ul className="space-y-1">
            {guide.tips.map((tip, i) => (
              <li key={i} className="text-sm text-text-secondary">
                · {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <Link
        href={guide.toolPath}
        className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
      >
        {guide.toolLabel}
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
    </article>
  );
}

export default function HowToPage() {
  const categories = [...new Set(HOW_TO_GUIDES.map((g) => g.category))];

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
          <div className="mx-auto max-w-[720px] text-center mb-16">
            <h1 className="display mb-4 text-[clamp(32px,5vw,52px)] leading-tight">
              How-to guides
            </h1>
            <p className="text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              Step-by-step workflows for every vectorization use case — from
              converting a logo to running batch jobs for a whole product line.
            </p>
          </div>

          {/* Quick nav */}
          <nav aria-label="Guide categories" className="mb-10">
            <ul className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <li key={cat}>
                  <a
                    href={`#category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                    className="px-4 py-1.5 rounded-full text-sm font-medium border border-border text-text-secondary hover:border-accent hover:text-text-primary transition-colors"
                  >
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Guides by category */}
          <div className="space-y-16">
            {categories.map((cat) => {
              const guides = HOW_TO_GUIDES.filter((g) => g.category === cat);
              return (
                <section
                  key={cat}
                  id={`category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <h2 className="text-[clamp(20px,2.5vw,28px)] font-semibold text-text-primary mb-6">
                    {cat}
                  </h2>
                  <div className="grid gap-6 lg:grid-cols-2">
                    {guides.map((guide) => (
                      <GuideCard key={guide.id} guide={guide} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
