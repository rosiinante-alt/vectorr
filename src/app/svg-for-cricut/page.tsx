import { Suspense } from 'react';
import Link from 'next/link';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { AuthSlot } from '@/components/auth-slot';
import { Scissors, Check, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'SVG for Cricut | Convert Images to Cricut-Ready SVG Files | Vectroy',
  description: 'Convert raster images to clean SVG files optimized for Cricut Design Space. Perfect for blade types, mat sizes, and crisp cuts.',
};

export default function SvgForCricutPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader
        authSlot={
          <Suspense fallback={null}>
            <AuthSlot />
          </Suspense>
        }
      />

      <main id="main" className="flex-1 py-12 sm:py-16 lg:py-20">
        <div className="wrap">
          
          {/* Hero */}
          <div className="mx-auto max-w-[720px] text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-[13px] font-medium text-accent">
              <Scissors className="h-3.5 w-3.5" />
              Cricut Design Space
            </div>
            <h1 className="display mb-4 text-[clamp(32px,5vw,54px)] leading-tight">
              Convert images to Cricut-ready SVG files
            </h1>
            <p className="mb-8 text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              Turn photos, logos, and artwork into clean vector files optimized for Cricut Design Space. Perfect for all blade types and mat sizes.
            </p>
            <Link
              href="/convert?format=svg&source=cricut"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
            >
              Convert to Cricut SVG
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Why Vectroy for Cricut */}
          <div className="mx-auto mt-20 max-w-[920px]">
            <h2 className="mb-10 text-center text-[clamp(24px,3vw,32px)] font-semibold text-text-primary">
              Why Vectroy for Cricut projects
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Clean blade paths',
                  description: 'Optimized vectors for all Cricut blade types: fine-point, deep-point, bonded-fabric, rotary, and knife.',
                },
                {
                  title: 'Perfect for Design Space',
                  description: 'SVG files import cleanly with no extra nodes, overlapping paths, or hidden layers.',
                },
                {
                  title: 'Mat-size ready',
                  description: 'Exports fit 12"×12", 12"×24", or custom mat sizes. Scale and position with confidence.',
                },
                {
                  title: 'Single-color layers',
                  description: 'Each color becomes a separate layer in Design Space — perfect for multi-mat projects.',
                },
                {
                  title: 'No hidden complexity',
                  description: 'No embedded rasters, no flattened groups, no mystery anchor points. Just clean vectors.',
                },
                {
                  title: 'Transparent backgrounds',
                  description: 'Remove backgrounds before vectorization — ideal for stickers, decals, and iron-on transfers.',
                },
              ].map((feature, idx) => (
                <div key={idx} className="rounded-[var(--radius-xl)] bg-bg-secondary p-5 shadow-[var(--shadow-1)]">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                    <Check className="h-4 w-4 text-accent" />
                  </div>
                  <h3 className="mb-2 text-[15px] font-semibold text-text-primary">{feature.title}</h3>
                  <p className="text-[14px] text-text-secondary">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow */}
          <div className="mx-auto mt-20 max-w-[820px]">
            <h2 className="mb-10 text-center text-[clamp(24px,3vw,32px)] font-semibold text-text-primary">
              From photo to Cricut cut in 3 steps
            </h2>
            <div className="space-y-6">
              {[
                { step: '1', title: 'Upload', description: 'Drop your photo, logo, or artwork. PNG, JPG, WEBP — up to 50 MB.' },
                { step: '2', title: 'Vectorize', description: 'Our AI traces clean paths optimized for Cricut blades and Design Space.' },
                { step: '3', title: 'Download', description: 'Get your SVG file and import it directly into Design Space. Ready to cut.' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 rounded-[var(--radius-xl)] bg-bg-secondary p-6 shadow-[var(--shadow-1)]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-[18px] font-bold text-white">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="mb-1 text-[16px] font-semibold text-text-primary">{item.title}</h3>
                    <p className="text-[14px] text-text-secondary">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/convert?format=svg&source=cricut"
                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
              >
                Start converting
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Popular Cricut Projects */}
          <div className="mx-auto mt-20 max-w-[820px]">
            <h2 className="mb-10 text-center text-[clamp(24px,3vw,32px)] font-semibold text-text-primary">
              Popular Cricut projects
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Custom stickers and decals',
                'Iron-on T-shirt designs',
                'Vinyl lettering and quotes',
                'Heat transfer graphics',
                'Paper crafts and cards',
                'Window clings',
                'Car decals',
                'Phone case designs',
              ].map((project, idx) => (
                <div key={idx} className="flex items-center gap-3 rounded-[var(--radius-md)] bg-bg-secondary px-4 py-3 text-[14px] text-text-primary">
                  <Check className="h-4 w-4 shrink-0 text-accent" />
                  {project}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mx-auto mt-20 max-w-[620px] rounded-[var(--radius-xl)] bg-accent/5 p-8 text-center">
            <h2 className="mb-3 text-[clamp(22px,2.5vw,28px)] font-semibold text-text-primary">
              Ready to cut?
            </h2>
            <p className="mb-6 text-[15px] text-text-secondary">
              Convert your first image to Cricut-ready SVG in under 60 seconds. No sign-up required to try.
            </p>
            <Link
              href="/convert?format=svg&source=cricut"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
            >
              Convert for free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
