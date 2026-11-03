-- ============================================================================
-- Migration: 001_schema_v2_migration.sql (FIXED for permission issues)
-- Description: Migrate from MVP schema (schema.sql) to Phase 1 schema (schema_v2.sql)
-- Date: 2026-11-02
--
-- IMPORTANT: Run this in Supabase SQL Editor as the postgres role
-- ============================================================================

-- Set role to postgres (admin) — must be first
set role postgres;

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
  created_at timestamptz not null default now()
);

create index if not exists team_folders_team_id_idx on public.team_folders(team_id);

-- Batch conversions
create table if not exists public.batch_conversions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  team_id     uuid references public.teams(id) on delete set null,
  name        text not null,
  description text,
  file_count  integer not null default 0,
  status      text not null default 'pending' check (status in ('pending', 'processing', 'complete', 'failed')),
  output_format text not null default 'svg',
  created_at  timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists batch_conversions_user_id_idx on public.batch_conversions(user_id);
create index if not exists batch_conversions_status_idx on public.batch_conversions(status);

-- Batch conversion items
create table if not exists public.batch_items (
  id                  uuid primary key default gen_random_uuid(),
  batch_conversion_id uuid not null references public.batch_conversions(id) on delete cascade,
  conversion_id       uuid references public.conversions(id) on delete set null,
  file_name           text not null,
  status              text not null default 'pending' check (status in ('pending', 'processing', 'complete', 'failed')),
  error_message       text,
  created_at          timestamptz not null default now()
);

create index if not exists batch_items_batch_conversion_id_idx on public.batch_items(batch_conversion_id);

-- Version history
create table if not exists public.conversion_versions (
  id            uuid primary key default gen_random_uuid(),
  conversion_id uuid not null references public.conversions(id) on delete cascade,
  version_num   integer not null,
  file_url      text not null,
  created_at    timestamptz not null default now(),
  created_by    uuid not null references auth.users(id) on delete cascade
);

create index if not exists conversion_versions_conversion_id_idx on public.conversion_versions(conversion_id);
create unique index if not exists conversion_versions_unique_idx on public.conversion_versions(conversion_id, version_num);

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

-- Workflow automations
create table if not exists public.workflows (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  team_id      uuid references public.teams(id) on delete set null,
  name         text not null,
  description  text,
  folder_id    text,
  output_format text not null default 'svg',
  enabled      boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists workflows_user_id_idx on public.workflows(user_id);
create index if not exists workflows_team_id_idx on public.workflows(team_id) where team_id is not null;

-- Workflow runs
create table if not exists public.workflow_runs (
  id          uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  file_path   text not null,
  status      text not null default 'pending' check (status in ('pending', 'running', 'success', 'failed')),
  error       text,
  created_at  timestamptz not null default now()
);

create index if not exists workflow_runs_workflow_id_idx on public.workflow_runs(workflow_id);

-- Style transfer presets
create table if not exists public.style_transfer_presets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  description text,
  model       text not null,
  prompt      text not null,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists style_transfer_presets_user_id_idx on public.style_transfer_presets(user_id);

-- User presets
create table if not exists public.user_presets (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  preprocessing jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

create index if not exists user_presets_user_id_idx on public.user_presets(user_id);

-- ============================================================================
-- STEP 3: Grant RLS policies
-- ============================================================================

alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.conversions enable row level security;
alter table public.user_credits enable row level security;
alter table public.credit_transactions enable row level security;
alter table public.team_folders enable row level security;
alter table public.batch_conversions enable row level security;
alter table public.batch_items enable row level security;
alter table public.conversion_versions enable row level security;
alter table public.conversion_comments enable row level security;
alter table public.approval_requests enable row level security;
alter table public.workflows enable row level security;
alter table public.workflow_runs enable row level security;
alter table public.style_transfer_presets enable row level security;
alter table public.user_presets enable row level security;

-- ============================================================================
-- STEP 4: Create RLS policies for user_credits
-- ============================================================================

create policy "Users can view their own credits"
  on public.user_credits
  for select
  using (auth.uid() = user_id);

create policy "Users can update their own credits (service role only)"
  on public.user_credits
  for update
  using (auth.uid() = user_id);

-- ============================================================================
-- STEP 5: Create RLS policies for credit_transactions
-- ============================================================================

create policy "Users can view their own transactions"
  on public.credit_transactions
  for select
  using (auth.uid() = user_id);

-- ============================================================================
-- STEP 6: Create RLS policies for conversions
-- ============================================================================

create policy "Users can view their own conversions"
  on public.conversions
  for select
  using (auth.uid() = user_id or team_id in (select team_id from public.team_members where user_id = auth.uid()));

create policy "Users can insert their own conversions"
  on public.conversions
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own conversions"
  on public.conversions
  for update
  using (auth.uid() = user_id or team_id in (select team_id from public.team_members where user_id = auth.uid()));

-- ============================================================================
-- COMMIT
-- ============================================================================

commit;
