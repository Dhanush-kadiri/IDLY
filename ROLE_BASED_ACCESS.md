# 🔐 Role-Based Access Control Guide

## 📊 System Overview

InTouract's Daily Logger implements a strict **3-tier role hierarchy** with complete role-based access control:

```
┌─────────────────────────────────────────┐
│              CEO (Superowner)           │
│      intouract.22@gmail.com             │
│      • Approves Admin requests          │
│      • Views all data (eyes on all)     │
│      • Manages colleges & companies     │
│      • Access to all features           │
└─────────────────────────────────────────┘
                  │
                  │ Approves
                  ▼
┌─────────────────────────────────────────┐
│              Admin                      │
│      • Approves Employee requests       │
│      • Views team logs                  │
│      • Manages own logs                 │
│      • Limited system access            │
└─────────────────────────────────────────┘
                  │
                  │ Approves
                  ▼
┌─────────────────────────────────────────┐
│              Employee                   │
│      • Submits own logs                 │
│      • Views own logs only              │
│      • No approval permissions          │
└─────────────────────────────────────────┘
```

---

## 🔐 CEO Role (Superowner)

### Login Credentials
```
Email:    intouract.22@gmail.com
Password: InTouract@1438
Role:     CEO
```

### Dashboard Access
**Route:** `/dashboard`

**Sidebar Navigation:**
- ✅ Dashboard (Overview)
- ✅ My Logs (Personal logs)
- ✅ Team Logs (All user logs)
- ✅ Approvals (Admin + Employee requests)
- ✅ Colleges (CRUD operations)
- ✅ Companies (CRUD operations)
- ✅ Metrics (System analytics)

### Permissions

#### User Management
- ✅ **Approve Admin Requests** - Only CEO can approve Admin registrations
- ✅ **Approve Employee Requests** - CEO can also approve Employees
- ✅ **View All Users** - Complete user list access
- ✅ **Reject Requests** - Can reject any pending request

#### Log Management
- ✅ **Create Own Logs** - Submit personal daily logs
- ✅ **View All Logs** - See logs from ALL users (Admin + Employee)
- ✅ **Edit Own Logs** - Modify personal logs
- ✅ **Delete Own Logs** - Remove personal logs
- ❌ **Edit Other's Logs** - Cannot modify other user's logs
- ❌ **Delete Other's Logs** - Cannot delete other user's logs

#### College Management (CEO Only)
- ✅ **Create Colleges** - Add new institutions
- ✅ **View Colleges** - See all college records
- ✅ **Update Colleges** - Edit college information
- ✅ **Delete Colleges** - Remove college records

#### Company Management (CEO Only)
- ✅ **Create Companies** - Add new companies
- ✅ **View Companies** - See all company records
- ✅ **Update Companies** - Edit company information
- ✅ **Delete Companies** - Remove company records

#### Metrics & Analytics (CEO Only)
- ✅ **Submission Rates** - Daily log submission statistics
- ✅ **Inactive Users** - Users who haven't submitted logs
- ✅ **College Statistics** - College count by status
- ✅ **Company Statistics** - Company count by status

### Approval Workflow

**CEO Approvals Page** (`/dashboard/approvals`):

Shows TWO types of pending requests:

1. **Admin Requests** (Only CEO can approve)
   ```
   User: john@example.com
   Requested Role: Admin
   Actions: [Approve] [Reject]
   ```

2. **Employee Requests** (CEO can also approve)
   ```
   User: jane@example.com
   Requested Role: Employee
   Actions: [Approve] [Reject]
   ```

---

## 👔 Admin Role

### How to Get Admin Access
1. Register at `/register`
2. Select "Admin" as requested role
3. Wait for **CEO approval**
4. Once approved, login with your credentials

### Dashboard Access
**Route:** `/dashboard`

**Sidebar Navigation:**
- ✅ Dashboard (Overview)
- ✅ My Logs (Personal logs)
- ✅ Team Logs (All user logs)
- ✅ Approvals (Employee requests only)
- ❌ Colleges (CEO only)
- ❌ Companies (CEO only)
- ❌ Metrics (CEO only)

