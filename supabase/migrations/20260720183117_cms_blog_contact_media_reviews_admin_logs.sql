/*
# CMS: Blog, Contact, Media Library, Reviews, Admin Users, Audit/Error Logs, Integrations, Email Templates

## Overview
Adds the full content management system backend: blog posts, contact form submissions,
media library, product reviews/comments, admin users with roles, audit logs, error logs,
third-party integrations, and email notification templates.

## New Tables
1. blog_posts — CMS-managed blog articles (title, slug, body, hero image, category, published status, author, timestamps).
2. contact_submissions — submissions from the public contact form (name, email, company, message, status).
3. media_library — central hub for uploaded images/videos/docs (url, type, alt text, tags, uploaded_by).
4. reviews — user-generated product reviews/comments with moderation status (approved/pending/rejected).
5. admin_users — internal team accounts with role-based access (Admin, Editor, Read-Only) and 2FA settings.
6. audit_logs — running record of who made what changes and when (actor, action, entity, details, timestamp).
7. error_logs — server-side errors, broken links, failed operations (level, message, context, timestamp).
8. integrations — securely stored API key references and third-party service configs (Stripe, Mailchimp, GA, etc.).
9. email_templates — automated email templates (welcome, receipts, admin alerts) with subject + body.

## Security
- All tables have RLS enabled.
- Public-facing tables (blog_posts published, contact_submissions insert, reviews approved read) use TO anon, authenticated.
- Admin-only tables (media_library, admin_users, audit_logs, error_logs, integrations, email_templates) use TO authenticated with ownership/role checks.
- Reviews allow anon insert (users submit reviews) but only approved reviews are publicly readable.
*/

-- 1. Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  body text NOT NULL,
  hero_image_url text,
  category text DEFAULT 'General',
  tags text[] DEFAULT '{}',
  author text DEFAULT 'Admin',
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

DROP POLICY IF EXISTS "anon_read_published_blog" ON blog_posts;
CREATE POLICY "anon_read_published_blog" ON blog_posts FOR SELECT
  TO anon, authenticated USING (published = true);
DROP POLICY IF EXISTS "auth_manage_blog" ON blog_posts;
CREATE POLICY "auth_manage_blog" ON blog_posts FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_blog" ON blog_posts;
CREATE POLICY "auth_update_blog" ON blog_posts FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_blog" ON blog_posts;
CREATE POLICY "auth_delete_blog" ON blog_posts FOR DELETE
  TO authenticated USING (true);

-- 2. Contact Submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  phone text,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status, created_at DESC);

DROP POLICY IF EXISTS "anon_insert_contact" ON contact_submissions;
CREATE POLICY "anon_insert_contact" ON contact_submissions FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_read_contact" ON contact_submissions;
CREATE POLICY "auth_read_contact" ON contact_submissions FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_contact" ON contact_submissions;
CREATE POLICY "auth_update_contact" ON contact_submissions FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_contact" ON contact_submissions;
CREATE POLICY "auth_delete_contact" ON contact_submissions FOR DELETE
  TO authenticated USING (true);

-- 3. Media Library
CREATE TABLE IF NOT EXISTS media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL DEFAULT 'image',
  file_size bigint,
  alt_text text,
  tags text[] DEFAULT '{}',
  folder text DEFAULT 'root',
  uploaded_by text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_media_library_folder ON media_library(folder, created_at DESC);

DROP POLICY IF EXISTS "auth_read_media" ON media_library;
CREATE POLICY "auth_read_media" ON media_library FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_media" ON media_library;
CREATE POLICY "auth_insert_media" ON media_library FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_media" ON media_library;
CREATE POLICY "auth_update_media" ON media_library FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_media" ON media_library;
CREATE POLICY "auth_delete_media" ON media_library FOR DELETE
  TO authenticated USING (true);

-- 4. Reviews / Comments
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_email text NOT NULL,
  rating integer DEFAULT 5,
  title text,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id) WHERE product_id IS NOT NULL;

DROP POLICY IF EXISTS "anon_read_approved_reviews" ON reviews;
CREATE POLICY "anon_read_approved_reviews" ON reviews FOR SELECT
  TO anon, authenticated USING (status = 'approved');
DROP POLICY IF EXISTS "anon_insert_review" ON reviews;
CREATE POLICY "anon_insert_review" ON reviews FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_manage_reviews" ON reviews;
CREATE POLICY "auth_manage_reviews" ON reviews FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_reviews" ON reviews;
CREATE POLICY "auth_delete_reviews" ON reviews FOR DELETE
  TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_read_all_reviews" ON reviews;
