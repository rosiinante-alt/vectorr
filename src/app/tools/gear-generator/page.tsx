'use client';

import { useState } from 'react';
import Link from 'next/link';

interface GearParams {
  teeth: number;
  module: number; // mm
  pressureAngle: number; // degrees
  thickness: number; // mm
  holeD: number; // bore diameter mm
}

function toRad(deg: number) { return (deg * Math.PI) / 180; }

function buildGearPath(teeth: number, module: number, pressureAngle: number): string {
  const pa = toRad(pressureAngle);
  const pitchR = (module * teeth) / 2;
  const addendum = module;
  const dedendum = 1.25 * module;
  const outerR = pitchR + addendum;
  const rootR = pitchR - dedendum;

  // Involute helper
  function involute(r: number, t: number): [number, number] {
    return [r * (Math.cos(t) + t * Math.sin(t)), r * (Math.sin(t) - t * Math.cos(t))];
  }

  const baseR = pitchR * Math.cos(pa);
  const toothAngle = (2 * Math.PI) / teeth;
  const steps = 8;
  const tMax = Math.sqrt((outerR / baseR) ** 2 - 1);

  let d = '';
  for (let i = 0; i < teeth; i++) {
    const offset = i * toothAngle;
    // Right flank
    for (let s = 0; s <= steps; s++) {
      const t = (s / steps) * tMax;
      const [x, y] = involute(baseR, t);
      const angle = Math.atan2(y, x) + offset;
      const r = Math.hypot(x, y);
      const px = r * Math.cos(angle);
      const py = r * Math.sin(angle);
      d += s === 0 && i === 0 ? `M ${px.toFixed(3)},${py.toFixed(3)} ` : `L ${px.toFixed(3)},${py.toFixed(3)} `;
    }
    // Left flank (mirror)
    for (let s = steps; s >= 0; s--) {
      const t = (s / steps) * tMax;
      const [x, y] = involute(baseR, t);
      const angle = -Math.atan2(y, x) + offset + toothAngle;
      const r = Math.hypot(x, y);
      const px = r * Math.cos(angle);
      const py = r * Math.sin(angle);
      d += `L ${px.toFixed(3)},${py.toFixed(3)} `;
    }
  }
  d += 'Z';
  return d;
}

function buildGearSvg(p: GearParams): string {
  const pitchR = (p.module * p.teeth) / 2;
  const outerR = pitchR + p.module;
  const size = (outerR + 4) * 2;
  const cx = size / 2;
  const cy = size / 2;

  const gearPath = buildGearPath(p.teeth, p.module, p.pressureAngle);
  const holeR = p.holeD / 2;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size.toFixed(1)} ${size.toFixed(1)}" width="${size.toFixed(1)}mm" height="${size.toFixed(1)}mm">
  <title>Spur gear — ${p.teeth} teeth, module ${p.module}</title>
  <!-- Pitch circle r=${pitchR.toFixed(2)}mm  Outer r=${outerR.toFixed(2)}mm  Bore d=${p.holeD}mm -->
  <g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})">
    <path d="${gearPath}" fill="none" stroke="#000000" stroke-width="0.5"/>
    ${holeR > 0 ? `<circle r="${holeR.toFixed(2)}" fill="none" stroke="#000000" stroke-width="0.5"/>` : ''}
  </g>
</svg>`;
}

export default function GearGeneratorPage() {
  const [params, setParams] = useState<GearParams>({
    teeth: 20,
    module: 2,
    pressureAngle: 20,
    thickness: 5,
    holeD: 6,
  });
  const [svg, setSvg] = useState<string>('');
  const [generated, setGenerated] = useState(false);

  function set(key: keyof GearParams, value: number) {
    setParams((p) => ({ ...p, [key]: value }));
    setGenerated(false);
  }

  function generate() {
    setSvg(buildGearSvg(params));
    setGenerated(true);
  }

  function download() {
    if (!svg) return;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gear-${params.teeth}t-m${params.module}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const pitchD = params.module * params.teeth;
  const outerD = pitchD + 2 * params.module;
  const rootD = pitchD - 2.5 * params.module;

  return (
    <div className="flex min-h-svh flex-col bg-bg-primary">
      <main className="flex-1 py-10">
        <div className="wrap">
          <div className="mb-6">
            <Link href="/tools" className="text-[13px] text-text-tertiary hover:text-accent">← All tools</Link>
            <h1 className="mt-2 text-[28px] font-bold text-text-primary">Gear Generator</h1>
            <p className="mt-1 text-[15px] text-text-secondary">Generate involute spur gear profiles as cut-ready SVG.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            {/* Controls */}
            <div className="space-y-4 rounded-[var(--radius-xl)] bg-bg-secondary p-5 shadow-[var(--shadow-1)]">
              {([
                { key: 'teeth', label: 'Number of teeth', min: 5, max: 200, step: 1 },
                { key: 'module', label: 'Module (mm)', min: 0.5, max: 10, step: 0.5 },
                { key: 'pressureAngle', label: 'Pressure angle (°)', min: 14.5, max: 25, step: 0.5 },
                { key: 'thickness', label: 'Thickness (mm)', min: 1, max: 50, step: 1 },
                { key: 'holeD', label: 'Bore diameter (mm)', min: 0, max: 50, step: 0.5 },
              ] as const).map(({ key, label, min, max, step }) => (
                <div key={key}>
                  <label className="mb-1 block text-[13px] font-medium text-text-primary">{label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range" min={min} max={max} step={step}
                      value={params[key]}
                      onChange={(e) => set(key, parseFloat(e.target.value))}
                      className="flex-1 accent-accent"
                    />
                    <input
                      type="number" min={min} max={max} step={step}
                      value={params[key]}
                      onChange={(e) => set(key, parseFloat(e.target.value) || min)}
                      className="w-16 rounded border border-[var(--border)] bg-bg-primary px-2 py-1 text-[13px] text-text-primary"
                    />
                  </div>
                </div>
              ))}

              <div className="border-t border-[var(--border)] pt-4">
                <p className="mb-2 text-[12px] font-medium text-text-tertiary uppercase tracking-wide">Calculated dimensions</p>
                <dl className="space-y-1 text-[13px]">
                  <div className="flex justify-between"><dt className="text-text-secondary">Pitch diameter</dt><dd className="font-medium text-text-primary">{pitchD.toFixed(2)} mm</dd></div>
                  <div className="flex justify-between"><dt className="text-text-secondary">Outer diameter</dt><dd className="font-medium text-text-primary">{outerD.toFixed(2)} mm</dd></div>
                  <div className="flex justify-between"><dt className="text-text-secondary">Root diameter</dt><dd className="font-medium text-text-primary">{rootD.toFixed(2)} mm</dd></div>
                </dl>
              </div>

              <button
                onClick={generate}
                className="w-full rounded-[var(--radius-md)] bg-accent px-4 py-2.5 text-[14px] font-medium text-white hover:bg-accent/90"
              >
                Generate gear
              </button>
              {generated && (
                <button
                  onClick={download}
                  className="w-full rounded-[var(--radius-md)] border border-[var(--border)] px-4 py-2.5 text-[14px] font-medium text-text-secondary hover:bg-bg-tertiary"
                >
                  Download SVG
                </button>
              )}
            </div>

            {/* Preview */}
            <div className="flex min-h-[320px] items-center justify-center rounded-[var(--radius-xl)] bg-bg-secondary shadow-[var(--shadow-1)]">
              {generated && svg ? (
                <div
                  className="max-h-[480px] max-w-full p-4"
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              ) : (
                <p className="text-[14px] text-text-tertiary">Configure parameters and click Generate</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
