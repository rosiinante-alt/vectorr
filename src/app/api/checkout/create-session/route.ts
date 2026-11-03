import { NextResponse, type NextRequest } from 'next/server';

import { badRequest, jsonError, serverError, unauthorized } from '@/lib/http';
import { createCheckoutSession, CheckoutError } from '@/lib/payments/polar-client';
import { availableProductKeys, getProductByKey, type ProductKey } from '@/lib/payments/products';
import { authenticate } from '@/lib/supabase/server';

/**
 * POST /api/checkout/create-session
 *
 * Body: { planKey: string }
 *
 * Opens a Polar checkout for the signed-in user and returns the hosted URL.
 * The user identity is attached to the checkout as `metadata.userId` here on the
 * server; the webhook handler relies on that when granting credits.
 */
export async function POST(request: NextRequest) {
  const { user } = await authenticate();
  if (!user) return unauthorized();

  let body: { planKey?: unknown };
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  if (typeof body.planKey !== 'string' || !getProductByKey(body.planKey)) {
    return jsonError('Unknown plan', 400, { availablePlans: availableProductKeys() });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    return serverError('NEXT_PUBLIC_SITE_URL is not configured');
  }

  try {
    const checkout = await createCheckoutSession(body.planKey as ProductKey, {
      userId: user.id,
      email: user.email,
      successUrl: new URL('/dashboard?checkout=success', siteUrl).toString(),
    });

    return NextResponse.json(checkout, { status: 201 });
  } catch (error) {
    if (error instanceof CheckoutError) {
      // A plan that exists in our catalog but has no Polar product is a
      // configuration gap on our side, not a bad request from the caller.
      if (error.code === 'unconfigured_plan') return serverError(error.message);
      if (error.code === 'unknown_plan') return badRequest(error.message);
    }
    console.error('Polar checkout failed:', error);
    return serverError('Could not create checkout');
  }
}

/** GET returns which plans are currently purchasable, for the pricing UI. */
export async function GET() {
  const plans = availableProductKeys().map((key) => {
    const product = getProductByKey(key);
    return {
      planKey: key,
      name: product?.name,
      credits: product?.credits,
      interval: product?.interval,
    };
  });

  return NextResponse.json({ plans });
}