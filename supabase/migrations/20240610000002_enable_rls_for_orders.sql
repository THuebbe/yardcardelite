-- First, create the order_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  sign_id UUID NOT NULL REFERENCES signs(id),
  quantity INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy for orders table
DROP POLICY IF EXISTS "Users can only view their own orders" ON orders;
CREATE POLICY "Users can only view their own orders"
ON orders
FOR ALL
USING (auth.uid() = user_id);

-- Enable Row Level Security for order_items table
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policy for order_items table
DROP POLICY IF EXISTS "Users can only view their own order items" ON order_items;
CREATE POLICY "Users can only view their own order items"
ON order_items
FOR ALL
USING (
  order_id IN (
    SELECT id FROM orders WHERE user_id = auth.uid()
  )
);

-- Add realtime support
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
