'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function EmbroideryDensityCalculatorPage() {
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(4);
  const [density, setDensity] = useState(4);
  const [threadCost, setThreadCost] = useState(3.5);

  const stitchCount = width * height * density * density * 100;
  const threadUsage = stitchCount * 0.006; // approx 0.006 inches per stitch
  const productionTime = stitchCount / 800; // approx 800 stitches per minute
  const materialCost = (threadUsage / 5500) * threadCost; // 5500 yards per spool

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <nav aria-label="Breadcrumb" className="border-b border-[#E5E8EB] bg-white">
        <div className="wrap py-3 text-[13.5px] text-[#718096]">
          <Link href="/" className="hover:text-[#1A202C]">Home</Link>
          <span aria-hidden="true"> / </span>
          <Link href="/tools" className="hover:text-[#1A202C]">Tools</Link>
          <span aria-hidden="true"> / </span>
          <span className="text-[#4A5568]">Embroidery Density Calculator</span>
        </div>
      </nav>

      <div className="wrap py-12">
        <header className="mb-8">
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold mb-3 tracking-[-0.02em]">
            Embroidery Density Calculator
          </h1>
          <p className="text-[1.0625rem] text-text-secondary max-w-2xl">
            Calculate stitch counts, thread usage, and production time for embroidery projects. Input design size
            and density to estimate material costs.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border border-border-subtle">
              <h2 className="text-[1.125rem] font-semibold mb-4">Design Settings</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.875rem] font-medium mb-2">Width (inches)</label>
                    <input
                      type="number"
                      min="0.5"
                      max="20"
                      step="0.25"
                      value={width}
                      onChange={(e) => setWidth(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.875rem] font-medium mb-2">Height (inches)</label>
                    <input
                      type="number"
                      min="0.5"
                      max="20"
                      step="0.25"
                      value={height}
                      onChange={(e) => setHeight(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium mb-2">
                    Stitch Density (stitches per inch)
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    step="0.5"
                    value={density}
                    onChange={(e) => setDensity(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[0.8125rem] text-text-tertiary mt-1">
                    <span>Low (2)</span>
                    <span className="font-semibold text-accent">{density}</span>
                    <span>High (8)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium mb-2">Thread Cost per Spool ($)</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    step="0.5"
                    value={threadCost}
                    onChange={(e) => setThreadCost(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="text-[0.8125rem] text-text-tertiary mt-1">Based on 5500 yard spool</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-bg-secondary border border-border-subtle">
              <h3 className="text-[1rem] font-semibold mb-3">Density Guide</h3>
              <ul className="space-y-2 text-[0.875rem] text-text-secondary">
                <li>
                  <strong>2-3:</strong> Light fill (text, outlines)
                </li>
                <li>
                  <strong>4-5:</strong> Standard fill (logos, basic designs)
                </li>
                <li>
                  <strong>6-8:</strong> Dense fill (detailed artwork)
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border border-border-subtle">
              <h2 className="text-[1.125rem] font-semibold mb-6">Estimates</h2>

              <div className="space-y-6">
                <div>
                  <p className="text-[0.875rem] text-text-tertiary mb-1">Total Stitch Count</p>
                  <p className="text-[2.5rem] font-bold leading-none">{stitchCount.toLocaleString()}</p>
                </div>

                <div className="pt-6 border-t border-border-subtle">
                  <p className="text-[0.875rem] text-text-tertiary mb-1">Thread Usage</p>
                  <p className="text-[1.5rem] font-bold">{threadUsage.toFixed(0)} yards</p>
                </div>

                <div className="pt-6 border-t border-border-subtle">
                  <p className="text-[0.875rem] text-text-tertiary mb-1">Production Time</p>
                  <p className="text-[1.5rem] font-bold">
                    {Math.floor(productionTime)} min {((productionTime % 1) * 60).toFixed(0)} sec
                  </p>
                  <p className="text-[0.8125rem] text-text-tertiary mt-1">At 800 stitches/minute</p>
                </div>

                <div className="pt-6 border-t border-border-subtle">
                  <p className="text-[0.875rem] text-text-tertiary mb-1">Thread Cost</p>
                  <p className="text-[1.5rem] font-bold text-accent">${materialCost.toFixed(2)}</p>
                  <p className="text-[0.8125rem] text-text-tertiary mt-1">Material only (per piece)</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <p className="text-[0.875rem] text-blue-900">
                <strong>Tip:</strong> These are estimates. Actual stitch counts vary based on design complexity,
                underlay, and digitization techniques.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-bg-secondary border border-border-subtle">
              <h3 className="text-[0.875rem] font-semibold mb-2">Design Area</h3>
              <p className="text-[0.875rem] text-text-secondary">
                {width} × {height} inches ({(width * height).toFixed(2)} in²)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
