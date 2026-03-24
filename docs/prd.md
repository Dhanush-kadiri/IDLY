# Requirements Document

## 1. Application Overview

### 1.1 Application Name
IDLY - InTouract's Daily Logger

### 1.2 Application Description
A production-grade internal work update and onboarding management system supporting employee log submission, multi-level approval workflows, role-based access control, and a CEO management panel. Deployable on the Replit platform.

## 2. Core Features

### 2.1 User Authentication System
- User Registration: email, password, name, phone, requested role, job title
- Admin Registration: email, password, name, phone, job title; requested role is Admin
- Employee Registration: email, password, name, phone, job title; requested role is Employee; must select a Reporting To target (CEO, COO, CTO, etc.)
- User Login: email and password verification; only ACTIVE users may log in
- Logout: clears authentication cookie
- Password Encryption: bcrypt
- Session Management: JWT stored in HttpOnly Cookie

### 2.2 Role & Permission Management
- Role Types: CEO, COO, CTO, Admin, Employee
- User Status: PENDING, ACTIVE, REJECTED
- Approval Flow:
  - Admin applications require CEO approval
  - Employee applications are routed to the selected Reporting To target only
  - Upon approval, systemRole is set and account is activated
- Permission Isolation:
  - Each senior management role (CEO, COO, CTO, etc.) can only view and approve Employees who selected them as their Reporting To
  - Management roles not selected as Reporting To cannot see that Employee's approval request or logs
- Initial CEO Account:
  - Email: intouract.22@gmail.com
  - Password: InTouract@1438
  - Created via seed script with status ACTIVE

### 2.3 Log Management System
- Employee Log Submission: title, description, status (In Progress / Completed / Blocked), links list
- Log Viewing: users view their own log history
- Log Edit/Delete: restricted to the log owner
- Management Role Log Viewing: each management role can only view logs of Employees who report to them; supports filtering by date and status
- Soft Delete: deletion marks deleted=true

### 2.4 CEO Management Panel
- Approval Management: view and process pending Admin applications and Employee applications where Reporting To = CEO
- Log Management: submit and view own work logs; view logs of Employees reporting to CEO
- College Management (CRUD):
  - Name
  - Address
  - SPOC Name
  - SPOC Contact
  - SPOC Mail ID
  - SPOC from InTouract - Name
  - SPOC from InTouract - Number
  - SPOC from InTouract - Mail
  - Duration of the MoU
  - Status
  - Description
- Company Management (CRUD):
  - Name
  - Address
  - SPOC Name
  - SPOC Contact
  - SPOC Mail ID
  - SPOC from InTouract - Name
  - SPOC from InTouract - Number
  - SPOC from InTouract - Mail
  - Duration of the MoU
  - Status
  - Description
- Overview Dashboard:
  - College/Company count statistics (by status)
  - Today's submission rate (submitted users / total active users reporting to CEO)
  - Non-submitting users list (users who have not submitted logs in the last N days, reporting to CEO only)

### 2.5 COO/CTO and Other Senior Management Panels
- Approval Management: view and process Employee applications where Reporting To = this role
- Team Logs: view logs of Employees reporting to this role; supports filtering by date and status
- Personal Logs: submit and manage own work logs
- Overview Dashboard:
  - Today's submission rate (submitted users / total active users reporting to this role)
  - Non-submitting users list (users who have not submitted logs in the last N days, reporting to this role only)

### 2.6 Admin Management Panel
- Approval Management: view and process Employee applications where Reporting To = Admin
- Team Logs: view logs of Employees reporting to this Admin; supports filtering by date and status
- Personal Logs: submit and manage own work logs

### 2.7 Employee Panel
- Profile: view personal information
- Log Management: submit, view, edit, and delete own work logs

## 3. Database Design

### 3.1 Data Models
- User: id, email, password, name, phone, requestedRole, systemRole, status, title, reportingTo, approvedAt, etc.
  - reportingTo: stores the role the Employee selected as their reporting target (CEO, COO, CTO, etc.); required for Employee role only
