import { Suspense } from 'react';
import Link from 'next/link';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { AuthSlot } from '@/components/auth-slot';
import { ArrowRight, Check } from 'lucide-react';

export const metadata = {
  title: 'Vector vs Raster Graphics: Complete Guide | Vectroy',
  description: 'Understand the difference between vector and raster graphics, their use cases, and when to use each format.',
};

export default function VectorVsRasterPage() {
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
              Vector vs Raster Graphics
            </h1>
            <p className="mb-8 text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              Learn the fundamental difference between vector and raster graphics and which one fits your project.
            </p>
          </div>

          {/* Key Differences */}
          <div className="mx-auto mt-12 max-w-[920px]">
            <h2 className="mb-10 text-center text-[clamp(24px,3vw,32px)] font-semibold text-text-primary">
              What's the difference?
            </h2>
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Vector */}
              <div className="rounded-[var(--radius-xl)] bg-bg-secondary p-6 shadow-[var(--shadow-1)]">
                <h3 className="mb-4 text-[22px] font-semibold text-text-primary">Vector Graphics</h3>
                <p className="mb-4 text-[15px] text-text-secondary">
                  Made of mathematical paths, points, and curves. Can be scaled infinitely without losing quality.
                </p>
                <div className="mb-4 rounded-[var(--radius-md)] bg-bg-primary p-4">
                  <p className="text-[13px] font-mono text-text-primary">&lt;path d="M10 10 L90 90" /&gt;</p>
                </div>
                <ul className="space-y-2 text-[14px] text-text-secondary">
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Resolution-independent</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Small file sizes</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Easily editable</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Perfect for logos and icons</span>
                  </li>
                </ul>
                <p className="mt-4 text-[13px] font-medium text-text-tertiary">Common formats: SVG, AI, EPS, PDF</p>
              </div>

              {/* Raster */}
              <div className="rounded-[var(--radius-xl)] bg-bg-secondary p-6 shadow-[var(--shadow-1)]">
                <h3 className="mb-4 text-[22px] font-semibold text-text-primary">Raster Graphics</h3>
                <p className="mb-4 text-[15px] text-text-secondary">
                  Made of a grid of pixels. Each pixel has a specific color. Quality depends on resolution (DPI).
                </p>
                <div className="mb-4 rounded-[var(--radius-md)] bg-bg-primary p-4">
                  <div className="grid grid-cols-8 gap-0.5">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className="aspect-square bg-text-tertiary opacity-70" />
                    ))}
                  </div>
                </div>
                <ul className="space-y-2 text-[14px] text-text-secondary">
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Captures photo detail</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Complex color gradients</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Universal compatibility</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>Best for photographs</span>
                  </li>
                </ul>
                <p className="mt-4 text-[13px] font-medium text-text-tertiary">Common formats: PNG, JPG, GIF, WEBP</p>
              </div>
            </div>
          </div>

          {/* When to Convert */}
          <div className="mx-auto mt-20 max-w-[820px]">
            <h2 className="mb-10 text-center text-[clamp(24px,3vw,32px)] font-semibold text-text-primary">
              When to convert raster to vector
            </h2>
            <div className="space-y-4">
              {[
                { title: 'Scalability needs', description: 'Your design needs to work at multiple sizes — from business cards to billboards.' },
                { title: 'Print quality', description: 'You need crisp edges and text at 300 DPI or higher for professional printing.' },
                { title: 'File size', description: 'Simple designs become much smaller as vectors, perfect for web use.' },
                { title: 'Editability', description: 'You want to change colors, shapes, or text without starting over.' },
                { title: 'CNC/Laser cutting', description: 'Your design will be cut, engraved, or embroidered by a machine.' },
              ].map((item, idx) => (
                <div key={idx} className="rounded-[var(--radius-xl)] bg-bg-secondary p-5 shadow-[var(--shadow-1)]">
                  <h3 className="mb-2 text-[16px] font-semibold text-text-primary">{item.title}</h3>
                  <p className="text-[14px] text-text-secondary">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mx-auto mt-20 max-w-[620px] rounded-[var(--radius-xl)] bg-accent/5 p-8 text-center">
            <h2 className="mb-3 text-[clamp(22px,2.5vw,28px)] font-semibold text-text-primary">
              Convert raster to vector
            </h2>
            <p className="mb-6 text-[15px] text-text-secondary">
              Turn your photos and artwork into scalable vector files.
            </p>
            <Link
              href="/convert?format=svg"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
            >
              Start vectorizing
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
