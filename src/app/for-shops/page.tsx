import type { Metadata } from 'next';
import Link from 'next/link';
import { SHOPS_WORKFLOWS, getShopsCategories } from '@/lib/shops-workflow-configs';

export const metadata: Metadata = {
  title: 'For Print Shops & Production — File Prep Workflows | Vectorr',
  description:
    'Production-ready file preparation guides for DTF printing, screen printing, embroidery, vinyl cutting, laser engraving, UV printing, and CNC routing. Practical workflows for shop operators.',
  keywords: [
    'print shop workflows',
    'dtf file prep',
    'screen print color separation',
    'embroidery digitizing',
    'vinyl cutting setup',
    'laser engraving files',
    'production file preparation',
  ],
  openGraph: {
    title: 'For Print Shops & Production — File Prep Workflows',
    description:
      'DTF gang sheets, screen print separations, embroidery digitizing, vinyl cutting, laser engraving, and CNC routing. Production guides for shop operators.',
    type: 'website',
  },
};

export default function ForShopsPage() {
  const categories = getShopsCategories();

  return (
    <div className="wrap py-12 sm:py-16">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] mb-4">
          For Print Shops & Production
        </h1>
        <p className="text-[clamp(1rem,2.5vw,1.25rem)] text-text-secondary max-w-3xl leading-relaxed">
          File preparation workflows for DTF printing, screen printing, embroidery, vinyl cutting, laser
          engraving, UV printing, sublimation, and CNC routing. Built for shop operators who need files ready
          to produce—no guesswork, no redos.
        </p>
      </header>

      {/* Workflows by Category */}
      <div className="space-y-16">
        {categories.map((category) => {
          const workflows = SHOPS_WORKFLOWS.filter((w) => w.category === category);
          return (
            <section key={category}>
              <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold mb-6 tracking-[-0.01em]">
                {category}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {workflows.map((workflow) => (
                  <Link
                    key={workflow.slug}
                    href={`/for-shops/${workflow.slug}`}
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
          Common Production Questions
        </h2>
        <div className="space-y-6 max-w-3xl">
          <details className="group p-6 rounded-xl bg-bg-secondary border border-border-subtle">
            <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
              What file format is best for DTF printing?
              <span className="text-text-tertiary group-open:rotate-180 transition-transform duration-200">
                ▼
              </span>
            </summary>
            <p className="mt-4 text-text-secondary leading-relaxed">
              PNG with alpha channel at 300 PPI. JPG cannot store transparency, so the white underbase will
              print a full rectangle. Export with transparent background and let the RIP generate white ink
              automatically.
            </p>
          </details>

          <details className="group p-6 rounded-xl bg-bg-secondary border border-border-subtle">
            <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
              How many colors can I use in screen printing?
              <span className="text-text-tertiary group-open:rotate-180 transition-transform duration-200">
                ▼
              </span>
            </summary>
            <p className="mt-4 text-text-secondary leading-relaxed">
              Each color requires one screen, so fewer is cheaper. Typical production runs use 1–4 colors.
              For dark garments, add a white underbase as a separate screen. Gradients require halftone
              screening (simulated process printing).
            </p>
          </details>

          <details className="group p-6 rounded-xl bg-bg-secondary border border-border-subtle">
            <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
              What's the minimum stitch height for embroidery text?
              <span className="text-text-tertiary group-open:rotate-180 transition-transform duration-200">
                ▼
              </span>
            </summary>
            <p className="mt-4 text-text-secondary leading-relaxed">
              3mm cap height is the practical minimum. Smaller text either becomes illegible or requires
              excessive stitch density (which puckers fabric). Use block fonts like Arial Bold instead of
              serif or script fonts for small text.
            </p>
          </details>

          <details className="group p-6 rounded-xl bg-bg-secondary border border-border-subtle">
            <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
              Do I need to mirror artwork for sublimation?
              <span className="text-text-tertiary group-open:rotate-180 transition-transform duration-200">
                ▼
              </span>
            </summary>
            <p className="mt-4 text-text-secondary leading-relaxed">
              Only for hard goods (mugs, phone cases, metal panels). Garment sublimation presses face-up, so
              no mirroring. Hard-good presses transfer face-down, so mirror the design before printing.
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
            name: 'For Print Shops & Production',
            description:
              'File preparation workflows for DTF, screen printing, embroidery, vinyl cutting, laser engraving, UV printing, and CNC routing.',
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/for-shops`,
            hasPart: SHOPS_WORKFLOWS.map((w) => ({
              '@type': 'HowTo',
              name: w.title,
              description: w.seoDescription,
              url: `${process.env.NEXT_PUBLIC_SITE_URL}/for-shops/${w.slug}`,
            })),
          }),
        }}
      />
    </div>
  );
}
