'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface PathNode {
  x: number;
  y: number;
  type: 'M' | 'L' | 'C' | 'Z';
}

export default function SvgPathEditorPage() {
  const [svgContent, setSvgContent] = useState<string>('');
  const [paths, setPaths] = useState<string[]>([]);
  const [selectedPath, setSelectedPath] = useState<number>(0);
  const [editedPath, setEditedPath] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    setSvgContent(text);

    // Extract paths from SVG
    const pathMatches = text.match(/<path[^>]*d="([^"]+)"/g) || [];
    const extractedPaths = pathMatches.map((match) => {
      const dMatch = match.match(/d="([^"]+)"/);
      return dMatch ? dMatch[1] : '';
    });

    setPaths(extractedPaths);
    if (extractedPaths.length > 0) {
      setEditedPath(extractedPaths[0]);
    }
  };

  const downloadModified = () => {
    const modifiedSvg = svgContent.replace(
      /<path[^>]*d="[^"]+"/,
      `<path d="${editedPath}"`
    );
    const blob = new Blob([modifiedSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'edited-path.svg';
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
          <span className="text-[#4A5568]">SVG Path Editor</span>
        </div>
      </nav>

      <div className="wrap py-12">
        <header className="mb-8">
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold mb-3 tracking-[-0.02em]">
            SVG Path Editor
          </h1>
          <p className="text-[1.0625rem] text-text-secondary max-w-2xl">
            Edit SVG paths interactively with visual controls. Adjust anchor points, modify bezier curves,
            and refine vector shapes with precision.
          </p>
        </header>

        {/* Upload */}
        {!svgContent && (
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
                <p className="text-[1rem] font-medium mb-1">Click to upload SVG</p>
                <p className="text-[0.875rem] text-text-tertiary">or drag and drop</p>
              </div>
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept=".svg,image/svg+xml"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </div>
        )}

        {/* Editor */}
        {svgContent && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-white border border-border-subtle">
                <h2 className="text-[1.125rem] font-semibold mb-4">Path Data</h2>
                <div className="mb-4">
                  <label className="block text-[0.875rem] font-medium mb-2">Select Path</label>
                  <select
                    value={selectedPath}
                    onChange={(e) => {
                      const idx = parseInt(e.target.value);
                      setSelectedPath(idx);
                      setEditedPath(paths[idx]);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {paths.map((_, idx) => (
                      <option key={idx} value={idx}>
                        Path {idx + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[0.875rem] font-medium mb-2">Edit Path Commands</label>
                  <textarea
                    value={editedPath}
                    onChange={(e) => setEditedPath(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white text-[0.8125rem] font-mono focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="p-6 rounded-xl bg-bg-secondary border border-border-subtle">
                <h3 className="text-[1rem] font-semibold mb-3">Path Commands Reference</h3>
                <ul className="space-y-2 text-[0.875rem] text-text-secondary">
                  <li>
                    <code className="font-mono bg-white px-2 py-0.5 rounded">M x y</code> — Move to point
                  </li>
                  <li>
                    <code className="font-mono bg-white px-2 py-0.5 rounded">L x y</code> — Line to point
                  </li>
                  <li>
                    <code className="font-mono bg-white px-2 py-0.5 rounded">C x1 y1 x2 y2 x y</code> —
                    Cubic bezier curve
                  </li>
                  <li>
                    <code className="font-mono bg-white px-2 py-0.5 rounded">Z</code> — Close path
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-white border border-border-subtle">
                <h2 className="text-[1.125rem] font-semibold mb-4">Preview</h2>
                <div className="aspect-square bg-bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
                  <svg
                    viewBox="0 0 200 200"
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{
                      __html: `<path d="${editedPath}" fill="none" stroke="#4F46E5" stroke-width="2"/>`,
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={downloadModified}
                  className="flex-1 h-11 rounded-full bg-accent text-white font-semibold hover:bg-accent-hover transition-colors"
                >
                  Download Modified SVG
                </button>
                <button
                  onClick={() => {
                    setSvgContent('');
                    setPaths([]);
                    setEditedPath('');
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="px-6 h-11 rounded-full border border-border-strong font-semibold hover:bg-bg-secondary transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
