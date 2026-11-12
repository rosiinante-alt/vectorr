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

// Credit costs per operation — INTEGER PRICING 2026
// All values are whole numbers 0-10, no decimals
export const CREDIT_COSTS = {
  // Core tools
  VECTORIZE: 3,             // Anchor price: 3 credits
  REMOVE_BG: 1,             // Simplest operation
  UPSCALE_2X: 2,            // Light upscale
  UPSCALE_4X: 3,            // Heavy upscale
  
  // AI generation & editing
  STYLE_TRANSFER: 4,        // Style application
  AI_GENERATE: 4,           // AI logo / SVG / pattern generation
  AI_IMAGE: 6,              // Full AI image generation (heavier than logo/SVG)
  AI_EDIT: 4,               // Inpainting / variant generation
  BRAND_IDENTITY: 8,        // Full brand identity kit (2× AI_GENERATE)
  
  // Export
  EXPORT_PREMIUM: 0,        // Format exports are free

  // Animation tiers
  ANIMATE_ECO: 1,           // Basic fade-in (now 1 credit, was free)
  ANIMATE_STANDARD: 4,      // Stroke + entrance animations
  ANIMATE_PRO: 6,           // Staggered / morph / parallax

  // Content generation
  CONTENT_LISTING: 1,       // Etsy listing / alt text (now 1 credit)
  CONTENT_BLOG: 4,          // Long-form blog article
  CONTENT_GENERATION: 1,    // Backward-compat alias → listing tier
  
  // Video generation tiers (placeholders for future)
  VIDEO_QUICK: 7,           // Quick video generation
  VIDEO_HD: 8,              // HD quality video
  VIDEO_CINEMATIC: 9,       // Cinematic quality
  VIDEO_CINEMATIC_SOUND: 10, // Cinematic + soundtrack
  
  // Audio
  ADD_SOUND: 6,             // Add sound effects
  MUSIC_SFX: 6,             // Music & SFX generation
} as const;

// Overage rates per tier (charged per credit when over monthly limit)
export const OVERAGE_RATES = {
  starter: 0.20,
  pro: 0.15,
  team_starter: 0.12,
  team_pro: 0.10,
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
    credits: 15,
    interval: null,
    description: '15 credits on signup. Try the core conversion flow.',
    polarProductId: '', // no product needed
    planKey: null,
    features: [
      '15 free credits',
      'PNG/JPG/WEBP → SVG',
      'Standard quality',
      'Watermarked exports',
    ],
  },
  STARTER: {
    name: 'Starter',
    price: 9.99,
    priceAnnual: 89.88,
    credits: 150,
    creditsAnnual: 1800,
    interval: 'month',
    description: '150 credits/month. Best for individuals and hobbyists.',
    planKey: 'starter_monthly',
    planKeyAnnual: 'starter_annual',
    annualSavings: 26,
    overageRate: 0.20,
    features: [
      '150 credits/month',
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
    credits: 750,
    creditsAnnual: 9000,
    interval: 'month',
    description: '750 credits/month. Perfect for creators and freelancers.',
    planKey: 'pro_monthly',
    planKeyAnnual: 'pro_annual',
    annualSavings: 17,
    overageRate: 0.15,
    features: [
      '750 credits/month',
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
    credits: 2250,
    creditsAnnual: 27000,
    interval: 'month',
    description: '2,250 credits/month. For small shops and teams (3 seats).',
    planKey: 'team_starter_monthly',
    planKeyAnnual: 'team_starter_annual',
    annualSavings: 25,
    overageRate: 0.12,
    seats: 3,
    features: [
      '2,250 credits/month',
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
    credits: 7500,
    creditsAnnual: 90000,
    interval: 'month',
    description: '7,500 credits/month. For production teams (10 seats).',
    planKey: 'team_pro_monthly',
    planKeyAnnual: 'team_pro_annual',
    annualSavings: 25,
    overageRate: 0.10,
    seats: 10,
    features: [
      '7,500 credits/month',
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
    credits: 60,
    price: 4.99,
    pricePerCredit: 0.083,
    name: 'Sample Pack',
    description: 'Try out the platform',
    planKey: 'pack_sample',
  },
  {
    credits: 300,
    price: 19.99,
    pricePerCredit: 0.067,
    name: 'Creator Pack',
    description: 'For active creators',
    planKey: 'pack_creator',
    badge: 'Popular',
  },
  {
    credits: 900,
    price: 49.99,
    pricePerCredit: 0.056,
    name: 'Studio Pack',
    description: 'For production workflows',
    planKey: 'pack_studio',
  },
  {
    credits: 2700,
    price: 119.99,
    pricePerCredit: 0.044,
    name: 'Pro Pack',
    description: 'Maximum value for agencies',
    planKey: 'pack_pro',
    badge: 'Best Value',
  },
];
