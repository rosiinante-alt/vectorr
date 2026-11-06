'use client';

import { useState } from 'react';
import Link from 'next/link';

const MATERIALS = [
  { id: 'vinyl', name: 'Vinyl', cost: 0.15, unit: 'sq ft', waste: 1.2 },
  { id: 'htv', name: 'Heat Transfer Vinyl', cost: 0.25, unit: 'sq ft', waste: 1.3 },
  { id: 'sublimation', name: 'Sublimation Paper', cost: 0.10, unit: 'sq ft', waste: 1.15 },
  { id: 'dtf-film', name: 'DTF Film', cost: 0.30, unit: 'sq ft', waste: 1.25 },
  { id: 'wood-3mm', name: '3mm Wood Sheet', cost: 0.50, unit: 'sq ft', waste: 1.1 },
  { id: 'acrylic-3mm', name: '3mm Acrylic', cost: 1.20, unit: 'sq ft', waste: 1.1 },
  { id: 'fabric', name: 'Fabric', cost: 0.40, unit: 'sq ft', waste: 1.2 },
];

export default function MaterialCostCalculatorPage() {
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIALS[0]);
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(4);
  const [quantity, setQuantity] = useState(50);
  const [setupTime, setSetupTime] = useState(15);
  const [laborRate, setLaborRate] = useState(25);

  const area = width * height / 144; // convert to sq ft
  const materialPerPiece = area * selectedMaterial.waste * selectedMaterial.cost;
  const setupCost = (setupTime / 60) * laborRate;
  const totalMaterialCost = materialPerPiece * quantity;
  const costPerPiece = materialPerPiece + (setupCost / quantity);
  const totalCost = totalMaterialCost + setupCost;

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <nav aria-label="Breadcrumb" className="border-b border-[#E5E8EB] bg-white">
        <div className="wrap py-3 text-[13.5px] text-[#718096]">
          <Link href="/" className="hover:text-[#1A202C]">Home</Link>
          <span aria-hidden="true"> / </span>
          <Link href="/tools" className="hover:text-[#1A202C]">Tools</Link>
          <span aria-hidden="true"> / </span>
          <span className="text-[#4A5568]">Material Cost Calculator</span>
        </div>
      </nav>

      <div className="wrap py-12">
        <header className="mb-8">
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold mb-3 tracking-[-0.02em]">
            Material Cost Calculator
          </h1>
          <p className="text-[1.0625rem] text-text-secondary max-w-2xl">
            Calculate accurate per-piece material costs. Input dimensions, material type, and waste factor to get
            pricing for vinyl, fabric, wood, and more.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border border-border-subtle">
              <h2 className="text-[1.125rem] font-semibold mb-4">Design Dimensions</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.875rem] font-medium mb-2">Width (inches)</label>
                    <input
                      type="number"
                      min="0.5"
                      max="48"
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
                      max="48"
                      step="0.25"
                      value={height}
                      onChange={(e) => setHeight(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium mb-2">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white border border-border-subtle">
              <h2 className="text-[1.125rem] font-semibold mb-4">Material & Labor</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-[0.875rem] font-medium mb-2">Material Type</label>
                  <select
                    value={selectedMaterial.id}
                    onChange={(e) =>
                      setSelectedMaterial(MATERIALS.find((m) => m.id === e.target.value) || MATERIALS[0])
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {MATERIALS.map((mat) => (
                      <option key={mat.id} value={mat.id}>
                        {mat.name} (${mat.cost}/{mat.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium mb-2">Setup Time (minutes)</label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={setupTime}
                    onChange={(e) => setSetupTime(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium mb-2">Labor Rate ($/hour)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="5"
                    value={laborRate}
                    onChange={(e) => setLaborRate(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-bg-secondary border border-border-subtle">
              <h3 className="text-[0.875rem] font-semibold mb-2">Design Area</h3>
              <p className="text-[0.875rem] text-text-secondary">
                {width} × {height} inches = {area.toFixed(2)} sq ft (with {((selectedMaterial.waste - 1) * 100).toFixed(0)}% waste)
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border border-border-subtle">
              <h2 className="text-[1.125rem] font-semibold mb-6">Cost Breakdown</h2>

              <div className="space-y-6">
                <div>
                  <p className="text-[0.875rem] text-text-tertiary mb-1">Material per Piece</p>
                  <p className="text-[2rem] font-bold">${materialPerPiece.toFixed(3)}</p>
                </div>

                <div className="pt-6 border-t border-border-subtle">
                  <p className="text-[0.875rem] text-text-tertiary mb-1">Setup Cost (one-time)</p>
                  <p className="text-[1.5rem] font-bold">${setupCost.toFixed(2)}</p>
                </div>

                <div className="pt-6 border-t border-border-subtle">
                  <p className="text-[0.875rem] text-text-tertiary mb-1">Total Material Cost</p>
                  <p className="text-[1.5rem] font-bold">${totalMaterialCost.toFixed(2)}</p>
                  <p className="text-[0.8125rem] text-text-tertiary mt-1">For {quantity} pieces</p>
                </div>

                <div className="pt-6 border-t border-border-subtle">
                  <p className="text-[0.875rem] text-text-tertiary mb-1">Cost per Piece (all-in)</p>
                  <p className="text-[1.75rem] font-bold text-accent">${costPerPiece.toFixed(3)}</p>
                  <p className="text-[0.8125rem] text-text-tertiary mt-1">Material + setup</p>
                </div>

                <div className="pt-6 border-t border-border-subtle">
                  <p className="text-[0.875rem] text-text-tertiary mb-1">Total Job Cost</p>
                  <p className="text-[1.5rem] font-bold">${totalCost.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-bg-secondary border border-border-subtle">
              <h3 className="text-[1rem] font-semibold mb-3">Pricing Recommendations</h3>
              <div className="space-y-2 text-[0.875rem]">
                <div className="flex justify-between">
                  <span className="text-text-tertiary">2x markup:</span>
                  <span className="font-medium">${(costPerPiece * 2).toFixed(2)}/piece</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">3x markup:</span>
                  <span className="font-medium">${(costPerPiece * 3).toFixed(2)}/piece</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Retail (4x):</span>
                  <span className="font-medium">${(costPerPiece * 4).toFixed(2)}/piece</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
