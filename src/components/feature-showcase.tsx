'use client';

import { useState } from 'react';

type ComparisonVisual = 'precision' | 'nodes' | 'true-vector' | 'auto' | 'background' | 'color';

interface Feature {
  id: ComparisonVisual;
  title: string;
  body: string;
  detail: string;
}

const features: Feature[] = [
  {
    id: 'precision',
    title: 'Sub-pixel precision',
    body: 'Every edge lands exactly where it belongs — not snapped to a pixel grid. Zoom in to 800% and the line is still straight.',
    detail: 'edge deviation < 0.1px',
  },
  {
    id: 'nodes',
    title: 'The right number of nodes',
    body: 'Hundreds of redundant control points collapsed into the fewest that still describe the shape exactly. Smaller files, cleaner edits.',
    detail: '4–9× fewer path nodes',
  },
  {
    id: 'true-vector',
    title: 'Real vectors, not embedded images',
    body: 'Some tools wrap your bitmap in an SVG and call it done. Vectroy traces actual shapes, so the result scales and edits like real geometry.',
    detail: 'zero embedded rasters',
  },
  {
    id: 'auto',
    title: 'Fully automatic',
    body: 'Color count, smoothing, and threshold are chosen from the image itself. No dials to guess before you can see a result.',
    detail: 'auto-detected per image',
  },
  {
    id: 'background',
    title: 'Background removal',
    body: 'Strip a flat or photographed backdrop before tracing, giving you transparent cut-outs ready for print and cut workflows.',
    detail: 'alpha channel preserved',
  },
  {
    id: 'color',
    title: 'Full colour and transparency',
    body: '32-bit colour with an alpha channel, so gradients, subtle shading, and glassy transparency survive the conversion.',
    detail: '32-bit RGBA',
  },
];

/** Pixel-staircase edge, as a raster of the same shape would render it. */
function RasterEdge() {
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="fs-diag" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1d1d1f" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#1d1d1f" stopOpacity="0.14" />
        </linearGradient>
      </defs>
      <rect width="120" height="80" fill="#f5f5f7" />
      <path
        d="M0 74h8V66h8v-8h8v-8h8v-8h8v-8h8V26h8v-8h8v-8h8V2h40V0H0z"
        fill="url(#fs-diag)"
      />
      <path
        d="M0 74h8V66h8v-8h8v-8h8v-8h8v-8h8V26h8v-8h8v-8h8V2h40"
        fill="none"
        stroke="#8e8e93"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/** The same edge as a clean diagonal path. */
function VectorEdge() {
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden="true">
      <rect width="120" height="80" fill="#eaf3fb" />
      <path d="M0 80 120 0v80z" fill="#0072cc" fillOpacity="0.14" />
      <path d="M0 80 120 0" fill="none" stroke="#0072cc" strokeWidth="1.5" />
      <circle cx="0" cy="80" r="2.5" fill="#fff" stroke="#0072cc" strokeWidth="1.5" />
      <circle cx="120" cy="0" r="2.5" fill="#fff" stroke="#0072cc" strokeWidth="1.5" />
    </svg>
  );
}

function NodeVisual() {
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden="true">
      <rect width="120" height="80" fill="#f5f5f7" />
      <path
        d="M14 62C14 40 26 22 48 18s44 8 48 26"
        fill="none"
        stroke="#8e8e93"
        strokeWidth="1.2"
        strokeDasharray="3 2"
      />
      {Array.from({ length: 17 }, (_, i) => {
        const t = i / 16;
        const x = 14 + t * (62 - 14 + 34);
        const y = 62 - Math.sin(t * Math.PI) * 44;
        return <circle key={i} cx={x} cy={y} r="2.1" fill="#8e8e93" />;
      })}
      <path d="M14 62C14 40 26 22 48 18s44 8 48 26" fill="none" stroke="#0072cc" strokeWidth="2" />
      {[
        [14, 62],
        [48, 18],
        [96, 44],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="#fff" stroke="#0072cc" strokeWidth="2" />
      ))}
    </svg>
  );
}

function TrueVectorVisual() {
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden="true">
      <rect width="120" height="80" fill="#f5f5f7" />
      <rect x="6" y="18" width="44" height="40" rx="4" fill="#fff" stroke="#c7c7cc" strokeDasharray="2 1.5" />
      <g fill="#c7c7cc">
        {Array.from({ length: 60 }, (_, i) => (
          <rect key={i} x={9 + (i % 10) * 4.2} y={21 + Math.floor(i / 10) * 3.8} width="3.2" height="2.8" />
        ))}
      </g>
      <text x="28" y="70" textAnchor="middle" fontSize="5" fill="#8e8e93">
        embedded bitmap
      </text>

      <path d="M66 52 78 26l12 26z" fill="#0072cc" fillOpacity="0.18" stroke="#0072cc" strokeWidth="1.6" />
      <circle cx="78" cy="26" r="2.2" fill="#fff" stroke="#0072cc" strokeWidth="1.6" />
      <circle cx="66" cy="52" r="2.2" fill="#fff" stroke="#0072cc" strokeWidth="1.6" />
      <circle cx="90" cy="52" r="2.2" fill="#fff" stroke="#0072cc" strokeWidth="1.6" />
      <text x="78" y="70" textAnchor="middle" fontSize="5" fill="#0072cc">
        traced shapes
      </text>
    </svg>
  );
}

