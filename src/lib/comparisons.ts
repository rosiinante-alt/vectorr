/**
 * Competitor comparison content.
 *
 * The copy lives in `public/data/comparisons.json` so it can be edited without
 * touching code. This module types that data and exposes lookup helpers used by
 * the `/compare/[competitor]` route and the sitemap.
 *
 * Content is template-only for now: paragraphs contain bracketed slots such as
 * `[COMPARISON_DETAILS]` and `[PRICING_TABLE]` that are meant to be replaced.
 */
import comparisons from "../../public/data/comparisons.json";

export type FeatureWinner = "vectroy" | "competitor" | "tie";

export interface ComparisonFeature {
  feature: string;
  vectroy: boolean;
  competitor: boolean;
  winner: FeatureWinner;
}

export interface ComparisonPricingTier {
  freeTier: string;
  startingPrice: string;
  model: string;
}

export interface Comparison {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  competitorName: string;
  competitorUrl: string;
  features: ComparisonFeature[];
  pricing: {
    vectroy: ComparisonPricingTier;
    competitor: ComparisonPricingTier;
  };
  contentTemplate: string;
}

export const COMPARISONS: Comparison[] = (comparisons as { comparisons: Comparison[] })
  .comparisons;

export const COMPARISON_SLUGS: string[] = COMPARISONS.map((item) => item.slug);

export function getComparison(slug: string): Comparison | undefined {
  return COMPARISONS.find((item) => item.slug === slug);
}
