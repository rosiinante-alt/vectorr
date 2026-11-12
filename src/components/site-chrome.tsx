import type { ReactNode } from "react";
import Link from "next/link";
import { HelpCircle } from "lucide-react";

import { SiteSearch } from "@/components/site-search";
import { NavDropdown } from "@/components/nav-dropdown";
import { MobileMenuButton } from "@/components/mobile-menu";
import { LanguageSwitcher } from "@/components/language-switcher";

/**
 * Account controls are passed in as a slot rather than resolved here: the
 * client bundle must not include the Supabase auth SDK on marketing pages.
 * Client-rendered pages that pass no slot get the signed-out link.
 */
/** Signed-out control, and the placeholder while the session resolves. */
export function SignInLink() {
  return (
    <Link
      href="/login"
      className="ml-1.5 inline-flex h-9 items-center rounded-full bg-text-primary px-4 text-[13.5px] font-semibold text-white transition-colors hover:bg-black"
    >
      Sign in
    </Link>
  );
}

export function SiteHeader({ authSlot }: { authSlot?: ReactNode }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/85 backdrop-blur-xl [backdrop-filter:saturate(1.8)_blur(20px)]">
      <div className="wrap flex h-[60px] items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[16px] font-semibold tracking-[-0.015em] text-text-primary"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-6 w-6 text-accent"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 18L12 5l8 13z" />
            <path d="M8.5 18L12 12l3.5 6" />
          </svg>
          Vectroy
        </Link>

        <nav aria-label="Main" className="flex items-center gap-1">
          {/* Desktop nav */}
          <div className="hidden lg:flex">
            <NavDropdown
              label="Tools"
              groups={[
                {
                  label: "Convert",
                  items: [
                    { label: "Image to SVG", href: "/convert", description: "Vectorize JPG, PNG, WebP" },
                    { label: "Batch Convert", href: "/batch", description: "Multiple files at once" },
                    { label: "Remove Background", href: "/remove-bg", description: "AI background removal" },
                    { label: "Upscale", href: "/upscale", description: "2× or 4× AI upscale" },
                  ],
                },
                {
                  label: "Edit & Optimize",
                  items: [
                    { label: "SVG Editor", href: "/svg-editor", description: "Edit paths and nodes" },
                    { label: "Optimize SVG", href: "/optimize-svg", description: "Compress and clean up" },
                    { label: "DPI Calculator", href: "/dpi-calculator", description: "Print and screen DPI" },
                    { label: "All Free Tools", href: "/tools", description: "All maker tools in one place" },
                  ],
                },
              ]}
            />
            <NavDropdown
              label="AI"
              groups={[
                {
                  label: "Generate",
                  items: [
                    { label: "SVG from Text", href: "/generate-svg", description: "Describe it, get a vector" },
                    { label: "Generate Logo", href: "/generate-logo", description: "Brand brief to logo" },
                    { label: "Generate Pattern", href: "/generate-pattern", description: "Repeating vector patterns" },
                  ],
                },
                {
                  label: "Animate & Brand",
                  items: [
                    { label: "Animate SVG", href: "/ai-animate", description: "CSS animations, 3 tiers" },
                    { label: "Brand Identity Kit", href: "/brand-identity", description: "Full identity in one click" },
                  ],
                },
              ]}
            />
            <NavDropdown
              label="Solutions"
              groups={[
                {
                  label: "By Audience",
                  items: [
                    { label: "For Crafters", href: "/for-crafters", description: "Cricut, Silhouette users" },
                    { label: "For Designers", href: "/for-designers", description: "Graphic designers" },
                    { label: "For Shops", href: "/for-shops", description: "Print shops, teams" },
                  ],
                },
                {
                  label: "By Use Case",
                  items: [
                    { label: "Laser Cutting", href: "/svg-for-laser-cutting" },
                    { label: "DTF Printing", href: "/svg-for-dtf" },
                    { label: "Etsy Sellers", href: "/svg-for-etsy-sellers" },
                    { label: "Screen Printing", href: "/svg-for-screen-printing" },
                    { label: "Embroidery", href: "/embroidery-converter" },
                  ],
                },
              ]}
            />
            <NavDropdown
              label="Resources"
              groups={[
                {
                  label: "Learn",
                  items: [
                    { label: "Blog & Guides", href: "/resources" },
                    { label: "How-To Guides", href: "/how-to" },
                    { label: "SVG Glossary", href: "/glossary" },
                    { label: "FAQ", href: "/faq" },
                  ],
                },
                {
                  label: "Browse",
                  items: [
                    { label: "SVG Gallery", href: "/gallery" },
                    { label: "Free SVG Files", href: "/free-svg-files" },
                    { label: "Examples", href: "/examples" },
                    { label: "Compare Alternatives", href: "/compare" },
                  ],
                },
              ]}
            />

            <Link
              href="/pricing"
              className="rounded-[var(--radius-sm)] px-3 py-2 text-[14px] font-medium text-text-secondary transition-colors hover:bg-[rgba(0,0,0,0.045)] hover:text-text-primary"
            >
              Pricing
            </Link>

            <div className="ml-1 hidden xl:block">
              <LanguageSwitcher />
            </div>

            <SiteSearch />
          </div>

          {/* Mobile: search + hamburger */}
          <div className="flex items-center gap-1 lg:hidden">
            <SiteSearch />
            <MobileMenuButton authSlot={authSlot} />
          </div>

          {/* Desktop auth */}
          <div className="hidden lg:block">
            {authSlot ?? <SignInLink />}
          </div>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const columns = [
    {
      title: "Product",
      links: [
        { label: "Convert Image to SVG", href: "/convert" },
        { label: "Batch Convert", href: "/batch" },
        { label: "Remove Background", href: "/remove-bg" },
        { label: "Upscale", href: "/upscale" },
        { label: "All Free Tools", href: "/tools" },
        { label: "SVG Editor", href: "/svg-editor" },
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
        { label: "For DTF Printing", href: "/svg-for-dtf" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog & Guides", href: "/resources" },
        { label: "SVG Gallery", href: "/gallery" },
        { label: "Free SVG Files", href: "/free-svg-files" },
        { label: "How-To Guides", href: "/how-to" },
        { label: "SVG Glossary", href: "/glossary" },
        { label: "FAQ", href: "/faq" },
      ],
    },
    {
      title: "Company & Legal",
      links: [
        { label: "Pricing", href: "/pricing" },
        { label: "Pro Plan", href: "/pro" },
        { label: "API Access", href: "/api-access" },
        { label: "Done for You", href: "/done-for-you" },
        { label: "Reviews", href: "/reviews" },
        { label: "About", href: "/about" },
        { label: "Terms", href: "/terms" },
        { label: "Privacy", href: "/privacy" },
      ],
    },
    {
      title: "Partners",
      links: [
        { label: "Affiliate Program", href: "/affiliate" },
        { label: "Refer a Friend", href: "/refer" },
        { label: "Education Discount", href: "/education" },
        { label: "Press Kit", href: "/press" },
        { label: "Network", href: "/network" },
      ],
    },
  ];

  return (
    <footer className="mt-auto bg-bg-secondary py-14">
      <div className="wrap">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <div className="sm:col-span-2 lg:col-span-3 xl:col-span-1 xl:row-span-2">
            <p className="text-[16px] font-semibold tracking-[-0.015em]">Vectroy</p>
            <p className="mt-3 max-w-[280px] text-[14.5px] leading-relaxed text-text-tertiary">
              Vector-to-vector optimization with a report you can read. Shrink the
              SVG you already have.
            </p>
            <div className="mt-5 inline-flex items-center gap-1.5 rounded-[var(--radius-md)] bg-bg-tertiary px-2.5 py-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-text-tertiary" />
              <span className="text-[12px] text-text-tertiary">
                Press <kbd className="font-mono">?</kbd> for keyboard shortcuts
              </span>
            </div>
            <div className="mt-5">
              <LanguageSwitcher />
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-[13px] font-semibold text-text-tertiary">
                {column.title}
              </h2>
              <ul className="mt-3.5 grid gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14.5px] text-text-primary/85 transition-opacity hover:underline hover:underline-offset-[3px]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-strong)] pt-5">
          <p className="text-[13.5px] text-text-tertiary">
            © 2026 Vectroy. Your files stay yours.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <p className="text-[13.5px] text-text-tertiary">
              Optimization runs on the server. Nothing is shared.
            </p>
            <Link
              href="/api/health"
              className="text-[13.5px] text-text-tertiary underline hover:text-text-primary"
            >
              Status
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
