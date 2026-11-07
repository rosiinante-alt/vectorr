import type { SupabaseClient } from '@supabase/supabase-js';

import { getProductByPolarId, type ProductDefinition } from './products';

/**
 * Business logic for turning verified Polar webhook events into credit grants.
 *
 * Every entry point here assumes the caller has already verified the webhook
 * signature, and writes through a service-role client because webhooks arrive
 * without a user session.
 */

export class FulfillmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FulfillmentError';
  }
}

function isUuid(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  );
}

/**
 * Resolves the Vectroy user a payment belongs to.
 *
 * `metadata.userId` is written by our own checkout endpoint. Orders also carry
 * the metadata of the checkout that produced them, so a one-time purchase and a
 * subscription both resolve through the same field.
 */
export function resolveUserId(metadata: Record<string, unknown> | null | undefined): string {
  const userId = metadata?.userId;
  if (!isUuid(userId)) {
    throw new FulfillmentError('Webhook payload has no valid metadata.userId');
  }
  return userId;
}

/** Finds the catalog entry for a Polar product ID, or throws. */
export function resolveProduct(productId: string | null | undefined): ProductDefinition {
  if (!productId) throw new FulfillmentError('Webhook payload has no product');
  const product = getProductByPolarId(productId);
  if (!product) {
    throw new FulfillmentError(`Product ${productId} is not in the catalog`);
  }
  return product;
}

export interface GrantResult {
  granted: boolean;
  credits: number;
  reason: 'purchase' | 'subscription';
}

/**
 * Grants the credits attached to a paid order.
 *
 * Idempotent on the Polar order ID: a retried or duplicated `order.paid` event
 * grants nothing the second time. `grant_credits_once` enforces this in the
 * database rather than relying on a read-then-write check here.
 */
export async function grantOrderCredits(
  supabase: SupabaseClient,
  order: {
    id: string;
    productId: string | null | undefined;
    metadata: Record<string, unknown> | null | undefined;
    recurring: boolean;
  },
): Promise<GrantResult> {
  const userId = resolveUserId(order.metadata);
  const product = resolveProduct(order.productId);

  const { data, error } = await supabase.rpc('grant_credits_once', {
    p_user_id: userId,
    p_amount: product.credits,
    p_reason: order.recurring ? 'subscription' : 'purchase',
    p_polar_order_id: order.id,
  });

  if (error) throw new FulfillmentError(`Could not grant credits: ${error.message}`);

  return {
    granted: data === true,
    credits: product.credits,
    reason: order.recurring ? 'subscription' : 'purchase',
  };
}

export interface SubscriptionState {
  subscriptionId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  planKey: string | null;
  tier: string;
  polarCustomerId: string | null;
  currentPeriodEnd: string | null;
}

/** Maps a Polar subscription status onto the values `user_credits` accepts. */
export function mapSubscriptionStatus(
  status: string,
  cancelAtPeriodEnd: boolean,
): SubscriptionState['status'] {
  if (status === 'past_due') return 'past_due';
  if (status === 'trialing') return 'trialing';
  if (status === 'canceled' || status === 'revoked') return 'canceled';
  // A subscription scheduled to end still has paid access until the period
  // rolls over, so it stays `active` rather than reading as cancelled.
  if (cancelAtPeriodEnd) return 'active';
  return 'active';
}

/**
 * Applies a subscription lifecycle event to `user_credits`.
 *
 * Credit grants are handled separately (see `grantOrderCredits`) because they
 * belong to an order; this only maintains the tier and status shown in the UI.
 */
export async function applySubscriptionState(
  supabase: SupabaseClient,
  userId: string,
  state: SubscriptionState,
): Promise<void> {
  const { error } = await supabase
    .from('user_credits')
    .upsert(
      {
        user_id: userId,
        tier: state.tier,
        subscription_status: state.status,
        subscription_id: state.subscriptionId,
        polar_subscription_id: state.subscriptionId,
        polar_customer_id: state.polarCustomerId,
        subscription_plan_key: state.planKey,
        current_period_end: state.currentPeriodEnd,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id', ignoreDuplicates: false },
    );

  if (error) throw new FulfillmentError(`Could not update subscription: ${error.message}`);
}

/** Marks a subscription as ended and returns the account to the free tier. */
export async function endSubscription(
  supabase: SupabaseClient,
  userId: string,
  subscriptionId: string,
): Promise<void> {
  const { error } = await supabase
    .from('user_credits')
    .update({
      tier: 'free',
      subscription_status: 'canceled',
      subscription_plan_key: null,
      current_period_end: null,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('polar_subscription_id', subscriptionId);

  if (error) throw new FulfillmentError(`Could not end subscription: ${error.message}`);
}