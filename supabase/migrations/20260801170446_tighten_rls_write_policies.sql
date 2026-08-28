-- Tighten write policies: only allow INSERT from anon for public submissions (orders, contact, reviews, newsletter).
-- Remove anon UPDATE/DELETE on sensitive tables so a browser cannot modify or delete orders, products, settings, etc.

-- ORDERS: anon can only INSERT (submit a quote request), not UPDATE or DELETE
DROP POLICY IF EXISTS "auth_update_orders" ON orders;
CREATE POLICY "auth_update_orders" ON orders
  FOR UPDATE TO authenticated USING (false) WITH CHECK (false);

-- ORDER_ITEMS: no public UPDATE
DROP POLICY IF EXISTS "auth_update_order_items" ON order_items;
CREATE POLICY "auth_update_order_items" ON order_items
  FOR UPDATE TO authenticated USING (false) WITH CHECK (false);

-- PRODUCTS: no anon INSERT/UPDATE/DELETE (admin uses service role via edge function or would need auth)
-- Keep public SELECT so products display on the site
DROP POLICY IF EXISTS "auth_delete_products" ON products;
CREATE POLICY "auth_delete_products" ON products
  FOR DELETE TO anon, authenticated USING (false);

DROP POLICY IF EXISTS "auth_insert_products" ON products;
CREATE POLICY "auth_insert_products" ON products
  FOR INSERT TO anon, authenticated WITH CHECK (false);

DROP POLICY IF EXISTS "auth_update_products" ON products;
CREATE POLICY "auth_update_products" ON products
  FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);

-- SITE_SETTINGS: no anon INSERT/UPDATE/DELETE
DROP POLICY IF EXISTS "auth_delete_site_settings" ON site_settings;
CREATE POLICY "auth_delete_site_settings" ON site_settings
  FOR DELETE TO anon, authenticated USING (false);

DROP POLICY IF EXISTS "auth_insert_site_settings" ON site_settings;
CREATE POLICY "auth_insert_site_settings" ON site_settings
  FOR INSERT TO anon, authenticated WITH CHECK (false);

DROP POLICY IF EXISTS "auth_update_site_settings" ON site_settings;
CREATE POLICY "auth_update_site_settings" ON site_settings
  FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);

-- BLOG_POSTS: no anon INSERT/UPDATE/DELETE
DROP POLICY IF EXISTS "auth_delete_blog" ON blog_posts;
CREATE POLICY "auth_delete_blog" ON blog_posts
  FOR DELETE TO anon, authenticated USING (false);

DROP POLICY IF EXISTS "auth_manage_blog" ON blog_posts;
CREATE POLICY "auth_manage_blog" ON blog_posts
  FOR INSERT TO anon, authenticated WITH CHECK (false);

DROP POLICY IF EXISTS "auth_update_blog" ON blog_posts;
CREATE POLICY "auth_update_blog" ON blog_posts
  FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);

-- EMAIL_TEMPLATES: no anon modification
DROP POLICY IF EXISTS "auth_delete_email_templates" ON email_templates;
CREATE POLICY "auth_delete_email_templates" ON email_templates
  FOR DELETE TO anon, authenticated USING (false);

DROP POLICY IF EXISTS "auth_insert_email_templates" ON email_templates;
CREATE POLICY "auth_insert_email_templates" ON email_templates
  FOR INSERT TO anon, authenticated WITH CHECK (false);

DROP POLICY IF EXISTS "auth_update_email_templates" ON email_templates;
CREATE POLICY "auth_update_email_templates" ON email_templates
  FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);

-- INTEGRATIONS: no anon modification
DROP POLICY IF EXISTS "auth_delete_integrations" ON integrations;
CREATE POLICY "auth_delete_integrations" ON integrations
  FOR DELETE TO anon, authenticated USING (false);

DROP POLICY IF EXISTS "auth_insert_integrations" ON integrations;
CREATE POLICY "auth_insert_integrations" ON integrations
  FOR INSERT TO anon, authenticated WITH CHECK (false);

DROP POLICY IF EXISTS "auth_update_integrations" ON integrations;
CREATE POLICY "auth_update_integrations" ON integrations
  FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);

-- MEDIA_LIBRARY: no anon modification
DROP POLICY IF EXISTS "auth_delete_media" ON media_library;
CREATE POLICY "auth_delete_media" ON media_library
  FOR DELETE TO anon, authenticated USING (false);

DROP POLICY IF EXISTS "auth_insert_media" ON media_library;
CREATE POLICY "auth_insert_media" ON media_library
  FOR INSERT TO anon, authenticated WITH CHECK (false);

DROP POLICY IF EXISTS "auth_update_media" ON media_library;
CREATE POLICY "auth_update_media" ON media_library
  FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);

-- CONTACT_SUBMISSIONS: anon can INSERT (submit form) but not UPDATE/DELETE
DROP POLICY IF EXISTS "auth_delete_contact" ON contact_submissions;
CREATE POLICY "auth_delete_contact" ON contact_submissions
  FOR DELETE TO anon, authenticated USING (false);

DROP POLICY IF EXISTS "auth_update_contact" ON contact_submissions;
CREATE POLICY "auth_update_contact" ON contact_submissions
  FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);

-- REVIEWS: anon can INSERT (submit review) but not UPDATE/DELETE
DROP POLICY IF EXISTS "auth_delete_reviews" ON reviews;
CREATE POLICY "auth_delete_reviews" ON reviews
  FOR DELETE TO anon, authenticated USING (false);

DROP POLICY IF EXISTS "auth_manage_reviews" ON reviews;
CREATE POLICY "auth_manage_reviews" ON reviews
  FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);

-- NEWSLETTER: anon can INSERT (subscribe) but not UPDATE/DELETE
DROP POLICY IF EXISTS "delete_newsletter_admin" ON newsletter_subscribers;
CREATE POLICY "delete_newsletter_admin" ON newsletter_subscribers
  FOR DELETE TO anon, authenticated USING (false);

DROP POLICY IF EXISTS "update_newsletter_admin" ON newsletter_subscribers;
CREATE POLICY "update_newsletter_admin" ON newsletter_subscribers
  FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);

-- AUDIT_LOGS: only INSERT, no UPDATE/DELETE from anon
DROP POLICY IF EXISTS "auth_insert_audit" ON audit_logs;
CREATE POLICY "auth_insert_audit" ON audit_logs
  FOR INSERT TO anon, authenticated WITH CHECK (false);

-- ERROR_LOGS: only INSERT, no UPDATE from anon
DROP POLICY IF EXISTS "auth_update_errors" ON error_logs;
CREATE POLICY "auth_update_errors" ON error_logs
  FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
