'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function VectorGridGeneratorPage() {
  const [cellSize, setCellSize] = useState(20);
  const [columns, setColumns] = useState(20);
  const [rows, setRows] = useState(20);
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [strokeColor, setStrokeColor] = useState('#cccccc');
  const [subdivisions, setSubdivisions] = useState(0);

  const generateGrid = () => {
    const width = columns * cellSize;
    const height = rows * cellSize;
    let paths = '';

    // Vertical lines
    for (let i = 0; i <= columns; i++) {
      const x = i * cellSize;
      const isMain = subdivisions > 0 ? i % (subdivisions + 1) === 0 : true;
      const weight = isMain ? strokeWidth : strokeWidth * 0.5;
      paths += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="${strokeColor}" stroke-width="${weight}" />\n`;
    }

    // Horizontal lines
    for (let i = 0; i <= rows; i++) {
      const y = i * cellSize;
      const isMain = subdivisions > 0 ? i % (subdivisions + 1) === 0 : true;
      const weight = isMain ? strokeWidth : strokeWidth * 0.5;
      paths += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="${strokeColor}" stroke-width="${weight}" />\n`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n${paths}</svg>`;
  };

  const downloadGrid = () => {
    const svg = generateGrid();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grid-${columns}x${rows}-${cellSize}px.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <nav aria-label="Breadcrumb" className="border-b border-[#E5E8EB] bg-white">
        <div className="wrap py-3 text-[13.5px] text-[#718096]">
          <Link href="/" className="hover:text-[#1A202C]">
            Home
          </Link>
          <span aria-hidden="true"> / </span>
          <Link href="/tools" className="hover:text-[#1A202C]">
            Tools
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="text-[#4A5568]">Vector Grid Generator</span>
        </div>
      </nav>

      <div className="wrap py-12">
        <header className="mb-8">
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold mb-3 tracking-[-0.02em]">
            Vector Grid Generator
          </h1>
          <p className="text-[1.0625rem] text-text-secondary max-w-2xl">
            Generate customizable vector grids for design layouts, mockups, and technical drawings. Configure
            spacing, line weight, and subdivisions, then export as clean SVG.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border border-border-subtle">
              <h2 className="text-[1.125rem] font-semibold mb-4">Grid Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-[0.875rem] font-medium mb-2">Cell Size (px)</label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={cellSize}
                    onChange={(e) => setCellSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-[0.875rem] text-text-tertiary mt-1">{cellSize}px</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.875rem] font-medium mb-2">Columns</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={columns}
                      onChange={(e) => setColumns(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.875rem] font-medium mb-2">Rows</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={rows}
                      onChange={(e) => setRows(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium mb-2">Stroke Width</label>
                  <input
                    type="range"
                    min="0.25"
                    max="5"
                    step="0.25"
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-[0.875rem] text-text-tertiary mt-1">{strokeWidth}px</div>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium mb-2">Stroke Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={strokeColor}
                      onChange={(e) => setStrokeColor(e.target.value)}
                      className="w-16 h-10 rounded-lg border border-border-strong cursor-pointer"
                    />
                    <input
                      type="text"
                      value={strokeColor}
                      onChange={(e) => setStrokeColor(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-border-strong bg-white text-[0.9375rem] font-mono focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium mb-2">Subdivisions</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={subdivisions}
                    onChange={(e) => setSubdivisions(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-[0.875rem] text-text-tertiary mt-1">
                    {subdivisions === 0 ? 'None' : `${subdivisions} per cell`}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-bg-secondary border border-border-subtle">
              <div className="text-[0.875rem] text-text-secondary space-y-1">
                <p>
                  <strong>Grid Size:</strong> {columns * cellSize} × {rows * cellSize}px
                </p>
                <p>
                  <strong>Total Cells:</strong> {columns * rows}
                </p>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border border-border-subtle">
              <h2 className="text-[1.125rem] font-semibold mb-4">Preview</h2>
              <div className="aspect-square bg-bg-secondary rounded-lg flex items-center justify-center overflow-auto p-4">
                <div
                  dangerouslySetInnerHTML={{ __html: generateGrid() }}
                  className="max-w-full max-h-full"
                />
              </div>
            </div>

            <button
              onClick={downloadGrid}
              className="w-full h-11 rounded-full bg-accent text-white font-semibold hover:bg-accent-hover transition-colors"
            >
              Download Grid SVG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
