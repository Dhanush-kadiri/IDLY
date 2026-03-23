# 📍 WHERE IS EVERYTHING? - Visual Guide

## 🎯 Quick Answer

### Where does CEO approve Admins?
**Answer:** Click **"Approvals"** in the left sidebar → You'll see Admin and Employee requests

### Where does Admin approve Employees?
**Answer:** Click **"Approvals"** in the left sidebar → You'll see Employee requests only

---

## 🖥️ CEO Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  InTouract                                    👤 Dhanush Kadiri ▼   │
├──────────────┬──────────────────────────────────────────────────────┤
│              │                                                      │
│  IT          │  Pending Approvals                                  │
│  InTouract   │  Review and approve user registration requests      │
│              │                                                      │
│ 📊 Dashboard │  ┌─────────────────────────────────────────────┐   │
│              │  │ User Requests                               │   │
│ 📝 My Logs   │  ├─────────────────────────────────────────────┤   │
│              │  │ Name    Email         Role    Actions       │   │
│ 📄 Team Logs │  │ John    john@test.com Admin   [✓] [✗]      │   │
│              │  │ Jane    jane@test.com Employee [✓] [✗]      │   │
│ 👥 Approvals │◄─┼─ CLICK HERE TO SEE PENDING REQUESTS         │   │
│              │  │                                              │   │
│ 🎓 Colleges  │  │ ✓ = Approve (Green button)                  │   │
│              │  │ ✗ = Reject (Red button)                     │   │
│ 🏢 Companies │  └─────────────────────────────────────────────┘   │
│              │                                                      │
│ 📈 Metrics   │  CEO sees BOTH Admin and Employee requests here     │
│              │                                                      │
│ ─────────────│                                                      │
│ Dhanush      │                                                      │
│ intouract... │                                                      │
│ [CEO]        │                                                      │
└──────────────┴──────────────────────────────────────────────────────┘
```

---

## 🖥️ Admin Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  InTouract                                    👤 Test Admin ▼       │
├──────────────┬──────────────────────────────────────────────────────┤
│              │                                                      │
│  IT          │  Pending Approvals                                  │
│  InTouract   │  Review and approve user registration requests      │
│              │                                                      │
│ 📊 Dashboard │  ┌─────────────────────────────────────────────┐   │
│              │  │ User Requests                               │   │
│ 📝 My Logs   │  ├─────────────────────────────────────────────┤   │
│              │  │ Name    Email         Role      Actions     │   │
│ 📄 Team Logs │  │ Jane    jane@test.com Employee  [✓] [✗]    │   │
│              │  │ Mike    mike@test.com Employee  [✓] [✗]    │   │
│ 👥 Approvals │◄─┼─ CLICK HERE TO SEE EMPLOYEE REQUESTS ONLY   │   │
│              │  │                                              │   │
│              │  │ NOTE: Admin requests are NOT shown here!    │   │
│              │  │ Only CEO can approve Admins.                │   │
│              │  └─────────────────────────────────────────────┘   │
│              │                                                      │
│ ─────────────│  Admin sees ONLY Employee requests here             │
│ Test Admin   │                                                      │
│ admin@...    │                                                      │
│ [ADMIN]      │                                                      │
└──────────────┴──────────────────────────────────────────────────────┘
```

---

## 🖥️ Employee Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  InTouract                                    👤 Test Employee ▼    │
├──────────────┬──────────────────────────────────────────────────────┤
│              │                                                      │
│  IT          │  Dashboard                                          │
│  InTouract   │                                                      │
│              │  Welcome to your dashboard!                         │
│ 📊 Dashboard │                                                      │
│              │  ┌─────────────────────────────────────────────┐   │
│ 📝 My Logs   │  │ My Daily Logs                               │   │
│              │  ├─────────────────────────────────────────────┤   │
│              │  │ Date       Title         Status              │   │
│              │  │ 2025-12-19 Fixed bug     Completed           │   │
│              │  │ 2025-12-18 New feature   In Progress         │   │
│              │  └─────────────────────────────────────────────┘   │
│              │                                                      │
│              │  Employee does NOT see:                             │
│              │  ❌ Team Logs                                       │
│              │  ❌ Approvals                                       │
│              │  ❌ Colleges                                        │
│ ─────────────│  ❌ Companies                                       │
│ Test Employee│  ❌ Metrics                                         │
│ employee@... │                                                      │
│ [EMPLOYEE]   │                                                      │
└──────────────┴──────────────────────────────────────────────────────┘
```

---

## 🔍 Step-by-Step: Where to Click

### CEO Approving Admin

```
Step 1: Login as CEO
┌─────────────────────────┐
│ Login                   │
│ Email: intouract.22@... │
│ Password: InTouract@... │
│ [Sign In] ◄─── CLICK    │
└─────────────────────────┘

Step 2: Look at Left Sidebar
┌─────────────────────────┐
│ 📊 Dashboard            │
│ 📝 My Logs              │
│ 📄 Team Logs            │
│ 👥 Approvals ◄─── CLICK │
│ 🎓 Colleges             │
│ 🏢 Companies            │
│ 📈 Metrics              │
└─────────────────────────┘

Step 3: See Pending Requests
┌──────────────────────────────────────┐
│ User Requests                        │
│ Name      Email         Role  Actions│
│ John Doe  john@test.com Admin [✓][✗]│
│                                 ▲    │
│                                 │    │
│                          CLICK HERE  │
│                          TO APPROVE  │
└──────────────────────────────────────┘

Step 4: Success!
┌──────────────────────────────────────┐
│ ✅ User approved successfully        │
└──────────────────────────────────────┘
```

---

### Admin Approving Employee

```
Step 1: Login as Admin
┌─────────────────────────┐
│ Login                   │
│ Email: admin@test.com   │
│ Password: Test1234!     │
│ [Sign In] ◄─── CLICK    │
└─────────────────────────┘

