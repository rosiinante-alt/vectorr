'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PRICING_TIERS, OVERAGE_RATES } from '@/lib/credits/constants';
import type { PurchaseTier } from '@/lib/payments/products';

interface CreditDisplayProps {
  balance: number;
  tier: PurchaseTier;
  monthlyAllocation: number;
  creditsUsedThisMonth: number;
  overageEnabled: boolean;
  onToggleOverage?: (enabled: boolean) => void;
}

export function CreditDisplay({
  balance,
  tier,
  monthlyAllocation,
  creditsUsedThisMonth,
  overageEnabled,
  onToggleOverage,
}: CreditDisplayProps) {
  const [showOverageModal, setShowOverageModal] = useState(false);

  // Calculate usage percentage
  const usagePercent = monthlyAllocation > 0 
    ? Math.min((creditsUsedThisMonth / monthlyAllocation) * 100, 100) 
    : 0;

  // Determine warning state
  const isLow = usagePercent >= 80;
  const isVeryLow = usagePercent >= 95;

  // Get tier info
  const tierInfo = Object.values(PRICING_TIERS).find(
    (t) => t.planKey?.includes(tier) || t.planKeyAnnual?.includes(tier)
  );

  // Get overage rate
  const overageRate = tier in OVERAGE_RATES 
    ? OVERAGE_RATES[tier as keyof typeof OVERAGE_RATES] 
    : null;

  const hasOverage = creditsUsedThisMonth > monthlyAllocation;
  const overageAmount = hasOverage ? creditsUsedThisMonth - monthlyAllocation : 0;
  const estimatedOverageCost = overageRate ? overageAmount * overageRate : 0;

  return (
    <div className="rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-1)]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[13.5px] font-medium text-text-secondary">
              Credit Balance
            </p>
            {tierInfo && tier !== 'free' && (
              <Badge tone="accent" className="text-[11px]">
                {tierInfo.name}
              </Badge>
            )}
          </div>
          <p className="mt-2 font-mono text-[40px] font-bold leading-none tracking-[-0.02em]">
            {balance.toLocaleString()}
          </p>
          <p className="mt-2 text-[13.5px] text-text-tertiary">
            {tier === 'free' 
              ? 'Free tier credits' 
              : \`\${creditsUsedThisMonth.toLocaleString()} of \${monthlyAllocation.toLocaleString()} used this month\`
            }
          </p>
        </div>
        <Link
          href="/pricing"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-accent px-4 text-[15px] font-semibold tracking-[-0.01em] text-white shadow-[0_1px_2px_rgba(0,0,0,0.12)] transition-[background-color,transform,box-shadow] hover:-translate-y-px hover:bg-accent-hover active:translate-y-0"
        >
          {tier === 'free' ? 'Upgrade' : 'Add credits'}
        </Link>
      </div>

      {/* Progress bar (only for paid tiers) */}
      {tier !== 'free' && monthlyAllocation > 0 && (
        <div className="mt-6 space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-border">
            <div
              className={\`h-full transition-all duration-300 \${
                isVeryLow 
                  ? 'bg-error-border' 
                  : isLow 
                  ? 'bg-warning-border' 
                  : 'bg-accent'
              }\`}
              style={{ width: \`\${usagePercent}%\` }}
            />
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-text-tertiary">
              {usagePercent.toFixed(0)}% used
            </span>
            {isLow && (
              <span className={\`font-medium \${isVeryLow ? 'text-error-text' : 'text-warning-text'}\`}>
                {isVeryLow ? 'Almost out of credits!' : 'Running low'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Overage section */}
      {tier !== 'free' && overageRate && (
        <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border)] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-[14px] font-semibold">Credit Overage</h3>
                <Badge tone={overageEnabled ? 'success' : 'neutral'} className="text-[11px]">
                  {overageEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <p className="mt-1 text-[13px] text-text-secondary">
                Pay ${overageRate.toFixed(2)}/credit when you exceed your monthly limit
              </p>
              {hasOverage && overageEnabled && (
                <p className="mt-2 text-[13px] font-medium text-warning-text">
                  Current overage: {overageAmount.toFixed(0)} credits (≈${estimatedOverageCost.toFixed(2)})
                </p>
              )}
            </div>
            <button
              onClick={() => setShowOverageModal(true)}
              className="text-[13px] font-medium text-accent hover:underline"
            >
              {overageEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>
      )}

      {/* Overage confirmation modal */}
      {showOverageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-w-md rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-2)]">
            <h3 className="text-[18px] font-semibold">
              {overageEnabled ? 'Disable' : 'Enable'} Credit Overage
            </h3>
            <p className="mt-2 text-[14.5px] text-text-secondary">
              {overageEnabled ? (
                <>
                  When disabled, conversions will be blocked once you reach your monthly credit limit. 
                  You'll need to upgrade or wait until your credits refresh.
                </>
              ) : (
                <>
                  When enabled, you can exceed your monthly credit limit at ${overageRate?.toFixed(2)}/credit. 
                  You'll be charged for overage at the end of your billing period.
                </>
              )}
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowOverageModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  onToggleOverage?.(!overageEnabled);
                  setShowOverageModal(false);
                }}
                className="flex-1"
              >
                {overageEnabled ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
