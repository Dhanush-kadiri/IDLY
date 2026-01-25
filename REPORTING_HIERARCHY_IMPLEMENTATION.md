# 🎯 Reporting Hierarchy System - Implementation Complete

## 📋 Overview

Implemented a hierarchical reporting structure where employees select their reporting manager during registration. Approval requests are sent ONLY to the selected manager, and managers can only see and manage their own team members.

---

## ✨ New Features

### 1. Manager Selection During Registration

**For Employees:**
- During registration, employees must select a reporting manager
- Dropdown shows all active CEOs and Admins
- Manager selection is required for Employee role
- Admin registrations don't require manager selection (approved by CEO)

**Manager List Format:**
```
John Doe - CEO
Jane Smith - COO
Bob Johnson - CTO
```

---

### 2. Hierarchical Approval Workflow

**CEO Approvals:**
- ✅ All Admin registration requests
- ✅ Employee requests where `reports_to = CEO's ID`
- ❌ Employee requests assigned to other managers

**Admin Approvals:**
- ✅ Employee requests where `reports_to = Admin's ID`
- ❌ Admin registration requests
- ❌ Employee requests assigned to other managers

**Example Scenario:**
```
Employee registers and selects "COO" as manager
→ Request goes ONLY to COO
→ CEO cannot see this request
→ CTO cannot see this request
→ Only COO can approve/reject
```

---

### 3. Team Management Isolation

**User Management Page:**
- CEO: Sees all active users
- Admin: Sees ONLY employees who report to them
- Each manager manages their own team independently

**Team Logs Page:**
- CEO: Sees all team logs
- Admin: Sees ONLY logs from employees who report to them
- Complete team isolation

---

## 🗄️ Database Changes

### New Field: `reports_to`

**Table:** `profiles`

**Column Details:**
```sql
reports_to uuid REFERENCES profiles(id) ON DELETE SET NULL
```

**Purpose:**
- Stores the user_id of the manager
- NULL for CEO and Admin roles
- Required for Employee role
- Foreign key to profiles table

**Index:**
```sql
CREATE INDEX idx_profiles_reports_to ON profiles(reports_to);
```

---

## 🔄 Updated Workflows

### Registration Workflow

**Step 1: User Fills Form**
```
- Email
- Name
- Phone
- Job Title
- Requested Role: [Employee/Admin]
- Reporting Manager: [Dropdown] ← NEW!
- Password
```

**Step 2: Manager Selection (Employees Only)**
```
If role = Employee:
  → Show manager dropdown
  → Load all active CEOs and Admins
  → User selects their manager
  → reports_to field is set

If role = Admin:
  → No manager selection
  → reports_to = NULL
```

**Step 3: Approval Routing**
```
If role = Admin:
  → Request goes to CEO

If role = Employee:
  → Request goes to selected manager (reports_to)
  → Only that manager can see and approve
```

---

### Approval Workflow

**CEO Dashboard:**
```
Approvals Page shows:
1. All Admin requests
2. Employee requests where reports_to = CEO's ID

Does NOT show:
- Employee requests assigned to other managers
```

**Admin Dashboard:**
```
Approvals Page shows:
1. Employee requests where reports_to = Admin's ID

Does NOT show:
- Admin requests
- Employee requests assigned to other managers
```

---

## 📊 Example Scenarios

### Scenario 1: Employee Reports to COO

**Registration:**
```
Name: Alice Johnson
Role: Employee
Manager: COO (Bob Smith)
```

**Result:**
- `reports_to` = Bob Smith's user_id
- Approval request appears in Bob's dashboard
- CEO cannot see this request
- CTO cannot see this request

**After Approval:**
- Bob can see Alice in User Management
- Bob can see Alice's logs in Team Logs
- CEO can see Alice (sees all users)
- CTO cannot see Alice

---

### Scenario 2: Employee Reports to CEO

**Registration:**
```
Name: Charlie Brown
Role: Employee
Manager: CEO (Dhanush Kadiri)
```

