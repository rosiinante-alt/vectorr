import type { SupabaseClient } from '@supabase/supabase-js';

const USER_ID = '8f14e45f-ceea-467f-a1b2-1c9e6e2b8a11';

// The catalog reads product IDs at module load, so these must be set before the
// modules under test are imported.
process.env.POLAR_PRODUCT_ONE_TIME_CREDITS = 'prod_one_time';
process.env.POLAR_PRODUCT_PLUS_MONTHLY = 'prod_plus_monthly';

import {
  applySubscriptionState,
  endSubscription,
  grantOrderCredits,
  mapSubscriptionStatus,
  resolveProduct,
  resolveUserId,
  FulfillmentError,
} from '@/lib/payments/fulfillment';
import { availableProductKeys, getProductByKey, getProductByPolarId } from '@/lib/payments/products';

/** Minimal Supabase stub: records the rpc/update calls each function makes. */
function stubClient(overrides: {
  rpcResult?: { data: unknown; error: unknown };
  onFrom?: (table: string, method: string, payload?: unknown) => { error: unknown };
} = {}) {
  const calls: { method: string; args: unknown[] }[] = [];

  const client = {
    rpc: jest.fn(async (fn: string, params: unknown) => {
      calls.push({ method: `rpc:${fn}`, args: [params] });
      return overrides.rpcResult ?? { data: true, error: null };
    }),
    from: jest.fn((table: string) => ({
      upsert: async (payload: unknown) => {
        calls.push({ method: 'upsert', args: [table, payload] });
        return overrides.onFrom?.(table, 'upsert', payload) ?? { error: null };
      },
      update: (payload: unknown) => {
        calls.push({ method: 'update', args: [table, payload] });
        const result = { eq: () => ({ eq: async () => overrides.onFrom?.(table, 'update', payload) ?? { error: null } }) };
        return { ...result, then: undefined };
      },
    })),
  };

  return { client: client as unknown as SupabaseClient, calls, raw: client };
}

describe('resolveUserId', () => {
  it('returns a valid uuid from metadata', () => {
    expect(resolveUserId({ userId: USER_ID })).toBe(USER_ID);
  });

  it('rejects missing, malformed, and non-string ids', () => {
    expect(() => resolveUserId(undefined)).toThrow(FulfillmentError);
    expect(() => resolveUserId({})).toThrow(FulfillmentError);
    expect(() => resolveUserId({ userId: 'not-a-uuid' })).toThrow(FulfillmentError);
    expect(() => resolveUserId({ userId: 42 })).toThrow(FulfillmentError);
  });
});

describe('resolveProduct', () => {
  it('rejects an unknown product id', () => {
    expect(() => resolveProduct('prod_does_not_exist')).toThrow(FulfillmentError);
    expect(() => resolveProduct(null)).toThrow(FulfillmentError);
  });
});

describe('grantOrderCredits', () => {
  it('grants the catalog credit amount for a one-time purchase', async () => {
    const { client, calls } = stubClient();

    const result = await grantOrderCredits(client, {
      id: 'order_1',
      productId: 'prod_one_time',
      metadata: { userId: USER_ID },
      recurring: false,
    });

    expect(result).toEqual({ granted: true, credits: 1.2, reason: 'purchase' });
    expect(calls[0]).toEqual({
      method: 'rpc:grant_credits_once',
      args: [
        {
          p_user_id: USER_ID,
          p_amount: 1.2,
          p_reason: 'purchase',
          p_polar_order_id: 'order_1',
        },
      ],
    });
  });

  it('reports granted=false when the database rejects a duplicate order', async () => {
    const { client } = stubClient({ rpcResult: { data: false, error: null } });

    const result = await grantOrderCredits(client, {
      id: 'order_1',
      productId: 'prod_one_time',
      metadata: { userId: USER_ID },
      recurring: false,
    });

    expect(result.granted).toBe(false);
  });

  it('surfaces database errors instead of claiming success', async () => {
    const { client } = stubClient({
      rpcResult: { data: null, error: { message: 'boom' } },
    });

    await expect(
      grantOrderCredits(client, {
        id: 'order_1',
        productId: 'prod_one_time',
        metadata: { userId: USER_ID },
        recurring: false,
      }),
    ).rejects.toThrow(/could not grant credits/i);
  });

  it('labels recurring orders as subscription grants', async () => {
    const { client } = stubClient();

    const result = await grantOrderCredits(client, {
      id: 'order_2',
      productId: 'prod_plus_monthly',
      metadata: { userId: USER_ID },
      recurring: true,
    });

    expect(result.reason).toBe('subscription');
  });
});

