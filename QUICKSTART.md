# InTouract's Daily Logger - Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will help you get InTouract's Daily Logger up and running quickly.

## Prerequisites

- Node.js 18+ installed
- pnpm or npm package manager

## Installation

### 1. Install Dependencies

```bash
pnpm install
```

or

```bash
npm install
```

### 2. Verify Setup

The application is pre-configured with:
- ✅ Supabase database connection
- ✅ Database schema deployed
- ✅ Authentication configured
- ✅ Security policies active

Run a quick validation:

```bash
npm run lint
```

If this completes without errors, you're ready to go!

## First-Time Setup

### Login as Default Admin

**IMPORTANT:** The default admin account is pre-created in the system.

**Default Admin Login Credentials:**
- **Email:** `intouract.22@gmail.com`
- **Password:** `InTouract@1438`
- **Role:** Admin (System Administrator)

**Steps:**
1. Navigate to the login page
2. Enter the admin credentials above
3. Click "Sign In"
4. You now have full admin access to manage the system!

**Note:** CEO is a superowner concept for system oversight. Users can register as Admin or Employee roles.

## Using the Application

### For Admins

After logging in as admin, you can:

1. **Approve Users**
   - Navigate to "Approvals"
   - Review pending Admin and Employee requests
   - Click "Approve" or "Reject"

2. **Manage Logs**
   - Go to "Dashboard" or "My Logs"
   - Click "New Log" to create an entry
   - Fill in title, description, status, and links
   - Click "Create"

3. **View Team Activity**
   - Navigate to "Team Logs"
   - Use filters to find specific logs
   - Monitor team productivity

4. **Manage Organizations**
   - Go to "Colleges" to manage college partnerships
   - Go to "Companies" to manage company partnerships
   - Add, edit, or delete entries as needed

5. **View Metrics**
   - Navigate to "Metrics"
   - See submission rates, inactive users, and statistics

### Adding More Users

**Note:** Users can register as Admin or Employee. CEO is a superowner concept for oversight, not a registerable role.

1. **Add an Admin:**
   - Have them register at `/register`
   - Select "Admin" as requested role
   - As an existing Admin, approve their request in "Approvals"

2. **Add Employees:**
   - Have them register at `/register`
   - Select "Employee" as requested role
   - As Admin, approve their request in "Approvals"

## Common Tasks

### Creating a Daily Log

1. Click "New Log" button
2. Enter a descriptive title
3. Add details in the description
4. Select status (In Progress, Completed, or Blocked)
5. Add any relevant links
6. Click "Create"

### Editing a Log

1. Find your log in the list
2. Click the edit icon (pencil)
3. Make your changes
4. Click "Update"

### Viewing Team Logs (Admin/CEO)

1. Navigate to "Team Logs"
2. Use filters to narrow down:
   - Status: All, In Progress, Completed, Blocked
   - Date range: Start and end dates
3. View detailed information for each log

### Managing Colleges/Companies (CEO)

1. Navigate to "Colleges" or "Companies"
2. Click "Add College" or "Add Company"
3. Fill in:
   - Name (required)
   - Status (optional custom text)
   - Onboard Status (Not Started, In Progress, Completed)
4. Click "Create"

## User Roles Overview

### 🔵 CEO (Chief Executive Officer)
- Full system access
- Approve Admin and Employee requests
- Manage colleges and companies
- View all logs and metrics

### 🟢 Admin (Administrator)
- Approve Employee requests
- View all employee logs
- Manage personal logs
- Team oversight capabilities

### 🟡 Employee
- Create and manage personal logs
- View personal profile
- Submit daily work updates

## Navigation Guide

### Sidebar Menu

The sidebar shows different options based on your role:

**Everyone sees:**
- Dashboard (main page)
- My Logs (personal log management)

**Admin and CEO see:**
- Team Logs (view all team logs)
- Approvals (pending user requests)

**CEO only sees:**
- Colleges (college management)
- Companies (company management)
- Metrics (analytics dashboard)

## Tips for Success

### For All Users

1. **Log Daily:** Make it a habit to log your work every day
2. **Be Descriptive:** Use clear titles and detailed descriptions
3. **Update Status:** Keep your log status current
4. **Add Links:** Include relevant documentation or resources

### For Admins

1. **Review Regularly:** Check team logs frequently
2. **Approve Promptly:** Process employee requests quickly
3. **Lead by Example:** Maintain your own logs consistently

### For CEOs

1. **Monitor Metrics:** Check the metrics dashboard regularly
2. **Follow Up:** Reach out to inactive users
3. **Keep Data Current:** Update college and company records
4. **Process Approvals:** Don't let requests pile up

## Troubleshooting

### Can't Log In?

- Verify your email and password
- Ensure your account has been approved (status is ACTIVE)
- Contact an administrator if stuck in PENDING status

### Don't See Expected Features?

- Check your role assignment
- Some features are role-restricted
- Log out and log back in to refresh permissions

### Log Not Appearing?

- Refresh the page
- Check if you're viewing the correct date range
- Verify the log was created successfully (look for success message)

## Getting Help

### Documentation

- **User Guide:** See USER_GUIDE.md for detailed instructions
- **Deployment Guide:** See DEPLOYMENT.md for deployment information
- **Project Summary:** See PROJECT_SUMMARY.md for technical details

### Support

For technical issues or questions:
1. Check the documentation files
2. Contact your system administrator
3. Reach out to the InTouract development team

## Next Steps

Now that you're set up:

1. ✅ Create the CEO account
2. ✅ Add a few test users (Admin and Employee)
3. ✅ Create some sample logs
4. ✅ Explore the different dashboards
5. ✅ Add a college and company
6. ✅ Check the metrics dashboard

## Security Reminders

- 🔒 Never share your login credentials
- 🔒 Log out when using shared computers
- 🔒 Report suspicious activity immediately
- 🔒 Change the CEO password after first login (recommended)

---

**Ready to start?** Create your CEO account and begin managing your team's daily work logs!

For more detailed information, see the complete USER_GUIDE.md file.
