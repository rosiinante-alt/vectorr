import Link from "next/link";

import { ImageComparisonSlider } from "@/components/image-comparison-slider";
import { ExampleGallery } from "@/components/example-gallery";
import { DragDropUpload } from "@/components/drag-drop-upload";
import { FeatureShowcase } from "@/components/feature-showcase";
import { UseCaseGrid } from "@/components/use-case-grid";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { HowItWorks } from "@/components/how-it-works";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";

const features = [
  {
    title: "AI Vectorization",
    body: "Traces edges, shapes, and gradients into clean vector paths. Works on logos, illustrations, and photos — from simple icons to complex scenes.",
    detail: "Edge detection · path simplification",
    icon: (
      <>
        <path d="M4 20L12 4l8 16z" />
        <path d="M8.5 20L12 13l3.5 7" />
      </>
    ),
  },
  {
    title: "Background Removal",
    body: "Strip backgrounds before vectorizing for cleaner results. One click, AI-powered. Perfect for product photos, logos, and graphics that need transparent backgrounds.",
    detail: "AI-powered · batch support",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 3.5v17M3.5 12h17" />
      </>
    ),
  },
  {
    title: "7 Export Formats",
    body: "SVG for web, DXF for CAD, EPS for print, G-code for laser cutters, DST for embroidery machines. One conversion, every format you need.",
    detail: "SVG · DXF · EPS · PDF · G-code · DST · AI",
    icon: (
      <>
        <path d="M12 3v12" />
        <path d="M7 10l5 5 5-5" />
        <path d="M4 19h16" />
      </>
    ),
  },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main" className="flex-1">
        {/* ── Hero ───────────────────────────────────────────── */}
        <section className="pt-16 pb-14 text-center sm:pt-24 sm:pb-20">
          <div className="wrap">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-bg-secondary py-1.5 pr-3.5 pl-1.5 text-[13.5px] font-medium text-text-secondary">
              <span className="rounded-full bg-text-primary px-2.5 py-0.5 text-[12px] font-semibold text-white">
                New
              </span>
              PNG, JPG, WEBP → crisp vectors for Cricut and laser cutting
            </p>

            <h1 className="display mx-auto max-w-[880px] text-[clamp(38px,6.4vw,74px)]">
              Turn any photo into a
              <br />
              <span className="text-accent">clean vector</span>
            </h1>

            <p className="mx-auto mt-6 max-w-[620px] text-[clamp(17px,1.9vw,20px)] leading-relaxed text-text-secondary">
              Upload a PNG, JPG, or WEBP. Get back a crisp SVG, DXF, EPS, or
              PDF — ready for Cricut, laser cutting, or print.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href="/convert" size="lg">
                Convert your first image
              </ButtonLink>
              <ButtonLink href="/#features" size="lg" variant="secondary">
                See how it works
              </ButtonLink>
            </div>

            <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[14px] font-medium text-text-tertiary">
              <li>No signup required</li>
              <li>5 free credits</li>
              <li>All export formats included</li>
            </ul>
          </div>
        </section>

        {/* ── Interactive Comparison ────────────────────────── */}
        <section className="py-16 sm:py-20 bg-gradient-to-b from-bg-secondary to-transparent" aria-labelledby="demo-heading">
          <div className="wrap">
            <div className="text-center mb-10">
              <h2
                id="demo-heading"
                className="display text-[clamp(28px,4vw,44px)] mb-4"
              >
                See the difference.
              </h2>
              <p className="text-[clamp(16px,1.7vw,19px)] text-text-secondary max-w-[560px] mx-auto">
                Drag the slider to compare your original image with the vectorized result.
              </p>
            </div>

            <div className="max-w-[900px] mx-auto">
              <ImageComparisonSlider
                beforeImage="/demo/logo-raster.svg"
                afterImage="/demo/logo-vector.svg"
                beforeAlt="Raster image - pixelated and blurry"
                afterAlt="Vector image - crisp and scalable"
                initialPosition={50}
                className="rounded-[var(--radius-xl)] shadow-[0_0_0_0.5px_var(--border),0_8px_24px_rgba(0,0,0,0.08)] bg-white"
                height={600}
              />
              <p className="mt-6 text-center text-[14px] text-text-tertiary">
                Drag the handle to compare raster vs. vector quality
              </p>
            </div>
          </div>
        </section>

        {/* ── How it works ──────────────────────────────────── */}
        <section className="py-20 sm:py-28" aria-labelledby="how-heading">
          <div className="wrap">
            <h2
              id="how-heading"
              className="display text-center text-[clamp(30px,4.4vw,50px)]"
            >
              How it works.
            </h2>
            <p className="mt-4 mx-auto max-w-[620px] text-center text-[clamp(16px,1.6vw,18px)] leading-relaxed text-text-secondary">
              Four steps from image to production-ready vector.
            </p>

            <div className="mt-16">
              <HowItWorks />
            </div>
          </div>
        </section>

        {/* ── Example Gallery ────────────────────────────────── */}
        <section className="py-20 sm:py-28 bg-bg-secondary" aria-labelledby="examples-heading">
          <div className="wrap">
            <div className="max-w-[760px] mb-12">
              <h2
                id="examples-heading"
                className="display text-[clamp(30px,4.4vw,50px)]"
              >
                See what's possible.
              </h2>
              <p className="mt-5 text-[clamp(17px,1.7vw,20px)] leading-relaxed text-text-secondary">
                From simple logos to detailed illustrations, our users convert every type of image. Explore examples across design categories.
              </p>
            </div>

            <ExampleGallery />
          </div>
        </section>

        {/* ── Drag & Drop Upload ─────────────────────────────── */}
        <section className="py-20 sm:py-28" aria-labelledby="upload-heading">
          <div className="wrap">
            <div className="max-w-[760px] mx-auto mb-12 text-center">
              <h2
                id="upload-heading"
                className="display text-[clamp(30px,4.4vw,50px)]"
              >
                Ready to vectorize?
              </h2>
              <p className="mt-5 text-[clamp(17px,1.7vw,20px)] leading-relaxed text-text-secondary">
                Upload any image and get crisp, scalable vectors in seconds. No sign-up required.
              </p>
            </div>

            <div className="max-w-[800px] mx-auto">
              <DragDropUpload />
            </div>
          </div>
        </section>

        {/* ── Features ───────────────────────────────────────── */}
        <section
          id="features"
          className="scroll-mt-20 bg-bg-secondary py-20 sm:py-28"
          aria-labelledby="features-heading"
        >
          <div className="wrap">
            <div className="max-w-[760px]">
              <h2
                id="features-heading"
                className="display text-[clamp(30px,4.4vw,50px)]"
              >
                From raster to vector in seconds.
              </h2>
              <p className="mt-5 text-[clamp(17px,1.7vw,20px)] leading-relaxed text-text-secondary">
                Whether you need a logo for your website or a design for your
                Cricut, Vectorr converts any image into production-ready vectors.
              </p>
            </div>

            <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <li
                  key={feature.title}
                  className="rounded-[var(--radius-xl)] bg-white p-7 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="grid h-9 w-9 place-items-center rounded-[var(--radius-md)] bg-accent-wash text-accent"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-[18px] w-[18px]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {feature.icon}
                      </svg>
                    </span>
                    <h3 className="text-[20px] font-semibold tracking-[-0.024em]">
                      <span className="visually-hidden">Feature {index + 1}: </span>
                      {feature.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-[15.5px] leading-relaxed text-text-secondary">
                    {feature.body}
                  </p>
                  <p className="tabular mt-5 border-t border-[var(--border)] pt-4 font-mono text-[12.5px] text-text-tertiary">
                    {feature.detail}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-20">
              <h3 className="display text-[clamp(24px,3vw,34px)]">
                What actually makes a good vector.
              </h3>
              <p className="mt-4 max-w-[620px] text-[clamp(16px,1.6vw,18px)] leading-relaxed text-text-secondary">
                Pick a detail to see how Vectorr handles it, compared with a
                straight raster trace.
              </p>

              <div className="mt-10">
                <FeatureShowcase />
              </div>
            </div>
          </div>
        </section>

        {/* ── Comparison ─────────────────────────────────────── */}
        <section className="py-20 sm:py-28" aria-labelledby="compare-heading">
          <div className="wrap">
            <div className="max-w-[760px]">
              <h2
                id="compare-heading"
                className="display text-[clamp(30px,4.4vw,50px)]"
              >
                Better than the alternatives.
              </h2>
              <p className="mt-5 text-[clamp(17px,1.7vw,20px)] leading-relaxed text-text-secondary">
                Fast, accurate tracing with all the export formats you need.
                No subscriptions, no bloat.
              </p>
            </div>

            <div className="mt-12 overflow-x-auto rounded-[var(--radius-lg)] bg-white shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]">
              <table className="w-full min-w-[680px] border-collapse text-left">
                <caption className="visually-hidden">
                  Comparison of vectorization tools
                </caption>
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="border-b border-[var(--border)] bg-bg-secondary px-4 py-3.5 text-[13.5px] font-semibold text-text-secondary whitespace-nowrap"
                    >
                      Feature
                    </th>
                    <th
                      scope="col"
                      className="border-b border-[var(--border)] bg-accent-wash px-4 py-3.5 text-[13.5px] font-semibold text-accent-ink whitespace-nowrap"
                    >
                      Vectorr
                    </th>
                    <th
                      scope="col"
                      className="border-b border-[var(--border)] bg-bg-secondary px-4 py-3.5 text-[13.5px] font-semibold text-text-secondary whitespace-nowrap"
                    >
                      Adobe Illustrator
                    </th>
                    <th
                      scope="col"
                      className="border-b border-[var(--border)] bg-bg-secondary px-4 py-3.5 text-[13.5px] font-semibold text-text-secondary whitespace-nowrap"
                    >
                      Vector Magic
                    </th>
                    <th
                      scope="col"
                      className="border-b border-[var(--border)] bg-bg-secondary px-4 py-3.5 text-[13.5px] font-semibold text-text-secondary whitespace-nowrap"
                    >
                      Online tools
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: "AI-powered tracing",
                      vectorr: "Yes",
                      illustrator: "Yes",
                      magic: "Yes",
                      online: "Basic",
                    },
                    {
                      label: "Background removal",
                      vectorr: "Yes",
                      illustrator: "Manual",
                      magic: "No",
                      online: "No",
                    },
                    {
                      label: "Batch processing (50 files)",
                      vectorr: "Yes",
                      illustrator: "Scripted",
                      magic: "No",
                      online: "No",
                    },
                    {
                      label: "Embroidery export (DST)",
                      vectorr: "Yes",
                      illustrator: "Plugin",
                      magic: "No",
                      online: "No",
                    },
                    {
                      label: "G-code for laser/CNC",
                      vectorr: "Yes",
                      illustrator: "No",
                      magic: "No",
                      online: "No",
                    },
                    {
                      label: "Browser-based",
                      vectorr: "Yes",
                      illustrator: "No",
                      magic: "No",
                      online: "Yes",
                    },
                  ].map((row) => (
                    <tr key={row.label}>
                      <th
                        scope="row"
                        className="border-b border-[var(--border)] px-4 py-3.5 text-[15px] font-semibold text-text-primary"
                      >
                        {row.label}
                      </th>
                      <td className="border-b border-[var(--border)] bg-accent-wash/60 px-4 py-3.5 text-[15px] font-medium text-text-primary">
                        {row.vectorr}
                      </td>
                      <td className="border-b border-[var(--border)] px-4 py-3.5 text-[15px] text-text-secondary">
                        {row.illustrator}
                      </td>
                      <td className="border-b border-[var(--border)] px-4 py-3.5 text-[15px] text-text-secondary">
                        {row.magic}
                      </td>
                      <td className="border-b border-[var(--border)] px-4 py-3.5 text-[15px] text-text-secondary">
                        {row.online}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Use cases ──────────────────────────────────────── */}
        <section
          className="bg-bg-secondary py-20 sm:py-28"
          aria-labelledby="usecases-heading"
        >
          <div className="wrap">
            <div className="max-w-[760px]">
              <h2
                id="usecases-heading"
                className="display text-[clamp(30px,4.4vw,50px)]"
              >
                Made for the way you work.
              </h2>
              <p className="mt-5 text-[clamp(17px,1.7vw,20px)] leading-relaxed text-text-secondary">
                The same conversion, tuned to what your next step needs — a cut
                file, a print-ready vector, or an API call.
              </p>
            </div>

            <UseCaseGrid />
          </div>
        </section>

        {/* ── Testimonials ───────────────────────────────────── */}
        <section className="py-20 sm:py-28" aria-labelledby="testimonials-heading">
          <div className="wrap">
            <h2
              id="testimonials-heading"
              className="display text-center text-[clamp(30px,4.4vw,50px)]"
            >
              Loved by makers and builders.
            </h2>

            <div className="mt-16">
              <TestimonialCarousel />
            </div>
          </div>
        </section>

        {/* ── Final CTA ──────────────────────────────────────── */}
        <section className="pb-24 sm:pb-32" aria-labelledby="cta-heading">
          <div className="wrap">
            <div className="rounded-[var(--radius-xl)] bg-bg-secondary px-6 py-14 text-center sm:px-10">
              <h2
                id="cta-heading"
                className="display mx-auto max-w-[620px] text-[clamp(30px,4.6vw,52px)]"
              >
                Ready to vectorize?
              </h2>
              <p className="mx-auto mt-5 max-w-[480px] text-[17px] text-text-secondary">
                Start with 5 free credits. No signup required to try it out.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <ButtonLink href="/convert" size="lg">
                  Convert your first image free
                </ButtonLink>
                <ButtonLink href="/pricing" size="lg" variant="secondary">
                  See pricing
                </ButtonLink>
              </div>
              <p className="mt-5 text-[13.5px] text-text-tertiary">
                5 free credits · All export formats ·{" "}
                <Link
                  href="/pricing"
                  className="text-accent-ink underline underline-offset-[3px]"
                >
                  See credit pricing
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
