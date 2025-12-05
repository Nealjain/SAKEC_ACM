-- ============================================
-- EVENT ATTENDANCE SYSTEM
-- ============================================

-- 1. Create event_attendance table
CREATE TABLE IF NOT EXISTS event_attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  attendee_type VARCHAR(50) NOT NULL, -- 'participant', 'volunteer', 'team'
  attendee_id VARCHAR(255), -- Can be team_member_id or registration_id
  attendee_name VARCHAR(255) NOT NULL,
  attendee_email VARCHAR(255),
  check_in_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  check_out_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  scan_method VARCHAR(50) NOT NULL, -- 'qr' or 'nfc'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_event_attendance_event_id ON event_attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_attendee_type ON event_attendance(attendee_type);
CREATE INDEX IF NOT EXISTS idx_event_attendance_attendee_id ON event_attendance(attendee_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_check_in ON event_attendance(check_in_time);

-- 3. Create event_volunteers table
CREATE TABLE IF NOT EXISTS event_volunteers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(100), -- 'coordinator', 'helper', 'technical', etc.
  status VARCHAR(50) DEFAULT 'registered', -- 'registered', 'confirmed', 'attended'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes for volunteers
CREATE INDEX IF NOT EXISTS idx_event_volunteers_event_id ON event_volunteers(event_id);
CREATE INDEX IF NOT EXISTS idx_event_volunteers_email ON event_volunteers(email);

-- 5. Enable RLS
ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_volunteers ENABLE ROW LEVEL SECURITY;

-- 6. Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can check in event attendance" ON event_attendance;
DROP POLICY IF EXISTS "Anyone can check out event attendance" ON event_attendance;
DROP POLICY IF EXISTS "Anyone can view event attendance" ON event_attendance;
DROP POLICY IF EXISTS "Anyone can register as volunteer" ON event_volunteers;
DROP POLICY IF EXISTS "Anyone can view volunteers" ON event_volunteers;

-- 7. Create RLS policies
CREATE POLICY "Anyone can check in event attendance"
  ON event_attendance
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can check out event attendance"
  ON event_attendance
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can view event attendance"
  ON event_attendance
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can register as volunteer"
  ON event_volunteers
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view volunteers"
  ON event_volunteers
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update volunteers"
  ON event_volunteers
  FOR UPDATE
  USING (true);

-- 8. Create view for event attendance summary
CREATE OR REPLACE VIEW event_attendance_summary AS
SELECT 
  ea.event_id,
  e.title as event_name,
  ea.attendee_type,
  COUNT(*) as total_check_ins,
  COUNT(ea.check_out_time) as total_check_outs,
  COUNT(*) - COUNT(ea.check_out_time) as currently_present,
  AVG(ea.duration_minutes) as avg_duration_minutes
FROM event_attendance ea
JOIN events e ON ea.event_id = e.id
GROUP BY ea.event_id, e.title, ea.attendee_type
ORDER BY e.date DESC, ea.attendee_type;

-- 9. Add comments
COMMENT ON TABLE event_attendance IS 'Stores attendance records for specific events';
COMMENT ON TABLE event_volunteers IS 'Stores volunteer registrations for events';
COMMENT ON COLUMN event_attendance.attendee_type IS 'Type: participant, volunteer, or team';
COMMENT ON COLUMN event_volunteers.role IS 'Volunteer role: coordinator, helper, technical, etc.';
