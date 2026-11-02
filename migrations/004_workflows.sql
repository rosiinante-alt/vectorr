-- ============================================================================
-- Workflows System Migration
-- Add workflow automation tables to support folder watching and batch operations
-- ============================================================================

-- Workflows table
create table if not exists public.workflows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  enabled boolean not null default true,
  trigger jsonb not null,  -- { type: 'file-added' | 'git-push' | 'scheduled' | 'manual', config: {...} }
  actions jsonb not null,  -- [{ type: 'convert' | 'remove-bg' | 'upscale' | ..., config: {...} }, ...]
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.workflows is 'Workflow automation configurations. Each workflow has a trigger and one or more actions.';
comment on column public.workflows.trigger is 'Trigger configuration: {type: "file-added", config: {watchPath: "/path"}}';
comment on column public.workflows.actions is 'Array of actions to execute: [{type: "convert", config: {...}}]';

create index if not exists workflows_user_id_idx on public.workflows(user_id);
create index if not exists workflows_enabled_idx on public.workflows(enabled) where enabled = true;
create index if not exists workflows_created_at_idx on public.workflows(created_at desc);

-- Workflow execution log (optional, for debugging and monitoring)
create table if not exists public.workflow_executions (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  trigger_data jsonb not null,  -- Data that triggered the workflow
  status text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed')),
  result jsonb,  -- Result from workflow execution
  error text,  -- Error message if failed
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

comment on table public.workflow_executions is 'Audit log of workflow executions for monitoring and debugging.';

create index if not exists workflow_executions_workflow_id_idx on public.workflow_executions(workflow_id);
create index if not exists workflow_executions_status_idx on public.workflow_executions(status);
create index if not exists workflow_executions_started_at_idx on public.workflow_executions(started_at desc);

-- RLS policies for workflows
alter table public.workflows enable row level security;

create policy "Users can view their own workflows"
  on public.workflows for select
  using (auth.uid() = user_id);

create policy "Users can create their own workflows"
  on public.workflows for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own workflows"
  on public.workflows for update
  using (auth.uid() = user_id);

create policy "Users can delete their own workflows"
  on public.workflows for delete
  using (auth.uid() = user_id);

-- RLS policies for workflow executions
alter table public.workflow_executions enable row level security;

create policy "Users can view their workflow executions"
  on public.workflow_executions for select
  using (
    exists (
      select 1 from public.workflows
      where workflows.id = workflow_executions.workflow_id
      and workflows.user_id = auth.uid()
    )
  );

create policy "System can insert workflow executions"
  on public.workflow_executions for insert
  with check (true);  -- Allow system to log executions

-- Trigger to update updated_at timestamp
create or replace function public.update_workflows_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger workflows_updated_at
  before update on public.workflows
  for each row
  execute function public.update_workflows_updated_at();
