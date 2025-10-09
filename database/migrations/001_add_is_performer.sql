-- Add is_performer field to users table
-- This allows users to activate performer mode without changing their base role

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_performer BOOLEAN DEFAULT FALSE;

-- Update existing performers to have is_performer = true
UPDATE users 
SET is_performer = TRUE 
WHERE role = 'performer';

-- Update the role check to allow only 'client' and 'admin'
-- (We'll handle performers via is_performer flag)
-- Note: We keep 'performer' in the check for backward compatibility
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('client', 'admin', 'performer'));

-- Create index for faster queries on is_performer
CREATE INDEX IF NOT EXISTS idx_users_is_performer ON users(is_performer) WHERE is_performer = TRUE;
