# Default Admin Account Information

## 🔐 Default Admin Login Credentials

**Email:** `intouract.22@gmail.com`  
**Password:** `InTouract@1438`  
**Role:** Admin (System Administrator)  
**Status:** ACTIVE

## 📋 Account Details

- **Role:** Admin (System Administrator)
- **Status:** ACTIVE
- **Title:** System Administrator
- **Access Level:** Full system management capabilities

## ✅ What You Can Do as Admin

### User Management
- ✓ Approve or reject Admin registration requests
- ✓ Approve or reject Employee registration requests
- ✓ View all user profiles and statuses
- ✓ Monitor pending approvals

### Daily Logs
- ✓ Submit your own daily work logs
- ✓ View all logs from all users (Admins and Employees)
- ✓ Monitor team activity and progress
- ✓ Track work status across the organization

### College Management
- ✓ Create new colleges/institutions
- ✓ Edit college information
- ✓ Update college status and onboarding status
- ✓ Delete colleges when needed

### Company Management
- ✓ Create new companies
- ✓ Edit company information
- ✓ Update company status and onboarding status
- ✓ Delete companies when needed

### Metrics & Analytics
- ✓ View submission rates (daily log submissions)
- ✓ See inactive users (users who haven't submitted logs recently)
- ✓ Monitor college and company statistics
- ✓ Track overall system usage

## 🚫 Important Information

### CEO as Superowner Concept
- **CEO** is a superowner concept for system oversight
- CEO is **not a registerable role**
- Users can only register as **Admin** or **Employee**
- This ensures proper access control and system management

### Registration Options for Others
When other users register, they can only choose:
1. **Admin** - Requires approval from an existing Admin
2. **Employee** - Requires Admin approval

## 🔄 Approval Workflow

### Admin Approval (Admin Only)
1. User registers and selects "Admin" role
2. Request appears in your "Approvals" section
3. You review and approve/reject
4. Upon approval, user gains Admin privileges

### Employee Approval (Admin)
1. User registers and selects "Employee" role
2. Request appears in "Approvals" for Admins
3. Any Admin can approve/reject
4. Upon approval, user gains Employee privileges

## 📊 Dashboard Navigation

Your Admin dashboard includes these sections:

1. **My Logs** - Submit and manage your personal daily logs
2. **Team Logs** - View all logs from all users
3. **Approvals** - Review pending user registration requests
4. **Colleges** - Manage college/institution records
5. **Companies** - Manage company records
6. **Metrics** - View system-wide analytics and statistics

## 🔒 Security Best Practices

1. **Keep Credentials Secure**
   - Store credentials in a secure password manager
   - Do not share admin credentials with unauthorized users
   - Change password periodically (when feature is available)

2. **Regular Monitoring**
   - Review pending approvals regularly
   - Monitor user activity through logs
   - Check metrics for unusual patterns

3. **Approval Guidelines**
   - Verify user identity before approving Admin requests
   - Ensure users have legitimate business need for access
   - Reject suspicious or duplicate requests

## 🆘 Troubleshooting

### Cannot Login
- Verify you're using the correct email: `intouract.22@gmail.com`
- Ensure password is exactly: `InTouract@1438` (case-sensitive)
- Check that you're on the login page, not registration page

### Missing Features
- Ensure you're logged in as Admin (check top-right user menu)
- Verify your role shows as "Admin" in the dashboard
- Try logging out and logging back in

### Approval Issues
- Refresh the page to see latest pending requests
- Check that users have completed registration properly
- Verify user status is "PENDING" before approving

## 📞 Support

For technical issues or questions:
1. Check the [User Guide](./USER_GUIDE.md) for detailed instructions
2. Review the [Quick Start Guide](./QUICKSTART.md) for common tasks
3. Consult the [Deployment Guide](./DEPLOYMENT.md) for system configuration

## 🔄 Account Recovery

**Important:** Since this is the default admin account, ensure you:
- Keep credentials backed up securely
- Document any password changes
- Have a recovery plan in place

If you lose access to the admin account, you'll need database-level access to reset the password.

## 🎯 System Architecture

### Role Structure
```
Admin (System Administrator)
    ├── Full system management
    ├── Approves Admin requests
    ├── Approves Employee requests
    ├── Views all data
    └── Manages colleges & companies
    
Admin (Additional)
    ├── Team management
    ├── Approves Employee requests
    ├── Views team logs
    └── Manages own logs
    
Employee
    ├── Personal log management
    ├── Views own data
    └── Submits daily updates
```

### CEO Superowner Concept
- **CEO** is a system-level oversight concept
- Not tied to a specific user account
- Represents the highest level of system authority
- Used for permission structures and access control
- Not available as a registration option

## 📈 Getting Started

### First Login
1. Navigate to the login page
2. Enter email: `intouract.22@gmail.com`
3. Enter password: `InTouract@1438`
4. Click "Sign In"
5. You'll be redirected to the Admin dashboard

### Adding Your First Users
1. Have users visit the registration page
2. They select either "Admin" or "Employee"
3. They complete the registration form
4. Go to your "Approvals" section
5. Review and approve their requests
6. They can now login and use the system

### Creating Your First Log
1. Click "My Logs" in the sidebar
2. Click "New Log" button
3. Enter title and description
4. Select status (In Progress, Completed, or Blocked)
5. Add any relevant links
6. Click "Submit"

## 🌟 Best Practices

### Daily Operations
- Review approvals at least once per day
- Monitor team logs for progress updates
- Keep your own logs up to date
- Check metrics weekly for insights

### User Management
- Approve legitimate requests promptly
- Communicate with users about their access
- Maintain a list of active users
- Remove inactive accounts when appropriate

### Data Management
- Keep college and company records updated
- Archive old logs periodically
- Maintain data accuracy
- Regular backups (handled by Supabase)

---

**Last Updated:** December 19, 2025  
**System Version:** 1.0.0  
**Account Status:** ✅ Active and Ready
