-- ============================================================================
-- Cleanup: Drop incomplete workflows tables before running schema v2 migration
-- Run this FIRST in Supabase SQL Editor, then run 001_schema_v2_migration_fixed.sql
-- ============================================================================

set role postgres;

-- Drop tables in reverse dependency order
drop table if exists public.workflow_executions cascade;
drop table if exists public.workflow_runs cascade;
drop table if exists public.workflows cascade;

-- Drop the trigger function if it exists
drop function if exists public.update_workflows_updated_at() cascade;
