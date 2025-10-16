-- Add new fields to team_members table for enhanced profiles
ALTER TABLE team_members 
ADD COLUMN IF NOT EXISTS personal_quote TEXT,
ADD COLUMN IF NOT EXISTS about_us TEXT,
ADD COLUMN IF NOT EXISTS cv_url TEXT;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_team_members_acm_id ON team_members(acm_id);
