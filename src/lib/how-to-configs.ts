import howToData from "../../public/data/how-to.json";

export interface HowToGuide {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  toolPath: string;
  toolLabel: string;
  category: string;
  steps: string[];
  tips: string[];
  tags: string[];
}

export const HOW_TO_GUIDES: HowToGuide[] = howToData as HowToGuide[];

export const HOW_TO_CATEGORIES = [
  ...new Set(HOW_TO_GUIDES.map((g) => g.category)),
];

export function getGuide(id: string): HowToGuide | undefined {
  return HOW_TO_GUIDES.find((g) => g.id === id);
}

export function buildHowToSchema(guide: HowToGuide) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: guide.title,
    description: guide.description,
    totalTime: `PT${guide.duration.replace(" minutes", "M").replace(" minute", "M")}`,
    step: guide.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: step,
    })),
  };
}
