import alternativesData from "../../public/data/alternatives.json";

export interface FeatureRow {
  name: string;
  them: boolean;
  us: boolean;
}

export interface Alternative {
  id: string;
  name: string;
  slug: string;
  category: string;
  url: string;
  description: string;
  pricing: string;
  strengths: string[];
  weaknesses: string[];
  vectroyAdvantage: string;
  features: FeatureRow[];
}

export const ALTERNATIVES: Alternative[] = alternativesData as Alternative[];

export function getAlternative(slug: string): Alternative | undefined {
  return ALTERNATIVES.find((a) => a.slug === slug);
}
