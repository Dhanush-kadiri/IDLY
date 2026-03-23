/*
# InTouract Daily Logger - Initial Schema

## Overview
Creates the complete database schema for the InTouract Daily Logger system including user management, daily logs, colleges, and companies.

## 1. Enums
- `user_role`: CEO, ADMIN, EMPLOYEE
- `user_status`: PENDING, ACTIVE, REJECTED
- `log_status`: IN_PROGRESS, COMPLETED, BLOCKED
- `onboard_status`: NOT_STARTED, IN_PROGRESS, COMPLETED

## 2. Tables

### profiles
User profile table synced from auth.users
- `id` (uuid, primary key, references auth.users)
- `email` (text, unique, not null)
- `name` (text)
- `phone` (text)
- `requested_role` (user_role, not null) - Role requested during registration
- `system_role` (user_role) - Actual role assigned after approval
- `status` (user_status, default PENDING) - Account status
- `title` (text) - Job title
- `approved_at` (timestamptz) - When the account was approved
- `approved_by` (uuid, references profiles) - Who approved the account
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

### daily_logs
Daily work log entries
- `id` (uuid, primary key, default gen_random_uuid())
- `user_id` (uuid, references profiles, not null)
- `title` (text, not null)
- `description` (text)
- `status` (log_status, default IN_PROGRESS)
- `links` (text[], default empty array) - Array of related links
- `deleted` (boolean, default false) - Soft delete flag
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

### colleges
College/institution management
- `id` (uuid, primary key, default gen_random_uuid())
- `name` (text, not null, unique)
- `status` (text) - General status
- `onboard_status` (onboard_status, default NOT_STARTED)
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

### companies
Company management
- `id` (uuid, primary key, default gen_random_uuid())
- `name` (text, not null, unique)
- `status` (text) - General status
- `onboard_status` (onboard_status, default NOT_STARTED)
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

## 3. Security

### RLS Policies
- Profiles: CEO and Admin can view all, users can view their own
- Daily Logs: Users can manage their own, Admin/CEO can view all
- Colleges/Companies: CEO full access, others read-only

### Helper Functions
- `is_ceo()`: Check if current user is CEO
- `is_admin_or_ceo()`: Check if current user is Admin or CEO
- `handle_new_user()`: Auto-sync confirmed users to profiles table

## 4. Triggers
- Auto-sync auth.users to profiles on email confirmation
- Auto-update updated_at timestamps

## 5. Initial Data
- CEO account will be seeded separately with credentials from environment variables
*/

-- Create enums
CREATE TYPE user_role AS ENUM ('CEO', 'ADMIN', 'EMPLOYEE');
CREATE TYPE user_status AS ENUM ('PENDING', 'ACTIVE', 'REJECTED');
CREATE TYPE log_status AS ENUM ('IN_PROGRESS', 'COMPLETED', 'BLOCKED');
CREATE TYPE onboard_status AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text,
  phone text,
  requested_role user_role NOT NULL,
  system_role user_role,
  status user_status DEFAULT 'PENDING'::user_status NOT NULL,
  title text,
  approved_at timestamptz,
  approved_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create daily_logs table
CREATE TABLE IF NOT EXISTS daily_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  status log_status DEFAULT 'IN_PROGRESS'::log_status NOT NULL,
  links text[] DEFAULT '{}',
  deleted boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create colleges table
CREATE TABLE IF NOT EXISTS colleges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  status text,
  onboard_status onboard_status DEFAULT 'NOT_STARTED'::onboard_status NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  status text,
  onboard_status onboard_status DEFAULT 'NOT_STARTED'::onboard_status NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_system_role ON profiles(system_role);
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_id ON daily_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_created_at ON daily_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_logs_deleted ON daily_logs(deleted);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is CEO
CREATE OR REPLACE FUNCTION is_ceo(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.system_role = 'CEO'::user_role AND p.status = 'ACTIVE'::user_status
  );
$$;

-- Helper function to check if user is Admin or CEO
CREATE OR REPLACE FUNCTION is_admin_or_ceo(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid 
    AND p.system_role IN ('ADMIN'::user_role, 'CEO'::user_role)
    AND p.status = 'ACTIVE'::user_status
  );
$$;

-- Auto-sync function for new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert a profile synced with fields from auth.users
  -- All new users start as PENDING and need approval
  INSERT INTO profiles (id, email, requested_role, status)
  VALUES (
    NEW.id,
    NEW.email,
    'EMPLOYEE'::user_role,  -- Default requested role
    'PENDING'::user_status
  );
  RETURN NEW;
END;
$$;

-- Trigger to auto-sync users on email confirmation
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "CEO has full access to profiles" ON profiles
  FOR ALL TO authenticated USING (is_ceo(auth.uid()));

CREATE POLICY "Admin/CEO can view all profiles" ON profiles
  FOR SELECT TO authenticated USING (is_admin_or_ceo(auth.uid()));

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE TO authenticated 
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND system_role IS NOT DISTINCT FROM (SELECT system_role FROM profiles WHERE id = auth.uid())
    AND status IS NOT DISTINCT FROM (SELECT status FROM profiles WHERE id = auth.uid())
  );

-- RLS Policies for daily_logs
CREATE POLICY "Users can view their own logs" ON daily_logs
  FOR SELECT TO authenticated 
  USING (user_id = auth.uid() AND deleted = false);

CREATE POLICY "Admin/CEO can view all logs" ON daily_logs
  FOR SELECT TO authenticated 
  USING (is_admin_or_ceo(auth.uid()) AND deleted = false);

CREATE POLICY "Users can create their own logs" ON daily_logs
  FOR INSERT TO authenticated 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own logs" ON daily_logs
  FOR UPDATE TO authenticated 
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own logs" ON daily_logs
  FOR UPDATE TO authenticated 
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for colleges (CEO only for modifications)
CREATE POLICY "CEO has full access to colleges" ON colleges
  FOR ALL TO authenticated USING (is_ceo(auth.uid()));

CREATE POLICY "All authenticated users can view colleges" ON colleges
  FOR SELECT TO authenticated USING (true);

-- RLS Policies for companies (CEO only for modifications)
CREATE POLICY "CEO has full access to companies" ON companies
  FOR ALL TO authenticated USING (is_ceo(auth.uid()));

CREATE POLICY "All authenticated users can view companies" ON companies
  FOR SELECT TO authenticated USING (true);

-- Create view for public profile information
CREATE OR REPLACE VIEW public_profiles AS
SELECT
  id,
  email,
  name,
  system_role,
  status,
  title,
  created_at
FROM profiles;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_logs_updated_at BEFORE UPDATE ON daily_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON colleges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DEFAULT ADMIN ACCOUNT CREATION
-- ============================================================================

/*
Create the default admin account with predefined credentials.
This account is the system administrator for initial setup and management.

Email: intouract.22@gmail.com
Password: InTouract@1438
Role: Admin (System Administrator)

Note: CEO is a superowner concept for system oversight, not a registerable role.
Users can register as Admin or Employee roles.
*/

-- Insert default admin profile
INSERT INTO profiles (
  id,
  email,
  name,
  requested_role,
  system_role,
  status,
  title,
  approved_at,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'intouract.22@gmail.com',
  'System Admin',
  'ADMIN'::user_role,
  'ADMIN'::user_role,
  'ACTIVE'::user_status,
  'System Administrator',
  now(),
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;