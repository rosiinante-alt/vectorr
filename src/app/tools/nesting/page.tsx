'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

interface Rect { x: number; y: number; w: number; h: number; label: string; }

interface NestingParams {
  sheetW: number;
  sheetH: number;
  spacing: number;
  parts: Array<{ w: number; h: number; qty: number; label: string }>;
}

function nestRects(p: NestingParams): { placed: Rect[]; waste: number } {
  const { sheetW, sheetH, spacing: sp } = p;
  const placed: Rect[] = [];

  // Simple strip-packing (shelf algorithm)
  let curX = sp;
  let curY = sp;
  let rowH = 0;

  for (const part of p.parts) {
    for (let q = 0; q < part.qty; q++) {
      const w = part.w + sp;
      const h = part.h + sp;

      if (curX + w > sheetW - sp) {
        // next row
        curX = sp;
        curY += rowH;
        rowH = 0;
      }
      if (curY + h > sheetH - sp) break; // out of sheet space

      placed.push({ x: curX, y: curY, w: part.w, h: part.h, label: part.label });
      curX += w;
      rowH = Math.max(rowH, h);
    }
  }

  const usedArea = placed.reduce((acc, r) => acc + r.w * r.h, 0);
  const waste = Math.round((1 - usedArea / (sheetW * sheetH)) * 100);

  return { placed, waste };
}

