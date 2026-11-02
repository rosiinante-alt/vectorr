import type { Metadata } from "next";
import { Suspense } from "react";

import { SignInForm } from "@/components/sign-in-form";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Workspace } from "@/components/workspace";
import { hasSessionCookie } from "@/lib/session";

export const metadata: Metadata = {
  title: "Optimize an SVG — Vectorr",
  description: "Upload an SVG, read the savings report, and download a smaller file.",
};

async function DashboardContent() {
  const signedIn = await hasSessionCookie();

  return (
    <>
      <div className="max-w-[820px]">
        <h1 className="display text-[clamp(28px,4vw,40px)]">
          Optimize an SVG
        </h1>
        <p className="mt-3 max-w-[560px] text-[16.5px] text-text-secondary">
          Drop a file to see its size, nodes and colors, then optimize it. Every
          figure in the report is measured on your file.
        </p>
      </div>

      {!signedIn && (
        <div className="mt-8 max-w-[560px] rounded-[var(--radius-xl)] bg-white p-6 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]">
          <h2 className="text-[17px] font-semibold tracking-[-0.02em]">
            Sign in to run the real optimization
          </h2>
          <p className="mt-1.5 text-[14.5px] text-text-secondary">
            Until then you get a local estimate — nothing is uploaded.
          </p>
          <div className="mt-4">
            <SignInForm compact />
          </div>
        </div>
      )}

      <div className="mt-10">
        <Workspace isSignedIn={signedIn} />
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main" className="flex-1 py-10 sm:py-14">
        <div className="wrap">
          <Suspense fallback={
            <div className="max-w-[820px]">
              <h1 className="display text-[clamp(28px,4vw,40px)]">
                Optimize an SVG
              </h1>
              <p className="mt-3 max-w-[560px] text-[16.5px] text-text-secondary">
                Drop a file to see its size, nodes and colors, then optimize it. Every
                figure in the report is measured on your file.
              </p>
            </div>
          }>
            <DashboardContent />
          </Suspense>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