**Result:**
- `reports_to` = CEO's user_id
- Approval request appears in CEO's dashboard
- COO cannot see this request
- CTO cannot see this request

**After Approval:**
- CEO can see Charlie in User Management
- CEO can see Charlie's logs in Team Logs
- COO cannot see Charlie
- CTO cannot see Charlie

---

### Scenario 3: Admin Registration

**Registration:**
```
Name: David Lee
Role: Admin
Title: CTO
```

**Result:**
- `reports_to` = NULL
- Approval request appears in CEO's dashboard
- Only CEO can approve Admin requests

**After Approval:**
- David becomes CTO (Admin role)
- David can approve employees who select him as manager
- David can only see his own team members

---

## 🔒 Security & Isolation

### Data Isolation

**Admin A:**
- Sees only employees where `reports_to = Admin A's ID`
- Cannot see employees of Admin B
- Cannot see employees of CEO
- Cannot modify other teams

**Admin B:**
- Sees only employees where `reports_to = Admin B's ID`
- Cannot see employees of Admin A
- Cannot see employees of CEO
- Cannot modify other teams

**CEO:**
- Sees all users (full visibility)
- Can approve all Admin requests
- Can approve employees who report directly to CEO
- Cannot approve employees assigned to other managers

---

### RLS Policies

**No Changes Required:**
- Existing RLS policies still work
- Filtering happens in application layer
- Managers can technically query all data
- But UI only shows their team

**Future Enhancement:**
- Could add RLS policies to enforce at database level
- Would prevent managers from querying other teams' data
- Currently relies on application-level filtering

---

## 🎨 UI Changes

### Registration Page

**New Field:**
```tsx
{formData.requestedRole === 'EMPLOYEE' && (
  <div className="space-y-2">
    <Label htmlFor="manager">Reporting Manager *</Label>
    <Select
      value={formData.reportsTo}
      onValueChange={(value) => setFormData({ ...formData, reportsTo: value })}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select your manager" />
      </SelectTrigger>
      <SelectContent>
        {managers.map((manager) => (
          <SelectItem key={manager.id} value={manager.id}>
            {manager.name} - {manager.title || manager.system_role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <p className="text-xs text-muted-foreground">
      Select the manager you will report to. Your approval request will be sent to them.
    </p>
  </div>
)}
```

**Validation:**
- Manager selection is required for Employees
- Shows error if not selected
- Automatically loads active managers on page load

---

### Approvals Page

**Updated Description:**
```
CEO: "Approve or reject Admin requests and Employee requests assigned to you"
Admin: "Approve or reject Employee requests assigned to you"
```

**Filtering Logic:**
```typescript
// CEO sees Admin requests + Employees reporting to CEO
if (profile?.system_role === 'CEO') {
  const filtered = data.filter(u => 
    u.requested_role === 'ADMIN' || 
    (u.requested_role === 'EMPLOYEE' && u.reports_to === user?.id)
  );
  setPendingUsers(filtered);
}

// Admin sees only Employees reporting to them
else if (profile?.system_role === 'ADMIN') {
  const filtered = data.filter(u => 
    u.requested_role === 'EMPLOYEE' && u.reports_to === user?.id
  );
  setPendingUsers(filtered);
}
```

---

### User Management Page

**Updated Filtering:**
```typescript
// CEO sees all users
if (profile?.system_role === 'CEO') {
  setUsers(data.filter(u => u.id !== user?.id));
}

// Admin sees only their team
else if (profile?.system_role === 'ADMIN') {
  setUsers(data.filter(u => 
    u.system_role === 'EMPLOYEE' && u.reports_to === user?.id
  ));
}
```

---

### Team Logs Page

**Updated Filtering:**
```typescript
// Admin only sees logs from their team
const managerId = profile?.system_role === 'ADMIN' ? user?.id : undefined;
const data = await dailyLogsApi.getAllLogs({ ...filters, managerId });
```

---

## 🧪 Testing Guide

### Test 1: Employee Registration with Manager Selection

