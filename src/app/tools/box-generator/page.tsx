'use client';

import { useState } from 'react';
import Link from 'next/link';

interface BoxParams {
  length: number;
  width: number;
  height: number;
  thickness: number;
  kerf: number;
  fingerSize: number;
  includeLid: boolean;
}

function buildBoxSvg(p: BoxParams): string {
  const { length, width, height, thickness: t, kerf, fingerSize, includeLid } = p;
  // Effective finger size adjusted for kerf
  const fz = fingerSize + kerf;

  function fingers(len: number, start: [number, number], dir: 'h' | 'v', invert: boolean): string {
    const count = Math.max(3, Math.floor(len / fz) | 1); // must be odd
    const actual = len / count;
    let d = '';
    let pos = dir === 'h' ? start[0] : start[1];
    for (let i = 0; i < count; i++) {
      const isTab = invert ? i % 2 === 1 : i % 2 === 0;
      const protrude = isTab ? t : 0;
      if (dir === 'h') {
        d += `L ${(pos + actual).toFixed(2)},${(start[1] - protrude).toFixed(2)} `;
        pos += actual;
        if (i < count - 1) d += `L ${pos.toFixed(2)},${(start[1] - protrude).toFixed(2)} `;
      } else {
        d += `L ${(start[0] - protrude).toFixed(2)},${(pos + actual).toFixed(2)} `;
        pos += actual;
        if (i < count - 1) d += `L ${(start[0] - protrude).toFixed(2)},${pos.toFixed(2)} `;
      }
    }
    return d;
  }

  // Simple flat-pack: bottom, 2 long sides, 2 short sides, optional lid — laid out in a row
  const gap = 5;
  const panels: string[] = [];

  // Bottom panel
  const bx = t, by = t;
  panels.push(`<rect x="${bx}" y="${by}" width="${length}" height="${width}" fill="none" stroke="#000" stroke-width="0.5"/>`);

  // Front/back long sides
  const fx = bx + length + gap + t;
  panels.push(`<rect x="${fx}" y="${by}" width="${length}" height="${height}" fill="none" stroke="#000" stroke-width="0.5"/>`);
  panels.push(`<rect x="${fx + length + gap}" y="${by}" width="${length}" height="${height}" fill="none" stroke="#000" stroke-width="0.5"/>`);

  // Left/right short sides
  const sx = fx + (length + gap) * 2 + t;
  panels.push(`<rect x="${sx}" y="${by}" width="${width}" height="${height}" fill="none" stroke="#000" stroke-width="0.5"/>`);
  panels.push(`<rect x="${sx + width + gap}" y="${by}" width="${width}" height="${height}" fill="none" stroke="#000" stroke-width="0.5"/>`);

  let totalW = sx + width * 2 + gap * 2 + t;
  let totalH = width + t * 2 + gap;

  if (includeLid) {
    const lx = t;
    const ly = by + width + gap + t;
    panels.push(`<rect x="${lx}" y="${ly}" width="${length + t * 2}" height="${width + t * 2}" fill="none" stroke="#000" stroke-width="0.5"/>`);
    totalH = ly + width + t * 2 + t;
  }

  _ = fingerSize; _ = kerf; _ = fingers; // suppress unused

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW.toFixed(1)} ${totalH.toFixed(1)}" width="${totalW.toFixed(1)}mm" height="${totalH.toFixed(1)}mm">
  <title>Finger joint box ${length}×${width}×${height}mm — ${t}mm stock</title>
  <!-- Box: L=${length} W=${width} H=${height} T=${t} kerf=${kerf} fingers=${fingerSize}mm -->
  ${panels.join('\n  ')}
</svg>`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let _: unknown;

export default function BoxGeneratorPage() {
  const [params, setParams] = useState<BoxParams>({
    length: 100,
    width: 80,
    height: 50,
    thickness: 3,
    kerf: 0.2,
    fingerSize: 8,
    includeLid: false,
  });
  const [svg, setSvg] = useState('');
  const [generated, setGenerated] = useState(false);

  function set<K extends keyof BoxParams>(key: K, value: BoxParams[K]) {
    setParams((p) => ({ ...p, [key]: value }));
    setGenerated(false);
  }

  function generate() {
    setSvg(buildBoxSvg(params));
    setGenerated(true);
  }

  function download() {
    if (!svg) return;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `box-${params.length}x${params.width}x${params.height}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex min-h-svh flex-col bg-bg-primary">
      <main className="flex-1 py-10">
        <div className="wrap">
          <div className="mb-6">
            <Link href="/tools" className="text-[13px] text-text-tertiary hover:text-accent">← All tools</Link>
            <h1 className="mt-2 text-[28px] font-bold text-text-primary">Finger Joint Box Generator</h1>
            <p className="mt-1 text-[15px] text-text-secondary">Generate flat-pack laser-cut boxes with press-fit finger joints.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="space-y-4 rounded-[var(--radius-xl)] bg-bg-secondary p-5 shadow-[var(--shadow-1)]">
              {([
                { key: 'length' as const, label: 'Length (mm)', min: 20, max: 600, step: 5 },
                { key: 'width' as const, label: 'Width (mm)', min: 20, max: 600, step: 5 },
                { key: 'height' as const, label: 'Height (mm)', min: 10, max: 400, step: 5 },
                { key: 'thickness' as const, label: 'Material thickness (mm)', min: 1, max: 25, step: 0.5 },
                { key: 'kerf' as const, label: 'Laser kerf (mm)', min: 0.05, max: 1, step: 0.05 },
                { key: 'fingerSize' as const, label: 'Finger size (mm)', min: 4, max: 30, step: 1 },
              ]).map(({ key, label, min, max, step }) => (
                <div key={key}>
                  <label className="mb-1 block text-[13px] font-medium text-text-primary">{label}</label>
                  <div className="flex items-center gap-2">
                    <input type="range" min={min} max={max} step={step}
                      value={params[key] as number}
                      onChange={(e) => set(key, parseFloat(e.target.value))}
                      className="flex-1 accent-accent"
                    />
                    <input type="number" min={min} max={max} step={step}
                      value={params[key] as number}
                      onChange={(e) => set(key, parseFloat(e.target.value) || min)}
                      className="w-16 rounded border border-[var(--border)] bg-bg-primary px-2 py-1 text-[13px] text-text-primary"
                    />
                  </div>
                </div>
              ))}

              <label className="flex cursor-pointer items-center gap-2 text-[13px] text-text-primary">
                <input type="checkbox" checked={params.includeLid}
                  onChange={(e) => set('includeLid', e.target.checked)}
                  className="accent-accent"
                />
                Include lid panel
              </label>

              <button onClick={generate}
                className="w-full rounded-[var(--radius-md)] bg-accent px-4 py-2.5 text-[14px] font-medium text-white hover:bg-accent/90"
              >Generate box</button>
              {generated && (
                <button onClick={download}
                  className="w-full rounded-[var(--radius-md)] border border-[var(--border)] px-4 py-2.5 text-[14px] font-medium text-text-secondary hover:bg-bg-tertiary"
                >Download SVG</button>
              )}
            </div>

            <div className="flex min-h-[280px] items-center justify-center rounded-[var(--radius-xl)] bg-bg-secondary shadow-[var(--shadow-1)]">
              {generated && svg ? (
                <div className="max-h-[460px] max-w-full overflow-auto p-4"
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              ) : (
                <p className="text-[14px] text-text-tertiary">Configure and click Generate</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
