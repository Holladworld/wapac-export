/*
# Rebrand to The Charcoal Factory — site_settings seed

## Overview
Resets all site_settings to match thecharcoalfactory.com branding exactly.
Includes hero text, trust badges, featured section, process section, footer,
contact info, and color theme matching the original site's dark/amber aesthetic.

## Changes
- Upserts all site_settings keys with TCF-branded values.
- No schema changes.
*/

INSERT INTO site_settings (key, value, updated_at) VALUES
  ('primary_color', '#1a1a1a', now()),
  ('bg_color', '#1a1a1a', now()),
  ('text_color', '#f5f5f5', now()),
  ('button_color', '#d97706', now()),
  ('button_text_color', '#ffffff', now()),
  ('accent_color', '#f59e0b', now()),
  ('secondary_text_color', '#a3a3a3', now()),
  ('hero_eyebrow', 'Charcoal Factory in China', now()),
  ('hero_title', 'Premium Charcoal. From Source to Shelf.', now()),
  ('hero_subtitle', 'Importers, distributors, and retail brands in 60+ countries source bulk bamboo charcoal, wood charcoal, and shisha charcoal directly from our wholesale charcoal factory in China. A, B & C grade available — MOQ 1×20GP container. Full export documentation on every shipment.', now()),
  ('hero_image_url', 'https://thecharcoalfactory.com/wp-content/uploads/2026/02/Machine-Made-Bamboo-Charcoal.jpg', now()),
  ('hero_bg_image', 'https://thecharcoalfactory.com/wp-content/uploads/2026/02/Machine-Made-Bamboo-Charcoal.jpg', now()),
  ('features_bg_image', 'https://thecharcoalfactory.com/wp-content/uploads/2026/02/Rectangle-11.jpg', now()),
  ('trust_badge_1_title', 'Global Bulk Shipping', now()),
  ('trust_badge_1_desc', '60+ countries served with full export documentation on every shipment.', now()),
  ('trust_badge_2_title', 'SGS Certified Quality', now()),
  ('trust_badge_2_desc', 'Every batch independently verified for fixed carbon, ash, and moisture content.', now()),
  ('trust_badge_3_title', 'Flexible Payment Options', now()),
  ('trust_badge_3_desc', 'Pay via FlutterWave, Paystack, Payoneer, or T/T bank transfer.', now()),
  ('trust_badge_4_title', 'Custom OEM Packaging', now()),
  ('trust_badge_4_desc', 'Private-label branding, custom carton weights, and retail-ready packaging.', now()),
  ('featured_eyebrow', 'Featured Catalog', now()),
  ('featured_title', 'Charcoal Factory Products for Every Market', now()),
  ('process_eyebrow', 'How It Works', now()),
  ('process_title', 'From inquiry to shipment in four steps.', now()),
  ('site_name', 'The Charcoal Factory', now()),
  ('site_tagline', 'Wholesale Charcoal Factory In China', now()),
  ('footer_about', 'Leading charcoal factory in China supplying bulk BBQ charcoal, shisha charcoal, and hardwood charcoal to importers, distributors, and retailers worldwide.', now()),
  ('contact_email', 'info@thecharcoalfactory.com', now()),
  ('contact_phone', '+86-55163514459', now()),
  ('contact_address', 'Hefei, Anhui Province, China', now()),
  ('footer_copyright', '© Created & Managed by OpalFlag FZC 2026. All Rights Reserved.', now())
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
