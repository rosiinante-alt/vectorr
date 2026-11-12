import glossaryData from "../../public/data/glossary.json";

export interface GlossaryTerm {
  term: string;
  slug: string;
  letter: string;
  category: string;
  definition: string;
  related: string[];
}

export const GLOSSARY_TERMS: GlossaryTerm[] = (
  glossaryData as GlossaryTerm[]
).sort((a, b) => a.term.localeCompare(b.term));

export const GLOSSARY_LETTERS = [
  ...new Set(GLOSSARY_TERMS.map((t) => t.letter)),
].sort();

export const GLOSSARY_CATEGORIES = [
  ...new Set(GLOSSARY_TERMS.map((t) => t.category)),
].sort();

export function getTermsByLetter(letter: string): GlossaryTerm[] {
  return GLOSSARY_TERMS.filter((t) => t.letter === letter);
}

export function getTermsByCategory(category: string): GlossaryTerm[] {
  return GLOSSARY_TERMS.filter((t) => t.category === category);
}

export const LETTER_GROUPS: Record<string, GlossaryTerm[]> = GLOSSARY_TERMS.reduce(
  (groups, term) => {
    const key = term.letter;
    (groups[key] ||= []).push(term);
    return groups;
  },
  {} as Record<string, GlossaryTerm[]>
);
