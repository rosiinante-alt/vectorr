import { Suspense } from "react";
import Link from "next/link";

import { ImageComparisonSlider } from "@/components/image-comparison-slider";
import { HeroTransformationSlider } from "@/components/hero-transformation-slider";
import { ExampleGallery } from "@/components/example-gallery";
import { DragDropUpload } from "@/components/drag-drop-upload";
import { FeatureShowcase } from "@/components/feature-showcase";
import { UseCaseGrid } from "@/components/use-case-grid";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { TestimonialSection } from "@/components/testimonial-section";
import { FormatComparisonTable } from "@/components/format-comparison-table";
import { FAQSection } from "@/components/faq-section";
import { VideoDemo } from "@/components/video-demo";
import { CaseStudies } from "@/components/case-studies";
import { HowItWorks } from "@/components/how-it-works";
import { BitmapVsVectorExplainer } from "@/components/bitmap-vs-vector";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
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
      <SiteHeader
        authSlot={
          <Suspense fallback={null}>
            <AuthSlot />
          </Suspense>
        }
      />

      <main id="main" className="flex-1">
        {/* ── Hero ───────────────────────────────────────────── */}
        <section className="pt-16 pb-14 text-center sm:pt-24 sm:pb-20">
          <div className="wrap">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-bg-secondary py-1.5 pr-3.5 pl-1.5 text-[13.5px] font-medium text-text-secondary">
              <span className="rounded-full bg-text-primary px-2.5 py-0.5 text-[12px] font-semibold text-white">
                AI-Powered
              </span>
              Transform raster images into perfect vectors instantly
            </p>

            <h1 className="display mx-auto max-w-[880px] text-[clamp(38px,6.4vw,74px)]">
              Convert PNG & JPG to
              <br />
              <span className="text-accent">scalable SVG</span>
            </h1>

            <p className="mx-auto mt-6 max-w-[620px] text-[clamp(17px,1.9vw,20px)] leading-relaxed text-text-secondary">
              Professional raster-to-vector conversion powered by AI. Upload any image
              and get crisp SVG, DXF, EPS, or PDF files — perfect for Cricut, laser cutting,
              embroidery, and commercial printing.
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
            <div className="text-center mb-12">
              <h2
                id="demo-heading"
                className="display text-[clamp(28px,4vw,44px)] mb-4"
              >
                See the difference.
              </h2>
              <p className="text-[clamp(16px,1.7vw,19px)] text-text-secondary max-w-[560px] mx-auto">
                Drag the slider to reveal the transformation. Our AI rebuilds real geometry—circles, smooth curves, clean paths—not just pixel outlines.
              </p>
            </div>

            <div className="max-w-[900px] mx-auto">
              <HeroTransformationSlider />
            </div>
          </div>
        </section>

        {/* ── Machine-Specific Landing Cards ─────────────────────── */}
        <section className="py-20 sm:py-28" aria-labelledby="machines-heading">
          <div className="wrap">
            <div className="max-w-[760px] mb-12">
              <h2
                id="machines-heading"
                className="display text-[clamp(30px,4.4vw,50px)] mb-4"
              >
                Works with every cutter and machine.
              </h2>
              <p className="text-[clamp(17px,1.7vw,20px)] text-text-secondary max-w-[620px]">
                Cricut. Laser. Embroidery. Whatever you make with, Vectroy outputs the exact file format it needs.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/for-crafters/cricut"
                className="group rounded-[var(--radius-xl)] bg-white p-6 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_0_0_0.5px_var(--border-strong),0_2px_6px_rgba(0,0,0,0.05)] transition-all"
              >
                <div className="text-[28px] mb-3">✂️</div>
                <h3 className="font-semibold text-[17px] group-hover:text-accent transition-colors">
                  Cricut
                </h3>
                <p className="mt-2 text-[14.5px] text-text-secondary">
                  SVG-ready for Design Space
                </p>
              </Link>

              <Link
                href="/for-crafters/laser-cutting"
                className="group rounded-[var(--radius-xl)] bg-white p-6 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_0_0_0.5px_var(--border-strong),0_2px_6px_rgba(0,0,0,0.05)] transition-all"
              >
                <div className="text-[28px] mb-3">🔴</div>
                <h3 className="font-semibold text-[17px] group-hover:text-accent transition-colors">
                  Laser Cutting
                </h3>
                <p className="mt-2 text-[14.5px] text-text-secondary">
                  DXF and G-code export
                </p>
              </Link>

              <Link
                href="/for-crafters/embroidery"
                className="group rounded-[var(--radius-xl)] bg-white p-6 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_0_0_0.5px_var(--border-strong),0_2px_6px_rgba(0,0,0,0.05)] transition-all"
              >
                <div className="text-[28px] mb-3">🧵</div>
                <h3 className="font-semibold text-[17px] group-hover:text-accent transition-colors">
                  Embroidery
                </h3>
                <p className="mt-2 text-[14.5px] text-text-secondary">
                  DST, PES, JEF formats
                </p>
              </Link>

              <Link
                href="/for-crafters/vinyl-cutting"
                className="group rounded-[var(--radius-xl)] bg-white p-6 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_0_0_0.5px_var(--border-strong),0_2px_6px_rgba(0,0,0,0.05)] transition-all"
              >
                <div className="text-[28px] mb-3">🎯</div>
                <h3 className="font-semibold text-[17px] group-hover:text-accent transition-colors">
                  Vinyl Cutting
                </h3>
                <p className="mt-2 text-[14.5px] text-text-secondary">
                  Silhouette & Cricut ready
                </p>
              </Link>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/for-crafters"
                className="text-accent font-medium underline underline-offset-[3px] text-[16px]"
              >
                View all machine guides →
              </Link>
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

        {/* ── Video Demo ─────────────────────────────────────── */}
        <VideoDemo />

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
                Cricut, Vectroy converts any image into production-ready vectors.
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
                Pick a detail to see how Vectroy handles it, compared with a
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
                      Vectroy
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
                      vectroy: "Yes",
                      illustrator: "Yes",
                      magic: "Yes",
                      online: "Basic",
                    },
                    {
                      label: "Background removal",
                      vectroy: "Yes",
                      illustrator: "Manual",
                      magic: "No",
                      online: "No",
                    },
                    {
                      label: "Batch processing (50 files)",
                      vectroy: "Yes",
                      illustrator: "Scripted",
                      magic: "No",
                      online: "No",
                    },
                    {
                      label: "Embroidery export (DST)",
                      vectroy: "Yes",
                      illustrator: "Plugin",
                      magic: "No",
                      online: "No",
                    },
                    {
                      label: "G-code for laser/CNC",
                      vectroy: "Yes",
                      illustrator: "No",
                      magic: "No",
                      online: "No",
                    },
                    {
                      label: "Browser-based",
                      vectroy: "Yes",
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
                        {row.vectroy}
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

        {/* ── Bitmap vs Vector ───────────────────────────────── */}
        <section className="py-20 sm:py-28 bg-bg-secondary" aria-labelledby="bitmap-heading">
          <div className="wrap">
            <h2
              id="bitmap-heading"
              className="display text-center text-[clamp(30px,4.4vw,50px)]"
            >
              Bitmap vs Vector — why it matters.
            </h2>

            <div className="mt-16">
              <BitmapVsVectorExplainer />
            </div>
          </div>
        </section>

        {/* ── Testimonials ───────────────────────────────────── */}
        <section className="py-20 sm:py-28" aria-labelledby="testimonials-heading">
          <div className="wrap">
            <h2
              id="testimonials-heading"
              className="display text-center text-[clamp(30px,4.4vw,50px)] mb-6"
            >
              Loved by makers and builders.
            </h2>
            <p className="text-center text-text-secondary text-[17px] mb-16 max-w-[620px] mx-auto">
              From Etsy sellers to production shops, Vectroy saves time and eliminates file conversion headaches.
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-[var(--radius-xl)] bg-bg-secondary p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#f59e0b]">★</span>
                  ))}
                </div>
                <p className="text-[15.5px] text-text-secondary leading-relaxed mb-6">
                  "We were spending 3-4 hours per day converting customer artwork. Vectroy cut that to 20 minutes. Our clients love the faster turnaround, and we love not being the bottleneck."
                </p>
                <div>
                  <p className="font-semibold text-[15px]">Sarah Chen</p>
                  <p className="text-[13.5px] text-text-tertiary">Owner, Precision Screen Print Co.</p>
                </div>
              </div>

              <div className="rounded-[var(--radius-xl)] bg-bg-secondary p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#f59e0b]">★</span>
                  ))}
                </div>
                <p className="text-[15.5px] text-text-secondary leading-relaxed mb-6">
                  "As someone who just started with a Cricut, figuring out SVG files was overwhelming. Vectroy made it dead simple—upload, download, done. I actually use my machine now!"
                </p>
                <div>
                  <p className="font-semibold text-[15px]">Marcus Thompson</p>
                  <p className="text-[13.5px] text-text-tertiary">Small Business Owner, Etsy</p>
                </div>
              </div>

              <div className="rounded-[var(--radius-xl)] bg-bg-secondary p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#f59e0b]">★</span>
                  ))}
                </div>
                <p className="text-[15.5px] text-text-secondary leading-relaxed mb-6">
                  "The API integration was seamless. We now batch-process 200+ designs per day without any manual intervention. Best decision we made for production automation."
                </p>
                <div>
                  <p className="font-semibold text-[15px]">Kenji Nakamura</p>
                  <p className="text-[13.5px] text-text-tertiary">Tech Lead, Print-on-Demand Startup</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Blog & Resources ────────────────────────────────── */}
        <section className="py-20 sm:py-28 bg-bg-secondary" aria-labelledby="blog-heading">
          <div className="wrap">
            <div className="flex items-center justify-between mb-12">
              <div className="max-w-[760px]">
                <h2
                  id="blog-heading"
                  className="display text-[clamp(30px,4.4vw,50px)]"
                >
                  Learn how to vectorize smarter.
                </h2>
                <p className="mt-5 text-[clamp(17px,1.7vw,20px)] text-text-secondary max-w-[620px]">
                  Guides, tutorials, and best practices for every use case—from Cricut designs to embroidery digitizing.
                </p>
              </div>
              <Link
                href="/blog"
                className="hidden md:block text-accent font-medium underline underline-offset-[3px] whitespace-nowrap ml-8 text-[16px]"
              >
                Read all posts →
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Link
                href="/blog/how-to-prepare-images-for-cricut"
                className="group rounded-[var(--radius-xl)] bg-white p-6 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_0_0_0.5px_var(--border-strong),0_2px_6px_rgba(0,0,0,0.05)] transition-all"
              >
                <p className="text-[13px] font-semibold text-text-tertiary uppercase tracking-widest mb-2">
                  GUIDE
                </p>
                <h3 className="text-[18px] font-semibold group-hover:text-accent transition-colors mb-2">
                  How to Prepare Images for Cricut
                </h3>
                <p className="text-[14.5px] text-text-secondary mb-4">
                  Best practices for clean SVG exports and avoiding common cutting errors.
                </p>
                <span className="text-accent text-[14px] font-medium">Read more →</span>
              </Link>

              <Link
                href="/blog/embroidery-file-formats-explained"
                className="group rounded-[var(--radius-xl)] bg-white p-6 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_0_0_0.5px_var(--border-strong),0_2px_6px_rgba(0,0,0,0.05)] transition-all"
              >
                <p className="text-[13px] font-semibold text-text-tertiary uppercase tracking-widest mb-2">
                  TUTORIAL
                </p>
                <h3 className="text-[18px] font-semibold group-hover:text-accent transition-colors mb-2">
                  Embroidery File Formats Explained
                </h3>
                <p className="text-[14.5px] text-text-secondary mb-4">
                  DST vs PES vs JEF: which format works for your machine.
                </p>
                <span className="text-accent text-[14px] font-medium">Read more →</span>
              </Link>

              <Link
                href="/blog/vectorizing-hand-drawn-designs"
                className="group rounded-[var(--radius-xl)] bg-white p-6 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_0_0_0.5px_var(--border-strong),0_2px_6px_rgba(0,0,0,0.05)] transition-all"
              >
                <p className="text-[13px] font-semibold text-text-tertiary uppercase tracking-widest mb-2">
                  TIPS
                </p>
                <h3 className="text-[18px] font-semibold group-hover:text-accent transition-colors mb-2">
                  Vectorizing Hand-Drawn Designs
                </h3>
                <p className="text-[14.5px] text-text-secondary mb-4">
                  Getting the best results from sketches, scans, and artwork photos.
                </p>
                <span className="text-accent text-[14px] font-medium">Read more →</span>
              </Link>
            </div>

            <div className="mt-8 md:hidden text-center">
              <Link
                href="/blog"
                className="text-accent font-medium underline underline-offset-[3px] text-[16px]"
              >
                Read all posts →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Format Comparison ──────────────────────────────── */}
        <FormatComparisonTable />

        {/* ── Shop Tier CTA ───────────────────────────────────– */}
        <section className="py-20 sm:py-28 bg-bg-secondary" aria-labelledby="shop-heading">
          <div className="wrap">
            <div className="max-w-[760px] mb-12">
              <h2
                id="shop-heading"
                className="display text-[clamp(30px,4.4vw,50px)]"
              >
                For production shops.
              </h2>
              <p className="mt-5 text-[clamp(17px,1.7vw,20px)] text-text-secondary max-w-[620px]">
                Batch processing, unlimited conversions, and dedicated support for screen print, embroidery, and production operations.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-12">
              <div className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]">
                <h3 className="text-[20px] font-semibold mb-3">Batch Processing</h3>
                <p className="text-[15px] text-text-secondary leading-relaxed mb-6">
                  Convert 50 files at once. Handle daily workload automatically, not one image at a time.
                </p>
              </div>
              <div className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]">
                <h3 className="text-[20px] font-semibold mb-3">Color Separation</h3>
                <p className="text-[15px] text-text-secondary leading-relaxed mb-6">
                  Ready for screen printing. Multi-layer separation, spot color control, all in one step.
                </p>
              </div>
              <div className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]">
                <h3 className="text-[20px] font-semibold mb-3">REST API</h3>
                <p className="text-[15px] text-text-secondary leading-relaxed mb-6">
                  Integrate into your workflow. No monthly minimums, pay per image. Scale without limits.
                </p>
              </div>
            </div>

            <div className="text-center">
              <ButtonLink href="/for-shops" size="lg" variant="secondary">
                View Shop Plans & Pricing
              </ButtonLink>
            </div>
          </div>
        </section>

        {/* ── Comparisons ─────────────────────────────────────– */}
        <section className="py-20 sm:py-28" aria-labelledby="compare-heading">
          <div className="wrap">
            <div className="max-w-[760px] mb-12">
              <h2
                id="compare-heading"
                className="display text-[clamp(30px,4.4vw,50px)]"
              >
                How Vectroy compares.
              </h2>
              <p className="mt-5 text-[clamp(17px,1.7vw,20px)] text-text-secondary max-w-[620px]">
                See detailed comparisons with other tools. Understand where we excel and what trade-offs exist.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/compare/vectosolve"
                className="group rounded-[var(--radius-xl)] bg-bg-secondary p-6 hover:shadow-[0_0_0_0.5px_var(--border-strong),0_2px_6px_rgba(0,0,0,0.05)] transition-all"
              >
                <h3 className="font-semibold text-[17px] mb-2 group-hover:text-accent transition-colors">
                  Vectroy vs Vectosolve
                </h3>
                <p className="text-[14.5px] text-text-secondary">
                  Batch processing, API, and embroidery focus.
                </p>
              </Link>

              <Link
                href="/compare/vectorizer-ai"
                className="group rounded-[var(--radius-xl)] bg-bg-secondary p-6 hover:shadow-[0_0_0_0.5px_var(--border-strong),0_2px_6px_rgba(0,0,0,0.05)] transition-all"
              >
                <h3 className="font-semibold text-[17px] mb-2 group-hover:text-accent transition-colors">
                  Vectroy vs Vectorizer.ai
                </h3>
                <p className="text-[14.5px] text-text-secondary">
                  Production focus and format export.
                </p>
              </Link>

              <Link
                href="/compare/vector-magic"
                className="group rounded-[var(--radius-xl)] bg-bg-secondary p-6 hover:shadow-[0_0_0_0.5px_var(--border-strong),0_2px_6px_rgba(0,0,0,0.05)] transition-all"
              >
                <h3 className="font-semibold text-[17px] mb-2 group-hover:text-accent transition-colors">
                  Vectroy vs Vector Magic
                </h3>
                <p className="text-[14.5px] text-text-secondary">
                  Batch, API, and desktop alternatives.
                </p>
              </Link>

              <Link
                href="/compare/adobe-illustrator"
                className="group rounded-[var(--radius-xl)] bg-bg-secondary p-6 hover:shadow-[0_0_0_0.5px_var(--border-strong),0_2px_6px_rgba(0,0,0,0.05)] transition-all"
              >
                <h3 className="font-semibold text-[17px] mb-2 group-hover:text-accent transition-colors">
                  Vectroy vs Adobe Illustrator
                </h3>
                <p className="text-[14.5px] text-text-secondary">
                  Specialized conversion vs. design tool.
                </p>
              </Link>

              <Link
                href="/compare"
                className="group rounded-[var(--radius-xl)] bg-accent-wash border border-accent p-6 hover:shadow-[0_0_0_0.5px_var(--border-strong),0_2px_6px_rgba(0,0,0,0.05)] transition-all"
              >
                <h3 className="font-semibold text-[17px] mb-2 text-accent group-hover:opacity-80 transition-opacity">
                  See all comparisons
                </h3>
                <p className="text-[14.5px] text-text-secondary">
                  Compare Vectroy with 10+ tools and services.
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Case Studies ────────────────────────────────────── */}
        <CaseStudies />

        {/* ── FAQ ───────────────────────────────────────────── */}
        <FAQSection />

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
