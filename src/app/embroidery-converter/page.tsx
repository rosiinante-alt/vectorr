import { Suspense } from 'react';
import Link from 'next/link';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { AuthSlot } from '@/components/auth-slot';
import { ArrowRight, Check } from 'lucide-react';

export const metadata = {
  title: 'Embroidery File Converter | PES, DST, JEF | Vectroy',
  description: 'Convert artwork to embroidery-ready vectors. Generate PES, DST, JEF files for Brother, Janome, and commercial machines.',
};

export default function EmbroideryConverterPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader authSlot={<Suspense fallback={null}><AuthSlot /></Suspense>} />
      <main id="main" className="flex-1 py-12 sm:py-16 lg:py-20">
        <div className="wrap">
          <div className="mx-auto max-w-[720px] text-center">
            <h1 className="display mb-4 text-[clamp(32px,5vw,54px)] leading-tight">Convert artwork to embroidery files</h1>
            <p className="mb-8 text-[clamp(16px,1.8vw,18px)] text-text-secondary">Turn logos and designs into PES, DST, JEF files for Brother, Janome, and commercial embroidery machines.</p>
            <Link href="/convert?format=dst&source=embroidery" className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90">
              Convert for embroidery <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
