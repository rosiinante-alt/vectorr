'use client';

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { SubscribeButton } from "@/components/subscribe-button";
import { PRICING_TIERS } from "@/lib/credits/constants";

const tierOrder = [
  "FREE",
  "STARTER",
  "PRO",
  "TEAM_STARTER",
  "TEAM_PRO",
  "ENTERPRISE",
] as const;

export function TierCards() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className="pb-16" aria-labelledby="tiers-heading">
      <h2 id="tiers-heading" className="visually-hidden">
        Plans
      </h2>
      <div className="wrap">
        {/* Annual / monthly toggle */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <span
            className={`text-[15px] font-medium transition-colors ${
              !isAnnual ? "text-text-primary" : "text-text-tertiary"
            }`}
          >
            Monthly
          </span>
          <button
            role="switch"
            aria-checked={isAnnual}
            onClick={() => setIsAnnual((v) => !v)}
            className={
              "relative h-7 w-12 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent " +
              (isAnnual ? "bg-accent" : "bg-bg-tertiary")
            }
          >
            <span
              className={
                "absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.18)] transition-transform " +
                (isAnnual ? "translate-x-[22px]" : "translate-x-[3px]")
              }
            />
            <span className="sr-only">
              {isAnnual ? "Switch to monthly billing" : "Switch to annual billing"}
            </span>
          </button>
          <span
            className={`text-[15px] font-medium transition-colors ${
              isAnnual ? "text-text-primary" : "text-text-tertiary"
            }`}
          >
            Annual
            {isAnnual && (
              <span className="ml-2 rounded-full bg-success px-2 py-0.5 text-[12px] font-semibold text-success-text">
                Save up to 26%
              </span>
            )}
          </span>
        </div>

        <ul className="grid gap-5 lg:grid-cols-3 xl:grid-cols-5">
          {tierOrder.map((key) => {
            const tier = PRICING_TIERS[key];
            const isPro = key === "PRO";
            const isTeam = key === "TEAM_STARTER" || key === "TEAM_PRO";
            const isEnterprise = key === "ENTERPRISE";

            const displayPrice =
              isAnnual && tier.priceAnnual ? tier.priceAnnual : tier.price;
            const displayCredits =
              isAnnual && tier.creditsAnnual ? tier.creditsAnnual : tier.credits;
            const planKey =
              isAnnual && tier.planKeyAnnual ? tier.planKeyAnnual : tier.planKey;
            const interval = isAnnual ? "year" : tier.interval;
            const monthlyEquivalent =
              isAnnual && displayPrice ? (displayPrice / 12).toFixed(2) : null;

            return (
              <li
                key={key}
                className={
                  "flex flex-col rounded-[var(--radius-xl)] bg-white p-7 " +
                  (isPro
                    ? "shadow-[inset_0_0_0_2px_var(--accent),0_2px_6px_rgba(0,0,0,0.05),0_18px_40px_-14px_rgba(0,0,0,0.16)]"
                    : "shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]")
                }
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-[17px] font-semibold tracking-[-0.02em]">
                    {tier.name}
                  </h3>
                  {isPro && <Badge tone="accent">Most popular</Badge>}
                  {isTeam && tier.seats && (
                    <Badge tone="accent">{tier.seats} seats</Badge>
                  )}
                </div>

                {isEnterprise ? (
                  <p className="mt-4 text-[24px] font-bold tracking-[-0.02em]">
                    Custom pricing
                  </p>
                ) : (
                  <>
                    <p className="mt-4 flex items-baseline gap-2">
                      <span className="tabular text-[46px] leading-none font-bold tracking-[-0.04em]">
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
                    {isAnnual ? "/year" : "/month"}
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
                  ) : (
                    <SubscribeButton
                      planKey={planKey}
                      variant={isPro ? "primary" : "secondary"}
                    >
                      Subscribe
                    </SubscribeButton>
                  )}
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
                  <p className="mt-4 border-t border-[var(--border)] pt-4 text-[13px] text-text-tertiary">
                    Overage: ${tier.overageRate}/credit (opt-in required)
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
