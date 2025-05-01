-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL,
  report_type TEXT NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  generated_by UUID NOT NULL,
  filename TEXT NOT NULL,
  report_data TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Allow all users to view reports" ON reports;
CREATE POLICY "Allow all users to view reports"
ON reports FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert reports" ON reports;
CREATE POLICY "Allow authenticated users to insert reports"
ON reports FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Enable realtime
alter publication supabase_realtime add table reports;
