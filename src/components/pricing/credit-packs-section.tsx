'use client';

import { SubscribeButton } from '@/components/subscribe-button';
import { Badge } from '@/components/ui/badge';
import { CREDIT_PACKS } from '@/lib/credits/constants';

export function CreditPacksSection() {
  return (
    <section className="py-20 bg-bg-secondary" aria-labelledby="packs-heading">
      <div className="wrap">
        <h2
          id="packs-heading"
          className="display max-w-[760px] text-[clamp(28px,4vw,44px)]"
        >
          One-time credit packs.
        </h2>
        <p className="mt-5 max-w-[620px] text-[17px] leading-relaxed text-text-secondary">
          No subscription needed. Credits never expire. Perfect for occasional use or
          topping up your account.
        </p>

        <ul className="mt-10 grid gap-6 sm:grid-cols-3">
          {CREDIT_PACKS.map((pack) => (
            <li
              key={pack.planKey}
              className={`
                relative flex flex-col rounded-[var(--radius-xl)] bg-white p-7
                shadow-[0_0_0_1px_var(--border),0_2px_8px_rgba(0,0,0,0.04)]
                ${pack.badge ? 'ring-2 ring-accent ring-offset-2' : ''}
              `}
            >
              {pack.badge && (
                <Badge
                  tone="accent"
                  className="absolute -top-3 left-1/2 -translate-x-1/2"
                >
                  {pack.badge}
                </Badge>
              )}

              <h3 className="text-[20px] font-semibold tracking-[-0.02em]">
                {pack.name}
              </h3>

              <p className="mt-3 flex items-baseline gap-1.5">
                <span className="text-[40px] font-bold leading-none tracking-[-0.03em]">
                  ${pack.price}
                </span>
                <span className="text-[14.5px] text-text-tertiary">
                  one-time
                </span>
              </p>

              <p className="mt-2 text-[14px] font-medium text-accent">
                {pack.credits} credits
              </p>

              <p className="mt-4 text-[15px] leading-relaxed text-text-secondary">
                {pack.description}
              </p>

              <div className="mt-6">
                <SubscribeButton
                  planKey={pack.planKey}
                  variant={pack.badge ? 'primary' : 'secondary'}
                >
                  Buy now
                </SubscribeButton>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] text-text-tertiary">
                    Cost per credit:
                  </span>
                  <span className="tabular text-[14px] font-semibold text-text-primary">
                    ${pack.pricePerCredit.toFixed(2)}
                  </span>
                </div>
              </div>

              <ul className="mt-4 grid gap-2">
                {[
                  'Credits never expire',
                  'No recurring charges',
                  'Use anytime',
                  'Instant activation',
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-2.5 text-[13px] leading-snug"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className="mt-0.5 h-3.5 w-3.5 flex-none text-success-text"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 10.5l4 4 8-9" />
                    </svg>
                    <span className="text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-[14px] text-text-tertiary">
          Need more credits?{' '}
          <a
            href="mailto:sales@vectroy.com?subject=Bulk Credit Purchase"
            className="text-accent-ink underline underline-offset-[3px] hover:text-accent"
          >
            Contact us
          </a>{' '}
          for bulk pricing.
        </p>
      </div>
    </section>
  );
}