describe('mapSubscriptionStatus', () => {
  it('keeps a period-end cancellation active', () => {
    // Paid access continues until the period rolls over.
    expect(mapSubscriptionStatus('active', true)).toBe('active');
  });

  it('maps the statuses that user_credits accepts', () => {
    expect(mapSubscriptionStatus('active', false)).toBe('active');
    expect(mapSubscriptionStatus('past_due', false)).toBe('past_due');
    expect(mapSubscriptionStatus('trialing', false)).toBe('trialing');
    expect(mapSubscriptionStatus('canceled', false)).toBe('canceled');
    expect(mapSubscriptionStatus('revoked', false)).toBe('canceled');
    expect(mapSubscriptionStatus('something_new', false)).toBe('active');
  });
});

describe('applySubscriptionState', () => {
  it('writes the tier and Polar identifiers', async () => {
    const { client, calls } = stubClient();

    await applySubscriptionState(client, USER_ID, {
      subscriptionId: 'sub_1',
      status: 'active',
      planKey: 'plus_monthly',
      tier: 'plus',
      polarCustomerId: 'cus_1',
      currentPeriodEnd: '2026-12-01T00:00:00Z',
    });

    expect(calls[0].method).toBe('upsert');
    const [table, payload] = calls[0].args as [string, Record<string, unknown>];
    expect(table).toBe('user_credits');
    expect(payload).toMatchObject({
      user_id: USER_ID,
      tier: 'plus',
      subscription_status: 'active',
      polar_subscription_id: 'sub_1',
      polar_customer_id: 'cus_1',
      subscription_plan_key: 'plus_monthly',
      current_period_end: '2026-12-01T00:00:00Z',
    });
    // Balance must never be written by a subscription event.
    expect(payload).not.toHaveProperty('balance');
  });

  it('throws when the write fails', async () => {
    const { client } = stubClient({ onFrom: () => ({ error: { message: 'nope' } }) });

    await expect(
      applySubscriptionState(client, USER_ID, {
        subscriptionId: 'sub_1',
        status: 'active',
        planKey: 'plus_monthly',
        tier: 'plus',
        polarCustomerId: null,
        currentPeriodEnd: null,
      }),
    ).rejects.toThrow(/could not update subscription/i);
  });
});

describe('endSubscription', () => {
  it('returns the account to the free tier', async () => {
    const { client, calls } = stubClient();

    await endSubscription(client, USER_ID, 'sub_1');

    const [table, payload] = calls[0].args as [string, Record<string, unknown>];
    expect(table).toBe('user_credits');
    expect(payload).toMatchObject({ tier: 'free', subscription_status: 'canceled' });
  });
});

describe('product catalog', () => {
  it('exposes only products whose Polar IDs are configured', () => {
    expect(availableProductKeys().sort()).toEqual(['one_time_credits', 'plus_monthly']);
    // Unconfigured products must never be offered with a placeholder ID.
    expect(getProductByKey('pro_monthly')?.id).toBeNull();
  });

  it('rejects unknown plan keys', () => {
    expect(getProductByKey('enterprise_mega')).toBeNull();
    // Guards against prototype keys resolving to a truthy value.
    expect(getProductByKey('toString')).toBeNull();
  });

  it('does not match an unconfigured product by empty id', () => {
    expect(getProductByPolarId('')).toBeNull();
    expect(getProductByPolarId('prod_unconfigured')).toBeNull();
  });
});