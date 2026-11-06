-- 010: Private bucket for style-transfer / AI generation outputs.
-- The style-transfer worker writes here with the service role and hands the
-- user a signed URL, so no client policies are needed. Idempotent.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('ai-generations', 'ai-generations', false, 20971520, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;
