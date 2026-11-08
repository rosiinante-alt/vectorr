import { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { Suspense } from "react";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Vectroy for Shops — Print, Embroidery & Production Pricing",
  description:
    "Batch processing, background removal, and done-for-you services for print shops, embroidery digitizers, and production teams. Affordable team pricing starting at $29/mo.",
  alternates: { canonical: "/for-shops" },
};

export default function ForShopsPage() {
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
          <div className="wrap text-center">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-bg-secondary py-1.5 pr-3.5 pl-1.5 text-[13.5px] font-medium text-text-secondary">
              <span className="rounded-full bg-text-primary px-2.5 py-0.5 text-[12px] font-semibold text-white">
                For Teams
              </span>
              Batch, API, and white-label options
            </p>
            <h1 className="display text-[clamp(40px,6vw,72px)] mb-6">
              Convert artwork at production speed.
            </h1>
            <p className="text-[clamp(17px,1.8vw,20px)] text-text-secondary leading-relaxed max-w-[680px] mx-auto">
              Batch process customer files, remove backgrounds, separate colors for screen printing, and export in machine-ready formats. All from one platform.
            </p>
          </div>
        </section>

        {/* ── Pricing Tiers ──────────────────────────────────────– */}
        <section className="py-16 sm:py-24 bg-bg-secondary">
          <div className="wrap">
            <h2 className="text-[clamp(28px,3.5vw,42px)] font-semibold tracking-[-0.02em] text-center mb-14">
              Plans for every operation size
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Starter */}
              <div className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="mb-6">
                  <h3 className="text-[22px] font-semibold mb-2">Starter</h3>
                  <p className="text-[14px] text-text-secondary">Small shops & freelancers</p>
                </div>
                <div className="mb-8 pb-8 border-b border-[var(--border)]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[48px] font-bold">$29</span>
                    <span className="text-text-secondary">/month</span>
                  </div>
                  <p className="mt-2 text-[13px] text-text-tertiary">Billed monthly, cancel anytime</p>
                </div>
                <ul className="space-y-3.5 mb-8">
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-[15px]">500 conversions/month</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-[15px]">Batch processing (up to 50 files)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-[15px]">Background removal</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-[15px]">All export formats</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-[15px]">Email support</span>
                  </li>
                </ul>
                <ButtonLink href="/pricing?plan=starter" size="lg" variant="secondary" className="w-full">
                  Get Started
                </ButtonLink>
              </div>

              {/* Professional */}
              <div className="rounded-[var(--radius-xl)] bg-accent-wash border-2 border-accent p-8 shadow-[0_0_0_0.5px_var(--accent),0_2px_6px_rgba(0,0,0,0.1)]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-[22px] font-semibold mb-2">Professional</h3>
                    <p className="text-[14px] text-text-secondary">Most popular for shops</p>
                  </div>
                  <span className="rounded-full bg-accent text-white px-3 py-1 text-[12px] font-semibold">
                    POPULAR
                  </span>
                </div>
                <div className="mb-8 pb-8 border-b border-accent/30">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[48px] font-bold">$79</span>
                    <span className="text-text-secondary">/month</span>
                  </div>
                  <p className="mt-2 text-[13px] text-text-tertiary">Billed monthly, cancel anytime</p>
                </div>
                <ul className="space-y-3.5 mb-8">
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-[15px]">5,000 conversions/month</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-[15px]">Unlimited batch processing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-[15px]">Color separation for screen print</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-[15px]">Background removal + object isolation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-[15px]">Priority email support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-[15px]">All export formats</span>
                  </li>
                </ul>
                <ButtonLink href="/pricing?plan=professional" size="lg" className="w-full">
                  Start Trial
                </ButtonLink>
              </div>

              {/* Enterprise */}
              <div className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="mb-6">
                  <h3 className="text-[22px] font-semibold mb-2">Enterprise</h3>
                  <p className="text-[14px] text-text-secondary">Large operations & integrations</p>
                </div>
                <div className="mb-8 pb-8 border-b border-[var(--border)]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[32px] font-bold">Custom</span>
                  </div>
                  <p className="mt-2 text-[13px] text-text-tertiary">Contact sales for pricing</p>
                </div>
                <ul className="space-y-3.5 mb-8">
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-[15px]">Unlimited conversions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-[15px]">REST API with priority support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-[15px]">White-label options</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-[15px]">Dedicated account manager</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-[15px]">On-premise deployment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-[15px]">SLA & phone support</span>
                  </li>
                </ul>
                <ButtonLink href="mailto:sales@vectroy.ai" size="lg" variant="secondary" className="w-full">
                  Contact Sales
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        {/* ── API Pricing ────────────────────────────────────────– */}
        <section className="py-16 sm:py-24">
          <div className="wrap">
            <div className="max-w-[760px] mb-12">
              <h2 className="text-[clamp(28px,3.5vw,42px)] font-semibold tracking-[-0.02em] mb-4">
                API for developers
              </h2>
              <p className="text-[17px] text-text-secondary leading-relaxed">
                Integrate Vectroy into your app or workflow. Pay only for what you use—no monthly minimums.
              </p>
            </div>
            <div className="bg-bg-secondary rounded-[var(--radius-xl)] p-8">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="pb-4 font-semibold">Volume</th>
                    <th className="pb-4 font-semibold">Price per image</th>
                    <th className="pb-4 font-semibold text-right">Monthly cost (1K images)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--border)]">
                    <td className="py-4">1 – 100</td>
                    <td className="py-4">$0.25</td>
                    <td className="py-4 text-right">$250</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="py-4">101 – 1,000</td>
                    <td className="py-4">$0.15</td>
                    <td className="py-4 text-right">$150</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="py-4">1,001 – 10,000</td>
                    <td className="py-4">$0.10</td>
                    <td className="py-4 text-right">$100</td>
                  </tr>
                  <tr>
                    <td className="py-4">10,000+</td>
                    <td className="py-4">$0.05</td>
                    <td className="py-4 text-right">$50</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-center text-text-secondary">
              <Link href="/api" className="text-accent font-medium underline underline-offset-[3px]">
                View API documentation →
              </Link>
            </p>
          </div>
        </section>

        {/* ── Use Cases ──────────────────────────────────────────– */}
        <section className="py-16 sm:py-24 bg-bg-secondary">
          <div className="wrap">
            <h2 className="text-[clamp(28px,3.5vw,42px)] font-semibold tracking-[-0.02em] text-center mb-14">
              Purpose-built for production
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]">
                <h3 className="text-[18px] font-semibold mb-3">Screen Print Shops</h3>
                <p className="text-[15px] text-text-secondary leading-relaxed mb-4">
                  Batch convert customer artwork, separate colors for multi-layer printing, and remove backgrounds. All without leaving Vectroy.
                </p>
                <Link href="/for-crafters/screen-printing" className="text-accent font-medium underline underline-offset-[3px]">
                  Learn more →
                </Link>
              </div>
              <div className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]">
                <h3 className="text-[18px] font-semibold mb-3">Embroidery Digitizing</h3>
                <p className="text-[15px] text-text-secondary leading-relaxed mb-4">
                  Convert artwork to DST, PES, or JEF instantly. Thread-density aware output for clean, stitchable files.
                </p>
                <Link href="/for-crafters/embroidery" className="text-accent font-medium underline underline-offset-[3px]">
                  Learn more →
                </Link>
              </div>
              <div className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]">
                <h3 className="text-[18px] font-semibold mb-3">Print On Demand</h3>
                <p className="text-[15px] text-text-secondary leading-relaxed mb-4">
                  Ready for shirts, mugs, tumblers. All export formats for every POD service—Printful, Teespring, Etsy.
                </p>
                <Link href="/for-crafters/print-on-demand" className="text-accent font-medium underline underline-offset-[3px]">
                  Learn more →
                </Link>
              </div>
              <div className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]">
                <h3 className="text-[18px] font-semibold mb-3">Laser & CNC Cutting</h3>
                <p className="text-[15px] text-text-secondary leading-relaxed mb-4">
                  Export to DXF and G-code ready for LightBurn, xTool, Glowforge, and industrial laser systems.
                </p>
                <Link href="/for-crafters/laser-cutting" className="text-accent font-medium underline underline-offset-[3px]">
                  Learn more →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────────────────– */}
        <section className="py-16 sm:py-24">
          <div className="wrap max-w-[760px]">
            <h2 className="text-[clamp(28px,3.5vw,42px)] font-semibold tracking-[-0.02em] mb-12">
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-[18px] font-semibold mb-2">What's included in each plan?</h3>
                <p className="text-[15px] text-text-secondary leading-relaxed">
                  All plans include batch processing, background removal, and all export formats (SVG, DXF, EPS, PDF, DST, G-code). Professional and Enterprise add color separation and priority support.
                </p>
              </div>
              <div>
                <h3 className="text-[18px] font-semibold mb-2">Can I upgrade or downgrade?</h3>
                <p className="text-[15px] text-text-secondary leading-relaxed">
                  Yes, anytime. Change your plan in your account settings and we'll prorate any charges or credits.
                </p>
              </div>
              <div>
                <h3 className="text-[18px] font-semibold mb-2">Do unused conversions roll over?</h3>
                <p className="text-[15px] text-text-secondary leading-relaxed">
                  No, monthly conversions reset each billing cycle. If you need more, contact us about a higher tier or API pricing.
                </p>
              </div>
              <div>
                <h3 className="text-[18px] font-semibold mb-2">Can I get a discount for annual billing?</h3>
                <p className="text-[15px] text-text-secondary leading-relaxed">
                  Yes. Pay annually and save 20%. Contact sales@vectroy.ai for more details.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────– */}
        <section className="py-16 sm:py-24 bg-bg-secondary">
          <div className="wrap text-center">
            <h2 className="text-[clamp(28px,3.5vw,42px)] font-semibold tracking-[-0.02em] mb-6">
              Ready to speed up production?
            </h2>
            <p className="text-[17px] text-text-secondary mb-8 max-w-[560px] mx-auto">
              Start a free trial on Professional or contact us for a custom quote.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <ButtonLink href="/pricing?plan=professional" size="lg">
                Start Free Trial
              </ButtonLink>
              <ButtonLink href="mailto:sales@vectroy.ai" size="lg" variant="secondary">
                Contact Sales
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