### Permissions

#### User Management
- ❌ **Approve Admin Requests** - Cannot approve Admins (CEO only)
- ✅ **Approve Employee Requests** - Can approve Employee registrations
- ✅ **View Team Users** - See Admin and Employee users
- ✅ **Reject Employee Requests** - Can reject Employee requests

#### Log Management
- ✅ **Create Own Logs** - Submit personal daily logs
- ✅ **View All Logs** - See logs from ALL users (Admin + Employee)
- ✅ **Edit Own Logs** - Modify personal logs
- ✅ **Delete Own Logs** - Remove personal logs
- ❌ **Edit Other's Logs** - Cannot modify other user's logs
- ❌ **Delete Other's Logs** - Cannot delete other user's logs

#### College Management
- ❌ **No Access** - CEO only feature

#### Company Management
- ❌ **No Access** - CEO only feature

#### Metrics & Analytics
- ❌ **No Access** - CEO only feature

### Approval Workflow

**Admin Approvals Page** (`/dashboard/approvals`):

Shows ONLY Employee requests:

```
User: jane@example.com
Requested Role: Employee
Actions: [Approve] [Reject]
```

**Note:** Admin requests are NOT shown to Admins (only CEO sees them)

---

## 👤 Employee Role

### How to Get Employee Access
1. Register at `/register`
2. Select "Employee" as requested role
3. Wait for **Admin or CEO approval**
4. Once approved, login with your credentials

### Dashboard Access
**Route:** `/dashboard`

**Sidebar Navigation:**
- ✅ Dashboard (Overview)
- ✅ My Logs (Personal logs only)
- ❌ Team Logs (Admin/CEO only)
- ❌ Approvals (Admin/CEO only)
- ❌ Colleges (CEO only)
- ❌ Companies (CEO only)
- ❌ Metrics (CEO only)

### Permissions

#### User Management
- ❌ **No Approval Rights** - Cannot approve any requests
- ❌ **Cannot View Other Users** - No access to user list

#### Log Management
- ✅ **Create Own Logs** - Submit personal daily logs
- ✅ **View Own Logs** - See only personal logs
- ✅ **Edit Own Logs** - Modify personal logs
- ✅ **Delete Own Logs** - Remove personal logs
- ❌ **View Other's Logs** - Cannot see other user's logs
- ❌ **Edit Other's Logs** - Cannot modify other user's logs
- ❌ **Delete Other's Logs** - Cannot delete other user's logs

#### College Management
- ❌ **No Access** - CEO only feature

#### Company Management
- ❌ **No Access** - CEO only feature

#### Metrics & Analytics
- ❌ **No Access** - CEO only feature

---

## 🔒 Security Implementation

### Frontend Security

#### Route Protection
All dashboard routes are protected by `RouteGuard` component:
- Checks if user is authenticated
- Redirects to `/login` if not authenticated
- Allows access only to authenticated users

#### Sidebar Filtering
Navigation items are filtered based on `system_role`:
```typescript
const filteredNavItems = navItems.filter(item => 
  profile?.system_role && item.roles.includes(profile.system_role)
);
```

#### Component-Level Checks
Each page component checks user role:
```typescript
const { profile } = useAuth();

// CEO-only check
if (profile?.system_role !== 'CEO') {
  return <Navigate to="/dashboard" />;
}
```

### Backend Security

#### API Route Protection
All API routes verify user authentication and role:

**Example: Approve User API**
```typescript
// Check if user is authenticated
if (!user) return { error: 'Unauthorized' };

// Check if user has permission
if (profile.system_role === 'ADMIN' && requestedRole !== 'EMPLOYEE') {
  return { error: 'Admins can only approve Employees' };
}
```

#### Database Security (RLS)
Row Level Security policies enforce data access:

**Profiles Table:**
- CEO: Can view all profiles
- Admin: Can view all profiles
- Employee: Can view own profile only

**Daily Logs Table:**
- CEO: Can view all logs
- Admin: Can view all logs
- Employee: Can view own logs only

**Colleges Table:**
- CEO: Full CRUD access
- Admin: No access
- Employee: No access

