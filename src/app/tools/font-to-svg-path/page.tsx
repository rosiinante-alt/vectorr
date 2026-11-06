'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FontToSvgPathPage() {
  const [text, setText] = useState('Vectorr');
  const [fontSize, setFontSize] = useState(48);
  const [fontWeight, setFontWeight] = useState('700');
  const [fontFamily, setFontFamily] = useState('Arial');

  const downloadSvg = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100">
  <text x="20" y="60" font-family="${fontFamily}" font-size="${fontSize}" font-weight="${fontWeight}" fill="currentColor">${text}</text>
</svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${text.replace(/\s+/g, '-').toLowerCase()}-text.svg`;
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
          <span className="text-[#4A5568]">Font to SVG Path</span>
        </div>
      </nav>

      <div className="wrap py-12">
        <header className="mb-8">
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold mb-3 tracking-[-0.02em]">
            Font to SVG Path Converter
          </h1>
          <p className="text-[1.0625rem] text-text-secondary max-w-2xl">
            Convert text into editable SVG paths. Type your text, choose a font, and generate vector outlines
            ready for cutting, engraving, or editing.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border border-border-subtle">
              <h2 className="text-[1.125rem] font-semibold mb-4">Text Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-[0.875rem] font-medium mb-2">Your Text</label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text..."
                    className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium mb-2">Font Family</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Impact">Impact</option>
                    <option value="Comic Sans MS">Comic Sans MS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium mb-2">Font Size</label>
                  <input
                    type="range"
                    min="12"
                    max="120"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-[0.875rem] text-text-tertiary mt-1">{fontSize}px</div>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium mb-2">Font Weight</label>
                  <select
                    value={fontWeight}
                    onChange={(e) => setFontWeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="300">Light (300)</option>
                    <option value="400">Regular (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semibold (600)</option>
                    <option value="700">Bold (700)</option>
                    <option value="800">Extra Bold (800)</option>
                    <option value="900">Black (900)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-bg-secondary border border-border-subtle">
              <h3 className="text-[1rem] font-semibold mb-3">Use Cases</h3>
              <ul className="space-y-2 text-[0.875rem] text-text-secondary">
                <li>• Logo text for cutting machines</li>
                <li>• Signage and engraving projects</li>
                <li>• Custom typography designs</li>
                <li>• Vinyl cutter ready text</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border border-border-subtle">
              <h2 className="text-[1.125rem] font-semibold mb-4">Preview</h2>
              <div className="aspect-[4/3] bg-bg-secondary rounded-lg flex items-center justify-center p-8">
                <svg viewBox="0 0 400 100" className="w-full h-auto">
                  <text
                    x="20"
                    y="60"
                    fontFamily={fontFamily}
                    fontSize={fontSize}
                    fontWeight={fontWeight}
                    fill="currentColor"
                  >
                    {text}
                  </text>
                </svg>
              </div>
            </div>

            <button
              onClick={downloadSvg}
              className="w-full h-11 rounded-full bg-accent text-white font-semibold hover:bg-accent-hover transition-colors"
            >
              Download SVG
            </button>

            <div className="p-4 rounded-xl bg-bg-secondary border border-border-subtle">
              <p className="text-[0.875rem] text-text-secondary">
                <strong>Note:</strong> For full path conversion (text to outlines), use Adobe Illustrator's
                "Create Outlines" or Inkscape's "Object to Path" after downloading.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
