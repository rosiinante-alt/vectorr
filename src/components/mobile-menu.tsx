"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

interface Section {
  title: string;
  links: { label: string; href: string }[];
}

const NAV_SECTIONS: Section[] = [
  {
    title: "Tools",
    links: [
      { label: "Convert Image to SVG", href: "/convert" },
      { label: "Batch Convert", href: "/batch" },
      { label: "Remove Background", href: "/remove-bg" },
      { label: "Upscale Image", href: "/upscale" },
      { label: "SVG Editor", href: "/svg-editor" },
      { label: "Optimize SVG", href: "/optimize-svg" },
      { label: "All Free Tools", href: "/tools" },
    ],
  },
  {
    title: "AI",
    links: [
      { label: "Generate SVG", href: "/generate-svg" },
      { label: "Animate SVG", href: "/ai-animate" },
      { label: "Generate Logo", href: "/generate-logo" },
      { label: "Brand Identity", href: "/brand-identity" },
      { label: "Generate Pattern", href: "/generate-pattern" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "For Crafters", href: "/for-crafters" },
      { label: "For Designers", href: "/for-designers" },
      { label: "For Shops", href: "/for-shops" },
      { label: "For Etsy Sellers", href: "/svg-for-etsy-sellers" },
      { label: "For Laser Cutting", href: "/svg-for-laser-cutting" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/resources" },
      { label: "Gallery", href: "/gallery" },
      { label: "Free SVG Files", href: "/free-svg-files" },
      { label: "How-To Guides", href: "/how-to" },
      { label: "SVG Glossary", href: "/glossary" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Pro Plan", href: "/pro" },
      { label: "API Access", href: "/api-access" },
      { label: "Reviews", href: "/reviews" },
      { label: "About", href: "/about" },
    ],
  },
];

function Accordion({ title, links }: Section) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--border)] last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-3.5 text-[15px] font-medium text-text-primary"
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 text-text-tertiary transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="pb-2 pl-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-2 text-[14px] text-text-secondary hover:text-text-primary"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function MobileMenuButton({ authSlot }: { authSlot?: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-text-secondary transition-colors hover:bg-[rgba(0,0,0,0.045)] lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-[min(360px,100vw)] bg-white shadow-[var(--shadow-1)]">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <span className="text-[15px] font-semibold">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="rounded p-1.5 text-text-tertiary hover:text-text-primary"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-2" style={{ maxHeight: "calc(100dvh - 65px)" }}>
              {NAV_SECTIONS.map((section) => (
                <Accordion key={section.title} {...section} />
              ))}

              <div className="mt-5 flex flex-col gap-3">
                {authSlot ?? (
                  <Link
                    href="/login"
                    className="inline-flex h-11 w-full items-center justify-center rounded-full bg-text-primary text-[14px] font-semibold text-white transition-colors hover:bg-black"
                  >
                    Sign in
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="inline-flex h-11 w-full items-center justify-center rounded-full border border-[var(--border)] text-[14px] font-semibold text-text-primary transition-colors hover:bg-bg-secondary"
                >
                  Open app
                </Link>
              </div>

              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 pb-6">
                <Link href="/terms" className="text-[12.5px] text-text-tertiary hover:underline">Terms</Link>
                <Link href="/privacy" className="text-[12.5px] text-text-tertiary hover:underline">Privacy</Link>
                <Link href="/affiliate" className="text-[12.5px] text-text-tertiary hover:underline">Affiliate</Link>
                <Link href="/faq" className="text-[12.5px] text-text-tertiary hover:underline">FAQ</Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
