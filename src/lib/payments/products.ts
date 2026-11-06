/**
 * Catalog of purchasable Polar products and the credits each one grants.
 *
 * Polar's API identifies products by an opaque UUID that only exists once the
 * product is created in the dashboard, so product IDs are read from the
 * environment rather than hardcoded. A product whose ID is unset is simply not
 * offered for sale; nothing else in the catalog depends on it.
 *
 * The credit amount for a purchase comes from THIS catalog (looked up by
 * product ID), never from the webhook payload, so a client cannot influence how
 * many credits a payment grants.
 */

export type PurchaseTier = 'free' | 'starter' | 'plus' | 'pro';

export interface ProductDefinition {
  /** Polar product ID, resolved at runtime from `envKey`. */
  id: string | null;
  envKey: string;
  name: string;
  /** Credits granted per billing period (or per purchase, when one-time). */
  credits: number;
  /** `null` for a one-time purchase. */
  interval: 'month' | 'year' | null;
  /** Tier written to `user_credits.tier` while the subscription is active. */
  tier: PurchaseTier;
  /** Credits are granted once on checkout, or renewed on each subscription cycle. */
  recurring: boolean;
}

// `process.env.X` is written out in full rather than built from `envKey`, because
// Next.js inlines only statically written environment reads at build time.
export const PRODUCTS: Record<string, ProductDefinition> = {
  one_time_credits: {
    id: process.env.POLAR_PRODUCT_ONE_TIME_CREDITS ?? null,
    envKey: 'POLAR_PRODUCT_ONE_TIME_CREDITS',
    name: 'Credit pack',
    credits: 20,
    interval: null,
    tier: 'free',
    recurring: false,
  },
  starter_monthly: {
    id: process.env.POLAR_PRODUCT_STARTER_MONTHLY ?? null,
    envKey: 'POLAR_PRODUCT_STARTER_MONTHLY',
    name: 'Starter (monthly)',
    credits: 5,
    interval: 'month',
    tier: 'starter',
    recurring: true,
  },
  plus_monthly: {
    id: process.env.POLAR_PRODUCT_PLUS_MONTHLY ?? null,
    envKey: 'POLAR_PRODUCT_PLUS_MONTHLY',
    name: 'Plus (monthly)',
    credits: 8,
    interval: 'month',
    tier: 'plus',
    recurring: true,
  },
  pro_monthly: {
    id: process.env.POLAR_PRODUCT_PRO_MONTHLY ?? null,
    envKey: 'POLAR_PRODUCT_PRO_MONTHLY',
    name: 'Pro (monthly)',
    credits: 20,
    interval: 'month',
    tier: 'pro',
    recurring: true,
  },
  starter_yearly: {
    id: process.env.POLAR_PRODUCT_STARTER_YEARLY ?? null,
    envKey: 'POLAR_PRODUCT_STARTER_YEARLY',
    name: 'Starter (yearly)',
    credits: 60,
    interval: 'year',
    tier: 'starter',
    recurring: true,
  },
  plus_yearly: {
    id: process.env.POLAR_PRODUCT_PLUS_YEARLY ?? null,
    envKey: 'POLAR_PRODUCT_PLUS_YEARLY',
    name: 'Plus (yearly)',
    credits: 96,
    interval: 'year',
    tier: 'plus',
    recurring: true,
  },
  pro_yearly: {
    id: process.env.POLAR_PRODUCT_PRO_YEARLY ?? null,
    envKey: 'POLAR_PRODUCT_PRO_YEARLY',
    name: 'Pro (yearly)',
    credits: 240,
    interval: 'year',
    tier: 'pro',
    recurring: true,
  },
};

export type ProductKey = keyof typeof PRODUCTS;

/** Product keys with a configured Polar product ID, i.e. what can be bought today. */
export function availableProductKeys(): ProductKey[] {
  return (Object.keys(PRODUCTS) as ProductKey[]).filter((key) => Boolean(PRODUCTS[key].id));
}

export function getProductByKey(key: string): ProductDefinition | null {
  return Object.prototype.hasOwnProperty.call(PRODUCTS, key) ? PRODUCTS[key] : null;
}

export function getProductByPolarId(productId: string): ProductDefinition | null {
  return Object.values(PRODUCTS).find((product) => product.id === productId) ?? null;
}