Step 2: Look at Left Sidebar
┌─────────────────────────┐
│ 📊 Dashboard            │
│ 📝 My Logs              │
│ 📄 Team Logs            │
│ 👥 Approvals ◄─── CLICK │
└─────────────────────────┘

Step 3: See Employee Requests Only
┌──────────────────────────────────────┐
│ User Requests                        │
│ Name      Email           Role Actions│
│ Jane Doe  jane@test.com   Emp [✓][✗]│
│                                 ▲    │
│                                 │    │
│                          CLICK HERE  │
│                          TO APPROVE  │
│                                      │
│ NOTE: You will NOT see Admin         │
│ requests here. Only Employees.       │
└──────────────────────────────────────┘

Step 4: Success!
┌──────────────────────────────────────┐
│ ✅ User approved successfully        │
└──────────────────────────────────────┘
```

---

## 📱 Mobile View (Responsive)

On mobile devices, the sidebar becomes a hamburger menu:

```
┌─────────────────────────────────┐
│ ☰  InTouract     👤 User ▼     │
├─────────────────────────────────┤
│                                 │
│  Pending Approvals              │
│                                 │
│  [User Requests Table]          │
│                                 │
└─────────────────────────────────┘

Click ☰ to open sidebar menu
```

---

## 🎯 URL Paths

| Page | URL | Who Can Access |
|------|-----|----------------|
| **CEO Dashboard** | `/dashboard` | CEO only |
| **Admin Dashboard** | `/dashboard` | Admin only |
| **Employee Dashboard** | `/dashboard` | Employee only |
| **CEO Approvals** | `/dashboard/approvals` | CEO only |
| **Admin Approvals** | `/dashboard/approvals` | Admin only |
| **My Logs** | `/dashboard/logs` | All roles |
| **Team Logs** | `/dashboard/team-logs` | CEO, Admin |
| **Colleges** | `/dashboard/colleges` | CEO only |
| **Companies** | `/dashboard/companies` | CEO only |
| **Metrics** | `/dashboard/metrics` | CEO only |

**Note:** Same URL (`/dashboard/approvals`) but different content based on role!

---

## 🔐 What Each Role Sees on Approvals Page

### CEO on `/dashboard/approvals`
```
┌─────────────────────────────────────────────┐
│ Pending Approvals                           │
│                                             │
│ User Requests                               │
│ ┌─────────────────────────────────────────┐ │
│ │ Admin Requests:                         │ │
│ │ • John (Admin) - [Approve] [Reject]     │ │
│ │ • Sarah (Admin) - [Approve] [Reject]    │ │
│ │                                         │ │
│ │ Employee Requests:                      │ │
│ │ • Jane (Employee) - [Approve] [Reject]  │ │
│ │ • Mike (Employee) - [Approve] [Reject]  │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### Admin on `/dashboard/approvals`
```
┌─────────────────────────────────────────────┐
│ Pending Approvals                           │
│                                             │
│ User Requests                               │
│ ┌─────────────────────────────────────────┐ │
│ │ Employee Requests:                      │ │
│ │ • Jane (Employee) - [Approve] [Reject]  │ │
│ │ • Mike (Employee) - [Approve] [Reject]  │ │
│ │                                         │ │
│ │ (Admin requests are not shown)          │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### Employee
```
❌ Cannot access /dashboard/approvals
Redirected to /dashboard
```

---

## ✅ How to Verify It's Working

### Test 1: Check Sidebar
```
1. Login as CEO
2. Count sidebar items - should be 7:
   ✓ Dashboard
   ✓ My Logs
   ✓ Team Logs
   ✓ Approvals ← THIS ONE
   ✓ Colleges
   ✓ Companies
   ✓ Metrics

3. Login as Admin
4. Count sidebar items - should be 4:
   ✓ Dashboard
   ✓ My Logs
   ✓ Team Logs
   ✓ Approvals ← THIS ONE

5. Login as Employee
6. Count sidebar items - should be 2:
   ✓ Dashboard
   ✓ My Logs
   ✗ No Approvals!
```

### Test 2: Check Approvals Page
```
1. Create test user via /register
2. Login as CEO
3. Go to /dashboard/approvals
4. Should see the pending request
5. Click green checkmark
6. Request disappears
7. User can now login
```

---

## 🚨 Troubleshooting

### "I don't see Approvals in sidebar"
**Check:**
- Are you logged in as CEO or Admin?
- Employees don't have Approvals
- Try logout and login again

### "Approvals page is empty"
**Check:**
- Are there any pending users?
- Create test user via /register
- Refresh the page

### "I'm Admin but see Admin requests"
**This is a BUG!**
- Admins should only see Employee requests
- Check your role in sidebar footer
- Report this issue

---

## 📞 Direct Links (After Login)

**CEO:**
- Dashboard: http://localhost:5173/dashboard
- Approvals: http://localhost:5173/dashboard/approvals ← **APPROVE ADMINS HERE**
- Colleges: http://localhost:5173/dashboard/colleges
- Companies: http://localhost:5173/dashboard/companies
- Metrics: http://localhost:5173/dashboard/metrics

**Admin:**
- Dashboard: http://localhost:5173/dashboard
- Approvals: http://localhost:5173/dashboard/approvals ← **APPROVE EMPLOYEES HERE**
- Team Logs: http://localhost:5173/dashboard/team-logs

**Employee:**
- Dashboard: http://localhost:5173/dashboard
- My Logs: http://localhost:5173/dashboard/logs

---

**Last Updated:** December 19, 2025  
**Status:** ✅ All Approval Locations Documented
