-- ============================================================================
-- 008: Reconcile schema with the application
--
-- `001_schema_v2_migration_fixed.sql` was executed against the live database,
-- but it is a *different* schema from `001_schema_v2_migration.sql`: it created
-- `batch_conversions` / `batch_items` / `style_transfer_presets` (which no
-- application code reads) and omitted `batch_jobs` / `batch_files` /
-- `ai_generations` / `conversion_folders` / `files` / `exports` (which the
-- application does read).
--
-- This migration is idempotent and only adds what is missing. The legacy
-- `batch_conversions`, `batch_items` and `style_transfer_presets` tables are
-- left untouched: they are empty and dropping them is a separate decision.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Batch pipeline (read by src/lib/batch/*, src/lib/workers/batch-worker.ts)
-- ----------------------------------------------------------------------------
create table if not exists public.batch_jobs (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  team_id         uuid references public.teams(id) on delete set null,
  status          text not null default 'pending'
                    check (status in ('pending', 'processing', 'complete', 'failed', 'partial')),
  total_files     int not null check (total_files > 0 and total_files <= 50),
  completed_files int not null default 0 check (completed_files >= 0),
  failed_files    int not null default 0 check (failed_files >= 0),
  zip_url         text,
  zip_expires_at  timestamptz,
  preprocessing   jsonb not null default '{}'::jsonb,
  -- Set when the whole batch fails and its charge is refunded, so a retried
  -- delivery of the same job cannot refund twice.
  refunded_at     timestamptz,
  created_at      timestamptz not null default now(),
  completed_at    timestamptz
);

create index if not exists batch_jobs_user_id_idx on public.batch_jobs(user_id);
create index if not exists batch_jobs_status_idx on public.batch_jobs(status);
create index if not exists batch_jobs_user_status_idx on public.batch_jobs(user_id, status);

create table if not exists public.batch_files (
  id            uuid primary key default gen_random_uuid(),
  batch_id      uuid not null references public.batch_jobs(id) on delete cascade,
  file_url      text not null,
  status        text not null default 'pending'
                  check (status in ('pending', 'processing', 'complete', 'failed')),
  result_url    text,
  error_message text,
  credits_used  numeric(5,2) check (credits_used >= 0),
  -- Everything the app holds onto for the customer, even after the conversion
  -- is delivered (source raster + converted vector).
  retained_until timestamptz,
  created_at    timestamptz not null default now(),
  completed_at  timestamptz
);

create index if not exists batch_files_batch_id_idx on public.batch_files(batch_id);
create index if not exists batch_files_status_idx on public.batch_files(status);

-- ----------------------------------------------------------------------------
-- AI generations (style transfer; read by src/lib/workers/style-transfer-worker.ts)
-- ----------------------------------------------------------------------------
create table if not exists public.ai_generations (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  type            text not null
                    check (type in ('logo', 'svg', 'pattern', 'animation', 'style_transfer', 'image')),
  prompt          text,
  preset          text,
  input_file_url  text,
  result_url      text,
  credits_used    numeric(5,2) not null check (credits_used >= 0),
  status          text not null default 'pending'
                    check (status in ('pending', 'processing', 'complete', 'failed')),
  job_id          text,
  error_message   text,
  metadata        jsonb not null default '{}'::jsonb,
  refunded_at     timestamptz,
  created_at      timestamptz not null default now(),
  completed_at    timestamptz
);

create index if not exists ai_generations_user_id_idx on public.ai_generations(user_id);
create index if not exists ai_generations_type_idx on public.ai_generations(type);
create index if not exists ai_generations_status_idx on public.ai_generations(status);
create index if not exists ai_generations_user_status_idx on public.ai_generations(user_id, status);

-- ----------------------------------------------------------------------------
-- Team folders / conversion folders
-- ----------------------------------------------------------------------------
create table if not exists public.conversion_folders (
  conversion_id uuid not null references public.conversions(id) on delete cascade,
  folder_id     uuid not null references public.team_folders(id) on delete cascade,
  added_at      timestamptz not null default now(),
  primary key (conversion_id, folder_id)
);

create index if not exists conversion_folders_folder_id_idx on public.conversion_folders(folder_id);

-- ----------------------------------------------------------------------------
-- Retention: how long the app keeps a customer's files
-- ----------------------------------------------------------------------------
-- The tables that already exist get an explicit retention stamp so a cleanup
-- job can find expired originals without scanning Storage.
alter table public.conversions
  add column if not exists retained_until timestamptz;

alter table public.conversions
  add column if not exists refunded_at timestamptz;

comment on column public.conversions.retained_until is
  'Originals and results are kept at least this long; expires_at is set per plan.';
comment on column public.conversions.refunded_at is
  'Set when a failed conversion refunded its credits, so a retry cannot refund twice.';

create index if not exists conversions_retained_until_idx on public.conversions(retained_until);

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table public.batch_jobs         enable row level security;
alter table public.batch_files        enable row level security;
alter table public.ai_generations     enable row level security;
alter table public.conversion_folders enable row level security;

drop policy if exists "Users can view own batch jobs" on public.batch_jobs;
create policy "Users can view own batch jobs"
  on public.batch_jobs for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own batch jobs" on public.batch_jobs;
create policy "Users can create own batch jobs"
  on public.batch_jobs for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own batch jobs" on public.batch_jobs;
create policy "Users can delete own batch jobs"
  on public.batch_jobs for delete
  using (auth.uid() = user_id);

drop policy if exists "Users can view own batch files" on public.batch_files;
create policy "Users can view own batch files"
  on public.batch_files for select
  using (batch_id in (select id from public.batch_jobs where user_id = auth.uid()));

drop policy if exists "Users can view own AI generations" on public.ai_generations;
create policy "Users can view own AI generations"
  on public.ai_generations for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own AI generations" on public.ai_generations;
create policy "Users can create own AI generations"
  on public.ai_generations for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can view conversion folders" on public.conversion_folders;
create policy "Users can view conversion folders"
  on public.conversion_folders for select
  using (
    folder_id in (
      select f.id from public.team_folders f
      where f.team_id in (select team_id from public.team_members where user_id = auth.uid())
    )
  );

-- ----------------------------------------------------------------------------
-- Refund-on-failure
--
-- A job that does not produce a usable result must never cost the customer
-- credits. `refund_failed_*` are idempotent: the second call for the same row
-- returns false, so a retried BullMQ job (or a double-run cleanup) cannot
-- refund the same charge twice.
-- ----------------------------------------------------------------------------
create or replace function public.refund_failed_conversion(
  p_conversion_id uuid,
  p_reason text default 'refund'
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_amount  numeric;
  v_already timestamptz;
  v_balance numeric;
begin
  -- Lock the conversion row so two concurrent failures serialise.
  select user_id, credits_used, refunded_at
    into v_user_id, v_amount, v_already
  from conversions
  where id = p_conversion_id
  for update;

  if v_user_id is null then
    return false;
  end if;

  if v_already is not null or coalesce(v_amount, 0) <= 0 then
    return false;
  end if;

  insert into user_credits (user_id, balance, tier)
  values (v_user_id, 0, 'free')
  on conflict (user_id) do nothing;

  select balance into v_balance from user_credits where user_id = v_user_id for update;

  update user_credits
  set balance = balance + v_amount,
      updated_at = now()
  where user_id = v_user_id;

  insert into credit_transactions (user_id, amount, balance_after, reason, conversion_id)
  values (v_user_id, v_amount, v_balance + v_amount, p_reason, p_conversion_id);

  update conversions
  set refunded_at = now()
  where id = p_conversion_id;

  return true;
end;
$$;

create or replace function public.refund_failed_generation(
  p_generation_id uuid,
  p_reason text default 'refund'
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_amount  numeric;
  v_already timestamptz;
  v_balance numeric;
begin
  select user_id, credits_used, refunded_at
    into v_user_id, v_amount, v_already
  from ai_generations
  where id = p_generation_id
  for update;

  if v_user_id is null then
    return false;
  end if;

  if v_already is not null or coalesce(v_amount, 0) <= 0 then
    return false;
  end if;

  insert into user_credits (user_id, balance, tier)
  values (v_user_id, 0, 'free')
  on conflict (user_id) do nothing;

  select balance into v_balance from user_credits where user_id = v_user_id for update;

  update user_credits
  set balance = balance + v_amount,
      updated_at = now()
  where user_id = v_user_id;

  insert into credit_transactions (user_id, amount, balance_after, reason, conversion_id)
  values (v_user_id, v_amount, v_balance + v_amount, p_reason, null);

  update ai_generations
  set refunded_at = now()
  where id = p_generation_id;

  return true;
end;
$$;

grant execute on function public.refund_failed_conversion to authenticated, service_role;
grant execute on function public.refund_failed_generation to authenticated, service_role;

-- ----------------------------------------------------------------------------
-- Re-apply add_credits: the live copy inserts 3 columns with 2 values and
-- fails with "INSERT has more target columns than expressions".
-- ----------------------------------------------------------------------------
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

-- PostgREST caches function signatures; reload so the new RPCs are callable.
notify pgrst, 'reload schema';
