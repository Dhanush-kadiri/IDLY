# InTouract's Daily Logger - User Guide

## Overview

InTouract's Daily Logger is a comprehensive internal work management system designed to streamline daily work logging, user onboarding, and team collaboration. The system features role-based access control with two main user roles: Admin and Employee. CEO is a superowner concept for system oversight.

## Getting Started

### Initial Setup

**Default Admin Account Access**

The default admin account is pre-created in the system for initial setup and management.

**Default Admin Login Credentials:**
- **Email:** intouract.22@gmail.com
- **Password:** InTouract@1438
- **Role:** Admin (System Administrator)

**Important Notes:**
- CEO is a superowner concept for system oversight, not a registerable role
- Users can register as Admin or Employee
- The default admin has full system management capabilities

**User Registration**

New users can register through the registration page with the following options:

1. **Admin Registration:**
   - Select "Admin" as requested role
   - Requires approval from an existing Admin
   - Gains team management capabilities upon approval

2. **Employee Registration:**
   - Select "Employee" as requested role
   - Requires Admin approval
   - Gains personal log management capabilities upon approval

All new registrations receive PENDING status until approved by an Admin.

### Login

1. Navigate to the login page
2. Enter your email and password
3. Click "Sign In"
4. Upon successful login, you'll be redirected to your role-specific dashboard

## User Roles & Permissions

### CEO (Chief Executive Officer)

**Access Level:** Full system access

**Capabilities:**
- Approve or reject Admin and Employee registration requests
- View and manage all user logs across the organization
- Create, edit, and delete personal work logs
- Manage colleges (add, edit, delete)
- Manage companies (add, edit, delete)
- View comprehensive metrics dashboard:
  - College and company statistics
  - Daily submission rates
  - Inactive user tracking

**Navigation:**
- Dashboard (personal profile and logs)
- My Logs (dedicated log management)
- Team Logs (view all team member logs)
- Approvals (pending user requests)
- Colleges (college management)
- Companies (company management)
- Metrics (analytics and statistics)

### Admin (Administrator)

**Access Level:** Team management and oversight

**Capabilities:**
- Approve or reject Employee registration requests
- View all employee work logs with filtering options
- Create, edit, and delete personal work logs
- Filter team logs by status and date range

**Navigation:**
- Dashboard (personal profile and logs)
- My Logs (dedicated log management)
- Team Logs (view all employee logs)
- Approvals (pending employee requests)

### Employee

**Access Level:** Personal work log management

**Capabilities:**
- View personal profile information
- Create new work log entries
- Edit existing personal logs
- Delete personal logs (soft delete)
- View personal log history

**Navigation:**
- Dashboard (personal profile and logs)
- My Logs (dedicated log management)

## Core Features

### Work Log Management

#### Creating a Log

1. Navigate to "Dashboard" or "My Logs"
2. Click the "New Log" button
3. Fill in the log details:
   - **Title** (required): Brief description of the work
   - **Description** (optional): Detailed information about the work
   - **Status** (required): Select from:
     - In Progress: Work is ongoing
     - Completed: Work is finished
     - Blocked: Work is blocked by dependencies
   - **Related Links** (optional): Add URLs related to the work
4. Click "Create" to save the log

#### Editing a Log

1. Locate the log in your log list
2. Click the edit icon (pencil)
3. Modify the desired fields
4. Click "Update" to save changes

#### Deleting a Log

1. Locate the log in your log list
2. Click the delete icon (trash)
3. Confirm the deletion in the dialog
4. The log will be soft-deleted (marked as deleted but retained in database)

### User Approval Workflow

#### For Admins and CEOs

1. Navigate to "Approvals"
2. Review pending user requests
3. View user details:
   - Name
   - Email
   - Phone
   - Job Title
   - Requested Role
   - Registration Date
4. Take action:
   - **Approve**: Grants the requested role and activates the account
   - **Reject**: Denies the request and marks the account as rejected

**Note:** Admins can only approve Employee requests. CEO approval is required for Admin requests.

