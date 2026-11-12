import { Suspense } from 'react';
import Link from 'next/link';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { AuthSlot } from '@/components/auth-slot';
import { Check, X, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'SVG vs PNG: When to Use Each Format | Vectroy',
  description: 'Complete comparison of SVG and PNG formats: file size, scalability, use cases, and when to choose each.',
};

export default function SvgVsPngPage() {
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
          
          <div className="mx-auto max-w-[820px] text-center">
            <h1 className="display mb-4 text-[clamp(32px,5vw,54px)] leading-tight">
              SVG vs PNG: Which format should you use?
            </h1>
            <p className="mb-8 text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              Understand the differences between vector and raster formats to choose the right one for your project.
            </p>
          </div>

          {/* Quick Comparison Table */}
          <div className="mx-auto mt-12 max-w-[920px] overflow-hidden rounded-[var(--radius-xl)] bg-bg-secondary shadow-[var(--shadow-1)]">
            <div className="grid grid-cols-[160px_1fr_1fr] gap-px bg-[var(--border)]">
              <div className="bg-bg-secondary p-4"></div>
              <div className="bg-bg-secondary p-4 text-center font-semibold text-text-primary">SVG</div>
              <div className="bg-bg-secondary p-4 text-center font-semibold text-text-primary">PNG</div>
              
              {[
                { feature: 'Scalability', svg: true, png: false },
                { feature: 'File size', svg: true, png: false },
                { feature: 'Photo quality', svg: false, png: true },
                { feature: 'Editability', svg: true, png: false },
                { feature: 'Browser support', svg: true, png: true },
                { feature: 'Transparency', svg: true, png: true },
                { feature: 'Animation', svg: true, png: false },
                { feature: 'Print quality', svg: true, png: true },
              ].map((row, idx) => (
                <>
                  <div key={`label-${idx}`} className="bg-bg-secondary p-4 text-[14px] text-text-primary">{row.feature}</div>
                  <div key={`svg-${idx}`} className="flex items-center justify-center bg-bg-secondary p-4">
                    {row.svg ? (
                      <Check className="h-5 w-5 text-accent" />
                    ) : (
                      <X className="h-5 w-5 text-text-tertiary" />
                    )}
                  </div>
                  <div key={`png-${idx}`} className="flex items-center justify-center bg-bg-secondary p-4">
                    {row.png ? (
                      <Check className="h-5 w-5 text-accent" />
                    ) : (
                      <X className="h-5 w-5 text-text-tertiary" />
                    )}
                  </div>
                </>
              ))}
            </div>
          </div>

          {/* When to Use Each */}
          <div className="mx-auto mt-20 max-w-[920px]">
            <h2 className="mb-10 text-center text-[clamp(24px,3vw,32px)] font-semibold text-text-primary">
              When to use each format
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* SVG */}
              <div className="rounded-[var(--radius-xl)] bg-bg-secondary p-6 shadow-[var(--shadow-1)]">
                <h3 className="mb-4 text-[20px] font-semibold text-text-primary">Use SVG for:</h3>
                <ul className="space-y-2.5 text-[14px] text-text-secondary">
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Logos and brand marks</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Icons and UI elements</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Infographics and diagrams</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Illustrations with solid colors</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Responsive web design</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Print materials at any size</span>
                  </li>
                </ul>
              </div>

              {/* PNG */}
              <div className="rounded-[var(--radius-xl)] bg-bg-secondary p-6 shadow-[var(--shadow-1)]">
                <h3 className="mb-4 text-[20px] font-semibold text-text-primary">Use PNG for:</h3>
                <ul className="space-y-2.5 text-[14px] text-text-secondary">
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Photographs and complex images</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Screenshots and screen captures</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Images with gradients and textures</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Social media graphics (fixed size)</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Email images</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>When universal compatibility is critical</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mx-auto mt-20 max-w-[620px] rounded-[var(--radius-xl)] bg-accent/5 p-8 text-center">
            <h2 className="mb-3 text-[clamp(22px,2.5vw,28px)] font-semibold text-text-primary">
              Convert PNG to SVG
            </h2>
            <p className="mb-6 text-[15px] text-text-secondary">
              Need a scalable vector version of your PNG? Convert it to SVG in seconds.
            </p>
            <Link
              href="/convert?format=svg"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
            >
              Convert to SVG
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
