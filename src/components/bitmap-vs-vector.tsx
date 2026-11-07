'use client';

import { useState } from 'react';
import Link from 'next/link';

type ComparisonMode = 'bitmap' | 'vector';

export function BitmapVsVectorExplainer() {
  const [mode, setMode] = useState<ComparisonMode>('bitmap');

  return (
    <div className="space-y-12">
      {/* Toggle */}
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setMode('bitmap')}
          aria-pressed={mode === 'bitmap'}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
            mode === 'bitmap'
              ? 'bg-text-primary text-white'
              : 'bg-white text-text-primary border border-[var(--border)] hover:bg-white/80'
          }`}
        >
          Bitmap
        </button>
        <span className="text-text-tertiary font-mono text-[12px]">vs.</span>
        <button
          type="button"
          onClick={() => setMode('vector')}
          aria-pressed={mode === 'vector'}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
            mode === 'vector'
              ? 'bg-accent text-white'
              : 'bg-white text-text-primary border border-[var(--border)] hover:bg-white/80'
          }`}
        >
          Vector
        </button>
      </div>

      {/* Content */}
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Visual */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-full rounded-[var(--radius-xl)] bg-white p-6 shadow-[0_0_0_0.5px_var(--border),0_4px_12px_rgba(0,0,0,0.05)]">
            {mode === 'bitmap' ? (
              <svg viewBox="0 0 240 180" className="h-auto w-full" aria-hidden="true">
                <defs>
                  <pattern id="bitmap-grid" width="6" height="6" patternUnits="userSpaceOnUse">
                    <rect width="3" height="3" x="0" y="0" fill="#e5e7eb" />
                    <rect width="3" height="3" x="3" y="3" fill="#e5e7eb" />
                  </pattern>
                </defs>
                <rect width="240" height="180" fill="url(#bitmap-grid)" />
                {/* Pixelated circle */}
                <g fill="#3b82f6">
                  {Array.from({ length: 576 }, (_, i) => {
                    const row = Math.floor(i / 24);
                    const col = i % 24;
                    const dx = col * 10;
                    const dy = row * 7.5;
                    const dist = Math.sqrt((col - 12) ** 2 + (row - 12) ** 2);
                    if (dist < 10.5) return <rect key={i} x={dx} y={dy} width="9" height="6" />;
                    return null;
                  })}
                </g>
                <text x="120" y="165" textAnchor="middle" fontSize="12" fill="#6b7280">
                  Pixels · Fixed Resolution
                </text>
              </svg>
            ) : (
              <svg viewBox="0 0 240 180" className="h-auto w-full" aria-hidden="true">
                <defs>
                  <radialGradient id="vector-grad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#1e40af" />
                  </radialGradient>
                </defs>
                <rect width="240" height="180" fill="#f3f4f6" />
                <circle cx="120" cy="90" r="60" fill="url(#vector-grad)" stroke="#1e3a8a" strokeWidth="2" />
                <text x="120" y="165" textAnchor="middle" fontSize="12" fill="#1f2937">
                  Scalable Curves · Infinite Resolution
                </text>
              </svg>
            )}
          </div>

          {/* Description */}
          <div className="text-center">
            {mode === 'bitmap' ? (
              <div className="space-y-2">
                <p className="font-semibold text-text-primary">Bitmap (Raster)</p>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>Made of fixed pixels</li>
                  <li>Blurry when enlarged</li>
                  <li>Large file sizes</li>
                  <li>Not editable</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-semibold text-text-primary">Vector</p>
                <ul className="space-y-1 text-sm text-text-secondary">
                  <li>Made of mathematical curves</li>
                  <li>Crisp at any size</li>
                  <li>Tiny file sizes</li>
                  <li>Fully editable</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Use cases */}
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-text-primary mb-4">
              {mode === 'bitmap' ? 'Bitmap use cases' : 'Vector use cases'}
            </h3>
            <ul className="space-y-3">
              {mode === 'bitmap' ? (
                <>
                  <li className="rounded-lg bg-white p-3 border border-[var(--border)]">
                    <p className="font-medium text-[14.5px] text-text-primary">Photos</p>
                    <p className="text-[13px] text-text-secondary">Photographs and natural images</p>
                  </li>
                  <li className="rounded-lg bg-white p-3 border border-[var(--border)]">
                    <p className="font-medium text-[14.5px] text-text-primary">Screenshots</p>
                    <p className="text-[13px] text-text-secondary">Complex raster graphics</p>
                  </li>
                  <li className="rounded-lg bg-white p-3 border border-[var(--border)]">
                    <p className="font-medium text-[14.5px] text-text-primary">Artwork</p>
                    <p className="text-[13px] text-text-secondary">Hand-painted digital art</p>
                  </li>
                </>
              ) : (
                <>
                  <li className="rounded-lg bg-white p-3 border border-[var(--border)]">
                    <p className="font-medium text-[14.5px] text-text-primary">Logos</p>
                    <p className="text-[13px] text-text-secondary">Clean, scalable brand assets</p>
                  </li>
                  <li className="rounded-lg bg-white p-3 border border-[var(--border)]">
                    <p className="font-medium text-[14.5px] text-text-primary">Icons</p>
                    <p className="text-[13px] text-text-secondary">Web and app graphics</p>
                  </li>
                  <li className="rounded-lg bg-white p-3 border border-[var(--border)]">
                    <p className="font-medium text-[14.5px] text-text-primary">Text</p>
                    <p className="text-[13px] text-text-secondary">Typography and lettering</p>
                  </li>
                  <li className="rounded-lg bg-white p-3 border border-[var(--border)]">
                    <p className="font-medium text-[14.5px] text-text-primary">Cut files</p>
                    <p className="text-[13px] text-text-secondary">Cricut, vinyl, laser</p>
                  </li>
                  <li className="rounded-lg bg-white p-3 border border-[var(--border)]">
                    <p className="font-medium text-[14.5px] text-text-primary">Print</p>
                    <p className="text-[13px] text-text-secondary">Business cards, posters</p>
                  </li>
                  <li className="rounded-lg bg-white p-3 border border-[var(--border)]">
                    <p className="font-medium text-[14.5px] text-text-primary">Code</p>
                    <p className="text-[13px] text-text-secondary">SVG for web development</p>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* CTA */}
          {mode === 'vector' && (
            <div className="rounded-[var(--radius-lg)] bg-accent-wash p-5">
              <p className="text-sm text-text-secondary mb-3">
                Ready to convert bitmap to vector? Vectorr handles the tracing
                automatically.
              </p>
              <Link
                href="/convert"
                className="inline-flex text-sm font-semibold text-accent-ink hover:underline"
              >
                Start converting →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}