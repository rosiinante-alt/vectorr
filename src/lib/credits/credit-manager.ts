import type { SupabaseClient } from '@supabase/supabase-js';

/** Re-exported so there is one source of truth for prices. */
export { CREDIT_COSTS } from './constants';

export type CreditReason =
  | 'conversion'
  | 'purchase'
  | 'refund'
  | 'subscription'
  | 'bonus'
  | 'batch_conversion'
  | 'ai_generation';

export interface CreditBalance {
  balance: number;
  tier: string;
}

/**
 * Thin wrapper over the `deduct_credits` / `add_credits` Postgres functions.
 *
 * Balance checks are advisory: `deductCredits` re-checks the balance inside the
 * function under a row lock, so a read-then-write race cannot overdraw.
 */
class CreditManager {
  async getBalance(supabase: SupabaseClient, userId: string): Promise<CreditBalance> {
    const { data, error } = await supabase
      .from('user_credits')
      .select('balance, tier')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw new Error(`Could not read credit balance: ${error.message}`);
    if (!data) return { balance: 0, tier: 'free' };

    return { balance: Number(data.balance), tier: String(data.tier) };
  }

  async hasEnoughCredits(
    supabase: SupabaseClient,
    userId: string,
    amount: number,
  ): Promise<boolean> {
    const { balance } = await this.getBalance(supabase, userId);
    return balance >= amount;
  }

  /** Returns false when the balance is insufficient; never throws for that case. */
  async deductCredits(
    supabase: SupabaseClient,
    userId: string,
    amount: number,
    reason: CreditReason,
    conversionId?: string | null,
  ): Promise<boolean> {
    const { data, error } = await supabase.rpc('deduct_credits', {
      p_user_id: userId,
      p_amount: amount,
      p_reason: reason,
      p_conversion_id: conversionId ?? null,
    });

    if (error) throw new Error(`Could not deduct credits: ${error.message}`);
    return data === true;
  }

  /** Restores credits, e.g. when a charged job could not be enqueued. */
  async addCredits(
    supabase: SupabaseClient,
    userId: string,
    amount: number,
    reason: CreditReason,
  ): Promise<void> {
    const { error } = await supabase.rpc('add_credits', {
      p_user_id: userId,
      p_amount: amount,
      p_reason: reason,
    });

    if (error) throw new Error(`Could not add credits: ${error.message}`);
  }
}

export const creditManager = new CreditManager();