/*
# Add CEO Update Policy for Admin Approvals

This migration adds a policy to allow CEO to update Admin profiles
for the approval process.

## Changes
- Add policy: "CEO can update Admin profiles for approval"
- Allows CEO to update status, system_role, approved_at, approved_by
- Only for Admin profiles (requested_role = 'ADMIN')
- Only for PENDING users

## Security
- CEO can only update Admin profiles
- CEO already has full access, but this makes it explicit
*/

-- Add policy for CEO to update Admin profiles for approval
CREATE POLICY "CEO can update Admin profiles for approval"
ON profiles
FOR UPDATE
TO authenticated
USING (
  is_ceo(auth.uid()) 
  AND requested_role = 'ADMIN'
  AND status = 'PENDING'
)
WITH CHECK (
  is_ceo(auth.uid()) 
  AND requested_role = 'ADMIN'
);