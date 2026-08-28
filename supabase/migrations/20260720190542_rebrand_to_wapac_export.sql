/*
# Rebrand to Wapac Export

## Overview
Updates all site_settings to rebrand from "The Charcoal Factory" to "Wapac Export".
The tagline becomes "West African Prime Allied Commodity" to reflect the full meaning.
All charcoal product content stays the same — only the brand name changes.
*/

INSERT INTO site_settings (key, value, updated_at) VALUES
  ('site_name', 'Wapac Export', now()),
  ('site_tagline', 'West African Prime Allied Commodity', now()),
  ('footer_about', 'Wapac Export is a leading export company supplying bulk BBQ charcoal, shisha charcoal, hardwood charcoal, cocoa, cashew nuts, ginger, and soya beans to importers, distributors, and retailers worldwide.', now()),
  ('footer_copyright', '© Wapac Export 2026. All Rights Reserved.', now()),
  ('contact_email', 'info@wapacexport.com', now()),
  ('contact_phone', '+86-55163514459', now()),
  ('contact_address', 'Hefei, Anhui Province, China', now())
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
