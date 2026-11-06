import type { Metadata } from 'next';
import Link from 'next/link';
import { FREE_TOOLS, TOOL_CATEGORIES } from '@/lib/tools-configs';

export const metadata: Metadata = {
  title: 'Free SVG & Vector Tools — 18 Production-Ready Tools | Vectorr',
  description:
    'Free online tools for vector files: batch converter, SVG optimizer, path editor, grid generator, and more. No signup, no limits.',
  keywords: ['free svg tools', 'batch converter', 'svg optimizer', 'color separation', 'path editor', 'vector tools'],
};

const LEGACY_TOOLS = [
  {
    slug: 'batch-converter',
    title: 'Batch Converter',
    description:
      'Upload multiple images at once and convert them all to SVG, PNG, PDF, or other formats. Automatically optimized for web, print, or production.',
    formats: ['SVG', 'PNG', 'PDF', 'DXF', 'EPS'],
    category: 'production',
  },
  {
    slug: 'svg-optimizer',
    title: 'SVG Optimizer',
    description:
      'Reduce SVG file size by removing metadata, simplifying paths, and collapsing redundant groups. See exactly what changed and download the optimized file.',
    formats: ['SVG'],
    category: 'quality',
  },
  {
    slug: 'color-separation',
    title: 'Color Separation Preview',
    description:
      'Preview CMYK separations for screen printing and offset printing. See each color plate individually and check registration alignment.',
    formats: ['SVG', 'PDF', 'PNG'],
    category: 'production',
  },
];

const ALL_TOOLS = [
  ...LEGACY_TOOLS,
  ...FREE_TOOLS.map((tool) => ({
    slug: tool.slug,
    title: tool.title,
    description: tool.description,
    formats: tool.formats,
    category: tool.category,
  })),
];

export default function ToolsPage() {
  return (
    <div className="wrap py-12 sm:py-16">
      <header className="mb-12">
        <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] mb-4">
          Free SVG & Vector Tools
        </h1>
        <p className="text-[clamp(1rem,2.5vw,1.25rem)] text-text-secondary max-w-3xl leading-relaxed">
          18 production-ready vector tools built for designers, shops, and crafters. Design, optimize, and
          validate—all free, no signup required.
        </p>
      </header>

      {/* Tool Categories */}
      {TOOL_CATEGORIES.map((category) => {
        const categoryTools = ALL_TOOLS.filter((t) => t.category === category.id);
        if (categoryTools.length === 0) return null;

        return (
          <div key={category.id} className="mb-12">
            <div className="mb-6">
              <h2 className="text-[1.75rem] font-bold mb-2">{category.label}</h2>
              <p className="text-[1rem] text-text-secondary">{category.blurb}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categoryTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="group block p-6 rounded-2xl bg-bg-secondary border border-border-subtle hover:border-border-strong hover:bg-bg-tertiary transition-[background-color,border-color] duration-200"
                >
                  <h3 className="text-[1.25rem] font-semibold mb-2 group-hover:text-accent transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-[0.9375rem] text-text-secondary mb-4 leading-relaxed">
                    {tool.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tool.formats.map((format) => (
                      <span
                        key={format}
                        className="px-2 py-0.5 text-[0.8125rem] font-medium rounded-md bg-bg-tertiary border border-border-subtle"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Free SVG & Vector Tools',
            description:
              '18 production-ready tools: batch converter, SVG optimizer, path editor, and more. No signup, no limits.',
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/tools`,
            hasPart: ALL_TOOLS.map((tool) => ({
              '@type': 'SoftwareApplication',
              name: tool.title,
              description: tool.description,
              url: `${process.env.NEXT_PUBLIC_SITE_URL}/tools/${tool.slug}`,
              applicationCategory: 'DesignApplication',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            })),
          }),
        }}
      />
    </div>
  );
}