- DailyLog: id, userId, title, description, status, links (array), deleted, createdAt, etc.
- College: id, name, address, spocName, spocContact, spocMailId, spocInTouractName, spocInTouractNumber, spocInTouractMail, mouDuration, status, description, onboardStatus, createdAt, etc.
- Company: id, name, address, spocName, spocContact, spocMailId, spocInTouractName, spocInTouractNumber, spocInTouractMail, mouDuration, status, description, onboardStatus, createdAt, etc.

### 3.2 Enum Types
- Role: CEO, COO, CTO, ADMIN, EMPLOYEE
- Status: PENDING, ACTIVE, REJECTED
- LogStatus: IN_PROGRESS, COMPLETED, BLOCKED
- OnboardStatus: NOT_STARTED, IN_PROGRESS, COMPLETED
- ReportingTo: CEO, COO, CTO (selectable during Employee registration)

## 4. API Endpoints

### 4.1 Authentication
- POST /api/auth/register — user registration (Employee must include reportingTo)
- POST /api/auth/login — user login
- POST /api/auth/logout — user logout
- GET /api/users/me — get current user info

### 4.2 User Management
- GET /api/users/pending — get pending users (filtered by current user role and reportingTo)
- POST /api/users/approve — approve user (only Employees/Admins reporting to current user)
- POST /api/users/reject — reject user application

### 4.3 Logs
- GET /api/daily-log — get log list (filtered by role and reportingTo relationship)
- POST /api/daily-log — create log
- PUT /api/daily-log/[id] — update log
- DELETE /api/daily-log/[id] — soft delete log

### 4.4 College Management (CEO only)
- GET /api/colleges — get college list
- POST /api/colleges — create college (name, address, spocName, spocContact, spocMailId, spocInTouractName, spocInTouractNumber, spocInTouractMail, mouDuration, status, description)
- PUT /api/colleges/[id] — update college
- DELETE /api/colleges/[id] — delete college

### 4.5 Company Management (CEO only)
- GET /api/companies — get company list
- POST /api/companies — create company (name, address, spocName, spocContact, spocMailId, spocInTouractName, spocInTouractNumber, spocInTouractMail, mouDuration, status, description)
- PUT /api/companies/[id] — update company
- DELETE /api/companies/[id] — delete company

### 4.6 Dashboard
- GET /api/dashboard/metrics — get dashboard metrics (filtered by role and reportingTo relationship)

## 5. Frontend Pages

### 5.1 Public Pages
- / (Home): shows login/register entry for unauthenticated users; redirects authenticated users to their role dashboard
- /register: registration page (Employee must select Reporting To)
- /login: login page

### 5.2 CEO Dashboard (/dashboard/ceo)
- Approval Panel: pending Admin and CEO-reporting Employee list
- Log Panel: CEO personal log submission form and history; CEO-reporting Employee logs
- College Management Panel: college list, CRUD operations, status filter; add/edit form includes all fields listed in Section 2.4
- Company Management Panel: company list, CRUD operations, status filter; add/edit form includes all fields listed in Section 2.4
- Overview Panel: statistics and non-submitting user list (CEO-reporting users only)

