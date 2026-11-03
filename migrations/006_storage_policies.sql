-- ============================================================================
-- Storage Policies for vector-files bucket
-- ============================================================================

-- Allow authenticated users to upload files to vector-files
create policy "Allow authenticated uploads to vector-files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'vector-files' and (auth.uid())::text = (storage.foldername(name))[1]);

-- Allow authenticated users to view/download files in vector-files
create policy "Allow authenticated reads on vector-files"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'vector-files');

-- Allow public read if bucket is public
create policy "Allow public read on vector-files"
  on storage.objects for select
  to public
  using (bucket_id = 'vector-files');

-- Allow authenticated users to update their own files
create policy "Allow authenticated updates on vector-files"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'vector-files' and (auth.uid())::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own files
create policy "Allow authenticated deletes on vector-files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'vector-files' and (auth.uid())::text = (storage.foldername(name))[1]);
