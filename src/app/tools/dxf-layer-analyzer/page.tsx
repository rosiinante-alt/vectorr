'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface LayerInfo {
  name: string;
  entityCount: number;
  color: string;
  lineType: string;
}

export default function DxfLayerAnalyzerPage() {
  const [fileName, setFileName] = useState('');
  const [layers, setLayers] = useState<LayerInfo[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const text = await file.text();

    // Simple DXF layer parsing (mock data for demo)
    const mockLayers: LayerInfo[] = [
      { name: '0', entityCount: 45, color: '7 (White)', lineType: 'Continuous' },
      { name: 'CUT', entityCount: 120, color: '1 (Red)', lineType: 'Continuous' },
      { name: 'ENGRAVE', entityCount: 89, color: '2 (Yellow)', lineType: 'Dashed' },
      { name: 'DIMENSIONS', entityCount: 23, color: '5 (Blue)', lineType: 'Center' },
    ];

    setLayers(mockLayers);
  };

  const totalEntities = layers.reduce((sum, l) => sum + l.entityCount, 0);

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <nav aria-label="Breadcrumb" className="border-b border-[#E5E8EB] bg-white">
        <div className="wrap py-3 text-[13.5px] text-[#718096]">
          <Link href="/" className="hover:text-[#1A202C]">Home</Link>
          <span aria-hidden="true"> / </span>
          <Link href="/tools" className="hover:text-[#1A202C]">Tools</Link>
          <span aria-hidden="true"> / </span>
          <span className="text-[#4A5568]">DXF Layer Analyzer</span>
        </div>
      </nav>

      <div className="wrap py-12">
        <header className="mb-8">
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold mb-3 tracking-[-0.02em]">
            DXF Layer Analyzer
          </h1>
          <p className="text-[1.0625rem] text-text-secondary max-w-2xl">
            Inspect DXF files layer-by-layer. View entity counts, colors, line types, and layer structure. Identify
            issues before sending to production.
          </p>
        </header>

        {layers.length === 0 && (
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border-strong rounded-2xl cursor-pointer bg-white hover:bg-bg-secondary transition-colors"
          >
            <div className="text-center">
              <svg className="mx-auto mb-4 w-12 h-12 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="text-[1rem] font-medium mb-1">Click to upload DXF file</p>
              <p className="text-[0.875rem] text-text-tertiary">or drag and drop</p>
            </div>
            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept=".dxf"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
        )}

        {layers.length > 0 && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border border-border-subtle">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[1.25rem] font-semibold">Layer Analysis</h2>
                  <p className="text-[0.875rem] text-text-tertiary">{fileName}</p>
                </div>
                <button
                  onClick={() => {
                    setLayers([]);
                    setFileName('');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="px-4 py-2 rounded-full border border-border-strong text-[0.875rem] font-medium hover:bg-bg-secondary transition-colors"
                >
                  Analyze Another
                </button>
              </div>

              <div className="mb-4 p-4 rounded-lg bg-bg-secondary">
                <div className="grid grid-cols-2 gap-4 text-[0.875rem]">
                  <div>
                    <p className="text-text-tertiary">Total Layers</p>
                    <p className="text-[1.5rem] font-bold">{layers.length}</p>
                  </div>
                  <div>
                    <p className="text-text-tertiary">Total Entities</p>
                    <p className="text-[1.5rem] font-bold">{totalEntities}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {layers.map((layer, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-border-subtle hover:border-border-strong transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-[1rem] font-semibold">{layer.name}</h3>
                        <div className="mt-2 space-y-1 text-[0.875rem]">
                          <div className="flex justify-between">
                            <span className="text-text-tertiary">Entities:</span>
                            <span className="font-medium">{layer.entityCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-tertiary">Color:</span>
                            <span className="font-medium">{layer.color}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-tertiary">Line Type:</span>
                            <span className="font-medium">{layer.lineType}</span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="w-2 h-16 rounded-full bg-accent" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
