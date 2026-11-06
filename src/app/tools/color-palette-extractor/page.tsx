'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface ColorInfo {
  hex: string;
  rgb: string;
  count: number;
}

export default function ColorPaletteExtractorPage() {
  const [colors, setColors] = useState<ColorInfo[]>([]);
  const [fileName, setFileName] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const colorMap = new Map<string, number>();

        // Sample every 10th pixel for performance
        for (let i = 0; i < imageData.data.length; i += 40) {
          const r = imageData.data[i];
          const g = imageData.data[i + 1];
          const b = imageData.data[i + 2];
          const a = imageData.data[i + 3];

          if (a > 128) {
            const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
            colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
          }
        }

        const sortedColors = Array.from(colorMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 12)
          .map(([hex, count]) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return {
              hex,
              rgb: `rgb(${r}, ${g}, ${b})`,
              count,
            };
          });

        setColors(sortedColors);
      };
      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportPalette = () => {
    const css = colors.map((c, i) => `--color-${i + 1}: ${c.hex};`).join('\n');
    const blob = new Blob([css], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'color-palette.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <nav aria-label="Breadcrumb" className="border-b border-[#E5E8EB] bg-white">
        <div className="wrap py-3 text-[13.5px] text-[#718096]">
          <Link href="/" className="hover:text-[#1A202C]">Home</Link>
          <span aria-hidden="true"> / </span>
          <Link href="/tools" className="hover:text-[#1A202C]">Tools</Link>
          <span aria-hidden="true"> / </span>
          <span className="text-[#4A5568]">Color Palette Extractor</span>
        </div>
      </nav>

      <div className="wrap py-12">
        <header className="mb-8">
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold mb-3 tracking-[-0.02em]">
            Color Palette Extractor
          </h1>
          <p className="text-[1.0625rem] text-text-secondary max-w-2xl">
            Extract dominant colors from any image or SVG. Get hex codes, RGB values, and ready-to-use color
            palettes for your design projects.
          </p>
        </header>

        <canvas ref={canvasRef} className="hidden" />

        {colors.length === 0 && (
          <div>
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border-strong rounded-2xl cursor-pointer bg-white hover:bg-bg-secondary transition-colors"
            >
              <div className="text-center">
                <svg
                  className="mx-auto mb-4 w-12 h-12 text-text-tertiary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-[1rem] font-medium mb-1">Click to upload image or SVG</p>
                <p className="text-[0.875rem] text-text-tertiary">PNG, JPG, SVG, or WebP</p>
              </div>
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept="image/*,.svg"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </div>
        )}

        {colors.length > 0 && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border border-border-subtle">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[1.25rem] font-semibold">Extracted Palette</h2>
                  <p className="text-[0.875rem] text-text-tertiary">{fileName}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={exportPalette}
                    className="px-4 py-2 rounded-full border border-border-strong font-medium text-[0.875rem] hover:bg-bg-secondary transition-colors"
                  >
                    Export as CSS
                  </button>
                  <button
                    onClick={() => {
                      setColors([]);
                      setFileName('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="px-4 py-2 rounded-full border border-border-strong font-medium text-[0.875rem] hover:bg-bg-secondary transition-colors"
                  >
                    Upload Another
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {colors.map((color, idx) => (
                  <div key={idx} className="group">
                    <div
                      className="aspect-square rounded-lg mb-2 cursor-pointer border border-border-subtle hover:scale-105 transition-transform"
                      style={{ backgroundColor: color.hex }}
                      onClick={() => copyToClipboard(color.hex)}
                      title="Click to copy"
                    />
                    <div className="text-[0.8125rem] space-y-0.5">
                      <button
                        onClick={() => copyToClipboard(color.hex)}
                        className="font-mono text-left hover:text-accent transition-colors"
                      >
                        {color.hex}
                      </button>
                      <p className="text-text-tertiary">{color.rgb}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-bg-secondary border border-border-subtle">
              <h3 className="text-[1rem] font-semibold mb-3">Usage Tips</h3>
              <ul className="space-y-2 text-[0.875rem] text-text-secondary">
                <li>• Click any color swatch to copy its hex code</li>
                <li>• Export palette as CSS variables for your project</li>
                <li>• Colors are sorted by frequency in the image</li>
                <li>• Works with PNG, JPG, SVG, and WebP files</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
