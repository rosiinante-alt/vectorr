import { Suspense } from "react";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { Shapes, ArrowRight, Check, Star } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vectorize My Logo | Logo Vectorization Service | Vectroy",
  description:
    "Turn your logo PNG or JPG into a clean, scalable SVG in seconds. Perfect for Cricut, embroidery, screen print, vinyl, and commercial use.",
  alternates: { canonical: "/vectorize-my-logo" },
  openGraph: {
    title: "Vectorize My Logo — PNG to SVG Logo Conversion",
    description:
      "Upload your logo and get a clean SVG in seconds. Scales to any size, works with every machine.",
    type: "website",
    url: "/vectorize-my-logo",
  },
};

const USE_CASES = [
  "Screen-print separations",
  "Embroidery digitizing prep",
  "Vinyl cutting with Cricut or Silhouette",
  "Laser engraving on wood or metal",
  "Print-on-demand product art",
  "Website retina display (SVG in <img>)",
];

const WHY = [
  {
    title: "Clean paths",
    body: "No stray nodes, no open paths. The output looks hand-traced because we smooth and simplify every curve.",
  },
  {
    title: "Color separated",
    body: "Multi-color logos come back as individual color layers you can disable, recolor, or export separately.",
  },
  {
    title: "Commercially licensed",
    body: "On any paid plan, the SVGs you generate are yours to use in products you sell. No royalties.",
  },
  {
    title: "Machine-ready",
    body: "Output has been tested in Cricut Design Space, Lightburn, and Hatch Embroidery. It just works.",
  },
];

export default function VectorizeMLogPage() {
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
          <div className="mx-auto max-w-[700px] text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-[13px] font-medium text-accent">
              <Shapes className="h-3.5 w-3.5" />
              Logo vectorization
            </div>
            <h1 className="display mb-4 text-[clamp(32px,5vw,52px)] leading-tight">
              Vectorize your logo in seconds
            </h1>
            <p className="mb-8 text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              Upload a PNG or JPG of your logo and get back a clean, scalable SVG
              file ready for any machine, screen, or surface.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/convert?format=svg&source=vectorize-my-logo"
                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
              >
                Vectorize my logo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] px-6 py-3 text-[15px] font-medium hover:bg-bg-secondary"
              >
                See examples
              </Link>
            </div>
          </div>

          {/* Use cases */}
          <div className="mt-16 mx-auto max-w-[820px]">
            <h2 className="mb-8 text-center text-[clamp(24px,3vw,32px)] font-semibold">
              Works everywhere your logo needs to go
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {USE_CASES.map((uc) => (
                <div
                  key={uc}
                  className="flex items-center gap-2.5 rounded-[var(--radius-xl)] bg-bg-secondary px-5 py-3.5 text-[14.5px]"
                >
                  <Check className="h-4 w-4 shrink-0 text-accent" />
                  {uc}
                </div>
              ))}
            </div>
          </div>

          {/* Why */}
          <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w) => (
              <div
                key={w.title}
                className="rounded-[var(--radius-xl)] bg-bg-secondary p-6 shadow-[var(--shadow-1)]"
              >
                <h3 className="text-[16px] font-semibold">{w.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
                  {w.body}
                </p>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="mt-20 mx-auto max-w-[700px] rounded-[var(--radius-xl)] bg-bg-secondary p-8 text-center shadow-[var(--shadow-1)]">
            <div className="mb-3 flex justify-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-[16px] italic text-text-secondary">
              &ldquo;I uploaded a photo of a hand-drawn logo sketch and got back a
              perfect SVG. Used it straight in Cricut Design Space — zero cleanup.&rdquo;
            </p>
            <p className="mt-3 text-[14px] font-semibold">— Jess H., small-batch embroidery</p>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link
              href="/convert?format=svg&source=vectorize-my-logo"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-8 py-3.5 text-[16px] font-medium text-white hover:bg-accent/90"
            >
              Upload your logo now <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 text-[13px] text-text-tertiary">
              First 10 credits free. No card required.
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
