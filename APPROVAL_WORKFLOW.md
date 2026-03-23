# 🔄 Approval Workflow - Complete Guide

## 🎯 Approval Hierarchy

### Clear Separation of Responsibilities

```
┌─────────────────────────────────────────────┐
│              CEO                            │
│  ✅ Approves: Admin requests ONLY          │
│  ❌ Does NOT approve: Employee requests     │
└─────────────────────────────────────────────┘
                  │
                  │ Approves Admins
                  ▼
┌─────────────────────────────────────────────┐
│              Admin                          │
│  ✅ Approves: Employee requests ONLY       │
│  ❌ Does NOT approve: Admin requests        │
└─────────────────────────────────────────────┘
                  │
                  │ Approves Employees
                  ▼
┌─────────────────────────────────────────────┐
│              Employee                       │
│  ✅ Can login and work                     │
│  ❌ Cannot approve anyone                   │
└─────────────────────────────────────────────┘
```

---

## 📋 Workflow Details

### Workflow 1: Admin Registration & Approval

```
Step 1: User Registers as Admin
┌─────────────────────────────────┐
│ User goes to /register          │
│ Selects "Admin" role            │
│ Fills form and submits          │
│ Status: PENDING                 │
└─────────────────────────────────┘
              ↓
Step 2: CEO Approves Admin
┌─────────────────────────────────┐
│ CEO logs in                     │
│ Goes to /dashboard/approvals    │
│ Sees ONLY Admin requests        │
│ Does NOT see Employee requests  │
│ Clicks "Approve" on Admin       │
│ Status: ACTIVE                  │
└─────────────────────────────────┘
              ↓
Step 3: Admin Can Login
┌─────────────────────────────────┐
│ Admin logs in successfully      │
│ Accesses Admin dashboard        │
│ Can approve Employees           │
│ Can manage own logs             │
└─────────────────────────────────┘
```

---

### Workflow 2: Employee Registration & Approval

```
Step 1: User Registers as Employee
┌─────────────────────────────────┐
│ User goes to /register          │
│ Selects "Employee" role         │
│ Fills form and submits          │
│ Status: PENDING                 │
└─────────────────────────────────┘
              ↓
Step 2: Admin Approves Employee
┌─────────────────────────────────┐
│ Admin logs in                   │
│ Goes to /dashboard/approvals    │
│ Sees ONLY Employee requests     │
│ Does NOT see Admin requests     │
│ Clicks "Approve" on Employee    │
│ Status: ACTIVE                  │
└─────────────────────────────────┘
              ↓
Step 3: Employee Can Login
┌─────────────────────────────────┐
│ Employee logs in successfully   │
│ Accesses Employee dashboard     │
│ Can submit own logs             │
│ Can view own logs only          │
└─────────────────────────────────┘
```

---

## 🚫 Rejection & Deletion Handling

### What Happens When User is Rejected or Deleted?

**User tries to login:**
```
┌─────────────────────────────────┐
│ User enters email and password  │
│ Clicks "Sign In"                │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│ System checks user status       │
│ Status: REJECTED or DELETED     │
└─────────────────────────────────┘
              ↓
┌─────────────────────────────────┐
│ ❌ Error message displayed:     │
│ "You are not approved"          │
│                                 │
│ User stays on login page        │
│ No redirection happens          │
└─────────────────────────────────┘
```

**Status Checks:**
- ✅ **ACTIVE** → Login successful, redirect to dashboard
- ❌ **PENDING** → Error: "Your account is pending approval. Please wait for an administrator to approve your request."
- ❌ **REJECTED** → Error: "You are not approved"
- ❌ **DELETED** (user not found) → Error: "You are not approved"

**Important:**
- User is NOT redirected to another page
- Error message shows on login page
- User can try again or contact administrator

---

## 🔐 CEO Approvals Page

### What CEO Sees

**URL:** `/dashboard/approvals`

**Page Title:** "Pending Approvals"

**Description:** "Approve or reject Admin registration requests"

**Table Content:**
```
┌──────────────────────────────────────────────────────┐
│ User Requests                                        │
├──────────────────────────────────────────────────────┤
│ Name         Email            Role    Status Actions │
│ John Doe     john@test.com    Admin   Pending [✓][✗]│
│ Sarah Smith  sarah@test.com   Admin   Pending [✓][✗]│
└──────────────────────────────────────────────────────┘
```

**What CEO Sees:**
- ✅ Admin registration requests
- ❌ Employee registration requests (NOT shown)

