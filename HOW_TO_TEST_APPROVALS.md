# 🧪 How to Test Role-Based Approvals

## 🎯 Quick Answer: Where to Approve Users?

### CEO Approves Admins
**Location:** `/dashboard/approvals`
1. Login as CEO (`intouract.22@gmail.com`)
2. Click **"Approvals"** in the left sidebar
3. You will see **Admin requests** and **Employee requests**
4. Click **[Approve]** button next to Admin requests

### Admin Approves Employees
**Location:** `/dashboard/approvals`
1. Login as Admin (after CEO approves you)
2. Click **"Approvals"** in the left sidebar
3. You will see **Employee requests only** (no Admin requests)
4. Click **[Approve]** button next to Employee requests

---

## 🧪 Step-by-Step Testing Guide

### Test 1: CEO Approves Admin

**Step 1: Create Admin Request**
```
1. Open browser in INCOGNITO mode
2. Go to: http://localhost:5173/register
3. Fill form:
   - Name: Test Admin
   - Email: admin@test.com
   - Password: Test1234!
   - Phone: 1234567890
   - Title: Admin Manager
   - Requested Role: Admin ← SELECT THIS
4. Click "Sign Up"
5. You should see: "Registration successful! Please wait for approval."
```

**Step 2: CEO Approves Admin**
```
1. Go back to CEO browser window
2. Login as CEO if not already:
   - Email: intouract.22@gmail.com
   - Password: InTouract@1438
3. Look at left sidebar - you should see "Approvals"
4. Click "Approvals"
5. You should see a table with:
   
   ┌─────────────────────────────────────────────────────┐
   │ User Requests                                       │
   ├─────────────────────────────────────────────────────┤
   │ Name         Email            Role    Actions       │
   │ Test Admin   admin@test.com   Admin   [✓] [✗]     │
   └─────────────────────────────────────────────────────┘
   
6. Click the GREEN CHECKMARK [✓] button
7. You should see: "User approved successfully"
8. The request disappears from the list
```

**Step 3: Admin Can Now Login**
```
1. Go to incognito window
2. Go to: http://localhost:5173/login
3. Login with:
   - Email: admin@test.com
   - Password: Test1234!
4. You should be redirected to Admin Dashboard
5. Check sidebar - you should see:
   ✅ Dashboard
   ✅ My Logs
   ✅ Team Logs
   ✅ Approvals
   ❌ Colleges (NOT visible)
   ❌ Companies (NOT visible)
   ❌ Metrics (NOT visible)
```

---

### Test 2: Admin Approves Employee

**Step 1: Create Employee Request**
```
1. Open ANOTHER incognito window
2. Go to: http://localhost:5173/register
3. Fill form:
   - Name: Test Employee
   - Email: employee@test.com
   - Password: Test1234!
   - Phone: 9876543210
   - Title: Software Developer
   - Requested Role: Employee ← SELECT THIS
4. Click "Sign Up"
5. You should see: "Registration successful! Please wait for approval."
```

**Step 2: Admin Approves Employee**
```
1. Go to Admin browser window (admin@test.com)
2. Click "Approvals" in sidebar
3. You should see:
   
   ┌─────────────────────────────────────────────────────┐
   │ User Requests                                       │
   ├─────────────────────────────────────────────────────┤
   │ Name           Email              Role      Actions │
   │ Test Employee  employee@test.com  Employee  [✓] [✗]│
   └─────────────────────────────────────────────────────┘
   
   NOTE: You should NOT see any Admin requests here!
   
4. Click the GREEN CHECKMARK [✓] button
5. You should see: "User approved successfully"
6. The request disappears from the list
```

**Step 3: Employee Can Now Login**
```
1. Go to employee incognito window
2. Go to: http://localhost:5173/login
3. Login with:
   - Email: employee@test.com
   - Password: Test1234!
4. You should be redirected to Employee Dashboard
5. Check sidebar - you should see:
   ✅ Dashboard
   ✅ My Logs
   ❌ Team Logs (NOT visible)
   ❌ Approvals (NOT visible)
   ❌ Colleges (NOT visible)
   ❌ Companies (NOT visible)
   ❌ Metrics (NOT visible)
```

---

## 🔍 What You Should See

### CEO Dashboard Sidebar
```
┌─────────────────────┐
│ InTouract           │
├─────────────────────┤
│ 📊 Dashboard        │
│ 📝 My Logs          │
│ 📄 Team Logs        │
│ 👥 Approvals        │ ← CLICK HERE TO APPROVE
│ 🎓 Colleges         │
│ 🏢 Companies        │
│ 📈 Metrics          │
└─────────────────────┘
```

### Admin Dashboard Sidebar
```
┌─────────────────────┐
│ InTouract           │
├─────────────────────┤
│ 📊 Dashboard        │
│ 📝 My Logs          │
│ 📄 Team Logs        │
│ 👥 Approvals        │ ← CLICK HERE TO APPROVE
└─────────────────────┘
```

