"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export interface ConversionSettingsValue {
  precision: 2 | 3 | 5;
}

interface ConversionSettingsProps {
  onSettings?: (settings: ConversionSettingsValue) => void;
  disabled?: boolean;
}

const presets: Array<{ precision: ConversionSettingsValue["precision"]; label: string; detail: string }> = [
  { precision: 2, label: "2 decimals", detail: "Smallest file; best for icons" },
  { precision: 3, label: "3 decimals", detail: "Balanced size and quality" },
  { precision: 5, label: "5 decimals", detail: "Preserve fine detail" },
];

export function ConversionSettings({ onSettings, disabled = false }: ConversionSettingsProps) {
  const [precision, setPrecision] = useState<ConversionSettingsValue["precision"]>(3);

  const selectPrecision = (value: ConversionSettingsValue["precision"]) => {
    setPrecision(value);
    onSettings?.({ precision: value });
  };

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-[19px] font-semibold tracking-[-0.022em]">Coordinate precision</h2>
          <p className="mt-1 text-[14px] text-text-secondary">Choose how precisely SVG coordinates are rounded.</p>
        </div>
        <Badge tone="accent">Default: 3 decimals</Badge>
      </div>
      <div className="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Coordinate precision">
        {presets.map((preset) => {
          const active = precision === preset.precision;
          return (
            <button
              key={preset.precision}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={disabled}
              onClick={() => selectPrecision(preset.precision)}
              className={`rounded-[var(--radius-lg)] p-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-55 ${active ? "bg-accent-wash shadow-[inset_0_0_0_1.5px_var(--accent)]" : "bg-white shadow-[inset_0_0_0_1px_var(--border-strong)] hover:bg-bg-secondary"}`}
            >
              <span className="block text-[14.5px] font-semibold">{preset.label}</span>
              <span className="mt-1 block text-[13px] text-text-secondary">{preset.detail}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
