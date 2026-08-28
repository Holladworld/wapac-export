-- supabase/migrations/20250601000002_create_admin_users.sql

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  password_hash TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  failed_attempts INTEGER DEFAULT 0,
  last_failed_at TIMESTAMPTZ,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()  -- ← Make sure this line exists
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read for authenticated users" ON admin_users
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all for service role" ON admin_users
  FOR ALL USING (auth.role() = 'service_role');

-- Insert admin user (without ON CONFLICT UPDATE to avoid updated_at issues)
INSERT INTO admin_users (email, display_name, role, password_hash, active)
VALUES (
  'wapacexport@gmail.com',
  'Wapac Admin',
  'admin',
  'sha256:6cec823fd73bebe346e983aa6bb4ef4d:71bfc97cd63f0dfde6dd7dec8be9fd80add383966fe9a72548f4a2ef0a4483e6959a4f6445a0dade65a44e6a30726251a5a9f7b8d1d3bcea2f64bfecb7e09907',
  true
) ON CONFLICT (email) DO NOTHING;