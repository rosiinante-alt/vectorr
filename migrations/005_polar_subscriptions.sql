-- ---------------------------------------------------------------------------
-- Polar subscription tracking on user_credits
--
-- `user_credits` was originally modelled around Stripe: `subscription_id` is
-- documented as a Stripe subscription ID and `credit_transactions` records a
-- `stripe_payment_intent`. Polar is the payment provider actually in use, so the
-- identifiers we need to reconcile webhooks live in their own columns rather
-- than being smuggled into Stripe-named fields.
-- ---------------------------------------------------------------------------

alter table public.user_credits
  add column if not exists polar_subscription_id text,
  add column if not exists polar_customer_id     text,
  add column if not exists subscription_plan_key text,
  -- End of the paid period recorded from the subscription event, used to tell a
  -- late or duplicated cycle event from a genuine renewal.
  add column if not exists current_period_end    timestamptz;

create unique index if not exists user_credits_polar_subscription_id_idx
  on public.user_credits (polar_subscription_id)
  where polar_subscription_id is not null;

comment on column public.user_credits.polar_subscription_id is
  'Polar subscription ID for paid plans. NULL on the free tier.';
comment on column public.user_credits.subscription_plan_key is
  'Key into the product catalog (src/lib/payments/products.ts) for the active plan.';
comment on column public.user_credits.current_period_end is
  'End of the current paid period, mirrored from Polar for idempotency and display.';

-- ---------------------------------------------------------------------------
-- Polar identifiers on credit_transactions
--
-- A purchase must be idempotent per payment: Polar retries webhooks and may
-- deliver the same order more than once, and credits must not be granted twice.
-- ---------------------------------------------------------------------------

alter table public.credit_transactions
  add column if not exists polar_order_id       text,
  add column if not exists polar_subscription_id text;

create unique index if not exists credit_transactions_polar_order_id_idx
  on public.credit_transactions (polar_order_id)
  where polar_order_id is not null;

comment on column public.credit_transactions.polar_order_id is
  'Polar order that funded this transaction. Unique, so a retried webhook cannot double-grant.';

-- ---------------------------------------------------------------------------
-- grant_credits_once
--
-- Adds credits and records the funding Polar order in one statement, so a
-- duplicate webhook delivery is rejected by the unique index instead of paying
-- the customer twice. Returns false when the order was already processed.
-- ---------------------------------------------------------------------------

create or replace function public.grant_credits_once(
  p_user_id uuid,
  p_amount numeric,
  p_reason text,
  p_polar_order_id text
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance numeric;
begin
  insert into user_credits (user_id, balance)
  values (p_user_id, 0)
  on conflict (user_id) do nothing;

  select balance into v_balance
  from user_credits
  where user_id = p_user_id
  for update;

  begin
    insert into credit_transactions (user_id, amount, balance_after, reason, polar_order_id)
    values (p_user_id, p_amount, v_balance + p_amount, p_reason, p_polar_order_id);
  exception
    when unique_violation then
      -- This order has already been granted; release the row lock and report it.
      return false;
  end;

  update user_credits
  set balance = balance + p_amount,
      updated_at = now()
  where user_id = p_user_id;

  return true;
end;
$$;

comment on function public.grant_credits_once is
  'Grants credits for a Polar order exactly once. Returns false for a repeat delivery.';