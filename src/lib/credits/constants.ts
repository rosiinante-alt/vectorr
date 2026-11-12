// Pricing tier shape — all fields beyond the core are optional so each tier
// only carries what applies to it (e.g. FREE has no annual variant).
export interface PricingTier {
  name: string;
  price: number | null;
  priceAnnual?: number;
  credits: number | null;
  creditsAnnual?: number;
  interval: string | null;
  description: string;
  planKey: string | null;
  planKeyAnnual?: string;
  annualSavings?: number;
  overageRate?: number;
  seats?: number;
  features: readonly string[];
  /** Only on FREE tier — legacy field, not used by subscribe flow. */
  polarProductId?: string;
}

// Credit costs per operation — from PRICING_STRATEGY_2026.md
export const CREDIT_COSTS = {
  VECTORIZE: 1.00,          // 1 credit = 1 image conversion
  REMOVE_BG: 0.25,          // Minor operations cost 0.25 credits
  UPSCALE_2X: 0.25,
  UPSCALE_4X: 0.25,
  STYLE_TRANSFER: 0.50,
  AI_GENERATE: 0.50,        // AI logo / SVG / pattern generation
  AI_IMAGE: 0.50,           // Full AI image generation (alias for AI_GENERATE)
  AI_EDIT: 0.50,            // Inpainting / variant generation
  BRAND_IDENTITY: 1.00,     // Full brand identity kit (2× AI_GENERATE)
  EXPORT_PREMIUM: 0.00,     // Format exports are free

  // Animation tiers
  ANIMATE_ECO: 0,           // Basic fade-in — free
  ANIMATE_STANDARD: 0.25,   // Stroke + entrance animations
  ANIMATE_PRO: 0.50,        // Staggered / morph / parallax

  // Content generation
  CONTENT_LISTING: 0.25,    // Etsy listing / alt text
  CONTENT_BLOG: 0.50,       // Long-form blog article
  CONTENT_GENERATION: 0.25, // Backward-compat alias → listing tier
} as const;

// Overage rates per tier (charged per credit when over monthly limit)
export const OVERAGE_RATES = {
  starter: 0.20,
  pro: 0.20,
  team_starter: 0.15,
  team_pro: 0.12,
} as const;

// Pricing tiers via Polar
//
// \`planKey\` points at the entry in src/lib/payments/products.ts that the
// Subscribe button purchases. Keep the two in step: the catalog decides the
// tier and credit grant, so this file is the marketing copy only.
//
// CAUTION: prices and credit amounts MUST match the live Polar product catalog
// exactly. A customer who sees a different price at checkout will abandon.
export const PRICING_TIERS: Record<string, PricingTier> = {
  FREE: {
    name: 'Free',
    price: 0,
    credits: 5,
    interval: null,
    description: '5 credits on signup. Try the core conversion flow.',
    polarProductId: '', // no product needed
    planKey: null,
    features: [
      '5 free credits',
      'PNG/JPG/WEBP → SVG',
      'Standard quality',
      'Watermarked exports',
    ],
  },
  STARTER: {
    name: 'Starter',
    price: 9.99,
    priceAnnual: 89.88,
    credits: 50,
    creditsAnnual: 600,
    interval: 'month',
    description: '50 credits/month. Best for individuals and hobbyists.',
    planKey: 'starter_monthly',
    planKeyAnnual: 'starter_annual',
    annualSavings: 26,
    overageRate: 0.20,
    features: [
      '50 credits/month',
      'PNG/JPG/WEBP → SVG conversion',
      'Background removal',
      'Image upscaling',
      'All export formats',
      'No watermarks',
    ],
  },
  PRO: {
    name: 'Pro',
    price: 24.99,
    priceAnnual: 224.88,
    credits: 250,
    creditsAnnual: 3000,
    interval: 'month',
    description: '250 credits/month. Perfect for creators and freelancers.',
    planKey: 'pro_monthly',
    planKeyAnnual: 'pro_annual',
    annualSavings: 17,
    overageRate: 0.20,
    features: [
      '250 credits/month',
      'Everything in Starter',
      'AI logo generation',
      'Style transfer',
      'Batch conversions',
      'Priority processing',
    ],
  },
  TEAM_STARTER: {
    name: 'Team Starter',
    price: 99,
    priceAnnual: 891,
    credits: 750,
    creditsAnnual: 9000,
    interval: 'month',
    description: '750 credits/month. For small shops and teams (3 seats).',
    planKey: 'team_starter_monthly',
    planKeyAnnual: 'team_starter_annual',
    annualSavings: 25,
    overageRate: 0.15,
    seats: 3,
    features: [
      '750 credits/month',
      '3 team seats included',
      'Everything in Pro',
      'Team collaboration',
      'Bulk operations',
      'Email support',
    ],
  },
  TEAM_PRO: {
    name: 'Team Pro',
    price: 249,
    priceAnnual: 2241,
    credits: 2500,
    creditsAnnual: 30000,
    interval: 'month',
    description: '2,500 credits/month. For production teams (10 seats).',
    planKey: 'team_pro_monthly',
    planKeyAnnual: 'team_pro_annual',
    annualSavings: 25,
    overageRate: 0.12,
    seats: 10,
    features: [
      '2,500 credits/month',
      '10 team seats included',
      'Everything in Team Starter',
      'Advanced API access',
      'Custom integrations',
      'Priority support',
    ],
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: null,
    credits: null,
    interval: null,
    description: 'Custom solutions for agencies and large teams.',
    planKey: null,
    features: [
      'Custom credit allocation',
      'Unlimited team seats',
      'White-label licensing',
      'SLA guarantee',
      'Dedicated account manager',
      'Custom contract terms',
    ],
  },
};

export type PricingTierKey = keyof typeof PRICING_TIERS;
export type CreditCostKey = keyof typeof CREDIT_COSTS;

// One-time credit packs (no subscription)
export interface CreditPack {
  credits: number;
  price: number;
  pricePerCredit: number;
  name: string;
  description: string;
  planKey: string;
  badge?: string;
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    credits: 20,
    price: 6.99,
    pricePerCredit: 0.35,
    name: 'Starter Pack',
    description: 'Perfect for one-off projects',
    planKey: 'one_time_credits',
  },
  {
    credits: 50,
    price: 14.99,
    pricePerCredit: 0.30,
    name: 'Value Pack',
    description: 'Best value for occasional use',
    planKey: 'one_time_credits_50',
    badge: 'Popular',
  },
  {
    credits: 100,
    price: 24.99,
    pricePerCredit: 0.25,
    name: 'Pro Pack',
    description: 'For serious projects',
    planKey: 'one_time_credits_100',
    badge: 'Best Value',
  },
];
