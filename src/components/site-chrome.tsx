'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { SignOutButton } from "./sign-out-button";

export function SiteHeader({ initialUser = null }: { initialUser?: User | null }) {
  const [user, setUser] = useState<User | null>(initialUser);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/85 backdrop-blur-xl [backdrop-filter:saturate(1.8)_blur(20px)]">
      <div className="wrap flex h-[60px] items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[16px] font-semibold tracking-[-0.015em] text-text-primary"
        >
          {/* TODO: Replace with Vectorr icon once provided */}
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
          <Link
            href="/#how"
            className="hidden rounded-[var(--radius-sm)] px-3 py-2 text-[14px] font-medium text-text-secondary transition-colors hover:bg-[rgba(0,0,0,0.045)] hover:text-text-primary sm:block"
          >
            How it works
          </Link>
          <Link
            href="/pricing"
            className="hidden rounded-[var(--radius-sm)] px-3 py-2 text-[14px] font-medium text-text-secondary transition-colors hover:bg-[rgba(0,0,0,0.045)] hover:text-text-primary sm:block"
          >
            Pricing
          </Link>
          <Link
            href="/blog"
            className="hidden rounded-[var(--radius-sm)] px-3 py-2 text-[14px] font-medium text-text-secondary transition-colors hover:bg-[rgba(0,0,0,0.045)] hover:text-text-primary sm:block"
          >
            Blog
          </Link>
          <Link
            href="/resources"
            className="hidden rounded-[var(--radius-sm)] px-3 py-2 text-[14px] font-medium text-text-secondary transition-colors hover:bg-[rgba(0,0,0,0.045)] hover:text-text-primary lg:block"
          >
            Resources
          </Link>
          <Link
            href="/tools"
            className="hidden rounded-[var(--radius-sm)] px-3 py-2 text-[14px] font-medium text-text-secondary transition-colors hover:bg-[rgba(0,0,0,0.045)] hover:text-text-primary lg:block"
          >
            Tools
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="ml-1.5 inline-flex h-9 items-center rounded-full bg-text-primary px-4 text-[13.5px] font-semibold text-white transition-colors hover:bg-black"
              >
                Dashboard
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="ml-1.5 inline-flex h-9 items-center rounded-full bg-text-primary px-4 text-[13.5px] font-semibold text-white transition-colors hover:bg-black"
            >
              Sign in
            </Link>
          )}
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
        { label: "How it works", href: "/#how" },
        { label: "Pricing", href: "/pricing" },
        { label: "Blog", href: "/blog" },
        { label: "Open app", href: "/dashboard" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { label: "For Crafters", href: "/for-crafters" },
        { label: "For Shops", href: "/for-shops" },
        { label: "For Designers", href: "/for-designers" },
        { label: "Free Tools", href: "/tools" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "All Resources", href: "/resources" },
        { label: "Compare Vectroy", href: "/compare/vectosolve" },
        { label: "Converter Tools", href: "/convert/jpg-to-svg" },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "Sign in", href: "/login" },
        { label: "Status", href: "/api/health" },
      ],
    },
  ];

  return (
    <footer className="mt-auto bg-bg-secondary py-14">
      <div className="wrap">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-[16px] font-semibold tracking-[-0.015em]">Vectroy</p>
            <p className="mt-3 max-w-[280px] text-[14.5px] leading-relaxed text-text-tertiary">
              Vector-to-vector optimization with a report you can read. Shrink the
              SVG you already have.
            </p>
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
            <div className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] bg-bg-tertiary px-2.5 py-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-text-tertiary" />
              <span className="text-[12px] text-text-tertiary">Press <kbd className="font-mono">?</kbd> for keyboard shortcuts</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
