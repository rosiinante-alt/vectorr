import { Suspense } from "react";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { Download, ArrowRight, Tag } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free SVG Files | Download & Customize Vector Graphics | Vectroy",
  description:
    "Download free SVG files for Cricut, Silhouette, laser cutting, and print. Geometric patterns, icons, frames, and more — all optimized and machine-ready.",
  alternates: { canonical: "/free-svg-files" },
  openGraph: {
    title: "Free SVG Files for Cricut, Laser Cutting & Print",
    description:
      "Machine-ready SVG downloads for makers. Geometric, botanical, typographic, and seasonal designs.",
    type: "website",
    url: "/free-svg-files",
  },
};

const CATEGORIES = [
  "All",
  "Geometric",
  "Botanical",
  "Animals",
  "Frames & borders",
  "Icons",
  "Seasonal",
  "Monograms",
];

const FILES = [
  {
    name: "Layered geometric mandala",
    tags: ["Geometric", "Cricut", "Vinyl"],
    desc: "9-layer mandala, each color on a separate path. Cricut and Silhouette ready.",
  },
  {
    name: "Wildflower wreath",
    tags: ["Botanical", "Print"],
    desc: "Detailed botanical line art. Perfect for HTV, stickers, and wall art.",
  },
  {
    name: "Block monogram frames (A–Z)",
    tags: ["Monograms", "Laser"],
    desc: "26 single-letter frames. Great for personalized laser-engraved gifts.",
  },
  {
    name: "Geometric mountain range",
    tags: ["Geometric", "DTF"],
    desc: "Low-poly mountain peaks, 4-color build. Scales cleanly from sticker to banner.",
  },
  {
    name: "Fern botanical set (8 files)",
    tags: ["Botanical", "Cricut"],
    desc: "Eight fern silhouettes: fronds, sprigs, and full stems.",
  },
  {
    name: "Simple paw print icon pack",
    tags: ["Animals", "Icons"],
    desc: "12 clean paw-print icons in varying sizes, single-path.",
  },
  {
    name: "Diamond frame borders (6 styles)",
    tags: ["Frames & borders"],
    desc: "Six diamond/rhombus frame styles. Stack or use solo for labels and tags.",
  },
  {
    name: "Sunflower single-layer",
    tags: ["Botanical", "Vinyl"],
    desc: "High-detail sunflower silhouette optimized for one-layer vinyl cuts.",
  },
];

export default function FreeSvgFilesPage() {
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
          <div className="mx-auto max-w-[680px] text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-[13px] font-medium text-accent">
              <Download className="h-3.5 w-3.5" />
              Free downloads
            </div>
            <h1 className="display mb-4 text-[clamp(32px,5vw,52px)] leading-tight">
              Free SVG files for makers
            </h1>
            <p className="mb-8 text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              Machine-ready SVG files for Cricut, Silhouette, laser cutting, vinyl,
              and print. Fully optimized. No sign-up required.
            </p>
          </div>

          {/* Category filter — static on server, JS enhancement TBD */}
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <span
                key={cat}
                className="cursor-default rounded-full border border-[var(--border)] bg-bg-secondary px-3.5 py-1.5 text-[13px] transition-colors hover:bg-bg-tertiary first:bg-accent first:text-white first:border-accent"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* File grid */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FILES.map((file) => (
              <div
                key={file.name}
                className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-bg-secondary"
              >
                {/* Placeholder preview */}
                <div className="flex h-36 items-center justify-center rounded-t-[var(--radius-xl)] bg-bg-tertiary">
                  <Download className="h-8 w-8 text-text-tertiary" />
                </div>
                <div className="p-4">
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {file.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent"
                      >
                        <Tag className="h-2.5 w-2.5" /> {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-[14.5px] font-semibold">{file.name}</h2>
                  <p className="mt-1 text-[13px] text-text-tertiary">{file.desc}</p>
                  <Link
                    href={`/convert?source=free-svg-files&file=${encodeURIComponent(file.name)}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent hover:underline"
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Upload own CTA */}
          <div className="mt-20 rounded-[var(--radius-xl)] bg-bg-secondary p-10 text-center shadow-[var(--shadow-1)]">
            <h2 className="text-[clamp(22px,3vw,30px)] font-semibold">
              Have your own design?
            </h2>
            <p className="mt-3 text-text-secondary">
              Upload any image and get a clean, optimized SVG in seconds.
            </p>
            <Link
              href="/convert"
              className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
            >
              Vectorize my own image <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
