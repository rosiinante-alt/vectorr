import { Suspense } from 'react';
import Link from 'next/link';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { AuthSlot } from '@/components/auth-slot';
import { ShoppingBag, Check, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'SVG for Etsy Sellers | Cricut, Silhouette, Print-on-Demand | Vectroy',
  description: 'Convert artwork to commercial-use SVG files for Etsy shops. Perfect for digital downloads, cut files, and print-on-demand.',
};

export default function SvgForEtsySellersPage() {
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
              <ShoppingBag className="h-3.5 w-3.5" />
              Etsy Sellers
            </div>
            <h1 className="display mb-4 text-[clamp(32px,5vw,54px)] leading-tight">
              SVG files for Etsy digital downloads
            </h1>
            <p className="mb-8 text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              Convert artwork to commercial-use SVG files for Cricut, Silhouette, print-on-demand, and digital download shops.
            </p>
            <Link
              href="/convert?format=svg&source=etsy"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
            >
              Convert for Etsy
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mx-auto mt-20 max-w-[920px]">
            <h2 className="mb-10 text-center text-[clamp(24px,3vw,32px)] font-semibold text-text-primary">
              Why Etsy sellers choose Vectroy
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: 'Commercial-use ready', description: 'Output files are yours to sell. No attribution, no watermarks.' },
                { title: 'Cricut & Silhouette', description: 'Works in Design Space, Silhouette Studio, and Inkscape - your buyers\' tools.' },
                { title: 'Print-on-demand', description: 'Clean vectors for Printful, Printify, Redbubble, and Merch by Amazon.' },
                { title: 'Transparent backgrounds', description: 'Perfect for stickers, decals, and sublimation designs.' },
                { title: 'Multiple formats', description: 'Export SVG, PNG, PDF, DXF — give your buyers options.' },
                { title: 'No hidden complexity', description: 'Files load cleanly. No customer support nightmares.' },
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
              From sketch to Etsy listing in 3 steps
            </h2>
            <div className="space-y-6">
              {[
                { step: '1', title: 'Upload', description: 'Drop your artwork or logo. PNG, JPG, WEBP — up to 50 MB.' },
                { step: '2', title: 'Vectorize', description: 'Our AI traces clean, commercial-use vectors your buyers will love.' },
                { step: '3', title: 'Download', description: 'Get SVG, PNG, PDF, or DXF. Upload to Etsy and start selling.' },
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
                href="/convert?format=svg&source=etsy"
                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
              >
                Start converting
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-20 max-w-[820px]">
            <h2 className="mb-10 text-center text-[clamp(24px,3vw,32px)] font-semibold text-text-primary">
              Popular Etsy digital products
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Cricut cut files',
                'Silhouette Studio files',
                'Sublimation designs',
                'Print-on-demand graphics',
                'T-shirt vector bundles',
                'Sticker sheet downloads',
                'Vinyl decal templates',
                'Printable wall art',
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
              Ready to list?
            </h2>
            <p className="mb-6 text-[15px] text-text-secondary">
              Convert your first design to commercial-use SVG in under 60 seconds.
            </p>
            <Link
              href="/convert?format=svg&source=etsy"
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
