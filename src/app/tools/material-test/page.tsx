'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CardParams {
  cols: number;    // power steps
  rows: number;    // speed steps
  powerMin: number;
  powerMax: number;
  speedMin: number;
  speedMax: number;
  cellSize: number; // mm
  material: string;
}

function buildCardSvg(p: CardParams): string {
  const { cols, rows, powerMin, powerMax, speedMin, speedMax, cellSize, material } = p;
  const margin = 20;
  const labelH = 10;
  const labelW = 18;
  const totalW = margin + labelW + cols * cellSize + margin;
  const totalH = margin + labelH + rows * cellSize + margin;

  const powerStep = (powerMax - powerMin) / (cols - 1 || 1);
  const speedStep = (speedMax - speedMin) / (rows - 1 || 1);

  const cells: string[] = [];
  const colLabels: string[] = [];
  const rowLabels: string[] = [];

  for (let c = 0; c < cols; c++) {
    const power = Math.round(powerMin + c * powerStep);
    const x = margin + labelW + c * cellSize;
    colLabels.push(`<text x="${(x + cellSize / 2).toFixed(1)}" y="${margin + labelH - 2}" text-anchor="middle" font-size="5" fill="#333">${power}%</text>`);
    cells.push(`<text x="${(x + cellSize / 2).toFixed(1)}" y="${margin + labelH / 2 - 1}" text-anchor="middle" font-size="4" fill="#666">P</text>`);
  }

  for (let r = 0; r < rows; r++) {
    const speed = Math.round(speedMin + r * speedStep);
    const y = margin + labelH + r * cellSize;
    rowLabels.push(`<text x="${margin + labelW - 2}" y="${(y + cellSize / 2 + 2).toFixed(1)}" text-anchor="end" font-size="5" fill="#333">${speed}</text>`);
    for (let c = 0; c < cols; c++) {
      const x = margin + labelW + c * cellSize;
      const power = Math.round(powerMin + c * powerStep);
      cells.push(`<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="none" stroke="#999" stroke-width="0.3"/>`);
      cells.push(`<text x="${(x + cellSize / 2).toFixed(1)}" y="${(y + cellSize * 0.55).toFixed(1)}" text-anchor="middle" font-size="4" fill="#aaa">${power}%/${speed}</text>`);
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW.toFixed(1)} ${totalH.toFixed(1)}" width="${totalW.toFixed(1)}mm" height="${totalH.toFixed(1)}mm">
  <title>Material test card — ${material}</title>
  <rect x="0" y="0" width="${totalW.toFixed(1)}" height="${totalH.toFixed(1)}" fill="white" stroke="none"/>
  <text x="${margin + labelW}" y="${margin - 2}" font-size="6" font-weight="bold" fill="#000">${material} — Power (%) × Speed (mm/s)</text>
  ${colLabels.join('\n  ')}
  ${rowLabels.join('\n  ')}
  ${cells.join('\n  ')}
</svg>`;
}

export default function MaterialTestPage() {
  const [params, setParams] = useState<CardParams>({
    cols: 5,
    rows: 5,
    powerMin: 40,
    powerMax: 100,
    speedMin: 10,
    speedMax: 50,
    cellSize: 12,
    material: '3mm Plywood',
  });
  const [svg, setSvg] = useState('');
  const [generated, setGenerated] = useState(false);

  function set<K extends keyof CardParams>(key: K, value: CardParams[K]) {
    setParams((p) => ({ ...p, [key]: value }));
    setGenerated(false);
  }

  function generate() {
    setSvg(buildCardSvg(params));
    setGenerated(true);
  }

  function download() {
    if (!svg) return;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `material-test-${params.material.replace(/\s+/g, '-').toLowerCase()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex min-h-svh flex-col bg-bg-primary">
      <main className="flex-1 py-10">
        <div className="wrap">
          <div className="mb-6">
            <Link href="/tools" className="text-[13px] text-text-tertiary hover:text-accent">← All tools</Link>
            <h1 className="mt-2 text-[28px] font-bold text-text-primary">Material Test Card Generator</h1>
            <p className="mt-1 text-[15px] text-text-secondary">Generate a power/speed test grid to dial in your laser settings.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="space-y-4 rounded-[var(--radius-xl)] bg-bg-secondary p-5 shadow-[var(--shadow-1)]">
              <div>
                <label className="mb-1 block text-[13px] font-medium text-text-primary">Material name</label>
                <input type="text" value={params.material}
                  onChange={(e) => set('material', e.target.value)}
                  className="w-full rounded border border-[var(--border)] bg-bg-primary px-3 py-1.5 text-[13px] text-text-primary"
                  placeholder="e.g. 3mm Plywood"
                />
              </div>

              {([
                { key: 'cols' as const, label: 'Power steps', min: 2, max: 10, step: 1 },
                { key: 'rows' as const, label: 'Speed steps', min: 2, max: 10, step: 1 },
                { key: 'powerMin' as const, label: 'Min power (%)', min: 1, max: 99, step: 1 },
                { key: 'powerMax' as const, label: 'Max power (%)', min: 2, max: 100, step: 1 },
                { key: 'speedMin' as const, label: 'Min speed (mm/s)', min: 1, max: 200, step: 1 },
                { key: 'speedMax' as const, label: 'Max speed (mm/s)', min: 2, max: 500, step: 5 },
                { key: 'cellSize' as const, label: 'Cell size (mm)', min: 8, max: 30, step: 1 },
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

              <button onClick={generate}
                className="w-full rounded-[var(--radius-md)] bg-accent px-4 py-2.5 text-[14px] font-medium text-white hover:bg-accent/90"
              >Generate card</button>
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
