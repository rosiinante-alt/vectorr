// Credit costs per operation — match VectoSolve pricing
export const CREDIT_COSTS = {
  VECTORIZE: 0.20,
  REMOVE_BG: 0.07,
  UPSCALE_2X: 0.15,
  UPSCALE_4X: 0.25,
  STYLE_TRANSFER: 0.50,
  AI_GENERATE: 2.50,
  AI_EDIT: 1.00,
  EXPORT_PREMIUM: 0.05, // DXF, EPS, G-code, DST
} as const;

// Pricing tiers via Polar
//
// `planKey` points at the entry in src/lib/payments/products.ts that the
// Subscribe button purchases. Keep the two in step: the catalog decides the
// tier and credit grant, so this file is the marketing copy only.
//
// CAUTION: prices and credit amounts MUST match the live Polar product catalog
// exactly. A customer who sees a different price at checkout will abandon.
export const PRICING_TIERS = {
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
    price: 7.99,
    credits: 5,
    interval: 'month',
    description: '5 credits/month. Best for individuals.',
    planKey: 'starter_monthly',
    features: [
      '5 credits/month',
      'PNG/JPG/WEBP → SVG',
      'Background removal',
      '2× upscaling',
      'All export formats',
      'No watermarks',
    ],
  },
  PLUS: {
    name: 'Plus',
    price: 9.99,
    credits: 8,
    interval: 'month',
    description: '8 credits/month. Perfect for small teams.',
    planKey: 'plus_monthly',
    features: [
      '8 credits/month',
      'Everything in Starter',
      '4× upscaling',
      'Style transfer',
      'Batch conversions',
      'Priority processing',
    ],
  },
  PRO: {
    name: 'Pro',
    price: 14.99,
    credits: 20,
    interval: 'month',
    description: '20 credits/month. For professionals and agencies.',
    planKey: 'pro_monthly',
    features: [
      '20 credits/month',
      'Everything in Plus',
      'AI generation',
      'Workflow automation',
      'API access',
      'Priority support',
    ],
  },
} as const;

export type PricingTierKey = keyof typeof PRICING_TIERS;
export type CreditCostKey = keyof typeof CREDIT_COSTS;