**Steps:**
1. Go to /register
2. Fill form with Employee role
3. Select a manager from dropdown (e.g., CEO)
4. Submit registration
5. Login as selected manager
6. Go to /dashboard/approvals
7. Verify request appears

**Expected Result:**
- ✅ Manager sees the request
- ✅ Other managers don't see the request
- ✅ Manager can approve/reject

---

### Test 2: Multiple Managers with Different Teams

**Setup:**
1. Create Admin A (COO)
2. Create Admin B (CTO)
3. Register Employee 1 → Reports to COO
4. Register Employee 2 → Reports to CTO

**Test as COO:**
1. Login as COO
2. Go to /dashboard/approvals
3. Should see Employee 1 only
4. Should NOT see Employee 2

**Test as CTO:**
1. Login as CTO
2. Go to /dashboard/approvals
3. Should see Employee 2 only
4. Should NOT see Employee 1

**Expected Result:**
- ✅ Complete team isolation
- ✅ Each manager sees only their team
- ✅ No cross-team visibility

---

### Test 3: Team Logs Isolation

**Setup:**
1. Approve Employee 1 (reports to COO)
2. Approve Employee 2 (reports to CTO)
3. Employee 1 submits a log
4. Employee 2 submits a log

**Test as COO:**
1. Login as COO
2. Go to /dashboard/team-logs
3. Should see Employee 1's log only
4. Should NOT see Employee 2's log

**Test as CTO:**
1. Login as CTO
2. Go to /dashboard/team-logs
3. Should see Employee 2's log only
4. Should NOT see Employee 1's log

**Expected Result:**
- ✅ Complete log isolation
- ✅ Each manager sees only their team's logs
- ✅ CEO sees all logs

---

## 📝 Files Modified

### Database
- ✅ Migration: `add_reports_to_field.sql`
  - Added `reports_to` column
  - Added index for performance

### Types
- ✅ `src/types/types.ts`
  - Added `reports_to` to Profile interface

### API
- ✅ `src/db/api.ts`
  - Added `getAllManagers()` function
  - Updated `getAllLogs()` to filter by managerId

### Authentication
- ✅ `src/contexts/AuthContext.tsx`
  - Added `reportsTo` to SignUpData interface
  - Updated signUp() to save reports_to

### Pages
- ✅ `src/pages/Register.tsx`
  - Added manager selection dropdown
  - Added validation for manager selection
  - Loads managers on mount

- ✅ `src/pages/dashboard/Approvals.tsx`
  - Updated filtering logic for reports_to
  - Updated description text

- ✅ `src/pages/dashboard/UserManagement.tsx`
  - Updated filtering to show only team members

- ✅ `src/pages/dashboard/TeamLogs.tsx`
  - Updated to filter logs by managerId

---

## 🎉 Summary

### What Was Implemented

1. **Manager Selection During Registration**
   - Employees select reporting manager
   - Dropdown shows active CEOs and Admins
   - Required field for Employees

2. **Hierarchical Approval Routing**
   - Requests go only to selected manager
   - Other managers cannot see the request
   - Complete approval isolation

3. **Team Management Isolation**
   - Managers see only their team members
   - User Management filtered by reports_to
   - Team Logs filtered by reports_to

4. **Database Schema Update**
   - Added reports_to field
   - Foreign key to profiles table
   - Indexed for performance

### Benefits

- ✅ Clear reporting structure
- ✅ Manager accountability
- ✅ Team isolation and privacy
- ✅ Scalable for multiple managers
- ✅ No cross-team interference

### Current System State

**Users:**
- CEO: intouract.22@gmail.com (can approve Admins + direct reports)
- Admin: test2233@gmail.com (can approve employees who select them)

**Next Steps:**
1. Register new employees
2. Select reporting manager during registration
3. Manager approves the request
4. Employee joins the team
5. Manager can view team logs and manage team

---

**Last Updated:** December 19, 2025  
**Status:** ✅ COMPLETE  
**Impact:** Hierarchical reporting system with complete team isolation
