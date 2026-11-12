import { Suspense } from "react";
import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { GalleryGrid } from "./gallery-grid";
import { GALLERY_ITEMS, GALLERY_CATEGORIES } from "@/lib/gallery-configs";

export const metadata: Metadata = {
  title: "Vectorization Gallery — Before & After Examples | Vectroy",
  description:
    "Browse real before-and-after vectorization examples: logos, illustrations, photos, laser-cut files, apparel prints, and craft designs.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Vectorization Gallery — Before & After Examples",
    description: "Real results from Vectroy across logos, photos, craft, and manufacturing.",
    type: "website",
    url: "/gallery",
  },
};

export default function GalleryPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
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
            <h1 className="display mb-4 text-[clamp(32px,5vw,52px)] leading-tight">
              Before&nbsp;&amp;&nbsp;after gallery
            </h1>
            <p className="mb-8 text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              Real results from raster images converted to production-ready
              vector artwork.
            </p>
          </div>

          {/* Category filter + grid — client component */}
          <GalleryGrid items={GALLERY_ITEMS} categories={GALLERY_CATEGORIES} />
        </div>

        {/* CTA */}
        <section className="mt-20 py-16 bg-bg-secondary">
          <div className="wrap text-center max-w-[640px]">
            <h2 className="display text-[clamp(26px,3.5vw,42px)] mb-4">
              Try it on your own image
            </h2>
            <p className="text-text-secondary mb-8">
              Upload a PNG or JPG and get a production-ready SVG in seconds — no
              design software needed.
            </p>
            <a
              href="/convert"
              className="btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-[var(--radius-lg)] bg-accent text-bg-primary font-medium text-base hover:opacity-90 transition-opacity"
            >
              Convert an image
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
