-- Update contact email and address to Nigeria
INSERT INTO site_settings (key, value, updated_at) VALUES
  ('contact_email', 'wapacexport@gmail.com', now()),
  ('contact_phone', '+234 803 000 0000', now()),
  ('contact_address', 'Lagos, Nigeria', now()),
  ('site_tagline', 'West African Prime Allied Commodities', now()),
  ('footer_about', 'Wapac Export is a leading Nigerian export company specializing in premium charcoal, cocoa, cashew nuts, ginger, and soya beans. Sourced directly from Nigerian farms and processed to international standards for global export.', now())
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- Update hero text to Nigeria-focused
INSERT INTO site_settings (key, value, updated_at) VALUES
  ('hero_eyebrow', 'Nigerian Export Specialists', now()),
  ('hero_title', 'Premium Nigerian Charcoal,Allied Commodities Export', now()),
  ('hero_subtitle', 'Direct from Nigerian farms to global ports. Premium hardwood charcoal, cocoa, cashew nuts, ginger, and soya beans — sourced, processed, and exported to international standards.', now())
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
