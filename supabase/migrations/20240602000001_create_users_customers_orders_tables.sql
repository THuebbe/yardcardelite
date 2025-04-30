-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (SaaS customers)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'business', 'customer')),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table (end customers of SaaS users)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  event_address JSONB NOT NULL,
  billing_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number SERIAL UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'deployed', 'checkin', 'completed', 'cancelled')),
  total_amount DECIMAL(10, 2) NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE,
  event_for_name TEXT,
  package_info JSONB,
  preview_slots JSONB,
  options JSONB,
  pickup_info JSONB,
  reports JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  sign_id UUID NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create signs table for inventory management
CREATE TABLE IF NOT EXISTS signs(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  serial_number TEXT UNIQUE,
  sign_number SERIAL UNIQUE NOT NULL,
  name TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('birthday', 'graduation', 'retirement', 'wedding', 'baby', 'anniversary', 'holiday', 'seasonal', 'other')),
  colors JSONB NOT NULL, -- Storing as JSONB array instead of TEXT for multiple colors
  style TEXT CHECK (style IN ('classic', 'modern', 'rustic', 'elegant', 'playful', 'minimalist', 'vintage', 'custom')),
  theme TEXT,
  image_url TEXT,
  dimensions JSONB,
  materials JSONB, -- Added materials as JSONB array
  weight JSONB, -- Added weight as JSONB object
  notes TEXT,
  inventory JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  sign_count INTEGER NOT NULL,
  setup_days_before INTEGER NOT NULL,
  teardown_days_after INTEGER NOT NULL,
  extra_day_before_price DECIMAL(10, 2) NOT NULL,
  extra_day_after_price DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
DROP POLICY IF EXISTS "Users can view their own data" ON users;
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own data" ON users;
CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Create policies for customers table
DROP POLICY IF EXISTS "Users can view their customers" ON customers;
CREATE POLICY "Users can view their customers"
  ON customers FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their customers" ON customers;
CREATE POLICY "Users can insert their customers"
  ON customers FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their customers" ON customers;
CREATE POLICY "Users can update their customers"
  ON customers FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their customers" ON customers;
CREATE POLICY "Users can delete their customers"
  ON customers FOR DELETE
  USING (user_id = auth.uid());

-- Create policies for orders table
DROP POLICY IF EXISTS "Users can view their orders" ON orders;
CREATE POLICY "Users can view their orders"
  ON orders FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their orders" ON orders;
CREATE POLICY "Users can insert their orders"
  ON orders FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their orders" ON orders;
CREATE POLICY "Users can update their orders"
  ON orders FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their orders" ON orders;
CREATE POLICY "Users can delete their orders"
  ON orders FOR DELETE
  USING (user_id = auth.uid());

-- Create policies for order_items table
DROP POLICY IF EXISTS "Users can view their order items" ON order_items;
CREATE POLICY "Users can view their order items"
  ON order_items FOR SELECT
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert their order items" ON order_items;
CREATE POLICY "Users can insert their order items"
  ON order_items FOR INSERT
  WITH CHECK (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can update their order items" ON order_items;
CREATE POLICY "Users can update their order items"
  ON order_items FOR UPDATE
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete their order items" ON order_items;
CREATE POLICY "Users can delete their order items"
  ON order_items FOR DELETE
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- Create policies for signs table (admin only for now)
DROP POLICY IF EXISTS "All users can view signs" ON signs;
CREATE POLICY "All users can view signs"
  ON signs FOR SELECT
  USING (true);

-- Create policies for packages table (all users can view)
DROP POLICY IF EXISTS "All users can view packages" ON packages;
CREATE POLICY "All users can view packages"
  ON packages FOR SELECT
  USING (true);

-- Enable realtime for relevant tables
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table customers;
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table order_items;
alter publication supabase_realtime add table signs;
alter publication supabase_realtime add table packages;
alter publication supabase_realtime add table signs;