### 5.3 COO/CTO Senior Management Dashboards (/dashboard/coo or /dashboard/cto)
- Approval Panel: Employee list reporting to this role
- Team Log Panel: logs of Employees reporting to this role; date and status filters
- Personal Log Panel: own log submission and history
- Overview Panel: statistics and non-submitting user list (this role's reporting users only)

### 5.4 Admin Dashboard (/dashboard/admin)
- Approval Panel: Employee list reporting to Admin
- Team Log Panel: logs of Employees reporting to Admin; date and status filters
- Personal Log Panel: Admin's own log submission and history

### 5.5 Employee Dashboard (/dashboard)
- Profile: display user information
- Log Management: log submission form and history table

### 5.6 Shared Components
- Sidebar: role-aware sidebar navigation; displays the IDLY logo (intouract logo.jpg, URL: https://miaoda-conversation-file.s3cdn.medo.dev/user-8c7cvevbxo8w/conv-8c7cxlsojcw0/20260324/file-ahel4nrto3cw.jpg) at the top
- Topbar: top bar with user dropdown and logout button; displays the IDLY logo on mobile or when sidebar is collapsed
- LogForm: log submission/edit modal
- Table: table component with server-side pagination
- CollegeForm / CompanyForm: college/company add and edit modals with all required fields

## 6. Logo Usage
- Logo file name: intouract logo.jpg
- Logo URL: https://miaoda-conversation-file.s3cdn.medo.dev/user-8c7cvevbxo8w/conv-8c7cxlsojcw0/20260324/file-ahel4nrto3cw.jpg
- Usage: display the IDLY logo prominently in the Sidebar header area and in the Topbar; also display on the /login and /register pages above the form

## 7. Security & Permissions

### 7.1 Server-Side Validation
- All API routes must validate JWT and user role
- Users can only operate on their own logs
- CEO-exclusive features (college/company management) require CEO role verification
- Approval and log viewing permissions require reportingTo relationship validation

### 7.2 Frontend Security
- Include credentials in fetch calls to pass cookies
- Use Zod for form validation
- Disable UI action buttons based on permissions
- Display friendly empty-state messages

### 7.3 Password Security
- bcrypt password hashing with SALT_ROUNDS=10
- CEO is recommended to change password after first login
- Password change functionality implemented

## 8. Deployment Configuration

### 8.1 Environment Variables
- DATABASE_URL: Supabase PostgreSQL connection string
- JWT_SECRET: JWT signing key
- CEO_EMAIL: intouract.22@gmail.com
- CEO_PASSWORD: InTouract@1438
- SALT_ROUNDS: 10
- NEXT_PUBLIC_APP_NAME: InTouract
- NODE_ENV: production

### 8.2 Database Migration & Seed Data
- Use Prisma Migrate for database migrations
- Seed script creates only the CEO account (reads email and password from environment variables)
- Post-deployment commands: npx prisma migrate deploy && ts-node prisma/seed.ts

### 8.3 Replit Deployment Steps
1. Create a new Repl (import repository or create from generated code)
2. Add all environment variables in Replit Secrets
3. Run npm ci or pnpm install
4. Run npx prisma migrate deploy
5. Run ts-node prisma/seed.ts
6. Start the Repl or click Deploy; the app will be accessible at the Repl's public URL

### 8.4 package.json Scripts
- dev: next dev -p 3000
- build: next build
- start: next start -p 3000
- prisma:migrate: prisma migrate deploy
- prisma:seed: ts-node prisma/seed.ts

## 9. Data Constraints

### 9.1 Seed Data
- Contains only one CEO account (email: intouract.22@gmail.com, password: InTouract@1438)
- No mock users or sample logs
- CEO account status is ACTIVE, systemRole is CEO

### 9.2 Data Persistence
- All data must be persisted via the database
- In-memory mock data is prohibited

### 9.3 Feature Restrictions
- No task assignment functionality
- Admin promotion must be performed by CEO
- Employee activation must be performed by their selected Reporting To target
- Management roles can only access data of Employees who report to them

## 10. Testing Requirements

### 10.1 Unit Tests
- Authentication flow: registration → CEO approves Admin → Admin approves Employee
- Reporting relationship: Employee selects COO → only COO sees approval request and logs

### 10.2 Integration Tests
- Employee creates log → their Reporting To target views the log
- Permission isolation: CEO cannot view logs of Employees reporting to COO

## 11. Design Style

- Color Scheme: professional enterprise palette; primary color deep blue (#1E40AF), secondary light gray (#F3F4F6) and white, accent green (#10B981) for success states
- Layout: classic admin layout with fixed sidebar and scrollable main content area
- Visual Details: medium border radius (8px), card-style design with subtle shadows, solid fill buttons, zebra-striped tables for readability
- Interaction Feedback: button hover darkens color, form validation errors shown in red, successful actions trigger green Toast notifications
- Logo: IDLY logo (intouract logo.jpg) displayed in the sidebar header, topbar, and authentication pages

## 12. Out of Scope
- Task assignment functionality
- Any mock or demo data beyond the initial CEO seed account
- Extended role types beyond CEO, COO, CTO, Admin, Employee