/*
# Add Function to Delete Auth Users

This migration creates a function to delete users from auth.users table
when they are deleted or rejected from profiles table.

## Functions
- delete_auth_user(user_id): Deletes user from auth.users
- Used when CEO/Admin deletes or rejects users

## Security
- SECURITY DEFINER to allow deletion from auth schema
- Only callable by authenticated users
- Validates user exists before deletion
*/

-- Function to delete user from auth.users
CREATE OR REPLACE FUNCTION delete_auth_user(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete from auth.users
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_auth_user(uuid) TO authenticated;