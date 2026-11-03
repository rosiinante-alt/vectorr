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
export const PRICING_TIERS = {
  FREE: {
    name: 'Free',
    price: 0,
    credits: 5,
    interval: null,
    description: '5 credits on signup. Try the core conversion flow.',
    polarProductId: '', // no product needed
    features: [
      '5 free credits',
      'PNG/JPG/WEBP → SVG',
      'Standard quality',
      'Watermarked exports',
    ],
  },
  PLUS: {
    name: 'Plus',
    price: 9.99,
    credits: 50,
    interval: 'month',
    description: '50 credits/month. Best for individuals.',
    polarProductId: process.env.POLAR_PLUS_PRODUCT_ID ?? '',
    features: [
      '50 credits/month',
      'PNG/JPG/WEBP → SVG',
      'Background removal',
      '2x upscaling',
      'All export formats',
      'No watermarks',
    ],
  },
  TEAM: {
    name: 'Team',
    price: 39,
    credits: 200,
    interval: 'month',
    description: '200 credits/month shared across 3 seats.',
    polarProductId: process.env.POLAR_TEAM_PRODUCT_ID ?? '',
    features: [
      '200 credits/month',
      '3 team seats',
      'Shared workspace',
      'Comments & version history',
      'All Plus features',
      'Priority support',
    ],
  },
  AGENCY: {
    name: 'Agency',
    price: 99,
    credits: 1000,
    interval: 'month',
    description: '1,000 credits/month for agencies and studios.',
    polarProductId: process.env.POLAR_AGENCY_PRODUCT_ID ?? '',
    features: [
      '1,000 credits/month',
      'Unlimited seats',
      'Workflow automation',
      'Folder watching',
      'API access',
      'All Team features',
    ],
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 999,
    credits: 10000,
    interval: 'month',
    description: 'Custom volume, SSO, audit logs.',
    polarProductId: process.env.POLAR_ENTERPRISE_PRODUCT_ID ?? '',
    features: [
      '10,000 credits/month',
      'SSO / SAML',
      'Audit logs',
      'SLA guarantee',
      'Dedicated support',
      'Custom integrations',
    ],
  },
} as const;

export type PricingTierKey = keyof typeof PRICING_TIERS;
export type CreditCostKey = keyof typeof CREDIT_COSTS;
