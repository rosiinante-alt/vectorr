-- ============================================================================
-- Vectorr — MVP database schema
-- Target: Supabase (PostgreSQL 15+)
--
-- Apply with:  supabase db push        (see README "Database setup")
--          or: paste this file into the Supabase SQL editor.
--
-- NOTE: `users` mirrors `auth.users`. Supabase owns authentication; this table
-- holds the public profile row. A trigger keeps the two in sync, so application
-- code never inserts into `users` directly.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.users is 'Public profile row, 1:1 with auth.users.';

-- ---------------------------------------------------------------------------
-- files — uploaded vector files
-- ---------------------------------------------------------------------------
create table if not exists public.files (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references public.users(id) on delete cascade,
  filename             text not null,
  original_size_bytes  integer check (original_size_bytes >= 0),
  optimized_size_bytes integer check (optimized_size_bytes >= 0),
  file_path            text not null,          -- Supabase Storage object path
  status               text not null default 'processing',
  metadata             jsonb not null default '{}'::jsonb,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  constraint files_status_check check (status in ('processing', 'ready', 'failed'))
);

comment on column public.files.metadata is
  'Extracted vector info, e.g. {"nodes": 1234, "paths": 56, "colors": ["#fff"]}';

create index if not exists files_user_id_created_at_idx
  on public.files (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- exports
-- ---------------------------------------------------------------------------
create table if not exists public.exports (
  id              uuid primary key default gen_random_uuid(),
  file_id         uuid not null references public.files(id) on delete cascade,
  format          text not null,
  file_path       text not null,
  file_size_bytes integer check (file_size_bytes >= 0),
  created_at      timestamptz not null default now(),
  constraint exports_format_check check (format in ('svg', 'png', 'pdf'))
);

create index if not exists exports_file_id_idx on public.exports (file_id);

-- ---------------------------------------------------------------------------
-- audit_log — append-only. No UPDATE/DELETE policy exists, by design.
-- ---------------------------------------------------------------------------
create table if not exists public.audit_log (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.users(id) on delete set null,
  action      text not null,
  resource_id uuid,
  timestamp   timestamptz not null default now()
);

create index if not exists audit_log_user_id_timestamp_idx
  on public.audit_log (user_id, timestamp desc);

-- ============================================================================
-- updated_at maintenance
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

drop trigger if exists files_touch_updated_at on public.files;
create trigger files_touch_updated_at
  before update on public.files
  for each row execute function public.touch_updated_at();

drop trigger if exists users_touch_updated_at on public.users;
create trigger users_touch_updated_at
  before update on public.users
  for each row execute function public.touch_updated_at();

-- ============================================================================
-- Mirror auth.users -> public.users
-- ============================================================================
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email, updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update of email on auth.users
  for each row execute function public.handle_new_auth_user();

-- Backfill existing auth users (safe to re-run).
insert into public.users (id, email)
select id, email from auth.users
on conflict (id) do nothing;

-- ============================================================================
-- Row-Level Security
-- ============================================================================
alter table public.users     enable row level security;
alter table public.files     enable row level security;
alter table public.exports   enable row level security;
alter table public.audit_log enable row level security;

-- ---------------------------------------------------------------------------
-- users: read + update own profile. No INSERT (the trigger owns creation),
-- no DELETE (account deletion goes through Supabase auth admin).
-- ---------------------------------------------------------------------------
drop policy if exists "Users can read own data" on public.users;
create policy "Users can read own data"
  on public.users for select
  using (auth.uid() = id);

drop policy if exists "Users can update own data" on public.users;
create policy "Users can update own data"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- files: full CRUD scoped to the owner.
-- ---------------------------------------------------------------------------
drop policy if exists "Users can read own files" on public.files;
create policy "Users can read own files"
  on public.files for select
  using (user_id = auth.uid());

drop policy if exists "Users can insert own files" on public.files;
create policy "Users can insert own files"
  on public.files for insert
  with check (user_id = auth.uid());

drop policy if exists "Users can update own files" on public.files;
create policy "Users can update own files"
  on public.files for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Users can delete own files" on public.files;
create policy "Users can delete own files"
  on public.files for delete
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- exports: reachable only through a file the user owns. INSERT additionally
-- re-checks ownership so a user cannot attach an export to someone else's file.
-- ---------------------------------------------------------------------------
drop policy if exists "Users can read own exports" on public.exports;
create policy "Users can read own exports"
  on public.exports for select
  using (
    exists (
      select 1 from public.files
      where files.id = exports.file_id and files.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert own exports" on public.exports;
create policy "Users can insert own exports"
  on public.exports for insert
  with check (
    exists (
      select 1 from public.files
      where files.id = exports.file_id and files.user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete own exports" on public.exports;
create policy "Users can delete own exports"
  on public.exports for delete
  using (
    exists (
      select 1 from public.files
      where files.id = exports.file_id and files.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- audit_log: append-only. A user may write and read their own entries; nobody
-- can mutate history through the API. The service role bypasses RLS.
-- ---------------------------------------------------------------------------
drop policy if exists "Users can insert own audit entries" on public.audit_log;
create policy "Users can insert own audit entries"
  on public.audit_log for insert
  with check (user_id = auth.uid());

drop policy if exists "Users can read own audit entries" on public.audit_log;
create policy "Users can read own audit entries"
  on public.audit_log for select
  using (user_id = auth.uid());

-- ============================================================================
-- Storage: private bucket for uploaded vector files
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('vector-files', 'vector-files', false)
on conflict (id) do nothing;

-- Objects are stored under a top-level folder named after the owner's uuid:
--   <user_id>/<timestamp>-<filename>.svg
-- The first path segment is therefore the ownership test.

-- RLS must be enabled on storage.objects explicitly. Supabase enables it by
-- default, but the policies below are inert without it, and Postgres accepts
-- policies on a table with RLS off without raising an error — so a missing
-- enable silently exposes every uploaded file to every user.
alter table storage.objects enable row level security;

drop policy if exists "Users can read own vector objects" on storage.objects;
create policy "Users can read own vector objects"
  on storage.objects for select
  using (
    bucket_id = 'vector-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can upload own vector objects" on storage.objects;
create policy "Users can upload own vector objects"
  on storage.objects for insert
  with check (
    bucket_id = 'vector-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update own vector objects" on storage.objects;
create policy "Users can update own vector objects"
  on storage.objects for update
  using (
    bucket_id = 'vector-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete own vector objects" on storage.objects;
create policy "Users can delete own vector objects"
  on storage.objects for delete
  using (
    bucket_id = 'vector-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
