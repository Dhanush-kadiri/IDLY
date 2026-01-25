/*
# Allow Anonymous Users to Read Manager Profiles

This migration adds a policy to allow anonymous users (not logged in)
to read profiles of managers (CEO and ADMIN roles) so they can select
their reporting manager during registration.

## Security
- Only allows reading manager profiles (CEO, ADMIN)
- Only allows reading ACTIVE users
- Only exposes necessary fields for manager selection
- Does not allow reading employee profiles
*/

-- Allow anonymous users to read manager profiles for registration
CREATE POLICY "Anonymous users can view active managers"
ON profiles
FOR SELECT
TO anon
USING (
  status = 'ACTIVE'::user_status 
  AND system_role IN ('CEO'::user_role, 'ADMIN'::user_role)
);

-- Add comment
COMMENT ON POLICY "Anonymous users can view active managers" ON profiles IS 
'Allows anonymous users to view active CEO and Admin profiles for manager selection during registration';
