-- Add status column to team_members table
ALTER TABLE team_members 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members(status);

-- Update existing records to have 'active' status
UPDATE team_members 
SET status = 'active' 
WHERE status IS NULL;

COMMENT ON COLUMN team_members.status IS 'Member status: active, inactive, alumni';