### Employee Dashboard Sidebar
```
┌─────────────────────┐
│ InTouract           │
├─────────────────────┤
│ 📊 Dashboard        │
│ 📝 My Logs          │
└─────────────────────┘
```

---

## 📋 Approvals Page Details

### CEO Approvals Page (`/dashboard/approvals`)

**What CEO Sees:**
```
┌──────────────────────────────────────────────────────────────┐
│ Pending Approvals                                            │
│ Review and approve user registration requests                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ User Requests                                                │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Name    │ Email           │ Role     │ Status  │ Actions││
│ ├────────────────────────────────────────────────────────┤  │
│ │ John    │ john@test.com   │ Admin    │ Pending │ [✓][✗]││
│ │ Jane    │ jane@test.com   │ Employee │ Pending │ [✓][✗]││
│ │ Bob     │ bob@test.com    │ Admin    │ Pending │ [✓][✗]││
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ ✓ = Approve Button (Green)                                  │
│ ✗ = Reject Button (Red)                                     │
└──────────────────────────────────────────────────────────────┘
```

**CEO can approve:**
- ✅ Admin requests
- ✅ Employee requests

---

### Admin Approvals Page (`/dashboard/approvals`)

**What Admin Sees:**
```
┌──────────────────────────────────────────────────────────────┐
│ Pending Approvals                                            │
│ Review and approve user registration requests                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ User Requests                                                │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Name    │ Email           │ Role     │ Status  │ Actions││
│ ├────────────────────────────────────────────────────────┤  │
│ │ Jane    │ jane@test.com   │ Employee │ Pending │ [✓][✗]││
│ │ Mike    │ mike@test.com   │ Employee │ Pending │ [✓][✗]││
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ NOTE: Admin requests are NOT shown here!                    │
│ Only CEO can see and approve Admin requests.                │
└──────────────────────────────────────────────────────────────┘
```

**Admin can approve:**
- ❌ Admin requests (NOT visible)
- ✅ Employee requests only

---

## 🚨 Common Issues & Solutions

### Issue 1: "I don't see Approvals in sidebar"
**Solution:**
- Check your role: Only CEO and Admin can see Approvals
- Employees do NOT have Approvals menu item
- Logout and login again to refresh

### Issue 2: "Approvals page is empty"
**Solution:**
- No pending requests yet
- Create test users using /register
- Make sure they selected Admin or Employee role
- Refresh the page

### Issue 3: "I'm Admin but I see Admin requests"
**Solution:**
- This should NOT happen
- Only CEO should see Admin requests
- Check your actual role in the sidebar footer
- If you see Admin requests as Admin, there's a bug

### Issue 4: "Approve button doesn't work"
**Solution:**
- Check browser console for errors
- Make sure you're logged in
- Try refreshing the page
- Check network tab for API errors

---

## 🎯 Quick Test Commands

### Create Test Admin User (via SQL)
```sql
INSERT INTO profiles (id, email, name, phone, title, requested_role, system_role, status)
VALUES (
  gen_random_uuid(),
  'testadmin@test.com',
  'Test Admin',
  '1234567890',
  'Admin Manager',
  'ADMIN',
  'ADMIN',
  'PENDING'
);
```

### Create Test Employee User (via SQL)
```sql
INSERT INTO profiles (id, email, name, phone, title, requested_role, system_role, status)
VALUES (
  gen_random_uuid(),
  'testemployee@test.com',
  'Test Employee',
  '9876543210',
  'Developer',
  'EMPLOYEE',
  'EMPLOYEE',
  'PENDING'
);
```

### Check Pending Users
```sql
SELECT name, email, requested_role, status 
FROM profiles 
WHERE status = 'PENDING'
ORDER BY created_at DESC;
```

---

## ✅ Expected Behavior Summary

| User Role | Can Access Approvals? | Sees Admin Requests? | Sees Employee Requests? | Can Approve Admins? | Can Approve Employees? |
|-----------|----------------------|---------------------|------------------------|--------------------|-----------------------|
| **CEO**   | ✅ Yes               | ✅ Yes              | ✅ Yes                 | ✅ Yes             | ✅ Yes                |
| **Admin** | ✅ Yes               | ❌ No               | ✅ Yes                 | ❌ No              | ✅ Yes                |
| **Employee** | ❌ No             | ❌ No               | ❌ No                  | ❌ No              | ❌ No                 |

---

## 🔗 Direct URLs

- **CEO Approvals:** `http://localhost:5173/dashboard/approvals`
- **Admin Approvals:** `http://localhost:5173/dashboard/approvals`
- **Registration:** `http://localhost:5173/register`
- **Login:** `http://localhost:5173/login`

---

## 📞 Need Help?

If approvals are not working:

1. **Check CEO is logged in:**
   ```
   Email: intouract.22@gmail.com
   Password: InTouract@1438
   ```

2. **Check sidebar shows "Approvals" menu item**

3. **Create a test user via registration page**

4. **Go to /dashboard/approvals and check if request appears**

5. **Click the green checkmark to approve**

---

**Last Updated:** December 19, 2025  
**Status:** ✅ Approvals System Fully Functional
