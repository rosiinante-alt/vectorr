-- ============================================================================
-- 007: Credit Management Functions & Signup Hook
-- ============================================================================

set role postgres;

-- 1. deduct_credits
create or replace function public.deduct_credits(
  p_user_id uuid,
  p_amount numeric,
  p_reason text,
  p_conversion_id uuid default null
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance numeric;
begin
  -- Ensure user_credits row exists with 5 initial credits if first time
  insert into user_credits (user_id, balance, tier)
  values (p_user_id, 5.00, 'free')
  on conflict (user_id) do nothing;

  select balance into v_balance
  from user_credits
  where user_id = p_user_id
  for update;

  if v_balance is null or v_balance < p_amount then
    return false;
  end if;

  update user_credits
  set balance = balance - p_amount,
      updated_at = now()
  where user_id = p_user_id;

  insert into credit_transactions (user_id, amount, balance_after, reason, conversion_id)
  values (p_user_id, -p_amount, v_balance - p_amount, p_reason, p_conversion_id);

  return true;
end;
$$;

-- 2. add_credits
create or replace function public.add_credits(
  p_user_id uuid,
  p_amount numeric,
  p_reason text,
  p_stripe_payment_intent text default null
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance numeric;
begin
  insert into user_credits (user_id, balance, tier)
  values (p_user_id, 0, 'free')
  on conflict (user_id) do nothing;

  select balance into v_balance
  from user_credits
  where user_id = p_user_id
  for update;

  update user_credits
  set balance = balance + p_amount,
      updated_at = now()
  where user_id = p_user_id;

  insert into credit_transactions (user_id, amount, balance_after, reason, stripe_payment_intent)
  values (p_user_id, p_amount, v_balance + p_amount, p_reason, p_stripe_payment_intent);
end;
$$;

-- 3. get_user_credits
create or replace function public.get_user_credits(
  p_user_id uuid
) returns table (
  balance numeric,
  tier text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into user_credits (user_id, balance, tier)
  values (p_user_id, 5.00, 'free')
  on conflict (user_id) do nothing;

  return query
  select uc.balance, uc.tier
  from user_credits uc
  where uc.user_id = p_user_id;
end;
$$;

-- 4. Grant execute permissions to authenticated and service_role
grant execute on function public.deduct_credits to authenticated, service_role;
grant execute on function public.add_credits to authenticated, service_role;
grant execute on function public.get_user_credits to authenticated, service_role;

-- 5. Auto-grant 5 credits on new auth user signup
create or replace function public.handle_new_user_credits()
returns trigger as $$
begin
  insert into public.user_credits (user_id, balance, tier)
  values (new.id, 5.00, 'free')
  on conflict (user_id) do nothing;

  insert into public.credit_transactions (user_id, amount, balance_after, reason)
  values (new.id, 5.00, 5.00, 'bonus');

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created_credits on auth.users;
create trigger on_auth_user_created_credits
  after insert on auth.users
  for each row execute function public.handle_new_user_credits();
