-- Disable RLS for orders table to allow access without authentication
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- Disable RLS for users table to allow access without authentication
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Disable RLS for customers table to allow access without authentication
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;


-- Disable RLS for signs table to allow access without authentication
ALTER TABLE signs DISABLE ROW LEVEL SECURITY;

-- Disable RLS for packages table to allow access without authentication
ALTER TABLE packages DISABLE ROW LEVEL SECURITY;

-- Disable RLS for reports table to allow access without authentication
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;

-- Add public access policies for all tables
DROP POLICY IF EXISTS "Public access" ON orders;
CREATE POLICY "Public access"
ON orders FOR ALL
USING (true);

DROP POLICY IF EXISTS "Public access" ON users;
CREATE POLICY "Public access"
ON users FOR ALL
USING (true);

DROP POLICY IF EXISTS "Public access" ON customers;
CREATE POLICY "Public access"
ON customers FOR ALL
USING (true);


DROP POLICY IF EXISTS "Public access" ON signs;
CREATE POLICY "Public access"
ON signs FOR ALL
USING (true);

DROP POLICY IF EXISTS "Public access" ON packages;
CREATE POLICY "Public access"
ON packages FOR ALL
USING (true);

DROP POLICY IF EXISTS "Public access" ON reports;
CREATE POLICY "Public access"
ON reports FOR ALL
USING (true);

-- Enable realtime for tables that aren't already in the publication
-- We're removing these lines as the tables are already in the publication
-- alter publication supabase_realtime add table users;
-- alter publication supabase_realtime add table customers;
-- alter publication supabase_realtime add table signs;
-- alter publication supabase_realtime add table packages;
-- alter publication supabase_realtime add table reports;