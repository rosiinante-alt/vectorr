import type { Metadata } from 'next';
import Link from 'next/link';
import { DESIGNERS_WORKFLOWS, getDesignersCategories } from '@/lib/designers-workflow-configs';

export const metadata: Metadata = {
  title: 'For Designers — Asset Export & Design System Workflows | Vectroy',
  description:
    'Production-ready workflows for Figma export, logo redesign, icon systems, typeface optimization, brand asset management, design tokens, and color palettes.',
  keywords: [
    'figma export',
    'design system workflow',
    'logo vectorization',
    'icon system design',
    'brand asset management',
    'design tokens',
    'color palette management',
  ],
  openGraph: {
    title: 'For Designers — Asset Export & Design System Workflows',
    description:
      'Figma to production, logo redesign, icon systems, typeface optimization, design handoff, and color management. Built for designers who ship.',
    type: 'website',
  },
};

export default function ForDesignersPage() {
  const categories = getDesignersCategories();

  return (
    <div className="wrap py-12 sm:py-16">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] mb-4">
          For Designers
        </h1>
        <p className="text-[clamp(1rem,2.5vw,1.25rem)] text-text-secondary max-w-3xl leading-relaxed">
          Asset export workflows for Figma, logo redesign, icon system design, typeface optimization, brand
          asset management, design-to-code handoff, and color palette management. Built for designers who need
          production-ready assets without manual cleanup.
        </p>
      </header>

      {/* Workflows by Category */}
      <div className="space-y-16">
        {categories.map((category) => {
          const workflows = DESIGNERS_WORKFLOWS.filter((w) => w.category === category);
          return (
            <section key={category}>
              <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold mb-6 tracking-[-0.01em]">
                {category}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {workflows.map((workflow) => (
                  <Link
                    key={workflow.slug}
                    href={`/for-designers/${workflow.slug}`}
                    className="group block p-6 rounded-2xl bg-bg-secondary border border-border-subtle hover:border-border-strong hover:bg-bg-tertiary transition-[background-color,border-color] duration-200"
                  >
                    <h3 className="text-[1.125rem] font-semibold mb-2 group-hover:text-accent transition-colors">
                      {workflow.title}
                    </h3>
                    <p className="text-[0.9375rem] text-text-secondary line-clamp-2 mb-3">
                      {workflow.seoDescription}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {workflow.formats.slice(0, 3).map((format) => (
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
            </section>
          );
        })}
      </div>

      {/* FAQs */}
      <section className="mt-16 pt-12 border-t border-border-subtle">
        <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold mb-6 tracking-[-0.01em]">
          Common Design Questions
        </h2>
        <div className="space-y-6 max-w-3xl">
          <details className="group p-6 rounded-xl bg-bg-secondary border border-border-subtle">
            <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
              Should I outline text in Figma before exporting?
              <span className="text-text-tertiary group-open:rotate-180 transition-transform duration-200">
                ▼
              </span>
            </summary>
            <p className="mt-4 text-text-secondary leading-relaxed">
              Yes, always. Fonts render differently across platforms. Outlining converts text to paths,
              guaranteeing the same appearance everywhere. Use Cmd+Shift+O before export.
            </p>
          </details>

          <details className="group p-6 rounded-xl bg-bg-secondary border border-border-subtle">
            <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
              What's the best export format for web icons?
              <span className="text-text-tertiary group-open:rotate-180 transition-transform duration-200">
                ▼
              </span>
            </summary>
            <p className="mt-4 text-text-secondary leading-relaxed">
              SVG for scalable icons, PNG @2x for raster fallback. SVG keeps file size small and scales
              perfectly; PNG is a fallback for complex effects or older browser support.
            </p>
          </details>

          <details className="group p-6 rounded-xl bg-bg-secondary border border-border-subtle">
            <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
              How do I create an accessible color palette?
              <span className="text-text-tertiary group-open:rotate-180 transition-transform duration-200">
                ▼
              </span>
            </summary>
            <p className="mt-4 text-text-secondary leading-relaxed">
              Check contrast ratios with a WCAG checker (4.5:1 for body text, 3:1 for large text). Test with
              colorblind simulators (Deuteranopia, Protanopia). Use perceptually uniform color spaces (Lab,
              Oklab) to ensure consistent perceived brightness.
            </p>
          </details>

          <details className="group p-6 rounded-xl bg-bg-secondary border border-border-subtle">
            <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
              Why does my exported SVG have huge file size?
              <span className="text-text-tertiary group-open:rotate-180 transition-transform duration-200">
                ▼
              </span>
            </summary>
            <p className="mt-4 text-text-secondary leading-relaxed">
              Figma includes editor metadata and verbose path data. Use an SVG optimizer (like Vectroy) to
              remove metadata, reduce decimal precision, and collapse redundant groups. This often cuts file
              size by 40–60%.
            </p>
          </details>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'For Designers',
            description:
              'Asset export workflows for Figma, logo redesign, icon systems, typeface optimization, brand asset management, and color management.',
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/for-designers`,
            hasPart: DESIGNERS_WORKFLOWS.map((w) => ({
              '@type': 'HowTo',
              name: w.title,
              description: w.seoDescription,
              url: `${process.env.NEXT_PUBLIC_SITE_URL}/for-designers/${w.slug}`,
            })),
          }),
        }}
      />
    </div>
  );
}
