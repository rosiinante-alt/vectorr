import type { SupabaseClient } from '@supabase/supabase-js';

type RefundTarget = 'conversion' | 'generation';

const RPC: Record<RefundTarget, { fn: string; arg: string }> = {
  conversion: { fn: 'refund_failed_conversion', arg: 'p_conversion_id' },
  generation: { fn: 'refund_failed_generation', arg: 'p_generation_id' },
};

/**
 * Returns the credits charged for a row whose job produced no result.
 *
 * The RPC is idempotent (it stamps `refunded_at` under a row lock), so calling
 * it again for the same row is a no-op and returns false.
 */
export async function refundFailedJob(
  supabase: SupabaseClient,
  target: RefundTarget,
  id: string,
): Promise<boolean> {
  const { fn, arg } = RPC[target];
  const { data, error } = await supabase.rpc(fn, { [arg]: id, p_reason: 'refund' });

  if (error) {
    console.error(`Refund for ${target} ${id} failed: ${error.message}`);
    return false;
  }

  if (data === true) console.log(`Refunded ${target} ${id}`);
  return data === true;
}