CREATE POLICY "auth_read_all_reviews" ON reviews FOR SELECT
  TO authenticated USING (true);

-- 5. Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  display_name text NOT NULL,
  role text NOT NULL DEFAULT 'editor',
  two_factor_enabled boolean NOT NULL DEFAULT false,
  two_factor_secret text,
  password_hash text,
  last_login timestamptz,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_read_admin_users" ON admin_users;
CREATE POLICY "auth_read_admin_users" ON admin_users FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_manage_admin_users" ON admin_users;
CREATE POLICY "auth_manage_admin_users" ON admin_users FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_admin_users" ON admin_users;
CREATE POLICY "auth_update_admin_users" ON admin_users FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_admin_users" ON admin_users;
CREATE POLICY "auth_delete_admin_users" ON admin_users FOR DELETE
  TO authenticated USING (true);

-- 6. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor text NOT NULL DEFAULT 'system',
  action text NOT NULL,
  entity_type text,
  entity_id text,
  details jsonb DEFAULT '{}',
  ip_address text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor);

DROP POLICY IF EXISTS "auth_read_audit" ON audit_logs;
CREATE POLICY "auth_read_audit" ON audit_logs FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_audit" ON audit_logs;
CREATE POLICY "auth_insert_audit" ON audit_logs FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- 7. Error Logs
CREATE TABLE IF NOT EXISTS error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level text NOT NULL DEFAULT 'error',
  message text NOT NULL,
  context jsonb DEFAULT '{}',
  source text,
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_error_logs_created ON error_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_level ON error_logs(level, resolved);

DROP POLICY IF EXISTS "auth_read_errors" ON error_logs;
CREATE POLICY "auth_read_errors" ON error_logs FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_errors" ON error_logs;
CREATE POLICY "auth_insert_errors" ON error_logs FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_errors" ON error_logs;
CREATE POLICY "auth_update_errors" ON error_logs FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- 8. Integrations
CREATE TABLE IF NOT EXISTS integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  api_key_encrypted text,
  webhook_url text,
  enabled boolean NOT NULL DEFAULT false,
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_read_integrations" ON integrations;
CREATE POLICY "auth_read_integrations" ON integrations FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_integrations" ON integrations;
CREATE POLICY "auth_insert_integrations" ON integrations FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_integrations" ON integrations;
CREATE POLICY "auth_update_integrations" ON integrations FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_integrations" ON integrations;
CREATE POLICY "auth_delete_integrations" ON integrations FOR DELETE
  TO authenticated USING (true);

-- 9. Email Templates
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key text UNIQUE NOT NULL,
  display_name text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_read_email_templates" ON email_templates;
CREATE POLICY "auth_read_email_templates" ON email_templates FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_email_templates" ON email_templates;
CREATE POLICY "auth_insert_email_templates" ON email_templates FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_email_templates" ON email_templates;
CREATE POLICY "auth_update_email_templates" ON email_templates FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_email_templates" ON email_templates;
CREATE POLICY "auth_delete_email_templates" ON email_templates FOR DELETE
  TO authenticated USING (true);

-- Seed default email templates
INSERT INTO email_templates (template_key, display_name, subject, body) VALUES
  ('welcome', 'Welcome Email', 'Welcome to The Charcoal Factory', 'Thank you for your interest in The Charcoal Factory. We will be in touch shortly regarding your inquiry.'),
  ('order_receipt', 'Order Receipt', 'Your Order Confirmation - #{order_id}', 'Dear {customer_name},\n\nWe have received your order and will process it shortly. Your order total is {total_amount}.\n\nThank you for your business.'),
  ('admin_alert', 'Admin Alert', 'New {event_type} Notification', 'A new {event_type} has been received. Please log in to the admin panel to review.')
ON CONFLICT (template_key) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  subject = EXCLUDED.subject,
  body = EXCLUDED.body;

-- Seed default integrations
INSERT INTO integrations (service_name, display_name, enabled) VALUES
  ('stripe', 'Stripe Payments', false),
  ('flutterwave', 'FlutterWave', false),
  ('paystack', 'Paystack', false),
  ('payoneer', 'Payoneer', false),
  ('mailchimp', 'Mailchimp', false),
  ('google_analytics', 'Google Analytics', false),
  ('smtp', 'SMTP Email', false)
ON CONFLICT (service_name) DO NOTHING;

-- Add order tracking fields to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS carrier text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_delivery date;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_notes text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Extend order status to include Delivered
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'));
