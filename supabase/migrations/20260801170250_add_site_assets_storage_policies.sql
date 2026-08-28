-- Storage policies for site-assets bucket (logo, media uploads)
-- Public read so browser can load images; only authenticated can upload.
CREATE POLICY "site_assets_public_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'site-assets');

CREATE POLICY "site_assets_authed_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "site_assets_authed_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'site-assets') WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "site_assets_authed_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'site-assets');
