/*
# Add Reporting Hierarchy

This migration adds a reporting hierarchy system where employees select
their reporting manager during registration.

## Changes
- Add reports_to field to profiles table
- Stores the user_id of the manager (CEO, COO, CTO, etc.)
- Employees select who they report to during registration
- Approval requests go only to the selected manager

## Security
- Only employees have reports_to set
- Admins and CEO don't report to anyone (NULL)
*/

-- Add reports_to column to profiles table
ALTER TABLE profiles
ADD COLUMN reports_to uuid REFERENCES profiles(id) ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX idx_profiles_reports_to ON profiles(reports_to);

-- Add comment
COMMENT ON COLUMN profiles.reports_to IS 'The manager this employee reports to (for approval workflow)';
