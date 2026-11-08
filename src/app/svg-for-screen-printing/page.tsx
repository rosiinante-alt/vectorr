import { Suspense } from 'react';
import Link from 'next/link';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { AuthSlot } from '@/components/auth-slot';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'SVG for Screen Printing | Color Separation, Halftones | Vectroy',
  description: 'Convert artwork to screen-print ready vectors with color separation and halftone support.',
};

export default function SvgForScreenPrintingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader authSlot={<Suspense fallback={null}><AuthSlot /></Suspense>} />
      <main id="main" className="flex-1 py-12 sm:py-16 lg:py-20">
        <div className="wrap">
          <div className="mx-auto max-w-[720px] text-center">
            <h1 className="display mb-4 text-[clamp(32px,5vw,54px)] leading-tight">SVG for screen printing</h1>
            <p className="mb-8 text-[clamp(16px,1.8vw,18px)] text-text-secondary">Convert artwork to screen-print ready vectors with color separation and halftone support.</p>
            <Link href="/convert?format=svg&source=screenprint" className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90">
              Convert for screen print <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