**What CEO Can Do:**
- ✅ Approve Admin requests
- ✅ Reject Admin requests
- ❌ Cannot approve Employee requests (they don't see them)

---

## 🔐 Admin Approvals Page

### What Admin Sees

**URL:** `/dashboard/approvals`

**Page Title:** "Pending Approvals"

**Description:** "Approve or reject Employee registration requests"

**Table Content:**
```
┌──────────────────────────────────────────────────────┐
│ User Requests                                        │
├──────────────────────────────────────────────────────┤
│ Name         Email            Role      Status Actions│
│ Jane Doe     jane@test.com    Employee Pending [✓][✗]│
│ Mike Brown   mike@test.com    Employee Pending [✓][✗]│
└──────────────────────────────────────────────────────┘
```

**What Admin Sees:**
- ✅ Employee registration requests
- ❌ Admin registration requests (NOT shown)

**What Admin Can Do:**
- ✅ Approve Employee requests
- ✅ Reject Employee requests
- ❌ Cannot approve Admin requests (they don't see them)

---

## 📊 Approval Matrix

| User Type | Who Approves | What They See in Approvals | Can Approve |
|-----------|--------------|---------------------------|-------------|
| **Admin** | CEO | Admin requests only | ✅ Admin |
| **Employee** | Admin | Employee requests only | ✅ Employee |
| **CEO** | N/A | N/A | N/A (CEO is pre-created) |

---

## 🧪 Testing Scenarios

### Test 1: CEO Approves Admin ✅

```
1. Open incognito window
2. Go to /register
3. Select "Admin" role
4. Fill form: name, email, password, phone, title
5. Submit registration
6. See message: "Registration successful! Please wait for approval."

7. In main window, login as CEO
8. Go to /dashboard/approvals
9. Should see the Admin request
10. Should NOT see any Employee requests
11. Click green checkmark to approve
12. Admin request disappears

13. In incognito window, go to /login
14. Login with Admin credentials
15. Should redirect to /dashboard
16. Should see Admin dashboard with 5 menu items
```

---

### Test 2: Admin Approves Employee ✅

```
1. Login as Admin (approved in Test 1)
2. Go to /dashboard/approvals
3. Should see ONLY Employee requests
4. Should NOT see any Admin requests

5. Open incognito window
6. Go to /register
7. Select "Employee" role
8. Fill form and submit
9. See message: "Registration successful! Please wait for approval."

10. Back to Admin window
11. Refresh /dashboard/approvals
12. Should see the Employee request
13. Click green checkmark to approve
14. Employee request disappears

15. In incognito window, go to /login
16. Login with Employee credentials
17. Should redirect to /dashboard
18. Should see Employee dashboard with 2 menu items
```

---

### Test 3: Rejected User Cannot Login ✅

```
1. Register a new user (Admin or Employee)
2. CEO/Admin goes to /dashboard/approvals
3. Clicks red X to reject the user
4. User status: REJECTED

5. User tries to login
6. Enters email and password
7. Clicks "Sign In"
8. Should see error: "You are not approved"
9. Should stay on login page
10. Should NOT be redirected anywhere
```

---

### Test 4: Deleted User Cannot Login ✅

```
1. Create and approve a user
2. CEO/Admin goes to /dashboard/users
3. Clicks "Delete" on the user
4. Confirms deletion
5. User is deleted from database

6. User tries to login
7. Enters email and password
8. Clicks "Sign In"
9. Should see error: "You are not approved"
10. Should stay on login page
11. Should NOT be redirected anywhere
```

---

### Test 5: Pending User Cannot Login ✅

```
1. Register a new user
2. User status: PENDING (not yet approved)

3. User tries to login
4. Enters email and password
5. Clicks "Sign In"
6. Should see error: "Your account is pending approval. Please wait for an administrator to approve your request."
7. Should stay on login page
8. Should NOT be redirected anywhere
```

---

## 🔒 Security Enforcement

### Frontend Security

**Approvals Page Filtering:**
```typescript
// CEO sees only Admin requests
if (profile?.system_role === 'CEO') {
  setPendingUsers(data.filter(u => u.requested_role === 'ADMIN'));
}

// Admin sees only Employee requests
else if (profile?.system_role === 'ADMIN') {
  setPendingUsers(data.filter(u => u.requested_role === 'EMPLOYEE'));
}
```

**Approval Permission Checks:**
```typescript
// CEO can only approve Admin requests
if (profile?.system_role === 'CEO' && requestedRole !== 'ADMIN') {
  return error('CEO can only approve Admin requests');
}

// Admin can only approve Employee requests
if (profile?.system_role === 'ADMIN' && requestedRole !== 'EMPLOYEE') {
  return error('Admins can only approve Employee requests');
}
```

---

### Backend Security

**Login Status Checks:**
```typescript
// Check if user exists
if (!profileData) {
  throw new Error('You are not approved');
}

// Check if user is rejected
if (profileData.status === 'REJECTED') {
  throw new Error('You are not approved');
}

// Check if user is pending
if (profileData.status === 'PENDING') {
  throw new Error('Your account is pending approval...');
}

// Check if user is active
if (profileData.status !== 'ACTIVE') {
  throw new Error('You are not approved');
}
```

---

## 📞 Quick Reference

### CEO Actions
- ✅ Approve Admin requests
- ✅ Reject Admin requests
- ✅ Delete Admin users (via User Management)
- ✅ Delete Employee users (via User Management)
- ❌ Cannot approve Employee requests

### Admin Actions
- ✅ Approve Employee requests
- ✅ Reject Employee requests
- ✅ Delete Employee users (via User Management)
- ❌ Cannot approve Admin requests
- ❌ Cannot delete Admin users

### Employee Actions
- ✅ Submit own logs
- ✅ View own logs
- ✅ Edit own logs
- ✅ Delete own logs
- ❌ Cannot approve anyone
- ❌ Cannot delete anyone

---

## 🎯 Key Points

1. **CEO approves ONLY Admins** - Employee requests are not shown to CEO
2. **Admin approves ONLY Employees** - Admin requests are not shown to Admin
3. **Rejected users see "You are not approved"** - No redirection, stay on login page
4. **Deleted users see "You are not approved"** - No redirection, stay on login page
5. **Pending users see pending message** - Clear explanation, stay on login page
6. **No cross-approval** - CEO cannot approve Employees, Admin cannot approve Admins

---

**Last Updated:** December 19, 2025  
**Status:** ✅ Approval Workflow Correctly Implemented  
**Changes:** CEO approves Admins only, Admin approves Employees only, Rejected/Deleted users stay on login page
