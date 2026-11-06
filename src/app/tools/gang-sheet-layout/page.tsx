'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Design {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

export default function GangSheetLayoutPage() {
  const [sheetWidth, setSheetWidth] = useState(22);
  const [sheetHeight, setSheetHeight] = useState(28);
  const [spacing, setSpacing] = useState(0.5);
  const [designWidth, setDesignWidth] = useState(4);
  const [designHeight, setDesignHeight] = useState(4);
  const [quantity, setQuantity] = useState(12);

  const calculateLayout = () => {
    const designs: Design[] = [];
    let x = spacing;
    let y = spacing;
    let rowHeight = 0;

    for (let i = 0; i < quantity; i++) {
      if (x + designWidth + spacing > sheetWidth) {
        x = spacing;
        y += rowHeight + spacing;
        rowHeight = 0;
      }

      if (y + designHeight + spacing <= sheetHeight) {
        designs.push({
          id: `design-${i}`,
          width: designWidth,
          height: designHeight,
          x,
          y,
        });
        x += designWidth + spacing;
        rowHeight = Math.max(rowHeight, designHeight);
      }
    }

    return designs;
  };

  const designs = calculateLayout();
  const efficiency = ((designs.length * designWidth * designHeight) / (sheetWidth * sheetHeight)) * 100;

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <nav aria-label="Breadcrumb" className="border-b border-[#E5E8EB] bg-white">
        <div className="wrap py-3 text-[13.5px] text-[#718096]">
          <Link href="/" className="hover:text-[#1A202C]">Home</Link>
          <span aria-hidden="true"> / </span>
          <Link href="/tools" className="hover:text-[#1A202C]">Tools</Link>
          <span aria-hidden="true"> / </span>
          <span className="text-[#4A5568]">Gang Sheet Layout</span>
        </div>
      </nav>

      <div className="wrap py-12">
        <header className="mb-8">
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold mb-3 tracking-[-0.02em]">
            Gang Sheet Layout Tool
          </h1>
          <p className="text-[1.0625rem] text-text-secondary max-w-2xl">
            Optimize gang sheet layouts for DTF, screen printing, and sublimation. Auto-nest designs, maximize
            material usage, and reduce waste.
          </p>
        </header>

        <div className="grid lg:grid-cols-[350px_1fr] gap-6">
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border border-border-subtle">
              <h2 className="text-[1.125rem] font-semibold mb-4">Sheet Settings</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.875rem] font-medium mb-2">Width (in)</label>
                    <input
                      type="number"
                      min="1"
                      max="48"
                      step="0.5"
                      value={sheetWidth}
                      onChange={(e) => setSheetWidth(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.875rem] font-medium mb-2">Height (in)</label>
                    <input
                      type="number"
                      min="1"
                      max="48"
                      step="0.5"
                      value={sheetHeight}
                      onChange={(e) => setSheetHeight(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium mb-2">Spacing (in)</label>
                  <input
                    type="number"
                    min="0"
                    max="2"
                    step="0.25"
                    value={spacing}
                    onChange={(e) => setSpacing(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white border border-border-subtle">
              <h2 className="text-[1.125rem] font-semibold mb-4">Design Settings</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.875rem] font-medium mb-2">Width (in)</label>
                    <input
                      type="number"
                      min="0.5"
                      max="20"
                      step="0.25"
                      value={designWidth}
                      onChange={(e) => setDesignWidth(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.875rem] font-medium mb-2">Height (in)</label>
                    <input
                      type="number"
                      min="0.5"
                      max="20"
                      step="0.25"
                      value={designHeight}
                      onChange={(e) => setDesignHeight(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium mb-2">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-bg-secondary border border-border-subtle">
              <div className="text-[0.875rem] space-y-2">
                <p>
                  <strong>Designs Fit:</strong> {designs.length} of {quantity}
                </p>
                <p>
                  <strong>Material Efficiency:</strong> {efficiency.toFixed(1)}%
                </p>
                <p>
                  <strong>Sheet Area:</strong> {(sheetWidth * sheetHeight).toFixed(1)} in²
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border border-border-subtle">
              <h2 className="text-[1.125rem] font-semibold mb-4">Layout Preview</h2>
              <div className="aspect-[8.5/11] bg-bg-secondary rounded-lg p-4 overflow-auto">
                <svg
                  viewBox={`0 0 ${sheetWidth} ${sheetHeight}`}
                  className="w-full h-full border border-border-subtle bg-white"
                >
                  <rect width={sheetWidth} height={sheetHeight} fill="white" stroke="#ddd" />
                  {designs.map((design) => (
                    <g key={design.id}>
                      <rect
                        x={design.x}
                        y={design.y}
                        width={design.width}
                        height={design.height}
                        fill="#4F46E5"
                        fillOpacity="0.2"
                        stroke="#4F46E5"
                        strokeWidth="0.05"
                      />
                      <text
                        x={design.x + design.width / 2}
                        y={design.y + design.height / 2}
                        fontSize="0.5"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#4F46E5"
                      >
                        {design.id.split('-')[1]}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {designs.length < quantity && (
              <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                <p className="text-[0.875rem] text-yellow-900">
                  ⚠ Only {designs.length} of {quantity} designs fit on this sheet. Consider using a larger
                  sheet, smaller designs, or reducing spacing.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
