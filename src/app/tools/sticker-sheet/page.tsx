'use client';

import { useState } from 'react';
import Link from 'next/link';

interface StickerParams {
  cols: number;
  rows: number;
  stickerW: number;   // mm
  stickerH: number;   // mm
  bleed: number;      // mm
  cornerR: number;    // mm — rounded corners on cut line
  gap: number;        // mm between stickers
  sheetW: number;
  sheetH: number;
}

function buildStickerSvg(p: StickerParams): string {
  const { cols, rows, stickerW, stickerH, bleed, cornerR, gap, sheetW, sheetH } = p;

  const totalW = cols * (stickerW + gap) - gap;
  const totalH = rows * (stickerH + gap) - gap;
  const offsetX = (sheetW - totalW) / 2;
  const offsetY = (sheetH - totalH) / 2;

  const rects: string[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = offsetX + c * (stickerW + gap);
      const y = offsetY + r * (stickerH + gap);

      // Print area (bleed included)
      rects.push(`<rect x="${(x - bleed).toFixed(2)}" y="${(y - bleed).toFixed(2)}" width="${(stickerW + bleed * 2).toFixed(2)}" height="${(stickerH + bleed * 2).toFixed(2)}" rx="${cornerR}" ry="${cornerR}" fill="none" stroke="#ff0000" stroke-width="0.1" stroke-dasharray="1,1" opacity="0.4"/>`);
      // Cut line
      rects.push(`<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${stickerW.toFixed(2)}" height="${stickerH.toFixed(2)}" rx="${cornerR}" ry="${cornerR}" fill="none" stroke="#000000" stroke-width="0.5"/>`);
    }
  }

  // Sheet outline
  const sheet = `<rect x="0" y="0" width="${sheetW}" height="${sheetH}" fill="none" stroke="#999" stroke-width="0.5"/>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${sheetW} ${sheetH}" width="${sheetW}mm" height="${sheetH}mm">
  <title>Sticker sheet — ${cols}×${rows} stickers, ${stickerW}×${stickerH}mm</title>
  <!-- Cut lines: black 0.5pt — Bleed: red dashed — Sheet: ${sheetW}×${sheetH}mm -->
  ${sheet}
  ${rects.join('\n  ')}
</svg>`;
}

export default function StickerSheetPage() {
  const [params, setParams] = useState<StickerParams>({
    cols: 4,
    rows: 5,
    stickerW: 50,
    stickerH: 50,
    bleed: 2,
    cornerR: 3,
    gap: 3,
    sheetW: 210,
    sheetH: 297,
  });
  const [svg, setSvg] = useState('');
  const [generated, setGenerated] = useState(false);

  function set<K extends keyof StickerParams>(key: K, value: number) {
    setParams((p) => ({ ...p, [key]: value }));
    setGenerated(false);
  }

  function generate() {
    setSvg(buildStickerSvg(params));
    setGenerated(true);
  }

  function download() {
    if (!svg) return;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sticker-sheet-${params.cols}x${params.rows}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalStickers = params.cols * params.rows;

  return (
    <div className="flex min-h-svh flex-col bg-bg-primary">
      <main className="flex-1 py-10">
        <div className="wrap">
          <div className="mb-6">
            <Link href="/tools" className="text-[13px] text-text-tertiary hover:text-accent">← All tools</Link>
            <h1 className="mt-2 text-[28px] font-bold text-text-primary">Sticker Sheet Maker</h1>
            <p className="mt-1 text-[15px] text-text-secondary">Generate a print-and-cut sticker sheet with bleed and cut lines.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="space-y-4 rounded-[var(--radius-xl)] bg-bg-secondary p-5 shadow-[var(--shadow-1)]">
              <div>
                <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-text-tertiary">Sheet size</p>
                <div className="grid grid-cols-2 gap-2">
                  {([['sheetW', 'Width (mm)'], ['sheetH', 'Height (mm)']] as const).map(([key, label]) => (
                    <div key={key}>
                      <label className="mb-1 block text-[12px] text-text-tertiary">{label}</label>
                      <input type="number" min={50} max={1200} value={params[key]}
                        onChange={(e) => set(key, Number(e.target.value))}
                        className="w-full rounded border border-[var(--border)] bg-bg-primary px-2 py-1.5 text-[13px] text-text-primary"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-text-tertiary">Grid</p>
                <div className="grid grid-cols-2 gap-2">
                  {([['cols', 'Columns'], ['rows', 'Rows']] as const).map(([key, label]) => (
                    <div key={key}>
                      <label className="mb-1 block text-[12px] text-text-tertiary">{label}</label>
                      <input type="number" min={1} max={20} value={params[key]}
                        onChange={(e) => set(key, Number(e.target.value))}
                        className="w-full rounded border border-[var(--border)] bg-bg-primary px-2 py-1.5 text-[13px] text-text-primary"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-text-tertiary">Sticker</p>
                <div className="space-y-2">
                  {([
                    ['stickerW', 'Width (mm)', 10, 300],
                    ['stickerH', 'Height (mm)', 10, 300],
                    ['bleed', 'Bleed (mm)', 0, 10],
                    ['cornerR', 'Corner radius (mm)', 0, 20],
                    ['gap', 'Gap between (mm)', 1, 20],
                  ] as const).map(([key, label, min, max]) => (
                    <div key={key}>
                      <label className="mb-1 block text-[12px] text-text-tertiary">{label}</label>
                      <div className="flex items-center gap-2">
                        <input type="range" min={min} max={max} step={0.5} value={params[key]}
                          onChange={(e) => set(key, parseFloat(e.target.value))}
                          className="flex-1 accent-accent"
                        />
                        <input type="number" min={min} max={max} step={0.5} value={params[key]}
                          onChange={(e) => set(key, parseFloat(e.target.value))}
                          className="w-14 rounded border border-[var(--border)] bg-bg-primary px-2 py-1 text-[13px] text-text-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between rounded bg-bg-primary px-3 py-2 text-[13px]">
                <span className="text-text-secondary">Total stickers</span>
                <span className="font-bold text-text-primary">{totalStickers}</span>
              </div>

              <button onClick={generate}
                className="w-full rounded-[var(--radius-md)] bg-accent px-4 py-2.5 text-[14px] font-medium text-white hover:bg-accent/90"
              >Generate sheet</button>
              {generated && (
                <button onClick={download}
                  className="w-full rounded-[var(--radius-md)] border border-[var(--border)] px-4 py-2.5 text-[14px] font-medium text-text-secondary hover:bg-bg-tertiary"
                >Download SVG</button>
              )}
            </div>

            <div className="flex min-h-[280px] items-center justify-center rounded-[var(--radius-xl)] bg-bg-secondary shadow-[var(--shadow-1)]">
              {generated && svg ? (
                <div className="max-h-[560px] max-w-full overflow-auto p-4"
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              ) : (
                <div className="text-center">
                  <p className="text-[14px] text-text-tertiary">Configure and click Generate</p>
                  <p className="mt-1 text-[12px] text-text-tertiary">Black lines = cut path · Red dashed = bleed</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
