CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_newsletter" ON newsletter_subscribers FOR INSERT
  TO anon, authenticated WITH CHECK (true);
CREATE POLICY "select_newsletter_admin" ON newsletter_subscribers FOR SELECT
  TO authenticated USING (true);
CREATE POLICY "delete_newsletter_admin" ON newsletter_subscribers FOR DELETE
  TO authenticated USING (true);
CREATE POLICY "update_newsletter_admin" ON newsletter_subscribers FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
