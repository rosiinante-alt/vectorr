import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { GLOSSARY_TERMS, LETTER_GROUPS } from "@/lib/glossary-configs";
import type { GlossaryTerm } from "@/lib/glossary-configs";

export const metadata: Metadata = {
  title: "SVG & Vector Glossary — Definitions | Vectroy",
  description:
    "Understand vectorization terms: SVG, path, Bézier curve, DPI, raster, format, color mode, and more. A-Z definitions for makers and designers.",
  alternates: { canonical: "/glossary" },
  openGraph: {
    title: "SVG & Vector Glossary",
    description: "A-Z definitions of vectorization and SVG terms.",
    type: "website",
    url: "/glossary",
  },
};

function TermCard({ term }: { term: GlossaryTerm }) {
  return (
    <article
      id={term.slug}
      className="scroll-mt-20 rounded-[var(--radius-md)] bg-bg-secondary p-5"
    >
      <h3 className="text-base font-semibold text-text-primary mb-1.5">
        {term.term}
      </h3>
      <p className="text-sm text-text-secondary mb-3 leading-relaxed">
        {term.definition}
      </p>

      {term.related.length > 0 && (
        <div>
          <p className="text-xs font-medium text-text-tertiary mb-1.5">
            Related terms
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {term.related.map((rt) => (
              <li key={rt}>
                <a
                  href={`#${rt.toLowerCase().replace(/\s+/g, "-")}`}
                  className="inline-block text-xs px-2 py-0.5 rounded-full bg-bg-tertiary text-text-secondary hover:bg-accent/10 hover:text-accent transition-colors"
                >
                  {rt}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

export default function GlossaryPage() {
  const letters = Object.keys(LETTER_GROUPS);

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
          <div className="mx-auto max-w-[720px] text-center mb-12">
            <h1 className="display mb-4 text-[clamp(32px,5vw,52px)] leading-tight">
              SVG & Vector Glossary
            </h1>
            <p className="text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              A-Z definitions of vectorization, SVG, and maker terms — from
              Bézier curves to DPI to raster formats.
            </p>
          </div>

          {/* Letter nav */}
          <nav
            aria-label="Jump to letter"
            className="sticky top-16 z-10 bg-bg-primary/80 backdrop-blur-sm rounded-[var(--radius-md)] p-3 mb-10 shadow-[var(--shadow-1)]"
          >
            <ul className="flex flex-wrap gap-2 justify-center">
              {letters.map((letter) => (
                <li key={letter}>
                  <a
                    href={`#letter-${letter}`}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-full text-sm font-semibold border border-border text-text-secondary hover:border-accent hover:text-accent transition-colors"
                    aria-label={`Jump to ${letter}`}
                  >
                    {letter}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Terms by letter */}
          <div className="space-y-12">
            {letters.map((letter) => {
              const terms = LETTER_GROUPS[letter] || [];
              if (terms.length === 0) return null;

              return (
                <section key={letter} id={`letter-${letter}`} className="scroll-mt-32">
                  <h2 className="text-[clamp(24px,3vw,32px)] font-semibold text-text-primary mb-5 pb-2 border-b border-border">
                    {letter}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {terms.map((term) => (
                      <TermCard key={term.slug} term={term} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="text-text-secondary mb-4">
              Ready to put these terms into practice?
            </p>
            <Link
              href="/convert"
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] bg-accent px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              Try the converter
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
      </main>

      <SiteFooter />
    </div>
  );
}