**Companies Table:**
- CEO: Full CRUD access
- Admin: No access
- Employee: No access

---

## 📋 Registration & Approval Flow

### Complete Workflow

```
┌─────────────────────────────────────────────────────────┐
│ Step 1: User Registration                               │
│ User visits /register                                   │
│ Selects role: Admin or Employee                         │
│ Fills form and submits                                  │
│ Status: PENDING                                         │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│ Step 2: Approval Request                                │
│                                                         │
│ If Admin Request:                                       │
│   → Appears in CEO's Approvals page                     │
│   → Only CEO can approve                                │
│                                                         │
│ If Employee Request:                                    │
│   → Appears in CEO's AND Admin's Approvals page         │
│   → Either CEO or Admin can approve                     │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│ Step 3: Approval Decision                               │
│ Approver clicks [Approve] or [Reject]                   │
│                                                         │
│ If Approved:                                            │
│   → system_role = requested_role                        │
│   → status = ACTIVE                                     │
│   → approved_at = current timestamp                     │
│   → User can now login                                  │
│                                                         │
│ If Rejected:                                            │
│   → status = REJECTED                                   │
│   → User cannot login                                   │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│ Step 4: User Login                                      │
│ User visits /login                                      │
│ Enters credentials                                      │
│ System checks status = ACTIVE                           │
│ Redirects to role-appropriate dashboard                │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Quick Reference

### Who Can Approve Whom?

| Approver | Can Approve Admin? | Can Approve Employee? |
|----------|-------------------|----------------------|
| **CEO**  | ✅ Yes            | ✅ Yes               |
| **Admin**| ❌ No             | ✅ Yes               |
| **Employee**| ❌ No          | ❌ No                |

### Who Can See What?

| Feature | CEO | Admin | Employee |
|---------|-----|-------|----------|
| **Own Logs** | ✅ | ✅ | ✅ |
| **All Logs** | ✅ | ✅ | ❌ |
| **Approvals** | ✅ (All) | ✅ (Employees only) | ❌ |
| **Colleges** | ✅ | ❌ | ❌ |
| **Companies** | ✅ | ❌ | ❌ |
| **Metrics** | ✅ | ❌ | ❌ |

### Dashboard Routes

| Route | CEO | Admin | Employee |
|-------|-----|-------|----------|
| `/dashboard` | ✅ | ✅ | ✅ |
| `/dashboard/logs` | ✅ | ✅ | ✅ |
| `/dashboard/team-logs` | ✅ | ✅ | ❌ |
| `/dashboard/approvals` | ✅ | ✅ | ❌ |
| `/dashboard/colleges` | ✅ | ❌ | ❌ |
| `/dashboard/companies` | ✅ | ❌ | ❌ |
| `/dashboard/metrics` | ✅ | ❌ | ❌ |

---

## ✅ Current System Status

### Database Status
```
Total Users: 1 (CEO only)
Total Logs: 0 (Clean)
Total Colleges: 0 (Clean)
Total Companies: 0 (Clean)
Pending Approvals: 0
```

### CEO Account
```
Email: intouract.22@gmail.com
Password: InTouract@1438
Role: CEO
Status: ACTIVE
Title: Chief Executive Officer
```

### Security Status
- ✅ Role-based access control implemented
- ✅ Frontend route protection active
- ✅ Backend API validation enforced
- ✅ Database RLS policies enabled
- ✅ Approval workflows functional
- ✅ Clean database (no test data)

---

## 🚀 Getting Started

### As CEO
1. Login at `/login` with CEO credentials
2. Access all features from sidebar
3. Approve Admin requests in "Approvals"
4. Manage colleges, companies, and metrics

### As New Admin
1. Register at `/register` as "Admin"
2. Wait for CEO approval
3. Login after approval
4. Approve Employee requests
5. View team logs

### As New Employee
1. Register at `/register` as "Employee"
2. Wait for Admin/CEO approval
3. Login after approval
4. Submit and manage personal logs

---

**Last Updated:** December 19, 2025  
**System Version:** 1.0.0  
**Security Status:** ✅ Fully Implemented