### Team Log Monitoring

#### Viewing Team Logs (Admin/CEO)

1. Navigate to "Team Logs"
2. Use filters to refine the view:
   - **Status Filter**: All, In Progress, Completed, Blocked
   - **Start Date**: Filter logs from a specific date
   - **End Date**: Filter logs up to a specific date
3. View comprehensive log information:
   - User details (name, email, title)
   - Log title and description
   - Status badge
   - Creation date and time
   - Related links

### College Management (CEO Only)

#### Adding a College

1. Navigate to "Colleges"
2. Click "Add College"
3. Fill in the details:
   - **Name** (required): College name
   - **Status** (optional): Custom status text
   - **Onboard Status** (required): Select from:
     - Not Started
     - In Progress
     - Completed
4. Click "Create"

#### Editing/Deleting Colleges

- Click the edit icon to modify college details
- Click the delete icon to permanently remove a college

### Company Management (CEO Only)

#### Adding a Company

1. Navigate to "Companies"
2. Click "Add Company"
3. Fill in the details:
   - **Name** (required): Company name
   - **Status** (optional): Custom status text
   - **Onboard Status** (required): Select from:
     - Not Started
     - In Progress
     - Completed
4. Click "Create"

#### Editing/Deleting Companies

- Click the edit icon to modify company details
- Click the delete icon to permanently remove a company

### Metrics Dashboard (CEO Only)

The metrics dashboard provides comprehensive analytics:

#### Key Metrics Cards

1. **Total Colleges**
   - Total number of colleges
   - Number with completed onboarding

2. **Total Companies**
   - Total number of companies
   - Number with completed onboarding

3. **Today's Submission Rate**
   - Percentage of active users who submitted logs today
   - Ratio of submitted users to total active users

4. **Inactive Users**
   - Count of users who haven't submitted logs in the last 7 days

#### Detailed Statistics

- **College Statistics**: Breakdown by onboarding status
- **Company Statistics**: Breakdown by onboarding status
- **Inactive Users Table**: Detailed list with:
  - User name and email
  - Last submission date
  - Days since last submission

## Best Practices

### For Employees

1. **Daily Logging**: Submit at least one log entry per day to maintain visibility
2. **Descriptive Titles**: Use clear, concise titles for easy identification
3. **Status Updates**: Keep log status current (update to "Completed" when done)
4. **Link References**: Add relevant links to provide context and documentation

### For Admins

1. **Timely Approvals**: Review and process employee requests promptly
2. **Regular Monitoring**: Check team logs regularly to stay informed
3. **Filter Usage**: Utilize date and status filters for efficient log review
4. **Lead by Example**: Maintain your own daily logs consistently

### For CEOs

1. **Strategic Oversight**: Use metrics dashboard for high-level insights
2. **Approval Management**: Process admin requests promptly to avoid bottlenecks
3. **Data Maintenance**: Keep college and company records up to date
4. **Inactive User Follow-up**: Monitor and reach out to inactive users

## Troubleshooting

### Cannot Login

- Verify your email and password are correct
- Ensure your account has been approved (status is ACTIVE)
- Contact an administrator if you're stuck in PENDING status

### Cannot See Expected Features

- Verify your role assignment
- Some features are role-restricted:
  - Colleges/Companies/Metrics: CEO only
  - Team Logs/Approvals: Admin and CEO only

### Log Not Appearing

- Ensure the log was successfully created (check for success message)
- Refresh the page
- Verify you're viewing the correct date range (for filtered views)

### Cannot Approve Users

- Admins can only approve Employee requests
- CEO approval is required for Admin requests
- Ensure you have the correct role permissions

## Security Notes

- Never share your login credentials
- Log out when using shared computers
- Report any suspicious activity to system administrators
- Passwords are securely encrypted in the database

## Support

For technical issues or feature requests, please contact your system administrator or the InTouract development team.

---

**Version:** 1.0  
**Last Updated:** December 2025
