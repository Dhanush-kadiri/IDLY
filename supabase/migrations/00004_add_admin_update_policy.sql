/*
# Add Admin Update Policy for Approvals

This migration adds a policy to allow Admins to update Employee profiles
for the approval process.

## Changes
- Add policy: "Admin can update Employee profiles for approval"
- Allows Admin to update status, system_role, approved_at, approved_by
- Only for Employee profiles (requested_role = 'EMPLOYEE')
- Only for PENDING users

## Security
- Admin can only update Employee profiles
- Admin cannot update their own profile's role/status
- Admin cannot update CEO or other Admin profiles
*/

-- Add policy for Admin to update Employee profiles for approval
CREATE POLICY "Admin can update Employee profiles for approval"
ON profiles
FOR UPDATE
TO authenticated
USING (
  is_admin_or_ceo(auth.uid()) 
  AND requested_role = 'EMPLOYEE'
  AND status = 'PENDING'
)
WITH CHECK (
  is_admin_or_ceo(auth.uid()) 
  AND requested_role = 'EMPLOYEE'
);