/*
# CMS Expansion — Bulk/Branded Pricing + Site Settings

## Overview
This migration expands the products table with flexible bulk and branded
pricing columns, and creates a new site_settings table for a site-wide CMS
that controls colors, hero text, trust badge copy, and image URLs from the
admin panel.

## Modified Tables

### products (altered)
New columns added to support dual pricing tiers:
- bulk_price_per_unit (numeric, default 0) — price per bulk unit (e.g. per ton)
- bulk_min_qty (integer, default 1) — minimum bulk order quantity
- bulk_unit_name (text, default 'ton') — unit label for bulk pricing
- branded_price_per_unit (numeric, default 0) — price per branded/retail unit
- branded_min_qty (integer, default 1) — minimum branded order quantity
- branded_unit_name (text, default 'box') — unit label for branded pricing
- branded_pack_desc (text) — description of branded packaging

The existing price_per_ton column is retained for backward compatibility
but the frontend will now use bulk_price_per_unit as the primary price.

Existing products are updated to populate bulk_* columns from price_per_ton
so they remain functional.

## New Tables

### site_settings
- key (text, primary key) — setting identifier e.g. 'primary_color', 'hero_title'
- value (text, not null) — the setting value
- updated_at (timestamptz, default now())

## Security (RLS)

### site_settings
- SELECT: public (anon + authenticated) — frontend needs to read settings
  to render the site dynamically
- INSERT / UPDATE / DELETE: authenticated only — admin manages settings

## Seed Data
Inserts default site settings:
- Colors: primary_color (#09090b), bg_color (#ffffff), text_color (#09090b),
  button_color (#09090b), button_text_color (#ffffff), accent_color (#27272a)
- Hero: hero_title, hero_subtitle, hero_image_url, hero_eyebrow
- Trust badges: trust_badge_1_title/desc through trust_badge_4_title/desc
- Section headings: featured_title, featured_eyebrow, process_title, process_eyebrow

## Important Notes
1. All new columns have safe defaults so existing rows remain valid.
2. Products are backfilled: bulk_price_per_unit = price_per_ton, bulk_min_qty = 1,
   bulk_unit_name = 'ton', branded columns set to sensible defaults.
3. site_settings policies are idempotent (DROP IF EXISTS before CREATE).
*/

-- ============================================================
-- ADD BULK/BRANDED COLUMNS TO PRODUCTS
-- ============================================================
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS bulk_price_per_unit numeric(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS bulk_min_qty integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS bulk_unit_name text DEFAULT 'ton',
  ADD COLUMN IF NOT EXISTS branded_price_per_unit numeric(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS branded_min_qty integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS branded_unit_name text DEFAULT 'box',
  ADD COLUMN IF NOT EXISTS branded_pack_desc text;

-- Backfill existing products: set bulk_price_per_unit from price_per_ton
UPDATE products
SET bulk_price_per_unit = price_per_ton,
    bulk_min_qty = 1,
    bulk_unit_name = 'ton',
    branded_price_per_unit = price_per_ton,
    branded_min_qty = 10,
    branded_unit_name = 'box',
    branded_pack_desc = 'Custom OEM retail packaging available'
WHERE bulk_price_per_unit = 0 OR bulk_price_per_unit IS NULL;

-- ============================================================
-- SITE SETTINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;
CREATE POLICY "public_read_site_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_site_settings" ON site_settings;
CREATE POLICY "auth_insert_site_settings" ON site_settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_site_settings" ON site_settings;
CREATE POLICY "auth_update_site_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_site_settings" ON site_settings;
CREATE POLICY "auth_delete_site_settings" ON site_settings FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- SEED DEFAULT SITE SETTINGS
-- ============================================================
INSERT INTO site_settings (key, value) VALUES
  -- Colors
  ('primary_color', '#09090b'),
  ('bg_color', '#ffffff'),
  ('text_color', '#09090b'),
  ('button_color', '#09090b'),
  ('button_text_color', '#ffffff'),
  ('accent_color', '#27272a'),
  -- Hero
  ('hero_eyebrow', 'Industrial Charcoal Export'),
  ('hero_title', 'Premium bulk charcoal,forged for global trade.'),
  ('hero_subtitle', 'Vertically integrated production from forest to container. We supply hardwood, bamboo, and coconut shell charcoal to wholesale buyers across four continents — with SGS-verified quality and T/T terms built for industrial volume.'),
  ('hero_image_url', 'https://images.pexels.com/photos/48884/pexels-photo-48884.jpeg?auto=compress&cs=tinysrgb&w=1920'),
  -- Trust badges
  ('trust_badge_1_title', 'Global Bulk Shipping'),
  ('trust_badge_1_desc', '20GP and 40GP container loads shipped to 40+ destination ports worldwide.'),
  ('trust_badge_2_title', 'SGS Certified Quality'),
  ('trust_badge_2_desc', 'Every batch independently verified for fixed carbon, ash, and moisture content.'),
  ('trust_badge_3_title', 'Flexible T/T Terms'),
  ('trust_badge_3_desc', '50% advance deposit, 50% before loading. Letters of credit available on request.'),
  ('trust_badge_4_title', 'Custom OEM Packaging'),
  ('trust_badge_4_desc', 'Private-label branding, custom carton weights, and retail-ready packaging.'),
  -- Section headings
  ('featured_eyebrow', 'Featured Catalog'),
  ('featured_title', 'Export-grade charcoal products.'),
  ('process_eyebrow', 'How It Works'),
  ('process_title', 'From inquiry to shipment in four steps.')
ON CONFLICT (key) DO NOTHING;
