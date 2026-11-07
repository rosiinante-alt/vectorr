import { polar } from '@/lib/polar';

import { getProductByKey, type ProductDefinition, type ProductKey } from './products';

export interface CheckoutSession {
  checkoutId: string;
  /** Hosted Polar checkout page to redirect the buyer to. */
  url: string;
}

export class CheckoutError extends Error {
  readonly code: 'unknown_plan' | 'unconfigured_plan' | 'polar_error';

  constructor(code: CheckoutError['code'], message: string) {
    super(message);
    this.name = 'CheckoutError';
    this.code = code;
  }
}

/** What we need to know about the buyer to open a checkout. */
export interface CheckoutBuyer {
  userId: string;
  email: string | null;
  /** Absolute URL Polar redirects to after a successful payment. */
  successUrl: string;
}

/**
 * Opens a Polar checkout for one of our catalog plans.
 *
 * `metadata.userId` is the only link between a Polar payment and a Vectroy
 * account, and it is written here on the server from the authenticated session
 * — never taken from the request body.
 */
export async function createCheckoutSession(
  planKey: ProductKey,
  buyer: CheckoutBuyer,
): Promise<CheckoutSession> {
  const product: ProductDefinition | null = getProductByKey(planKey);
  if (!product) {
    throw new CheckoutError('unknown_plan', `Unknown plan: ${planKey}`);
  }
  if (!product.id) {
    throw new CheckoutError(
      'unconfigured_plan',
      `${product.envKey} is not configured, so ${product.name} cannot be purchased yet`,
    );
  }

  try {
    const checkout = await polar.checkouts.create({
      products: [product.id],
      customer_email: buyer.email ?? undefined,
      success_url: buyer.successUrl,
      metadata: { userId: buyer.userId, planKey },
    });

    return { checkoutId: checkout.id, url: checkout.url };
  } catch (error) {
    throw new CheckoutError(
      'polar_error',
      error instanceof Error ? error.message : 'Polar rejected the checkout request',
    );
  }
}