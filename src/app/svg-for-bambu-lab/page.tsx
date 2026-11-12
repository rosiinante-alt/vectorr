import { Suspense } from 'react';
import Link from 'next/link';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { AuthSlot } from '@/components/auth-slot';
import { Box, Check, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'SVG for Bambu Lab 3D Printers | Convert to 3MF, STL | Vectroy',
  description: 'Convert 2D artwork to 3D-ready vectors for Bambu Studio. Perfect for lithophanes, embossed plates, and relief models.',
};

export default function SvgForBambuLabPage() {
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
          
          <div className="mx-auto max-w-[720px] text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-[13px] font-medium text-accent">
              <Box className="h-3.5 w-3.5" />
              Bambu Studio
            </div>
            <h1 className="display mb-4 text-[clamp(32px,5vw,54px)] leading-tight">
              Convert artwork for Bambu Lab 3D printers
            </h1>
            <p className="mb-8 text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              Turn logos and artwork into clean vectors for lithophanes, embossed plates, and relief models in Bambu Studio.
            </p>
            <Link
              href="/convert?format=3mf&source=bambu"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
            >
              Convert for Bambu Lab
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mx-auto mt-20 max-w-[920px]">
            <h2 className="mb-10 text-center text-[clamp(24px,3vw,32px)] font-semibold text-text-primary">
              Why Vectroy for Bambu Studio
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: 'Lithophane-ready', description: 'Clean outlines for lithophane generation. No artifacts or noise in your relief.' },
                { title: '3MF & STL export', description: 'Export as 3MF for Bambu Studio or STL for universal slicers.' },
                { title: 'Emboss-ready paths', description: 'Perfect for extruded logos, nameplates, and decorative reliefs.' },
                { title: 'X1/P1/A1 compatible', description: 'Works with all Bambu Lab printer families and Handy app.' },
                { title: 'Multi-material ready', description: 'Separate colors into layers for AMS multi-color prints.' },
                { title: 'No manual tracing', description: 'Skip manual SVG tracing in Bambu Studio. Get clean vectors instantly.' },
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

          <div className="mx-auto mt-20 max-w-[820px]">
            <h2 className="mb-10 text-center text-[clamp(24px,3vw,32px)] font-semibold text-text-primary">
              From image to 3D print in 3 steps
            </h2>
            <div className="space-y-6">
              {[
                { step: '1', title: 'Upload', description: 'Drop your artwork. PNG, JPG, WEBP — up to 50 MB.' },
                { step: '2', title: 'Vectorize', description: 'Our AI traces clean outlines perfect for lithophanes and relief extrusion.' },
                { step: '3', title: 'Download', description: 'Get 3MF or STL and import it into Bambu Studio. Ready to slice.' },
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
                href="/convert?format=3mf&source=bambu"
                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
              >
                Start converting
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-20 max-w-[820px]">
            <h2 className="mb-10 text-center text-[clamp(24px,3vw,32px)] font-semibold text-text-primary">
              Popular Bambu Lab projects
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Lithophanes and night lights',
                'Embossed nameplates',
                'Relief logo badges',
                'Decorative wall art',
                'Custom keychains',
                'Multi-color coasters',
                'Cookie stamps',
                'Miniature terrain',
              ].map((project, idx) => (
                <div key={idx} className="flex items-center gap-3 rounded-[var(--radius-md)] bg-bg-secondary px-4 py-3 text-[14px] text-text-primary">
                  <Check className="h-4 w-4 shrink-0 text-accent" />
                  {project}
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto mt-20 max-w-[620px] rounded-[var(--radius-xl)] bg-accent/5 p-8 text-center">
            <h2 className="mb-3 text-[clamp(22px,2.5vw,28px)] font-semibold text-text-primary">
              Ready to print?
            </h2>
            <p className="mb-6 text-[15px] text-text-secondary">
              Convert your first design to 3D-ready vectors in under 60 seconds.
            </p>
            <Link
              href="/convert?format=3mf&source=bambu"
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