function AutoVisual() {
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden="true">
      <rect width="120" height="80" fill="#f5f5f7" />
      <g stroke="#d2d2d7" strokeWidth="1.2" fill="#fff">
        <rect x="10" y="14" width="100" height="12" rx="6" />
        <rect x="10" y="34" width="100" height="12" rx="6" />
        <rect x="10" y="54" width="100" height="12" rx="6" />
      </g>
      <rect x="10" y="14" width="62" height="12" rx="6" fill="#0072cc" />
      <rect x="10" y="34" width="34" height="12" rx="6" fill="#0072cc" />
      <rect x="10" y="54" width="80" height="12" rx="6" fill="#0072cc" />
      <circle cx="72" cy="20" r="4.5" fill="#fff" stroke="#0072cc" strokeWidth="1.6" />
      <circle cx="44" cy="40" r="4.5" fill="#fff" stroke="#0072cc" strokeWidth="1.6" />
      <circle cx="90" cy="60" r="4.5" fill="#fff" stroke="#0072cc" strokeWidth="1.6" />
    </svg>
  );
}

function BackgroundVisual() {
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden="true">
      <defs>
        <pattern id="fs-checker" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="#e8e8ed" />
          <rect x="4" y="4" width="4" height="4" fill="#e8e8ed" />
          <rect x="4" width="4" height="4" fill="#fff" />
          <rect y="4" width="4" height="4" fill="#fff" />
        </pattern>
      </defs>
      <rect width="120" height="80" fill="#f5f5f7" />
      <rect x="10" y="12" width="44" height="46" rx="4" fill="#fff" stroke="#c7c7cc" />
      <circle cx="32" cy="34" r="12" fill="#1d1d1f" />
      <text x="32" y="70" textAnchor="middle" fontSize="5" fill="#8e8e93">
        original
      </text>

      <rect x="66" y="12" width="44" height="46" rx="4" fill="url(#fs-checker)" stroke="#0072cc" strokeDasharray="2 1.5" />
      <circle cx="88" cy="34" r="12" fill="#1d1d1f" />
      <text x="88" y="70" textAnchor="middle" fontSize="5" fill="#0072cc">
        transparent
      </text>
    </svg>
  );
}

function ColorVisual() {
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="fs-sweep" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0072cc" />
          <stop offset="55%" stopColor="#7b61ff" />
          <stop offset="100%" stopColor="#ff5f6d" />
        </linearGradient>
        <linearGradient id="fs-alpha" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0072cc" stopOpacity="1" />
          <stop offset="100%" stopColor="#0072cc" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="120" height="80" fill="#f5f5f7" />
      <rect x="8" y="12" width="104" height="26" rx="5" fill="url(#fs-sweep)" />
      <rect x="8" y="44" width="104" height="26" rx="5" fill="url(#fs-alpha)" />
      <text x="12" y="75" fontSize="6" fill="#8e8e93">
        32-bit RGBA
      </text>
    </svg>
  );
}

const visuals: Record<ComparisonVisual, () => React.ReactElement> = {
  precision: () => (
    <div className="grid h-full grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-md)]">
      <figure className="relative overflow-hidden">
        <RasterEdge />
        <figcaption className="absolute left-2 top-2 rounded bg-white/85 px-1.5 py-0.5 font-mono text-[10px] text-text-tertiary">
          raster
        </figcaption>
      </figure>
      <figure className="relative overflow-hidden">
        <VectorEdge />
        <figcaption className="absolute left-2 top-2 rounded bg-white/85 px-1.5 py-0.5 font-mono text-[10px] text-accent-ink">
          vector
        </figcaption>
      </figure>
    </div>
  ),
  nodes: () => <NodeVisual />,
  'true-vector': () => <TrueVectorVisual />,
  auto: () => <AutoVisual />,
  background: () => <BackgroundVisual />,
  color: () => <ColorVisual />,
};

export function FeatureShowcase() {
  const [active, setActive] = useState<ComparisonVisual>('precision');
  const activeFeature = features.find((f) => f.id === active) ?? features[0];
  const Visual = visuals[activeFeature.id];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-14">
      {/* Copy column — acts as the selector */}
      <ul className="flex flex-col gap-2">
        {features.map((feature) => {
          const isActive = feature.id === active;
          return (
            <li key={feature.id}>
              <button
                type="button"
                onClick={() => setActive(feature.id)}
                aria-pressed={isActive}
                className={`w-full rounded-[var(--radius-lg)] p-5 text-left transition-colors ${
                  isActive
                    ? 'bg-white shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]'
                    : 'hover:bg-white/60'
                }`}
              >
                <h3
                  className={`text-[19px] font-semibold tracking-[-0.02em] ${
                    isActive ? 'text-accent-ink' : 'text-text-primary'
                  }`}
                >
                  {feature.title}
                </h3>
                {isActive && (
                  <>
                    <p className="mt-2.5 text-[15.5px] leading-relaxed text-text-secondary">
                      {feature.body}
                    </p>
                    <p className="tabular mt-3 font-mono text-[12.5px] text-text-tertiary">
                      {feature.detail}
                    </p>
                  </>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Visual column */}
      <div className="sticky top-24">
        <div className="overflow-hidden rounded-[var(--radius-xl)] bg-white p-3 shadow-[0_0_0_0.5px_var(--border),0_8px_24px_rgba(0,0,0,0.06)]">
          <div className="aspect-[3/2] w-full overflow-hidden rounded-[var(--radius-md)] [&>svg]:h-full [&>svg]:w-full">
            <Visual />
          </div>
        </div>
        <p className="mt-3 text-center font-mono text-[12px] text-text-tertiary">
          {activeFeature.title} — illustrative comparison
        </p>
      </div>
    </div>
  );
}