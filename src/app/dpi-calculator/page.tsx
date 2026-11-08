'use client';

import { useState } from 'react';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { Calculator, Check } from 'lucide-react';

export default function DpiCalculatorPage() {
  const [widthPx, setWidthPx] = useState(3000);
  const [heightPx, setHeightPx] = useState(2000);
  const [widthIn, setWidthIn] = useState(10);
  const [heightIn, setHeightIn] = useState(6.67);
  const [dpi, setDpi] = useState(300);

  const calculateFromSize = (w: number, h: number, targetDpi: number) => {
    setWidthIn(parseFloat((w / targetDpi).toFixed(2)));
    setHeightIn(parseFloat((h / targetDpi).toFixed(2)));
  };

  const calculateFromInches = (wIn: number, hIn: number, targetDpi: number) => {
    setWidthPx(Math.round(wIn * targetDpi));
    setHeightPx(Math.round(hIn * targetDpi));
  };

  return (
    <div className="flex min-h-svh flex-col">
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader />

      <main id="main" className="flex-1 py-12 sm:py-16 lg:py-20">
        <div className="wrap">
          
          <div className="mx-auto max-w-[720px] text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-[13px] font-medium text-accent">
              <Calculator className="h-3.5 w-3.5" />
              Free Tool
            </div>
            <h1 className="display mb-4 text-[clamp(32px,5vw,54px)] leading-tight">
              DPI Calculator
            </h1>
            <p className="mb-8 text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              Calculate the resolution needed for print, or find out how large you can print at a given DPI.
            </p>
          </div>

          {/* Calculator */}
          <div className="mx-auto mt-12 max-w-[720px] rounded-[var(--radius-xl)] bg-bg-secondary p-8 shadow-[var(--shadow-1)]">
            <h2 className="mb-6 text-[20px] font-semibold text-text-primary">Calculate print size</h2>
            
            <div className="space-y-6">
              {/* Image Dimensions */}
              <div>
                <label className="mb-2 block text-[14px] font-medium text-text-primary">Image dimensions (pixels)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-[13px] text-text-secondary">Width</label>
                    <input
                      type="number"
                      value={widthPx}
                      onChange={(e) => {
                        const w = parseInt(e.target.value) || 0;
                        setWidthPx(w);
                        calculateFromSize(w, heightPx, dpi);
                      }}
                      className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-bg-primary px-3 py-2 text-[14px] text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[13px] text-text-secondary">Height</label>
                    <input
                      type="number"
                      value={heightPx}
                      onChange={(e) => {
                        const h = parseInt(e.target.value) || 0;
                        setHeightPx(h);
                        calculateFromSize(widthPx, h, dpi);
                      }}
                      className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-bg-primary px-3 py-2 text-[14px] text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>
              </div>

              {/* DPI */}
              <div>
                <label className="mb-2 block text-[14px] font-medium text-text-primary">Print DPI</label>
                <input
                  type="number"
                  value={dpi}
                  onChange={(e) => {
                    const d = parseInt(e.target.value) || 72;
                    setDpi(d);
                    calculateFromSize(widthPx, heightPx, d);
                  }}
                  className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-bg-primary px-3 py-2 text-[14px] text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {[72, 150, 300, 600].map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setDpi(d);
                        calculateFromSize(widthPx, heightPx, d);
                      }}
                      className="rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-1 text-[13px] text-text-primary hover:border-accent hover:bg-accent/5"
                    >
                      {d} DPI
                    </button>
                  ))}
                </div>
              </div>

              {/* Result */}
              <div className="rounded-[var(--radius-lg)] bg-accent/10 p-6">
                <p className="mb-2 text-[14px] text-text-secondary">Maximum print size at {dpi} DPI:</p>
                <p className="text-[28px] font-bold text-accent">
                  {widthIn.toFixed(2)}" × {heightIn.toFixed(2)}"
                </p>
                <p className="mt-1 text-[13px] text-text-tertiary">
                  ({(widthIn * 2.54).toFixed(1)} cm × {(heightIn * 2.54).toFixed(1)} cm)
                </p>
              </div>
            </div>
          </div>

          {/* DPI Reference */}
          <div className="mx-auto mt-12 max-w-[720px]">
            <h2 className="mb-6 text-center text-[clamp(22px,2.8vw,28px)] font-semibold text-text-primary">
              DPI reference guide
            </h2>
            <div className="space-y-3">
              {[
                { dpi: 72, usage: 'Screen / Web', quality: 'Good for digital display' },
                { dpi: 150, usage: 'Large format / Posters', quality: 'Acceptable for viewing from a distance' },
                { dpi: 300, usage: 'Professional print', quality: 'Industry standard for magazines and brochures' },
                { dpi: 600, usage: 'Fine art / High-end print', quality: 'Maximum detail for premium materials' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 rounded-[var(--radius-lg)] bg-bg-secondary p-4 shadow-[var(--shadow-1)]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[14px] font-bold text-accent">
                    {item.dpi}
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-text-primary">{item.usage}</p>
                    <p className="text-[13px] text-text-secondary">{item.quality}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Vector */}
          <div className="mx-auto mt-20 max-w-[620px] rounded-[var(--radius-xl)] bg-accent/5 p-8 text-center">
            <h2 className="mb-3 text-[clamp(22px,2.5vw,28px)] font-semibold text-text-primary">
              Skip DPI limits with vectors
            </h2>
            <p className="mb-6 text-[15px] text-text-secondary">
              Vector files scale to any size without losing quality. No DPI calculations needed.
            </p>
            <a
              href="/convert?format=svg"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
            >
              Convert to vector
            </a>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
