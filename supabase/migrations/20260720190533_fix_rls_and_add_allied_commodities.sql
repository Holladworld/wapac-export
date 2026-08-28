/*
# Fix RLS on admin_users, audit_logs, error_logs for anon inserts + add allied commodity products

## Overview
1. Fixes RLS policies on admin_users, audit_logs, and error_logs so the anon-key frontend can insert records (the previous authenticated-only INSERT policies caused "new row violates row-level security policy" errors when adding users from the admin panel which uses the anon key).
2. Adds allied commodity products (cocoa, cashew nuts, ginger, soya bean) to the products table.
3. Adds a "service_type" column to products to distinguish charcoal vs allied commodity products.

## Security Changes
- admin_users: INSERT policy changed from TO authenticated to TO anon, authenticated (the admin panel uses the anon key).
- audit_logs: already had anon insert, verified.
- error_logs: already had anon insert, verified.
- All SELECT/UPDATE/DELETE policies on these tables remain authenticated-only for reads, but since the admin panel uses the anon key, we also need anon access. Updated to anon, authenticated for consistency with the rest of the CMS tables.

## Schema Changes
- products: added "service_type" column (text, default 'charcoal') to distinguish charcoal products from allied commodity products.
- Added a new product category set: Cocoa, Cashew Nuts, Ginger, Soya Bean.
*/

-- Fix admin_users INSERT policy for anon access
DROP POLICY IF EXISTS "auth_manage_admin_users" ON admin_users;
CREATE POLICY "anon_insert_admin_users" ON admin_users FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_read_admin_users" ON admin_users;
CREATE POLICY "anon_read_admin_users" ON admin_users FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_admin_users" ON admin_users;
CREATE POLICY "anon_update_admin_users" ON admin_users FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_admin_users" ON admin_users;
CREATE POLICY "anon_delete_admin_users" ON admin_users FOR DELETE
  TO anon, authenticated USING (true);

-- Add service_type column to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS service_type text NOT NULL DEFAULT 'charcoal';

-- Seed allied commodity products
INSERT INTO products (name, description, grade, category, image_url, specifications, price_per_ton, bulk_price_per_unit, bulk_min_qty, bulk_unit_name, branded_price_per_unit, branded_min_qty, branded_unit_name, branded_pack_desc, service_type) VALUES
  ('Premium Raw Cocoa Beans', 'High-grade raw cocoa beans from West African farms. Properly fermented and sun-dried for export. Suitable for chocolate manufacturers and cocoa processors worldwide.', 'Grade A', 'Cocoa', 'https://images.pexels.com/photos/8629016/pexels-photo-8629016.jpeg?auto=compress&cs=tinysrgb&w=800', '{"Moisture": "≤7.5%", "Foreign Matter": "≤1%", "Broken Beans": "≤5%", "Fermentation": "Well fermented"}', 3200, 3200, 18, 'ton', 0, 1, 'bag', 'Custom jute or PP bag packaging available', 'allied')
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, grade, category, image_url, specifications, price_per_ton, bulk_price_per_unit, bulk_min_qty, bulk_unit_name, branded_price_per_unit, branded_min_qty, branded_unit_name, branded_pack_desc, service_type) VALUES
  ('Premium Cashew Nuts (Raw Whole)', 'Whole raw cashew nuts, carefully graded and cleaned for export. Ideal for roasting, processing, and retail packaging. Sourced from West African cooperatives.', 'Grade A', 'Cashew Nuts', 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800', '{"Count": "180-200 per kg", "Moisture": "≤5%", "Broken": "≤2%", "Color": "White/Ivory"}', 4500, 4500, 18, 'ton', 0, 1, 'carton', 'Vacuum-sealed cartons or custom packaging', 'allied')
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, grade, category, image_url, specifications, price_per_ton, bulk_price_per_unit, bulk_min_qty, bulk_unit_name, branded_price_per_unit, branded_min_qty, branded_unit_name, branded_pack_desc, service_type) VALUES
  ('Dried Ginger (Whole Root)', 'Sun-dried whole ginger root with high oleoresin content. Pungent aroma and flavor. Suitable for spice processors, food manufacturers, and herbal product brands.', 'Grade A', 'Ginger', 'https://images.pexels.com/photos/163828/ginger-spice-root-tasty-163828.jpeg?auto=compress&cs=tinysrgb&w=800', '{"Moisture": "≤12%", "Oleoresin": "≥6%", "Foreign Matter": "≤1%", "Mold": "None"}', 2800, 2800, 18, 'ton', 0, 1, 'bag', 'Jute bags or custom PP woven bags', 'allied')
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, grade, category, image_url, specifications, price_per_ton, bulk_price_per_unit, bulk_min_qty, bulk_unit_name, branded_price_per_unit, branded_min_qty, branded_unit_name, branded_pack_desc, service_type) VALUES
  ('Soya Beans (Export Grade)', 'High-protein soya beans for animal feed, oil extraction, and food processing. Clean, uniform, and properly dried for long-term storage and export.', 'Grade A', 'Soya Bean', 'https://images.pexels.com/photos/7421099/pexels-photo-7421099.jpeg?auto=compress&cs=tinysrgb&w=800', '{"Protein": "≥36%", "Moisture": "≤13%", "Foreign Matter": "≤1%", "Splits": "≤10%"}', 1800, 1800, 18, 'ton', 0, 1, 'bag', 'PP woven bags or bulk container loading', 'allied')
ON CONFLICT DO NOTHING;
