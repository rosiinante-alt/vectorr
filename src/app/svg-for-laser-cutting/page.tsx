import { Suspense } from 'react';
import Link from 'next/link';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { AuthSlot } from '@/components/auth-slot';
import { Zap, Check, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'SVG for Laser Cutting | Glowforge, xTool, K40 | Vectroy',
  description: 'Convert artwork to clean vector files optimized for laser cutters. Glowforge, xTool, K40, and universal laser compatibility.',
};

export default function SvgForLaserCuttingPage() {
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
              <Zap className="h-3.5 w-3.5" />
              Laser Cutting
            </div>
            <h1 className="display mb-4 text-[clamp(32px,5vw,54px)] leading-tight">
              SVG files for laser cutters
            </h1>
            <p className="mb-8 text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              Convert artwork to clean vector paths optimized for Glowforge, xTool, K40, and universal laser cutters.
            </p>
            <Link
              href="/convert?format=svg&source=laser"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
            >
              Convert for laser
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mx-auto mt-20 max-w-[920px]">
            <h2 className="mb-10 text-center text-[clamp(24px,3vw,32px)] font-semibold text-text-primary">
              Laser-cutter ready vectors
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: 'Precise cut paths', description: 'Clean outlines for wood, acrylic, leather, and fabric. No stray nodes or overlapping lines.' },
                { title: 'Stroke control', description: 'Control cut, score, and engrave layers with stroke-based vectors — not fills.' },
                { title: 'Kerf compensation', description: 'Export clean paths you can adjust for material kerf in your laser software.' },
                { title: 'Glowforge compatible', description: 'Import directly into Glowforge App. No manual tracing required.' },
                { title: 'xTool & LightBurn', description: 'Works with xTool Creative Space, LightBurn, and RDWorks.' },
                { title: 'K40 Whisperer', description: 'Simple SVG exports load cleanly in K40 Whisperer and LaserDRW.' },
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
              From image to laser in 3 steps
            </h2>
            <div className="space-y-6">
              {[
                { step: '1', title: 'Upload', description: 'Drop your design. PNG, JPG, or WEBP — up to 50 MB.' },
                { step: '2', title: 'Vectorize', description: 'Our AI traces clean cut paths optimized for laser precision.' },
                { step: '3', title: 'Download', description: 'Get SVG and import it into Glowforge, xTool, LightBurn, or K40 Whisperer.' },
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
                href="/convert?format=svg&source=laser"
                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
              >
                Start converting
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-20 max-w-[820px]">
            <h2 className="mb-10 text-center text-[clamp(24px,3vw,32px)] font-semibold text-text-primary">
              Popular laser projects
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Acrylic jewelry and keychains',
                'Wood signs and plaques',
                'Leather wallets and patches',
                'Engraved cutting boards',
                'Custom coasters',
                'Fabric appliqué templates',
                'Model kits and assembly toys',
                'Metal etching (with spray)',
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
              Ready to cut?
            </h2>
            <p className="mb-6 text-[15px] text-text-secondary">
              Convert your first design to laser-ready SVG in under 60 seconds.
            </p>
            <Link
              href="/convert?format=svg&source=laser"
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
