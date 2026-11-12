'use client';

import { useState } from 'react';
import { SubscribeButton } from '@/components/subscribe-button';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { AnnualToggle } from './annual-toggle';
import type { PricingTier } from '@/lib/credits/constants';

interface PricingGridProps {
  tiers: Record<string, PricingTier>;
  tierOrder: readonly string[];
}

export function PricingGrid({ tiers, tierOrder }: PricingGridProps) {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <>
      <div className="mb-10 flex justify-center">
        <AnnualToggle value={isAnnual} onChange={setIsAnnual} />
      </div>

      <ul className="grid max-w-[1200px] gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tierOrder.map((key) => {
          const tier = tiers[key];
          if (!tier) return null;

          const isEnterprise = key === 'ENTERPRISE';
          const isPro = key === 'PRO';
          const isFree = key === 'FREE';

          // Skip annual toggle for FREE and ENTERPRISE
          const showAnnualVariant = !isFree && !isEnterprise && isAnnual;

          const displayPrice = showAnnualVariant
            ? tier.priceAnnual
            : tier.price;
          const displayCredits = showAnnualVariant
            ? tier.creditsAnnual
            : tier.credits;
          const interval = showAnnualVariant ? 'year' : tier.interval;
          const planKey = showAnnualVariant
            ? tier.planKeyAnnual
            : tier.planKey;

          // Calculate monthly equivalent for annual plans
          const monthlyEquivalent =
            showAnnualVariant && tier.priceAnnual
              ? (tier.priceAnnual / 12).toFixed(2)
              : null;

          return (
            <li
              key={key}
              className={`
                relative flex flex-col rounded-[var(--radius-xl)] bg-white p-7
                shadow-[0_0_0_1px_var(--border),0_2px_8px_rgba(0,0,0,0.04)]
                ${isPro ? 'ring-2 ring-accent ring-offset-2' : ''}
              `}
            >
              {isPro && (
                <Badge
                  tone="accent"
                  className="absolute -top-3 left-1/2 -translate-x-1/2"
                >
                  Most Popular
                </Badge>
              )}

              <h3 className="text-[20px] font-semibold tracking-[-0.02em]">
                {tier.name}
              </h3>

              {isEnterprise ? (
                <p className="mt-3 text-[15px] text-text-secondary">
                  Custom pricing
                </p>
              ) : (
                <>
                  <p className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-[40px] font-bold leading-none tracking-[-0.03em]">
                      ${displayPrice}
                    </span>
                    {interval && (
                      <span className="text-[14.5px] text-text-tertiary">
                        /{interval}
                      </span>
                    )}
                  </p>
                  {isAnnual && monthlyEquivalent && tier.annualSavings && (
                    <p className="mt-1 text-[13px] text-success-text">
                      ${monthlyEquivalent}/mo · Save {tier.annualSavings}%
                    </p>
                  )}
                </>
              )}

              <p className="mt-4 text-[15px] leading-relaxed text-text-secondary">
                {tier.description}
              </p>

              {!isEnterprise && displayCredits && (
                <p className="mt-2 text-[14px] font-medium text-accent">
                  {displayCredits.toLocaleString()} credits
                  {isAnnual ? '/year' : '/month'}
                </p>
              )}

              <div className="mt-6">
                {isEnterprise ? (
                  <ButtonLink
                    href="mailto:sales@vectroy.com?subject=Enterprise Inquiry"
                    size="lg"
                    variant="secondary"
                    className="w-full"
                  >
                    Contact sales
                  </ButtonLink>
                ) : planKey === null ? (
                  <ButtonLink
                    href="/convert"
                    size="lg"
                    variant="secondary"
                    className="w-full"
                  >
                    Get started
                  </ButtonLink>
                ) : planKey ? (
                  <SubscribeButton
                    planKey={planKey}
                    variant={isPro ? 'primary' : 'secondary'}
                  >
                    Subscribe
                  </SubscribeButton>
                ) : null}
              </div>

              <ul className="mt-6 grid gap-3 border-t border-[var(--border)] pt-6">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-2.5 text-[14.5px] leading-snug"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 flex-none text-success-text"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 10.5l4 4 8-9" />
                    </svg>
                    <span className="text-text-primary">{feature}</span>
                  </li>
                ))}
              </ul>

              {!isEnterprise && tier.overageRate && (
                <p className="mt-4 pt-4 border-t border-[var(--border)] text-[13px] text-text-tertiary">
                  Overage: ${tier.overageRate}/credit (opt-in required)
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
