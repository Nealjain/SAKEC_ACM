-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_member_id VARCHAR(255) NOT NULL,
  member_name VARCHAR(255) NOT NULL,
  member_email VARCHAR(255),
  check_in_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  check_out_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  scan_method VARCHAR(50) NOT NULL, -- 'qr' or 'nfc'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_attendance_member_id ON attendance(team_member_id);
CREATE INDEX IF NOT EXISTS idx_attendance_check_in ON attendance(check_in_time);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(DATE(check_in_time));

-- Enable RLS
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (check-in)
CREATE POLICY "Anyone can check in"
  ON attendance
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update their own check-out
CREATE POLICY "Anyone can check out"
  ON attendance
  FOR UPDATE
  USING (true);

-- Allow anyone to view attendance records
CREATE POLICY "Anyone can view attendance"
  ON attendance
  FOR SELECT
  USING (true);

-- Create view for daily attendance summary
CREATE OR REPLACE VIEW daily_attendance_summary AS
SELECT 
  DATE(check_in_time) as attendance_date,
  COUNT(*) as total_check_ins,
  COUNT(check_out_time) as total_check_outs,
  COUNT(*) - COUNT(check_out_time) as currently_present,
  AVG(duration_minutes) as avg_duration_minutes
FROM attendance
GROUP BY DATE(check_in_time)
ORDER BY attendance_date DESC;

COMMENT ON TABLE attendance IS 'Stores team member attendance records with check-in/check-out times';
