'use client';

import { useState } from 'react';
import Link from 'next/link';

interface HingeParams {
  width: number;   // mm
  height: number;  // mm
  kerf: number;    // mm
  gap: number;     // mm — gap between cuts
  cuts: number;    // cut rows across width
  pattern: 'straight' | 'staggered';
}

function buildHingeSvg(p: HingeParams): string {
  const { width, height, kerf, gap, cuts, pattern } = p;

  const colSpacing = width / (cuts + 1);
  const lines: string[] = [];

  for (let col = 0; col < cuts; col++) {
    const x = colSpacing * (col + 1);
    const offset = pattern === 'staggered' && col % 2 === 1 ? gap / 2 : 0;
    // Alternate short cuts to create living hinge flex zones
    let y = offset;
    let cut = true;
    while (y < height) {
      const end = Math.min(y + (cut ? gap * 3 : gap), height);
      if (cut) {
        lines.push(`<line x1="${x.toFixed(2)}" y1="${y.toFixed(2)}" x2="${x.toFixed(2)}" y2="${end.toFixed(2)}" />`);
      }
      y = end;
      cut = !cut;
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}mm" height="${height}mm">
  <title>Living hinge ${width}×${height}mm — ${cuts} cut columns, ${kerf}mm kerf</title>
  <!-- Living hinge pattern — kerf=${kerf}mm gap=${gap}mm pattern=${pattern} -->
  <rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="#000" stroke-width="0.5"/>
  <g stroke="#000000" stroke-width="${kerf}" stroke-linecap="round">
    ${lines.join('\n    ')}
  </g>
</svg>`;
}

export default function LivingHingePage() {
  const [params, setParams] = useState<HingeParams>({
    width: 100,
    height: 60,
    kerf: 0.2,
    gap: 2,
    cuts: 10,
    pattern: 'staggered',
  });
  const [svg, setSvg] = useState('');
  const [generated, setGenerated] = useState(false);

  function set<K extends keyof HingeParams>(key: K, value: HingeParams[K]) {
    setParams((p) => ({ ...p, [key]: value }));
    setGenerated(false);
  }

  function generate() {
    setSvg(buildHingeSvg(params));
    setGenerated(true);
  }

  function download() {
    if (!svg) return;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `living-hinge-${params.width}x${params.height}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalCuts = params.cuts * Math.floor(params.height / (params.gap * 4));

  return (
    <div className="flex min-h-svh flex-col bg-bg-primary">
      <main className="flex-1 py-10">
        <div className="wrap">
          <div className="mb-6">
            <Link href="/tools" className="text-[13px] text-text-tertiary hover:text-accent">← All tools</Link>
            <h1 className="mt-2 text-[28px] font-bold text-text-primary">Living Hinge Generator</h1>
            <p className="mt-1 text-[15px] text-text-secondary">Generate kerf-bending living hinge patterns for laser cutting.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="space-y-4 rounded-[var(--radius-xl)] bg-bg-secondary p-5 shadow-[var(--shadow-1)]">
              {([
                { key: 'width' as const, label: 'Width (mm)', min: 20, max: 500, step: 5 },
                { key: 'height' as const, label: 'Height (mm)', min: 10, max: 300, step: 5 },
                { key: 'kerf' as const, label: 'Kerf width (mm)', min: 0.05, max: 2, step: 0.05 },
                { key: 'gap' as const, label: 'Cut spacing (mm)', min: 0.5, max: 10, step: 0.5 },
                { key: 'cuts' as const, label: 'Cut columns', min: 2, max: 50, step: 1 },
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

              <div>
                <label className="mb-1 block text-[13px] font-medium text-text-primary">Pattern</label>
                <div className="flex gap-2">
                  {(['straight', 'staggered'] as const).map((p) => (
                    <button key={p} onClick={() => set('pattern', p)}
                      className={`rounded-full border px-3 py-1 text-[13px] capitalize transition-colors ${params.pattern === p ? 'border-accent bg-accent/10 text-accent' : 'border-[var(--border)] text-text-secondary'}`}
                    >{p}</button>
                  ))}
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-4 text-[13px]">
                <div className="flex justify-between text-text-secondary">
                  <span>Approx. cut count</span>
                  <span className="font-medium text-text-primary">~{totalCuts}</span>
                </div>
              </div>

              <button onClick={generate}
                className="w-full rounded-[var(--radius-md)] bg-accent px-4 py-2.5 text-[14px] font-medium text-white hover:bg-accent/90"
              >Generate hinge</button>
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
