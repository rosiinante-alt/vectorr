'use client';

import { useState } from 'react';
import Link from 'next/link';

const MATERIALS = [
  { id: 'wood-3mm', name: '3mm Plywood', power: 75, speed: 15, passes: 1 },
  { id: 'wood-6mm', name: '6mm Plywood', power: 100, speed: 10, passes: 2 },
  { id: 'acrylic-3mm', name: '3mm Acrylic', power: 70, speed: 20, passes: 1 },
  { id: 'acrylic-6mm', name: '6mm Acrylic', power: 90, speed: 12, passes: 2 },
  { id: 'leather', name: 'Leather (2-3mm)', power: 60, speed: 25, passes: 1 },
  { id: 'cardboard', name: 'Cardboard', power: 40, speed: 30, passes: 1 },
  { id: 'fabric', name: 'Fabric/Felt', power: 30, speed: 40, passes: 1 },
  { id: 'mdf-3mm', name: '3mm MDF', power: 80, speed: 12, passes: 1 },
];

const MACHINES = [
  { id: 'glowforge-basic', name: 'Glowforge Basic', maxPower: 40 },
  { id: 'glowforge-plus', name: 'Glowforge Plus', maxPower: 45 },
  { id: 'glowforge-pro', name: 'Glowforge Pro', maxPower: 45 },
  { id: 'xtool-d1', name: 'xTool D1', maxPower: 40 },
  { id: 'generic-40w', name: 'Generic 40W CO2', maxPower: 40 },
  { id: 'generic-60w', name: 'Generic 60W CO2', maxPower: 60 },
];

export default function LaserCutSettingsPage() {
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIALS[0]);
  const [selectedMachine, setSelectedMachine] = useState(MACHINES[0]);
  const [operation, setOperation] = useState<'cut' | 'engrave'>('cut');

  const adjustedPower = Math.min(
    (selectedMaterial.power / 100) * selectedMachine.maxPower,
    selectedMachine.maxPower
  );

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <nav aria-label="Breadcrumb" className="border-b border-[#E5E8EB] bg-white">
        <div className="wrap py-3 text-[13.5px] text-[#718096]">
          <Link href="/" className="hover:text-[#1A202C]">Home</Link>
          <span aria-hidden="true"> / </span>
          <Link href="/tools" className="hover:text-[#1A202C]">Tools</Link>
          <span aria-hidden="true"> / </span>
          <span className="text-[#4A5568]">Laser Cut Settings Calculator</span>
        </div>
      </nav>

      <div className="wrap py-12">
        <header className="mb-8">
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold mb-3 tracking-[-0.02em]">
            Laser Cut Settings Calculator
          </h1>
          <p className="text-[1.0625rem] text-text-secondary max-w-2xl">
            Find the right laser cutter settings for your material and machine. Select material type, thickness,
            and machine to get power, speed, and pass recommendations.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border border-border-subtle">
              <h2 className="text-[1.125rem] font-semibold mb-4">Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-[0.875rem] font-medium mb-2">Material</label>
                  <select
                    value={selectedMaterial.id}
                    onChange={(e) =>
                      setSelectedMaterial(MATERIALS.find((m) => m.id === e.target.value) || MATERIALS[0])
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {MATERIALS.map((mat) => (
                      <option key={mat.id} value={mat.id}>
                        {mat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium mb-2">Machine</label>
                  <select
                    value={selectedMachine.id}
                    onChange={(e) =>
                      setSelectedMachine(MACHINES.find((m) => m.id === e.target.value) || MACHINES[0])
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border-strong bg-white text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {MACHINES.map((machine) => (
                      <option key={machine.id} value={machine.id}>
                        {machine.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium mb-2">Operation</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setOperation('cut')}
                      className={`px-4 py-2 rounded-lg text-[0.9375rem] font-medium transition-colors ${
                        operation === 'cut'
                          ? 'bg-accent text-white'
                          : 'bg-white border border-border-strong hover:bg-bg-secondary'
                      }`}
                    >
                      Cut
                    </button>
                    <button
                      onClick={() => setOperation('engrave')}
                      className={`px-4 py-2 rounded-lg text-[0.9375rem] font-medium transition-colors ${
                        operation === 'engrave'
                          ? 'bg-accent text-white'
                          : 'bg-white border border-border-strong hover:bg-bg-secondary'
                      }`}
                    >
                      Engrave
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-bg-secondary border border-border-subtle">
              <h3 className="text-[1rem] font-semibold mb-3">Safety Tips</h3>
              <ul className="space-y-2 text-[0.875rem] text-text-secondary">
                <li>• Always test settings on scrap material first</li>
                <li>• Never leave laser cutter unattended</li>
                <li>• Ensure proper ventilation and filtration</li>
                <li>• Keep fire extinguisher nearby</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border border-border-subtle">
              <h2 className="text-[1.125rem] font-semibold mb-6">Recommended Settings</h2>

              <div className="space-y-6">
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-[0.875rem] font-medium">Power</span>
                    <span className="text-[2rem] font-bold text-accent">{adjustedPower.toFixed(0)}W</span>
                  </div>
                  <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all"
                      style={{ width: `${(adjustedPower / selectedMachine.maxPower) * 100}%` }}
                    />
                  </div>
                  <p className="text-[0.8125rem] text-text-tertiary mt-1">
                    {((adjustedPower / selectedMachine.maxPower) * 100).toFixed(0)}% of max power
                  </p>
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-[0.875rem] font-medium">Speed</span>
                    <span className="text-[2rem] font-bold text-accent">
                      {operation === 'cut' ? selectedMaterial.speed : selectedMaterial.speed * 3}
                    </span>
                  </div>
                  <p className="text-[0.8125rem] text-text-tertiary">mm/s or % depending on your machine</p>
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-[0.875rem] font-medium">Passes</span>
                    <span className="text-[2rem] font-bold text-accent">
                      {operation === 'cut' ? selectedMaterial.passes : 1}
                    </span>
                  </div>
                  <p className="text-[0.8125rem] text-text-tertiary">
                    Number of {operation === 'cut' ? 'cutting' : 'engraving'} passes
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <p className="text-[0.875rem] text-blue-900">
                <strong>Note:</strong> These are starting point recommendations. Always run a test cut and adjust
                based on your specific material and machine conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
