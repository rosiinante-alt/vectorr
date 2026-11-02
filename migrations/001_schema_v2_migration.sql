-- ============================================================================
-- Migration: 001_schema_v2_migration.sql
-- Description: Migrate from MVP schema (schema.sql) to Phase 1 schema (schema_v2.sql)
-- Date: 2026-11-02
--
-- This migration:
--   1. Creates all new Phase 1 tables
--   2. Migrates existing `files` table data to `conversions` (if any exists)
--   3. Adds indexes
--   4. Sets up RLS policies
--   5. Creates storage buckets
--
-- IMPORTANT: Run this migration in a transaction. If any step fails, roll back.
-- ============================================================================

begin;

-- ============================================================================
-- STEP 1: Create new tables (idempotent)
-- ============================================================================

-- Teams
create table if not exists public.teams (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  owner_id        uuid not null references auth.users(id) on delete cascade,
  plan            text not null default 'team_starter' check (plan in ('team_starter', 'team_pro', 'agency')),
  subscription_id text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists teams_owner_id_idx on public.teams(owner_id);

-- Team members
create table if not exists public.team_members (
  team_id   uuid not null references public.teams(id) on delete cascade,
  user_id   uuid not null references auth.users(id) on delete cascade,
  role      text not null check (role in ('admin', 'editor', 'viewer')),
  joined_at timestamptz not null default now(),
  primary key (team_id, user_id)
);

create index if not exists team_members_user_id_idx on public.team_members(user_id);

-- Conversions
create table if not exists public.conversions (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  team_id            uuid references public.teams(id) on delete set null,
  original_file_url  text not null,
  converted_file_url text,
  original_format    text not null check (original_format in ('png', 'jpg', 'jpeg', 'webp', 'gif', 'heic', 'tiff', 'bmp')),
  output_format      text not null default 'svg' check (output_format in ('svg', 'dxf', 'eps', 'ai', 'pdf', 'cdr', 'lottie', 'dst', 'pes', 'jef', 'gcode')),
  preprocessing      jsonb not null default '{}'::jsonb,
  status             text not null default 'pending' check (status in ('pending', 'processing', 'complete', 'failed')),
  credits_used       numeric(5,2) not null default 0.20 check (credits_used >= 0),
  job_id             text,
  error_message      text,
  metadata           jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  completed_at       timestamptz
);

create index if not exists conversions_user_id_idx on public.conversions(user_id);
create index if not exists conversions_status_idx on public.conversions(status);
create index if not exists conversions_team_id_idx on public.conversions(team_id) where team_id is not null;
create index if not exists conversions_created_at_idx on public.conversions(created_at desc);

-- User credits
create table if not exists public.user_credits (
  user_id             uuid primary key references auth.users(id) on delete cascade,
  balance             numeric(6,2) not null default 0 check (balance >= 0),
  tier                text not null default 'free' check (tier in ('free', 'starter', 'plus', 'pro', 'team', 'agency')),
  subscription_id     text,
  subscription_status text check (subscription_status in ('active', 'canceled', 'past_due', 'trialing')),
  updated_at          timestamptz not null default now()
);

-- Credit transactions
create table if not exists public.credit_transactions (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  amount                numeric(6,2) not null,
  balance_after         numeric(6,2) not null,
  reason                text not null check (reason in ('conversion', 'purchase', 'refund', 'subscription', 'bonus', 'batch_conversion', 'ai_generation')),
  conversion_id         uuid references public.conversions(id) on delete set null,
  stripe_payment_intent text,
  created_at            timestamptz not null default now()
);

create index if not exists credit_transactions_user_id_idx on public.credit_transactions(user_id);
create index if not exists credit_transactions_created_at_idx on public.credit_transactions(created_at desc);

-- Team folders
create table if not exists public.team_folders (
  id         uuid primary key default gen_random_uuid(),
  team_id    uuid not null references public.teams(id) on delete cascade,
  name       text not null,
  parent_id  uuid references public.team_folders(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists team_folders_team_id_idx on public.team_folders(team_id);
create index if not exists team_folders_parent_id_idx on public.team_folders(parent_id) where parent_id is not null;

-- Conversion folders
create table if not exists public.conversion_folders (
  conversion_id uuid not null references public.conversions(id) on delete cascade,
  folder_id     uuid not null references public.team_folders(id) on delete cascade,
  added_at      timestamptz not null default now(),
  primary key (conversion_id, folder_id)
);

create index if not exists conversion_folders_folder_id_idx on public.conversion_folders(folder_id);

-- Conversion versions
create table if not exists public.conversion_versions (
  id             uuid primary key default gen_random_uuid(),
  conversion_id  uuid not null references public.conversions(id) on delete cascade,
  version_number int not null,
  checkpoint_name text not null,
  file_url       text not null,
  metadata       jsonb not null default '{}'::jsonb,
  created_by     uuid references auth.users(id) on delete set null,
  created_at     timestamptz not null default now(),
  unique (conversion_id, version_number)
);

create index if not exists conversion_versions_conversion_id_idx on public.conversion_versions(conversion_id);

-- Batch jobs
create table if not exists public.batch_jobs (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  team_id         uuid references public.teams(id) on delete set null,
  status          text not null default 'pending' check (status in ('pending', 'processing', 'complete', 'failed', 'partial')),
  total_files     int not null check (total_files > 0 and total_files <= 50),
  completed_files int not null default 0 check (completed_files >= 0),
  failed_files    int not null default 0 check (failed_files >= 0),
  zip_url         text,
  zip_expires_at  timestamptz,
  preprocessing   jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  completed_at    timestamptz
);

create index if not exists batch_jobs_user_id_idx on public.batch_jobs(user_id);
create index if not exists batch_jobs_status_idx on public.batch_jobs(status);

-- Batch files
create table if not exists public.batch_files (
  id            uuid primary key default gen_random_uuid(),
  batch_id      uuid not null references public.batch_jobs(id) on delete cascade,
  file_url      text not null,
  status        text not null default 'pending' check (status in ('pending', 'processing', 'complete', 'failed')),
  result_url    text,
  error_message text,
  credits_used  numeric(5,2) check (credits_used >= 0),
  created_at    timestamptz not null default now(),
  completed_at  timestamptz
);

create index if not exists batch_files_batch_id_idx on public.batch_files(batch_id);
create index if not exists batch_files_status_idx on public.batch_files(status);

-- AI generations
create table if not exists public.ai_generations (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  type            text not null check (type in ('logo', 'svg', 'pattern', 'animation', 'style_transfer', 'image')),
  prompt          text,
  preset          text,
  input_file_url  text,
  result_url      text,
  credits_used    numeric(5,2) not null check (credits_used >= 0),
  status          text not null default 'pending' check (status in ('pending', 'processing', 'complete', 'failed')),
  job_id          text,
  error_message   text,
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  completed_at    timestamptz
);

create index if not exists ai_generations_user_id_idx on public.ai_generations(user_id);
create index if not exists ai_generations_type_idx on public.ai_generations(type);
create index if not exists ai_generations_status_idx on public.ai_generations(status);

-- User presets
create table if not exists public.user_presets (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  settings_json jsonb not null,
  is_default    boolean not null default false,
  created_at    timestamptz not null default now(),
  unique (user_id, name)
);

create index if not exists user_presets_user_id_idx on public.user_presets(user_id);

-- Conversion comments
create table if not exists public.conversion_comments (
  id            uuid primary key default gen_random_uuid(),
  conversion_id uuid not null references public.conversions(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  parent_id     uuid references public.conversion_comments(id) on delete cascade,
  content       text not null,
  position_x    numeric(10,2),
  position_y    numeric(10,2),
  resolved      boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists conversion_comments_conversion_id_idx on public.conversion_comments(conversion_id);
create index if not exists conversion_comments_parent_id_idx on public.conversion_comments(parent_id) where parent_id is not null;

-- Approval requests
create table if not exists public.approval_requests (
  id            uuid primary key default gen_random_uuid(),
  conversion_id uuid not null references public.conversions(id) on delete cascade,
  requested_by  uuid not null references auth.users(id) on delete cascade,
  reviewer_id   uuid not null references auth.users(id) on delete cascade,
  status        text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  feedback      text,
  created_at    timestamptz not null default now(),
  reviewed_at   timestamptz
);

create index if not exists approval_requests_conversion_id_idx on public.approval_requests(conversion_id);
create index if not exists approval_requests_reviewer_id_idx on public.approval_requests(reviewer_id);

-- ============================================================================
-- STEP 2: Migrate existing `files` data to `conversions` (if any exists)
-- ============================================================================

-- Check if files table exists and has data
do $$
begin
  if exists (select 1 from information_schema.tables where table_name = 'files' and table_schema = 'public') then
    -- Migrate files to conversions
    -- Map old status to new status
    insert into public.conversions (
      id,
      user_id,
      original_file_url,
      converted_file_url,
      original_format,
      output_format,
      status,
      metadata,
      created_at,
      completed_at
    )
    select
      f.id,
      f.user_id,
      f.file_path as original_file_url,
      case when f.status = 'ready' then f.file_path else null end as converted_file_url,
      'svg' as original_format,  -- Assume SVG for legacy files
      'svg' as output_format,
      case f.status
        when 'processing' then 'processing'
        when 'ready' then 'complete'
        when 'failed' then 'failed'
        else 'pending'
      end as status,
      f.metadata,
      f.created_at,
      case when f.status = 'ready' then f.updated_at else null end as completed_at
    from public.files f
    on conflict (id) do nothing;

    raise notice 'Migrated % rows from files to conversions', (select count(*) from public.files);
  else
    raise notice 'No files table found, skipping data migration';
  end if;
end $$;

-- ============================================================================
-- STEP 3: Create updated_at triggers
-- ============================================================================

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists teams_touch_updated_at on public.teams;
create trigger teams_touch_updated_at
  before update on public.teams
  for each row execute function public.touch_updated_at();

drop trigger if exists user_credits_touch_updated_at on public.user_credits;
create trigger user_credits_touch_updated_at
  before update on public.user_credits
  for each row execute function public.touch_updated_at();

drop trigger if exists conversion_comments_touch_updated_at on public.conversion_comments;
create trigger conversion_comments_touch_updated_at
  before update on public.conversion_comments
  for each row execute function public.touch_updated_at();

-- ============================================================================
-- STEP 4: Create credit management functions
-- ============================================================================

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
  select balance into v_balance
  from user_credits
  where user_id = p_user_id
  for update;

  if v_balance is null then
    raise exception 'User credits record not found';
  end if;

  if v_balance < p_amount then
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
  insert into user_credits (user_id, balance)
  values (p_user_id, 0)
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

-- ============================================================================
-- STEP 5: Enable RLS and create policies
-- ============================================================================

alter table public.teams                enable row level security;
alter table public.team_members         enable row level security;
alter table public.conversions          enable row level security;
alter table public.user_credits         enable row level security;
alter table public.credit_transactions  enable row level security;
alter table public.team_folders         enable row level security;
alter table public.conversion_folders   enable row level security;
alter table public.conversion_versions  enable row level security;
alter table public.batch_jobs           enable row level security;
alter table public.batch_files          enable row level security;
alter table public.ai_generations       enable row level security;
alter table public.user_presets         enable row level security;
alter table public.conversion_comments  enable row level security;
alter table public.approval_requests    enable row level security;

-- Teams policies
drop policy if exists "Team members can view teams" on public.teams;
create policy "Team members can view teams"
  on public.teams for select
  using (
    owner_id = auth.uid() or
    id in (select team_id from public.team_members where user_id = auth.uid())
  );

drop policy if exists "Team owners can update teams" on public.teams;
create policy "Team owners can update teams"
  on public.teams for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "Team owners can delete teams" on public.teams;
create policy "Team owners can delete teams"
  on public.teams for delete
  using (owner_id = auth.uid());

-- Team members policies
drop policy if exists "Team members can view membership" on public.team_members;
create policy "Team members can view membership"
  on public.team_members for select
  using (
    user_id = auth.uid() or
    team_id in (select team_id from public.team_members where user_id = auth.uid())
  );

drop policy if exists "Team admins can manage members" on public.team_members;
create policy "Team admins can manage members"
  on public.team_members for all
  using (
    team_id in (
      select team_id from public.team_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- Conversions policies
drop policy if exists "Users can view own conversions" on public.conversions;
create policy "Users can view own conversions"
  on public.conversions for select
  using (auth.uid() = user_id);

drop policy if exists "Team members can view team conversions" on public.conversions;
create policy "Team members can view team conversions"
  on public.conversions for select
  using (
    team_id in (
      select team_id from public.team_members where user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert own conversions" on public.conversions;
create policy "Users can insert own conversions"
  on public.conversions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own conversions" on public.conversions;
create policy "Users can update own conversions"
  on public.conversions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own conversions" on public.conversions;
create policy "Users can delete own conversions"
  on public.conversions for delete
  using (auth.uid() = user_id);

-- User credits policies
drop policy if exists "Users can view own credits" on public.user_credits;
create policy "Users can view own credits"
  on public.user_credits for select
  using (auth.uid() = user_id);

drop policy if exists "Users can update own credits" on public.user_credits;
create policy "Users can update own credits"
  on public.user_credits for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Credit transactions policies
drop policy if exists "Users can view own transactions" on public.credit_transactions;
create policy "Users can view own transactions"
  on public.credit_transactions for select
  using (auth.uid() = user_id);

-- Team folders policies
drop policy if exists "Team members can view folders" on public.team_folders;
create policy "Team members can view folders"
  on public.team_folders for select
  using (
    team_id in (select team_id from public.team_members where user_id = auth.uid())
  );

drop policy if exists "Team editors can manage folders" on public.team_folders;
create policy "Team editors can manage folders"
  on public.team_folders for all
  using (
    team_id in (
      select team_id from public.team_members
      where user_id = auth.uid() and role in ('admin', 'editor')
    )
  );

-- Conversion folders policies
drop policy if exists "Users can view conversion folders" on public.conversion_folders;
create policy "Users can view conversion folders"
  on public.conversion_folders for select
  using (
    conversion_id in (select id from public.conversions where user_id = auth.uid())
    or
    folder_id in (
      select id from public.team_folders
      where team_id in (select team_id from public.team_members where user_id = auth.uid())
    )
  );

-- Conversion versions policies
drop policy if exists "Users can view versions of accessible conversions" on public.conversion_versions;
create policy "Users can view versions of accessible conversions"
  on public.conversion_versions for select
  using (
    conversion_id in (select id from public.conversions where user_id = auth.uid())
    or
    conversion_id in (
      select id from public.conversions
      where team_id in (select team_id from public.team_members where user_id = auth.uid())
    )
  );

drop policy if exists "Users can create versions of own conversions" on public.conversion_versions;
create policy "Users can create versions of own conversions"
  on public.conversion_versions for insert
  with check (
    conversion_id in (select id from public.conversions where user_id = auth.uid())
  );

-- Batch jobs policies
drop policy if exists "Users can view own batch jobs" on public.batch_jobs;
create policy "Users can view own batch jobs"
  on public.batch_jobs for select
  using (auth.uid() = user_id);

drop policy if exists "Team members can view team batch jobs" on public.batch_jobs;
create policy "Team members can view team batch jobs"
  on public.batch_jobs for select
  using (
    team_id in (select team_id from public.team_members where user_id = auth.uid())
  );

drop policy if exists "Users can create own batch jobs" on public.batch_jobs;
create policy "Users can create own batch jobs"
  on public.batch_jobs for insert
  with check (auth.uid() = user_id);

-- Batch files policies
drop policy if exists "Users can view batch files" on public.batch_files;
create policy "Users can view batch files"
  on public.batch_files for select
  using (
    batch_id in (select id from public.batch_jobs where user_id = auth.uid())
    or
    batch_id in (
      select id from public.batch_jobs
      where team_id in (select team_id from public.team_members where user_id = auth.uid())
    )
  );

-- AI generations policies
drop policy if exists "Users can view own AI generations" on public.ai_generations;
create policy "Users can view own AI generations"
  on public.ai_generations for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own AI generations" on public.ai_generations;
create policy "Users can create own AI generations"
  on public.ai_generations for insert
  with check (auth.uid() = user_id);

-- User presets policies
drop policy if exists "Users can manage own presets" on public.user_presets;
create policy "Users can manage own presets"
  on public.user_presets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Conversion comments policies
drop policy if exists "Users can view comments on accessible conversions" on public.conversion_comments;
create policy "Users can view comments on accessible conversions"
  on public.conversion_comments for select
  using (
    conversion_id in (select id from public.conversions where user_id = auth.uid())
    or
    conversion_id in (
      select id from public.conversions
      where team_id in (select team_id from public.team_members where user_id = auth.uid())
    )
  );

drop policy if exists "Users can create comments on accessible conversions" on public.conversion_comments;
create policy "Users can create comments on accessible conversions"
  on public.conversion_comments for insert
  with check (
    auth.uid() = user_id and
    (
      conversion_id in (select id from public.conversions where user_id = auth.uid())
      or
      conversion_id in (
        select id from public.conversions
        where team_id in (select team_id from public.team_members where user_id = auth.uid())
      )
    )
  );

drop policy if exists "Users can update own comments" on public.conversion_comments;
create policy "Users can update own comments"
  on public.conversion_comments for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Approval requests policies
drop policy if exists "Users can view approval requests" on public.approval_requests;
create policy "Users can view approval requests"
  on public.approval_requests for select
  using (
    auth.uid() = requested_by or
    auth.uid() = reviewer_id
  );

drop policy if exists "Users can create approval requests" on public.approval_requests;
create policy "Users can create approval requests"
  on public.approval_requests for insert
  with check (auth.uid() = requested_by);

drop policy if exists "Reviewers can update approval requests" on public.approval_requests;
create policy "Reviewers can update approval requests"
  on public.approval_requests for update
  using (auth.uid() = reviewer_id)
  with check (auth.uid() = reviewer_id);

-- ============================================================================
-- STEP 6: Create storage buckets
-- ============================================================================

insert into storage.buckets (id, name, public)
values
  ('originals', 'originals', false),
  ('conversions', 'conversions', false),
  ('exports', 'exports', false),
  ('batch-archives', 'batch-archives', false),
  ('ai-generations', 'ai-generations', false)
on conflict (id) do nothing;

alter table storage.objects enable row level security;

-- Storage policies: originals
drop policy if exists "Users can upload to originals" on storage.objects;
create policy "Users can upload to originals"
  on storage.objects for insert
  with check (
    bucket_id = 'originals' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users can read own originals" on storage.objects;
create policy "Users can read own originals"
  on storage.objects for select
  using (
    bucket_id = 'originals' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users can delete own originals" on storage.objects;
create policy "Users can delete own originals"
  on storage.objects for delete
  using (
    bucket_id = 'originals' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies: conversions
drop policy if exists "Users can read own conversions" on storage.objects;
create policy "Users can read own conversions"
  on storage.objects for select
  using (
    bucket_id = 'conversions' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Service role can write conversions" on storage.objects;
create policy "Service role can write conversions"
  on storage.objects for insert
  with check (bucket_id = 'conversions');

-- Storage policies: batch-archives
drop policy if exists "Users can read own batch archives" on storage.objects;
create policy "Users can read own batch archives"
  on storage.objects for select
  using (
    bucket_id = 'batch-archives' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Service role can write batch archives" on storage.objects;
create policy "Service role can write batch archives"
  on storage.objects for insert
  with check (bucket_id = 'batch-archives');

-- Storage policies: ai-generations
drop policy if exists "Users can read own AI generations" on storage.objects;
create policy "Users can read own AI generations"
  on storage.objects for select
  using (
    bucket_id = 'ai-generations' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Service role can write AI generations" on storage.objects;
create policy "Service role can write AI generations"
  on storage.objects for insert
  with check (bucket_id = 'ai-generations');

-- ============================================================================
-- STEP 7: Create composite indexes
-- ============================================================================

create index if not exists conversions_user_status_idx on public.conversions(user_id, status);
create index if not exists conversions_team_status_idx on public.conversions(team_id, status) where team_id is not null;
create index if not exists credit_transactions_user_created_idx on public.credit_transactions(user_id, created_at desc);
create index if not exists batch_jobs_user_status_idx on public.batch_jobs(user_id, status);
create index if not exists ai_generations_user_status_idx on public.ai_generations(user_id, status);

-- ============================================================================
-- STEP 8: Add comments for documentation
-- ============================================================================

comment on table public.teams is 'Team workspaces. Owner has full control; members have role-based access.';
comment on table public.team_members is 'Team membership. Roles: admin (full access), editor (create/edit), viewer (read-only).';
comment on table public.conversions is 'Vectorization jobs. Each row represents one image → vector conversion.';
comment on table public.user_credits is 'User credit balance and subscription tier. Credits are deducted per conversion.';
comment on table public.credit_transactions is 'Audit log of all credit movements. Negative amounts are deductions.';
comment on table public.team_folders is 'Hierarchical folders for organizing team conversions.';
comment on table public.conversion_folders is 'Links conversions to team folders (many-to-many).';
comment on table public.conversion_versions is 'Version history for conversions. Each checkpoint is a snapshot.';
comment on table public.batch_jobs is 'Batch processing jobs. Up to 50 files per batch.';
comment on table public.batch_files is 'Individual files within a batch job.';
comment on table public.ai_generations is 'AI-powered generation jobs (logo, SVG, pattern, style transfer, etc.).';
comment on table public.user_presets is 'User-saved conversion presets for quick access.';
comment on table public.conversion_comments is 'Threaded comments and annotations on conversions.';
comment on table public.approval_requests is 'Client approval workflow for conversions.';

comment on column public.conversions.preprocessing is 'Preprocessing options: {"remove_bg": true, "upscale": "2x", "destination": "cricut"}';
comment on column public.conversions.metadata is 'File metadata: {"width": 1920, "height": 1080, "file_size": 245000, "colors": 12}';
comment on column public.conversions.credits_used is 'Credits deducted for this conversion (default: 0.20)';
comment on column public.conversions.job_id is 'BullMQ job ID for async status polling';
comment on column public.batch_jobs.zip_expires_at is 'ZIP archive expiry (24 hours after creation)';
comment on column public.ai_generations.preset is 'Style transfer preset: cubist, minimalist, etc.';
comment on column public.user_presets.settings_json is 'Preset settings: {"remove_bg": true, "upscale": "2x", "destination": "web"}';

-- ============================================================================
-- Migration complete
-- ============================================================================

commit;

-- Verify migration
do $$
begin
  raise notice 'Migration complete. Tables created: %', (
    select count(*)
    from information_schema.tables
    where table_schema = 'public'
    and table_name in (
      'teams', 'team_members', 'conversions', 'user_credits', 'credit_transactions',
      'team_folders', 'conversion_folders', 'conversion_versions', 'batch_jobs',
      'batch_files', 'ai_generations', 'user_presets', 'conversion_comments',
      'approval_requests'
    )
  );
end $$;
