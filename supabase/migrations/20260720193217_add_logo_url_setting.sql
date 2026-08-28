INSERT INTO site_settings (key, value, updated_at) VALUES
  ('logo_url', 'https://thecharcoalfactory.com/wp-content/uploads/2026/02/cropped-Logo-7-scaled-1-1024x798.png', now())
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
