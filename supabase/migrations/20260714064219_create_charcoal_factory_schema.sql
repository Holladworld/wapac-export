/*
# The Charcoal Factory — Core Schema

## Overview
Creates the three core tables for a B2B wholesale charcoal e-commerce platform:
products (catalog), orders (wholesale inquiries), and order_items (line items).
Enables Row Level Security with public read access to the product catalog,
anonymous order submission (checkout), and authenticated-only access to order
data for the admin dashboard.

## New Tables

### products
- id (uuid, primary key)
- name (text, not null) — product name
- description (text, not null) — marketing/technical description
- grade (text, not null) — quality grade e.g. 'Grade A', 'Grade B'
- category (text, not null) — charcoal type: 'Wood', 'Bamboo', 'Coconut'
- specifications (jsonb, not null) — technical specs: Ash Content, Fixed Carbon,
  Moisture, Calorific Value, Burn Time, etc.
- price_per_ton (numeric, not null) — USD price per metric ton
- image_url (text) — product photo URL
- created_at (timestamptz, default now)

### orders
- id (uuid, primary key)
- company_name (text, not null)
- contact_name (text, not null)
- contact_email (text, not null)
- vat_number (text) — corporate registration / VAT number
- shipping_address (text, not null) — destination port / address
- payment_method (text, not null) — 'T/T Bank Transfer', 'Letter of Credit',
  'Proforma Invoice'
- total_price (numeric, not null) — order total in USD
- total_tons (numeric, not null) — aggregate tons across line items
- status (text, not null, default 'Pending') — 'Pending', 'Processing',
  'Shipped', 'Cancelled'
- created_at (timestamptz, default now())

### order_items
- id (uuid, primary key)
- order_id (uuid, foreign key → orders.id ON DELETE CASCADE)
- product_id (uuid, foreign key → products.id)
- quantity (integer, not null) — number of metric tons ordered
- price_at_purchase (numeric, not null) — price per ton captured at order time

## Security (RLS)

### products
- SELECT: public (anon + authenticated) — catalog is visible to all visitors
- INSERT / UPDATE / DELETE: authenticated only — admin manages inventory

### orders
- INSERT: public (anon + authenticated) — visitors submit wholesale inquiries
  at checkout without signing in
- SELECT / UPDATE: authenticated only — admin dashboard reads and updates
  order status

### order_items
- INSERT: public (anon + authenticated) — created during checkout
- SELECT: authenticated only — admin-only line item visibility

## Seed Data
Inserts three premium charcoal products with full technical specifications:
1. A-Grade Natural Hardwood Charcoal — $850/ton
2. Hexagonal Machine-Made Bamboo Charcoal — $1,100/ton
3. Premium Coconut Shell Shisha Cubes — $1,400/ton

## Important Notes
1. This is a single-tenant storefront: no user accounts for buyers. The admin
   authenticates via Supabase email/password to satisfy the authenticated-only
   RLS policies on orders and order_items.
2. All policies are idempotent (DROP IF EXISTS before CREATE POLICY).
3. price_per_ton and total_price use numeric(12,2) for precise currency values.
*/

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  grade text NOT NULL,
  category text NOT NULL,
  specifications jsonb NOT NULL DEFAULT '{}'::jsonb,
  price_per_ton numeric(12,2) NOT NULL,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_products" ON products;
CREATE POLICY "auth_insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_products" ON products;
CREATE POLICY "auth_update_products" ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_products" ON products;
CREATE POLICY "auth_delete_products" ON products FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  vat_number text,
  shipping_address text NOT NULL,
  payment_method text NOT NULL,
  total_price numeric(12,2) NOT NULL,
  total_tons numeric(12,2) NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_orders" ON orders;
CREATE POLICY "public_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_orders" ON orders;
CREATE POLICY "auth_read_orders" ON orders FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_orders" ON orders;
CREATE POLICY "auth_update_orders" ON orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  price_at_purchase numeric(12,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_order_items" ON order_items;
CREATE POLICY "public_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_order_items" ON order_items;
CREATE POLICY "auth_read_order_items" ON order_items FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_order_items" ON order_items;
CREATE POLICY "auth_update_order_items" ON order_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_grade ON products(grade);

-- ============================================================
-- SEED DATA — Premium Charcoal Products
-- ============================================================
INSERT INTO products (name, description, grade, category, specifications, price_per_ton, image_url)
VALUES
  (
    'A-Grade Natural Hardwood Charcoal',
    'Premium hardwood charcoal carbonized from dense African acacia and oak. Sourced from sustainably managed forests and processed in our ISO-certified kilns. Ideal for premium BBQ restaurants, hospitality groups, and wholesale distribution networks requiring consistent high-heat output and minimal smoke.',
    'Grade A',
    'Wood',
    jsonb_build_object(
      'Fixed Carbon', '>80%',
      'Moisture', '<5%',
      'Ash Content', '<3%',
      'Calorific Value', '7,800 kcal/kg',
      'Burn Time', '3.5 hours',
      'Shape', 'Lump / Natural'
    ),
    850.00,
    'https://images.pexels.com/photos/48884/pexels-photo-48884.jpeg?auto=compress&cs=tinysrgb&w=900'
  ),
  (
    'Hexagonal Machine-Made Bamboo Charcoal',
    'Engineered hexagonal bamboo charcoal briquettes produced from compressed bamboo sawdust. Smokeless, odorless, and uniformly shaped for controlled combustion. The preferred choice for indoor dining venues, shisha lounges, and export-grade retail packaging.',
    'Grade A',
    'Bamboo',
    jsonb_build_object(
      'Fixed Carbon', '>85%',
      'Moisture', '<4%',
      'Ash Content', '<4%',
      'Calorific Value', '8,200 kcal/kg',
      'Burn Time', '>5 hours',
      'Shape', 'Hexagonal'
    ),
  1100.00,
    'https://images.pexels.com/photos/12224453/pexels-photo-12224453.jpeg?auto=compress&cs=tinysrgb&w=900'
  ),
  (
    'Premium Coconut Shell Shisha Cubes',
    '100% eco-friendly coconut shell charcoal cubes crafted for premium shisha and hookah applications. Sparkless, odorless, and ash-bound for a clean, long-lasting session. Custom OEM packaging available for private-label brands.',
    'Grade A',
    'Coconut',
    jsonb_build_object(
      'Fixed Carbon', '>82%',
      'Moisture', '<5%',
      'Ash Content', '<2.2%',
      'Calorific Value', '7,900 kcal/kg',
      'Burn Time', '>2 hours per cube',
      'Shape', 'Cube (25mm)'
    ),
    1400.00,
    'https://images.pexels.com/photos/1309071/pexels-photo-1309071.jpeg?auto=compress&cs=tinysrgb&w=900'
  )
ON CONFLICT DO NOTHING;
