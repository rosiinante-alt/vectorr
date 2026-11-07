import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  COMPARISONS,
  COMPARISON_SLUGS,
  getComparison,
  type Comparison,
  type ComparisonFeature,
} from "@/lib/comparisons";

interface RouteParams {
  competitor: string;
}

interface PageProps {
  params: Promise<RouteParams>;
}

export async function generateStaticParams(): Promise<RouteParams[]> {
  return COMPARISON_SLUGS.map((competitor) => ({ competitor }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { competitor } = await params;
  const comparison = getComparison(competitor);

  if (!comparison) {
    return {
      title: "Comparison Not Found",
      description: "This comparison is not available.",
    };
  }

  return {
    title: comparison.seoTitle,
    description: comparison.seoDescription,
    keywords: comparison.keywords,
    alternates: { canonical: `/compare/${comparison.slug}` },
    openGraph: {
      title: comparison.seoTitle,
      description: comparison.seoDescription,
      type: "article",
      url: `/compare/${comparison.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: comparison.seoTitle,
      description: comparison.seoDescription,
    },
  };
}

const SLOT_PATTERN = /(\[[A-Z0-9_]+\])/g;
const SLOT_TEST = /^\[[A-Z0-9_]+\]$/;

/** Split template copy into markdown-ish blocks and highlight [SLOT] markers. */
function renderTemplate(text: string) {
  return text.split("\n\n").map((block, index) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("## ")) {
      return (
        <h2
          key={index}
          className="display mt-12 mb-4 text-[clamp(24px,3vw,32px)] first:mt-0"
        >
          {trimmed.slice(3)}
        </h2>
      );
    }

    return (
      <p
        key={index}
        className="mb-4 text-[16px] leading-[1.75] text-text-secondary"
      >
        {trimmed.split(SLOT_PATTERN).map((part, partIndex) =>
          SLOT_TEST.test(part) ? (
            <span
              key={partIndex}
              className="rounded-[var(--radius-sm)] bg-warning-wash px-1 font-mono text-[13px] text-warning"
            >
              {part}
            </span>
          ) : (
            <span key={partIndex}>{part}</span>
          ),
        )}
      </p>
    );
  });
}

function WinnerMark({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex items-center gap-1.5 text-success-text">
      <span aria-hidden="true" className="text-[15px]">✓</span>
      <span className="text-[13px] font-medium">Yes</span>
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-text-tertiary">
      <span aria-hidden="true" className="text-[15px]">✕</span>
      <span className="text-[13px] font-medium">No</span>
    </span>
  );
}

function FeatureRows({ features }: { features: ComparisonFeature[] }) {
  return (
    <tbody>
      {features.map((row) => (
        <tr
          key={row.feature}
          className="border-t border-[var(--border)] first:border-t-0"
        >
          <th
            scope="row"
            className="py-4 pr-4 text-left text-[15px] font-medium text-text-primary"
          >
            {row.feature}
            {row.winner === "vectroy" && (
              <Badge tone="success" className="ml-2 align-middle">
                Vectroy
              </Badge>
            )}
            {row.winner === "competitor" && (
              <Badge tone="neutral" className="ml-2 align-middle">
                Competitor
              </Badge>
            )}
          </th>
          <td className="px-4 py-4 text-center">
            <WinnerMark value={row.vectroy} />
          </td>
          <td className="px-4 py-4 text-center">
            <WinnerMark value={row.competitor} />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

function CtaBlock({ competitorName }: { competitorName: string }) {
  return (
    <section className="mt-16 rounded-[var(--radius-xl)] bg-bg-secondary p-8 text-center sm:p-12">
      <h2 className="display text-[clamp(26px,4vw,38px)]">Try Vectroy Free</h2>
      <p className="mx-auto mt-4 max-w-[520px] text-[16.5px] leading-relaxed text-text-secondary">
        Start with 5 free credits. No credit card required — see how your files
        compare against {competitorName} before you commit.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href="/convert" size="lg">
          Try Vectroy Free
        </ButtonLink>
        <ButtonLink href="/pricing" size="lg" variant="secondary">
          See pricing
        </ButtonLink>
      </div>
    </section>
  );
}

export default async function ComparePage({ params }: PageProps) {
  const { competitor } = await params;
  const comparison: Comparison | undefined = getComparison(competitor);

  if (!comparison) {
    notFound();
  }

  const related = COMPARISONS.filter((item) => item.slug !== comparison.slug).slice(
    0,
    4,
  );

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main" className="flex-1">
        <section className="py-14 sm:py-20">
          <div className="wrap">
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex items-center gap-2 text-[13.5px] text-text-tertiary"
            >
              <Link href="/" className="hover:text-text-primary">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span>Compare</span>
              <span aria-hidden="true">/</span>
              <span className="text-text-secondary">{comparison.competitorName}</span>
            </nav>

            <Badge tone="accent">Comparison</Badge>
            <h1 className="display mt-4 max-w-[820px] text-[clamp(34px,5vw,58px)]">
              {comparison.title}
            </h1>
            <p className="mt-5 max-w-[620px] text-[17px] leading-relaxed text-text-secondary">
              A side-by-side look at features, output quality, and pricing.
              Jump to the matrix below, or read the full breakdown.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <ButtonLink href="/convert" size="lg">
                Try Vectroy Free
              </ButtonLink>
              <a
                href={comparison.competitorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center rounded-[999px] px-5 text-[16px] font-semibold text-text-secondary shadow-[inset_0_0_0_1px_var(--border-strong)] transition-colors hover:bg-bg-secondary hover:text-text-primary"
              >
                Visit {comparison.competitorName} ↗
              </a>
            </div>
          </div>
        </section>

        <section className="pb-4" aria-labelledby="matrix-heading">
          <div className="wrap">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse">
                  <caption id="matrix-heading" className="visually-hidden">
                    Feature comparison between Vectroy and {comparison.competitorName}
                  </caption>
                  <thead>
                    <tr className="bg-bg-secondary">
                      <th
                        scope="col"
                        className="py-4 pl-6 pr-4 text-left text-[13px] font-semibold tracking-[0.04em] text-text-tertiary uppercase"
                      >
                        Feature
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-4 text-center text-[14px] font-semibold text-text-primary"
                      >
                        Vectroy
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-4 text-center text-[14px] font-semibold text-text-primary"
                      >
                        {comparison.competitorName}
                      </th>
                    </tr>
                  </thead>
                  <FeatureRows features={comparison.features} />
                  <tfoot>
                    <tr className="border-t border-[var(--border-strong)] bg-bg-secondary">
                      <th
                        scope="row"
                        className="py-5 pl-6 pr-4 text-left text-[15px] font-semibold text-text-primary"
                      >
                        Pricing
                      </th>
                      <td className="px-4 py-5 text-center align-top">
                        <p className="text-[15px] font-semibold text-text-primary">
                          {comparison.pricing.vectroy.startingPrice}
                        </p>
                        <p className="mt-1 text-[13px] text-text-tertiary">
                          {comparison.pricing.vectroy.model}
                        </p>
                        <p className="mt-1 text-[13px] text-text-tertiary">
                          Free: {comparison.pricing.vectroy.freeTier}
                        </p>
                      </td>
                      <td className="px-4 py-5 text-center align-top">
                        <p className="text-[15px] font-semibold text-text-primary">
                          {comparison.pricing.competitor.startingPrice}
                        </p>
                        <p className="mt-1 text-[13px] text-text-tertiary">
                          {comparison.pricing.competitor.model}
                        </p>
                        <p className="mt-1 text-[13px] text-text-tertiary">
                          Free: {comparison.pricing.competitor.freeTier}
                        </p>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Card>
            <p className="mt-3 text-[12.5px] text-text-tertiary">
              Competitor pricing and features are placeholders pending final review.
            </p>
          </div>
        </section>

        <section className="py-14 sm:py-20" aria-labelledby="details-heading">
          <div className="wrap max-w-[820px]">
            <h2 id="details-heading" className="visually-hidden">
              Detailed comparison
            </h2>
            <article>{renderTemplate(comparison.contentTemplate)}</article>
          </div>
        </section>

        <section className="pb-16" aria-labelledby="related-heading">
          <div className="wrap">
            <h2
              id="related-heading"
              className="display text-[clamp(24px,3vw,32px)]"
            >
              Other comparisons
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/compare/${item.slug}`}
                    className="block rounded-[var(--radius-xl)] bg-white p-5 text-[16px] font-medium text-text-primary shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-bg-secondary"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="wrap">
          <CtaBlock competitorName={comparison.competitorName} />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
