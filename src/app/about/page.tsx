import { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { Suspense } from "react";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Vectroy — AI-Powered Vector Conversion",
  description:
    "Learn how Vectroy was built to solve the vector conversion problem for makers, designers, and production shops. Our story, team, and mission.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
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

      <main id="main" className="flex-1">
        {/* ── Hero ───────────────────────────────────────────────── */}
        <section className="pt-20 pb-16 sm:pt-28 sm:pb-20">
          <div className="wrap">
            <div className="max-w-[820px]">
              <h1 className="display text-[clamp(40px,6vw,72px)] mb-6">
                Built for creators who make with precision.
              </h1>
              <p className="text-[clamp(17px,1.8vw,20px)] text-text-secondary leading-relaxed max-w-[680px]">
                Vectroy started when we realized that makers, designers, and production shops were spending hours converting images into machine-ready files. We built Vectroy to handle that work in seconds—with the quality that comes from real geometric understanding, not just pixel tracing.
              </p>
            </div>
          </div>
        </section>

        {/* ── Mission ───────────────────────────────────────────── */}
        <section className="py-16 sm:py-24 bg-bg-secondary">
          <div className="wrap">
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <h2 className="text-[clamp(28px,3.5vw,42px)] font-semibold tracking-[-0.02em] mb-4">
                  Our mission
                </h2>
                <p className="text-[17px] text-text-secondary leading-relaxed mb-5">
                  Remove the barrier between an idea and production-ready artwork. Whether you're cutting vinyl on a Cricut, running embroidery through a digitizer, or preparing artwork for screen printing, your images shouldn't need to be remade from scratch.
                </p>
                <p className="text-[17px] text-text-secondary leading-relaxed">
                  Vectroy understands what each machine needs: clean, traceable paths for cutters; thread-density control for embroidery; color-separation smarts for screen print. That's not a generic converter—it's a craft-aware toolset.
                </p>
              </div>
              <div>
                <h2 className="text-[clamp(28px,3.5vw,42px)] font-semibold tracking-[-0.02em] mb-4">
                  Why we built it
                </h2>
                <p className="text-[17px] text-text-secondary leading-relaxed mb-5">
                  Existing tools treated vectorization as a one-size-fits-all problem. Illustrator's Image Trace is powerful but designed for designers. Vector Magic is solid but doesn't speak machine language. Online converters work but assume every user knows SVG, DXF, and EPS well enough to configure output.
                </p>
                <p className="text-[17px] text-text-secondary leading-relaxed">
                  We started with the user's end state: "I want to cut this on my Cricut" or "I need to send this to an embroidery shop." Vectroy works backward from there.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works ───────────────────────────────────────── */}
        <section className="py-16 sm:py-24">
          <div className="wrap">
            <h2 className="text-[clamp(28px,3.5vw,42px)] font-semibold tracking-[-0.02em] text-center mb-14">
              Our approach
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-[var(--radius-xl)] bg-bg-secondary p-8">
                <div className="text-[48px] font-bold text-accent mb-4">01</div>
                <h3 className="text-[20px] font-semibold mb-3">Real geometry, not pixel outlines</h3>
                <p className="text-[15.5px] text-text-secondary leading-relaxed">
                  Our AI engine detects circles, curves, and corners—then rebuilds them as clean Bezier paths. That's why Cricut cuts hold their shape, and laser cuts don't shatter delicate details.
                </p>
              </div>
              <div className="rounded-[var(--radius-xl)] bg-bg-secondary p-8">
                <div className="text-[48px] font-bold text-accent mb-4">02</div>
                <h3 className="text-[20px] font-semibold mb-3">Machine-aware export</h3>
                <p className="text-[15.5px] text-text-secondary leading-relaxed">
                  SVG for web. DXF for CAD. EPS for print. DST for embroidery. G-code for laser. Each format gets output tuned to what that machine actually needs—no guessing or manual tweaking required.
                </p>
              </div>
              <div className="rounded-[var(--radius-xl)] bg-bg-secondary p-8">
                <div className="text-[48px] font-bold text-accent mb-4">03</div>
                <h3 className="text-[20px] font-semibold mb-3">Built for batch and automation</h3>
                <p className="text-[15.5px] text-text-secondary leading-relaxed">
                  Batch process 50 images at once. Use our API to integrate vectorization into your production pipeline. Stop being the bottleneck—let Vectroy handle the conversion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Who uses it ────────────────────────────────────────– */}
        <section className="py-16 sm:py-24 bg-bg-secondary">
          <div className="wrap">
            <h2 className="text-[clamp(28px,3.5vw,42px)] font-semibold tracking-[-0.02em] text-center mb-14">
              Built for makers, designers, and shops
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="text-[32px] mb-4">🎨</div>
                <h3 className="text-[18px] font-semibold mb-2">Makers & Hobbyists</h3>
                <p className="text-[15px] text-text-secondary leading-relaxed">
                  Convert designs for Cricut, laser cutters, embroidery machines, and vinyl cutters. Get your first 5 conversions free.
                </p>
              </div>
              <div className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="text-[32px] mb-4">🏢</div>
                <h3 className="text-[18px] font-semibold mb-2">Print & Production Shops</h3>
                <p className="text-[15px] text-text-secondary leading-relaxed">
                  Batch convert customer artwork, remove backgrounds, separate colors for screen printing. From $29/mo.
                </p>
              </div>
              <div className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="text-[32px] mb-4">⚙️</div>
                <h3 className="text-[18px] font-semibold mb-2">Developers & Integrators</h3>
                <p className="text-[15px] text-text-secondary leading-relaxed">
                  REST API with per-image billing. Embed vectorization into your app or workflow.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────– */}
        <section className="py-16 sm:py-24">
          <div className="wrap text-center">
            <h2 className="text-[clamp(28px,3.5vw,42px)] font-semibold tracking-[-0.02em] mb-6">
              Ready to get started?
            </h2>
            <p className="text-[17px] text-text-secondary mb-8 max-w-[560px] mx-auto">
              Try Vectroy free with 5 credits. No signup required to start converting.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <ButtonLink href="/convert" size="lg">
                Convert your first image
              </ButtonLink>
              <ButtonLink href="/pricing" size="lg" variant="secondary">
                See pricing
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