function buildNestingSvg(p: NestingParams, placed: Rect[]): string {
  const scale = Math.min(400 / p.sheetW, 300 / p.sheetH);
  const W = (p.sheetW * scale).toFixed(1);
  const H = (p.sheetH * scale).toFixed(1);

  const colors = ['#4A90D9', '#E85D6A', '#27AE60', '#F5A623', '#9B59B6', '#1ABC9C'];
  const labels = [...new Set(placed.map((r) => r.label))];

  const rects = placed.map((r, i) => {
    const color = colors[labels.indexOf(r.label) % colors.length];
    const x = (r.x * scale).toFixed(2);
    const y = (r.y * scale).toFixed(2);
    const w = (r.w * scale).toFixed(2);
    const h = (r.h * scale).toFixed(2);
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" fill-opacity="0.3" stroke="${color}" stroke-width="0.5"/>
    <text x="${(r.x * scale + r.w * scale / 2).toFixed(1)}" y="${(r.y * scale + r.h * scale / 2 + 2).toFixed(1)}" text-anchor="middle" font-size="${Math.max(5, Math.min(10, r.w * scale / 3)).toFixed(0)}" fill="${color}">${r.label} ${i + 1}</text>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}px" height="${H}px">
  <rect x="0" y="0" width="${W}" height="${H}" fill="#f5f5f5" stroke="#999" stroke-width="0.5"/>
  ${rects.join('\n  ')}
</svg>`;
}

const DEFAULT_PARTS = [
  { w: 80, h: 50, qty: 4, label: 'A' },
  { w: 60, h: 40, qty: 6, label: 'B' },
  { w: 30, h: 30, qty: 10, label: 'C' },
];

export default function NestingPage() {
  const [sheetW, setSheetW] = useState(600);
  const [sheetH, setSheetH] = useState(400);
  const [spacing, setSpacing] = useState(2);
  const [parts, setParts] = useState(DEFAULT_PARTS);
  const [result, setResult] = useState<{ svg: string; waste: number; placed: number } | null>(null);

  const updatePart = useCallback((i: number, key: keyof typeof parts[0], value: string | number) => {
    setParts((prev) => prev.map((p, idx) => idx === i ? { ...p, [key]: value } : p));
    setResult(null);
  }, []);

  function addPart() {
    const nextLabel = String.fromCharCode(65 + parts.length % 26);
    setParts((p) => [...p, { w: 50, h: 40, qty: 2, label: nextLabel }]);
  }

  function removePart(i: number) {
    setParts((p) => p.filter((_, idx) => idx !== i));
    setResult(null);
  }

  function nest() {
    const p: NestingParams = { sheetW, sheetH, spacing, parts };
    const { placed, waste } = nestRects(p);
    const svg = buildNestingSvg(p, placed);
    setResult({ svg, waste, placed: placed.length });
  }

  function download() {
    if (!result) return;
    const blob = new Blob([result.svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nesting-layout.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex min-h-svh flex-col bg-bg-primary">
      <main className="flex-1 py-10">
        <div className="wrap">
          <div className="mb-6">
            <Link href="/tools" className="text-[13px] text-text-tertiary hover:text-accent">← All tools</Link>
            <h1 className="mt-2 text-[28px] font-bold text-text-primary">Nesting Tool</h1>
            <p className="mt-1 text-[15px] text-text-secondary">Pack parts onto your sheet material to minimize waste.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
            <div className="space-y-5 rounded-[var(--radius-xl)] bg-bg-secondary p-5 shadow-[var(--shadow-1)]">
              <div>
                <p className="mb-3 text-[13px] font-semibold text-text-primary">Sheet size</p>
                <div className="grid grid-cols-2 gap-3">
                  {([['sheetW', 'Width (mm)', sheetW, setSheetW], ['sheetH', 'Height (mm)', sheetH, setSheetH]] as const).map(([, label, val, set]) => (
                    <div key={label}>
                      <label className="mb-1 block text-[12px] text-text-tertiary">{label}</label>
                      <input type="number" min={50} max={3000} value={val}
                        onChange={(e) => { (set as (v: number) => void)(Number(e.target.value)); setResult(null); }}
                        className="w-full rounded border border-[var(--border)] bg-bg-primary px-2 py-1.5 text-[13px] text-text-primary"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <label className="mb-1 block text-[12px] text-text-tertiary">Spacing (mm)</label>
                  <input type="number" min={0} max={20} step={0.5} value={spacing}
                    onChange={(e) => { setSpacing(Number(e.target.value)); setResult(null); }}
                    className="w-24 rounded border border-[var(--border)] bg-bg-primary px-2 py-1.5 text-[13px] text-text-primary"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-text-primary">Parts</p>
                  <button onClick={addPart} className="text-[12px] text-accent hover:underline">+ Add part</button>
                </div>
                <div className="space-y-2">
                  {parts.map((part, i) => (
                    <div key={i} className="flex items-center gap-2 rounded border border-[var(--border)] bg-bg-primary px-2 py-1.5">
                      <input type="text" value={part.label} maxLength={4}
                        onChange={(e) => updatePart(i, 'label', e.target.value)}
                        className="w-10 rounded border border-[var(--border)] bg-bg-secondary px-1 py-0.5 text-[12px] text-text-primary text-center"
                      />
                      <input type="number" min={5} max={2000} value={part.w} title="Width mm"
                        onChange={(e) => updatePart(i, 'w', Number(e.target.value))}
                        className="w-14 rounded border border-[var(--border)] bg-bg-secondary px-1 py-0.5 text-[12px] text-text-primary"
                      />
                      <span className="text-[11px] text-text-tertiary">×</span>
                      <input type="number" min={5} max={2000} value={part.h} title="Height mm"
                        onChange={(e) => updatePart(i, 'h', Number(e.target.value))}
                        className="w-14 rounded border border-[var(--border)] bg-bg-secondary px-1 py-0.5 text-[12px] text-text-primary"
                      />
                      <span className="text-[11px] text-text-tertiary">qty</span>
                      <input type="number" min={1} max={200} value={part.qty}
                        onChange={(e) => updatePart(i, 'qty', Number(e.target.value))}
                        className="w-12 rounded border border-[var(--border)] bg-bg-secondary px-1 py-0.5 text-[12px] text-text-primary"
                      />
                      <button onClick={() => removePart(i)} className="ml-auto text-[11px] text-error hover:opacity-70">✕</button>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={nest}
                className="w-full rounded-[var(--radius-md)] bg-accent px-4 py-2.5 text-[14px] font-medium text-white hover:bg-accent/90"
              >Nest parts</button>
              {result && (
                <button onClick={download}
                  className="w-full rounded-[var(--radius-md)] border border-[var(--border)] px-4 py-2.5 text-[14px] font-medium text-text-secondary hover:bg-bg-tertiary"
                >Download SVG</button>
              )}
            </div>

            <div className="rounded-[var(--radius-xl)] bg-bg-secondary shadow-[var(--shadow-1)]">
              {result ? (
                <div className="p-5">
                  <div className="mb-4 flex flex-wrap gap-4 text-[13px]">
                    <div className="rounded bg-bg-primary px-3 py-2">
                      <p className="text-text-tertiary">Placed</p>
                      <p className="text-[16px] font-bold text-text-primary">{result.placed} parts</p>
                    </div>
                    <div className="rounded bg-bg-primary px-3 py-2">
                      <p className="text-text-tertiary">Material waste</p>
                      <p className="text-[16px] font-bold text-text-primary">{result.waste}%</p>
                    </div>
                    <div className="rounded bg-bg-primary px-3 py-2">
                      <p className="text-text-tertiary">Sheet used</p>
                      <p className="text-[16px] font-bold text-text-primary">{100 - result.waste}%</p>
                    </div>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: result.svg }} className="overflow-auto" />
                </div>
              ) : (
                <div className="flex h-full min-h-[280px] items-center justify-center">
                  <p className="text-[14px] text-text-tertiary">Add parts and click Nest</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
