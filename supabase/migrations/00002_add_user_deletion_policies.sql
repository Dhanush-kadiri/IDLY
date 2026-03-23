/*
# Add User Deletion Policies

This migration adds RLS policies to allow CEO and Admin to delete users:
- CEO can delete Admin and Employee users
- Admin can delete Employee users only
- Users cannot delete themselves
- CEO account cannot be deleted

## Security
- DELETE policy for CEO: Can delete any user except CEO role
- DELETE policy for Admin: Can delete only Employee role users
- Prevents self-deletion
*/

-- Add DELETE policy for CEO
CREATE POLICY "CEO can delete Admins and Employees" ON profiles
  FOR DELETE TO authenticated
  USING (
    is_ceo(auth.uid()) 
    AND system_role != 'CEO'
    AND id != auth.uid()
  );

-- Add DELETE policy for Admin
CREATE POLICY "Admin can delete Employees" ON profiles
  FOR DELETE TO authenticated
  USING (
    is_admin_or_ceo(auth.uid())
    AND system_role = 'EMPLOYEE'
    AND id != auth.uid()
  );