import { NextResponse, type NextRequest } from 'next/server';

import { validateEvent } from '@/lib/polar';
import {
  applySubscriptionState,
  endSubscription,
  grantOrderCredits,
  mapSubscriptionStatus,
  resolveUserId,
  FulfillmentError,
} from '@/lib/payments/fulfillment';
import { getProductByPolarId } from '@/lib/payments/products';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

/**
 * POST /api/webhooks/polar
 *
 * Receives Polar webhooks. The signature is verified against the raw body before
 * anything else happens; an unverified request is rejected without touching the
 * database. Writes use the service-role client because Polar calls us without a
 * user session.
 *
 * Configure this URL in the Polar dashboard with format "Raw".
 */

/** The verified payload type, derived from the SDK's own `validateEvent`. */
type VerifiedEvent = Awaited<ReturnType<typeof validateEvent>>;

/** Returns 200 for failures that retrying cannot fix, so Polar stops re-sending. */
function skip(reason: string) {
  console.warn(`Polar webhook skipped: ${reason}`);
  return NextResponse.json({ ok: false, skipped: reason });
}

export async function POST(request: NextRequest) {
  const secret = process.env.POLAR_WEBHOOK_SECRET;
  if (!secret) {
    console.error('POLAR_WEBHOOK_SECRET is not configured');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const body = await request.text();
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  let event: VerifiedEvent;
  try {
    event = await validateEvent(body, headers, secret);
  } catch (error) {
    // A bad signature is a 401 and is never retried into a valid one.
    console.error('Polar webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();

  try {
    switch (event.type) {
      case 'order.paid': {
        const order = event.data;
        if (!order.paid) return skip(`order ${order.id} is not paid`);

        const product = getProductByPolarId(order.product_id ?? '');
        if (!product) return skip(`order ${order.id} references an unknown product`);

        const result = await grantOrderCredits(supabase, {
          id: order.id,
          productId: order.product_id,
          metadata: order.metadata,
          recurring: order.product?.is_recurring ?? product.recurring,
        });

        // A repeat delivery is expected, not an error: Polar retries webhooks.
        if (!result.granted) return skip(`order ${order.id} was already granted`);

        console.log(`Granted ${result.credits} credits for order ${order.id} (${result.reason})`);
        return NextResponse.json({ ok: true });
      }

      case 'subscription.active':
      case 'subscription.created':
      case 'subscription.updated':
      case 'subscription.uncanceled':
      case 'subscription.resumed':
      case 'subscription.cycled': {
        const subscription = event.data;
        const userId = resolveUserId(subscription.metadata);
        const product = getProductByPolarId(subscription.product_id);
        if (!product) return skip(`subscription ${subscription.id} references an unknown product`);

        await applySubscriptionState(supabase, userId, {
          subscriptionId: subscription.id,
          status: mapSubscriptionStatus(subscription.status, subscription.cancel_at_period_end),
          planKey: subscription.product_id,
          tier: product.tier,
          polarCustomerId: subscription.customer_id,
          currentPeriodEnd: subscription.current_period_end,
        });

        return NextResponse.json({ ok: true });
      }

      case 'subscription.canceled':
      case 'subscription.revoked': {
        const subscription = event.data;
        const userId = resolveUserId(subscription.metadata);

        // Cancelling schedules the end of the period; access continues until
        // Polar revokes the subscription. A revocation ends it immediately.
        if (event.type === 'subscription.canceled' && subscription.ends_at) {
          await applySubscriptionState(supabase, userId, {
            subscriptionId: subscription.id,
            status: 'active',
            planKey: subscription.product_id,
            tier: getProductByPolarId(subscription.product_id)?.tier ?? 'free',
            polarCustomerId: subscription.customer_id,
            currentPeriodEnd: subscription.ends_at,
          });
          return NextResponse.json({ ok: true });
        }

        await endSubscription(supabase, userId, subscription.id);
        return NextResponse.json({ ok: true });
      }

      case 'subscription.past_due': {
        const subscription = event.data;
        const userId = resolveUserId(subscription.metadata);
        await applySubscriptionState(supabase, userId, {
          subscriptionId: subscription.id,
          status: 'past_due',
          planKey: subscription.product_id,
          tier: getProductByPolarId(subscription.product_id)?.tier ?? 'free',
          polarCustomerId: subscription.customer_id,
          currentPeriodEnd: subscription.current_period_end,
        });
        return NextResponse.json({ ok: true });
      }

      default:
        // Unhandled event types are acknowledged so Polar does not retry them.
        return NextResponse.json({ ok: true, ignored: event.type });
    }
  } catch (error) {
    if (error instanceof FulfillmentError) {
      // A payload we cannot map (e.g. missing metadata.userId) will not succeed
      // on retry either.
      console.error(`Polar webhook could not be fulfilled (${event.type}):`, error.message);
      return skip(error.message);
    }

    // Anything else may be transient (database down), so return 500 to retry.
    console.error(`Polar webhook failed (${event.type}):`, error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}