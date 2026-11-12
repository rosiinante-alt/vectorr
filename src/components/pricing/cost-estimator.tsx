'use client';

import { useState } from 'react';
import { CREDIT_COSTS, PRICING_TIERS } from '@/lib/credits/constants';

const OPERATIONS = [
  { name: 'Vectorize', key: 'VECTORIZE', cost: CREDIT_COSTS.VECTORIZE },
  { name: 'Remove Background', key: 'REMOVE_BG', cost: CREDIT_COSTS.REMOVE_BG },
  { name: 'Upscale 2×', key: 'UPSCALE_2X', cost: CREDIT_COSTS.UPSCALE_2X },
  { name: 'Upscale 4×', key: 'UPSCALE_4X', cost: CREDIT_COSTS.UPSCALE_4X },
  { name: 'AI Logo Generation', key: 'AI_GENERATE', cost: CREDIT_COSTS.AI_GENERATE },
  { name: 'Style Transfer', key: 'STYLE_TRANSFER', cost: CREDIT_COSTS.STYLE_TRANSFER },
] as const;

export function CostEstimator() {
  const [counts, setCounts] = useState<Record<string, number>>({
    VECTORIZE: 50,
    REMOVE_BG: 0,
    UPSCALE_2X: 0,
    UPSCALE_4X: 0,
    AI_GENERATE: 0,
    STYLE_TRANSFER: 0,
  });

  const totalCredits = OPERATIONS.reduce(
    (sum, op) => sum + counts[op.key] * op.cost,
    0
  );

  const handleSliderChange = (key: string, value: number) => {
    setCounts((prev) => ({ ...prev, [key]: value }));
  };

  const recommendedTier = (() => {
    if (totalCredits <= 5) return 'FREE';
    if (totalCredits <= 50) return 'STARTER';
    if (totalCredits <= 250) return 'PRO';
    if (totalCredits <= 750) return 'TEAM_STARTER';
    if (totalCredits <= 2500) return 'TEAM_PRO';
    return 'ENTERPRISE';
  })();

  const tierInfo = PRICING_TIERS[recommendedTier];

  return (
    <div className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[0_0_0_1px_var(--border),0_2px_8px_rgba(0,0,0,0.04)]">
      <h3 className="text-[20px] font-semibold">Estimate your monthly usage</h3>
      <p className="mt-2 text-[15px] text-text-secondary">
        Adjust the sliders to see which plan fits your needs.
      </p>

      <div className="mt-8 space-y-6">
        {OPERATIONS.map((op) => (
          <div key={op.key}>
            <div className="flex items-baseline justify-between gap-4">
              <label
                htmlFor={`slider-${op.key}`}
                className="text-[15px] font-medium text-text-primary"
              >
                {op.name}
              </label>
              <div className="flex items-baseline gap-2">
                <span className="tabular text-[15px] font-semibold text-accent">
                  {counts[op.key]}
                </span>
                <span className="text-[13px] text-text-tertiary">
                  × {op.cost} = {(counts[op.key] * op.cost).toFixed(2)} cr
                </span>
              </div>
            </div>
            <input
              id={`slider-${op.key}`}
              type="range"
              min="0"
              max="200"
              step="10"
              value={counts[op.key]}
              onChange={(e) => handleSliderChange(op.key, Number(e.target.value))}
              className="mt-2 w-full"
              style={{
                accentColor: 'var(--accent)',
              }}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[var(--radius-lg)] bg-bg-secondary p-6">
        <div className="flex items-baseline justify-between">
          <span className="text-[15px] font-medium text-text-secondary">
            Total monthly credits needed:
          </span>
          <span className="tabular text-[24px] font-bold text-accent">
            {totalCredits.toFixed(2)}
          </span>
        </div>

        {tierInfo && (
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <p className="text-[15px] text-text-secondary">
              Recommended plan:
            </p>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-[18px] font-semibold text-text-primary">
                {tierInfo.name}
              </span>
              {tierInfo.price !== null && (
                <span className="text-[18px] font-semibold text-text-primary">
                  ${tierInfo.price}
                  <span className="text-[14px] text-text-tertiary">/mo</span>
                </span>
              )}
            </div>
            {tierInfo.credits !== null && (
              <p className="mt-1 text-[14px] text-text-tertiary">
                Includes {tierInfo.credits.toLocaleString()} credits/month
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
