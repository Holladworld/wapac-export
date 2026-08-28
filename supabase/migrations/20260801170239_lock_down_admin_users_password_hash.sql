-- Revoke the anon (public) ability to read the password_hash column.
-- The admin-login edge function uses the service role key which bypasses RLS,
-- so login still works. The browser (anon key) can no longer fetch password hashes.
REVOKE SELECT (password_hash, two_factor_secret) ON admin_users FROM anon, authenticated;

-- Also narrow the anon SELECT policy so only safe columns are exposed if needed.
-- The edge function handles auth, so anon does not need to read admin_users at all.
-- Revoke all table-level SELECT from anon and authenticated on sensitive columns.
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing permissive policies and replace with a deny-by-default approach.
DROP POLICY IF EXISTS "anon_read_admin_users" ON admin_users;
DROP POLICY IF EXISTS "anon_insert_admin_users" ON admin_users;
DROP POLICY IF EXISTS "anon_update_admin_users" ON admin_users;
DROP POLICY IF EXISTS "anon_delete_admin_users" ON admin_users;

-- Admin users table should not be accessible via the anon key at all.
-- The edge function uses the service role key, which bypasses RLS.
-- Authenticated users also should not browse this table.
CREATE POLICY "deny_admin_users_anon" ON admin_users
  FOR SELECT TO anon, authenticated
  USING (false);

CREATE POLICY "deny_admin_users_insert" ON admin_users
  FOR INSERT TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "deny_admin_users_update" ON admin_users
  FOR UPDATE TO anon, authenticated
  USING (false) WITH CHECK (false);

CREATE POLICY "deny_admin_users_delete" ON admin_users
  FOR DELETE TO anon, authenticated
  USING (false);
