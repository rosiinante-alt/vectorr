import resourcesData from "../../public/data/resources.json";

export interface ResourceSection {
  id: string;
  title: string;
}

export interface ResourceItem {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  content: string;
  schema: Record<string, unknown>;
}

export const RESOURCES: ResourceItem[] = resourcesData as ResourceItem[];

export const RESOURCE_SLUGS: string[] = RESOURCES.map((r) => r.slug);

export function getResource(slug: string): ResourceItem | undefined {
  return RESOURCES.find((r) => r.slug === slug);
}

/** Turn an H2 title into a stable anchor id. */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/&amp;/g, "and")
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Extract the H2 headings from a resource body for the table of contents. */
export function getSections(content: string): ResourceSection[] {
  const matches = content.match(/<h2>([\s\S]*?)<\/h2>/g) ?? [];
  return matches.map((tag) => {
    const title = tag.replace(/<\/?h2>/g, "").replace(/<[^>]+>/g, "");
    return { id: slugifyHeading(title), title };
  });
}

/** Add ids to every H2 so the table of contents can link to them. */
export function withHeadingIds(content: string): string {
  return content.replace(/<h2>([\s\S]*?)<\/h2>/g, (_tag, inner: string) => {
    const title = inner.replace(/<[^>]+>/g, "");
    return `<h2 id="${slugifyHeading(title)}">${inner}</h2>`;
  });
}
