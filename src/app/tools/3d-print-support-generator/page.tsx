'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PrintSupportGeneratorPage() {
  const [baseHeight, setBaseHeight] = useState(5);
  const [supportDensity, setSupportDensity] = useState(15);
  const [overhangAngle, setOverhangAngle] = useState(45);
  const [supportType, setSupportType] = useState<'grid' | 'tree'>('grid');

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <nav aria-label="Breadcrumb" className="border-b border-[#E5E8EB] bg-white">
        <div className="wrap py-3 text-[13.5px] text-[#718096]">
          <Link href="/" className="hover:text-[#1A202C]">Home</Link>
          <span aria-hidden="true"> / </span>
          <Link href="/tools" className="hover:text-[#1A202C]">Tools</Link>
          <span aria-hidden="true"> / </span>
          <span className="text-[#4A5568]">3D Print Support Generator</span>
        </div>
      </nav>

      <div className="wrap py-12">
        <header className="mb-8">
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold mb-3 tracking-[-0.02em]">
            3D Print Support Generator
          </h1>
          <p className="text-[1.0625rem] text-text-secondary max-w-2xl">
            Generate support structures for 3D printing vector models. Optimize for multicolor prints on Bambu Lab,
            Prusa, and other FDM printers.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border border-border-subtle">
              <h2 className="text-[1.125rem] font-semibold mb-4">Support Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-[0.875rem] font-medium mb-2">Support Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSupportType('grid')}
                      className={`px-4 py-2 rounded-lg text-[0.9375rem] font-medium transition-colors ${
                        supportType === 'grid'
                          ? 'bg-accent text-white'
                          : 'bg-white border border-border-strong hover:bg-bg-secondary'
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setSupportType('tree')}
                      className={`px-4 py-2 rounded-lg text-[0.9375rem] font-medium transition-colors ${
                        supportType === 'tree'
                          ? 'bg-accent text-white'
                          : 'bg-white border border-border-strong hover:bg-bg-secondary'
                      }`}
                    >
                      Tree
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium mb-2">Base Height (mm)</label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={baseHeight}
                    onChange={(e) => setBaseHeight(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-[0.875rem] text-text-tertiary mt-1">{baseHeight}mm</div>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium mb-2">Support Density (%)</label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={supportDensity}
                    onChange={(e) => setSupportDensity(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[0.8125rem] text-text-tertiary mt-1">
                    <span>Light (5%)</span>
                    <span className="font-semibold text-accent">{supportDensity}%</span>
                    <span>Heavy (50%)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium mb-2">Overhang Angle (°)</label>
                  <input
                    type="range"
                    min="30"
                    max="70"
                    step="5"
                    value={overhangAngle}
                    onChange={(e) => setOverhangAngle(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-[0.875rem] text-text-tertiary mt-1">{overhangAngle}°</div>
                  <p className="text-[0.8125rem] text-text-tertiary mt-1">
                    Overhangs steeper than this angle will get supports
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-bg-secondary border border-border-subtle">
              <h3 className="text-[1rem] font-semibold mb-3">Support Types</h3>
              <ul className="space-y-2 text-[0.875rem] text-text-secondary">
                <li>
                  <strong>Grid:</strong> Traditional lattice supports, easy to remove
                </li>
                <li>
                  <strong>Tree:</strong> Organic supports, uses less material, harder to remove
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-white border border-border-subtle">
              <h3 className="text-[1rem] font-semibold mb-3">Recommended Settings</h3>
              <div className="space-y-3 text-[0.875rem]">
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Contact Z Distance:</span>
                  <span className="font-medium">0.2mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Support Interface:</span>
                  <span className="font-medium">Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Support Pattern:</span>
                  <span className="font-medium">Lines</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border border-border-subtle">
              <h2 className="text-[1.125rem] font-semibold mb-4">Preview</h2>
              <div className="aspect-square bg-bg-secondary rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <svg className="mx-auto mb-4 w-16 h-16 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="text-[0.9375rem] text-text-tertiary">Upload an STL or 3MF file to preview</p>
                  <button className="mt-4 px-4 py-2 rounded-full border border-border-strong text-[0.875rem] font-medium hover:bg-bg-secondary transition-colors">
                    Upload 3D Model
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white border border-border-subtle">
              <h3 className="text-[1rem] font-semibold mb-4">Estimated Material</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[0.875rem] mb-1">
                    <span className="text-text-tertiary">Support Material</span>
                    <span className="font-medium">~15g</span>
                  </div>
                  <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${supportDensity}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[0.875rem] mb-1">
                    <span className="text-text-tertiary">Print Time Increase</span>
                    <span className="font-medium">~25 min</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <p className="text-[0.875rem] text-blue-900">
                <strong>Tip:</strong> Use tree supports for organic shapes and grid supports for geometric
                models. Enable "Support Interface" for cleaner surface finish.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
