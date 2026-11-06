-- ============================================================================
-- 009: Lock down credit functions and balances
--
-- The credit functions are SECURITY DEFINER and were executable by `anon` and
-- `authenticated` (Postgres grants EXECUTE to PUBLIC by default). Anyone with
-- the public anon key could call add_credits / grant_credits_once for any user
-- id, and the user_credits UPDATE policy let a signed-in user set their own
-- balance. The app only changes credits from the server with the service role,
-- so clients lose all write paths here.
--
-- Idempotent. Reversible with matching GRANT statements.
-- ============================================================================

revoke execute on function public.add_credits(uuid, numeric, text, text)              from public, anon, authenticated;
revoke execute on function public.deduct_credits(uuid, numeric, text, uuid)           from public, anon, authenticated;
revoke execute on function public.grant_credits_once(uuid, numeric, text, text)       from public, anon, authenticated;
revoke execute on function public.refund_failed_conversion(uuid, text)                from public, anon, authenticated;
revoke execute on function public.refund_failed_generation(uuid, text)                from public, anon, authenticated;
revoke execute on function public.get_user_credits(uuid)                               from public, anon, authenticated;
revoke execute on function public.handle_new_user_credits()                           from public, anon, authenticated;

grant execute on function public.add_credits(uuid, numeric, text, text)               to service_role;
grant execute on function public.deduct_credits(uuid, numeric, text, uuid)            to service_role;
grant execute on function public.grant_credits_once(uuid, numeric, text, text)        to service_role;
grant execute on function public.refund_failed_conversion(uuid, text)                 to service_role;
grant execute on function public.refund_failed_generation(uuid, text)                 to service_role;
grant execute on function public.get_user_credits(uuid)                                to service_role;

-- Balances are read-only to their owner. Only the service role writes them.
drop policy if exists "Users can update their own credits (service role only)" on public.user_credits;
revoke insert, update, delete on public.user_credits        from anon, authenticated;
revoke insert, update, delete on public.credit_transactions from anon, authenticated;
