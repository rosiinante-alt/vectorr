import blogData from "../../public/data/blog.json";

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogItem {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  /** ISO date string, e.g. "2026-11-06". */
  publishedAt: string;
  updatedAt?: string;
  /** Primary cluster: file-formats | machine-workflows | vectorization | print-production | design-software */
  category: string;
  readingMinutes: number;
  /** One-sentence deck shown above the body and in listings. */
  excerpt: string;
  /** HTML content. Supports h2/h3/p/ul/ol/table/figure/strong/a. */
  content: string;
  faqs?: BlogFaq[];
  /** Slugs of related converters, e.g. "png-to-svg". */
  relatedConverters?: string[];
  /** Slugs of related articles. */
  relatedPosts?: string[];
  /** Optional explicit source list shown at the bottom. */
  sources?: { label: string; href: string }[];
}

export const BLOG_POSTS: BlogItem[] = blogData as BlogItem[];

export const BLOG_SLUGS: string[] = BLOG_POSTS.map((p) => p.slug);

export const BLOG_CATEGORIES: { id: string; label: string; blurb: string }[] = [
  {
    id: "file-formats",
    label: "File Formats",
    blurb: "What each format stores, what it loses, and which machine reads it.",
  },
  {
    id: "machine-workflows",
    label: "Machine Workflows",
    blurb: "Cutters, lasers, embroidery and the files they accept.",
  },
  {
    id: "3d-printing",
    label: "3D Printing",
    blurb: "SVG to mesh, STL vs 3MF, and getting 2D art onto a build plate.",
  },
  {
    id: "vectorization",
    label: "Vectorization",
    blurb: "Turning pixels into paths that survive editing and scaling.",
  },
  {
    id: "print-production",
    label: "Print & Production",
    blurb: "Screen print, DTF, sublimation and the separations behind them.",
  },
  {
    id: "design-software",
    label: "Design Software",
    blurb: "Illustrator, Inkscape, CorelDRAW, Rhino and Bambu Studio specifics.",
  },
];

export function getBlogPost(slug: string): BlogItem | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

/** Posts sorted newest first. */
export function sortedPosts(): BlogItem[] {
  return [...BLOG_POSTS].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
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

/** Extract H2 headings for the table of contents. */
export function getBlogSections(content: string): { id: string; title: string }[] {
  const matches = content.match(/<h2>([\s\S]*?)<\/h2>/g) ?? [];
  return matches.map((tag) => {
    const title = tag.replace(/<\/?h2>/g, "").replace(/<[^>]+>/g, "");
    return { id: slugifyHeading(title), title };
  });
}

/** Wrap tables so they scroll on narrow screens and add ids to every H2. */
export function prepareBlogHtml(content: string): string {
  return content
    .replace(/<table([\s\S]*?)<\/table>/g, (_m, inner: string) => `<div class="table-wrap"><table${inner}</table></div>`)
    .replace(/<h2>([\s\S]*?)<\/h2>/g, (_tag, inner: string) => {
      const title = inner.replace(/<[^>]+>/g, "");
      return `<h2 id="${slugifyHeading(title)}">${inner}</h2>`;
    });
}

/** Plain-text word count, used to estimate reading time when absent. */
export function wordCount(content: string): number {
  return content
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function readingTime(content: string): number {
  return Math.max(1, Math.round(wordCount(content) / 220));
}

/** Emit FAQPage JSON-LD when a post carries FAQs. */
export function blogFaqSchema(post: BlogItem): Record<string, unknown> | null {
  if (!post.faqs || post.faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}