# Welcome to Your Miaoda Project
Miaoda Application Link URL
    URL:https://medo.dev/projects/app-8c7cxlsojcw1

# InTouract's Daily Logger

> A production-grade internal work management system with multi-role authentication, approval workflows, and comprehensive team collaboration features.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Security](#security)
- [Support](#support)

## 🎯 Overview

InTouract's Daily Logger is a comprehensive internal work management system designed for organizations that need:

- **Daily Work Logging**: Track team member activities and progress
- **Multi-Level Approvals**: Structured approval workflow for new users
- **Role-Based Access**: Three distinct user roles with appropriate permissions
- **Team Collaboration**: View and monitor team activities
- **Organization Management**: Track colleges and company partnerships
- **Analytics Dashboard**: Monitor team productivity and engagement

## ✨ Features

### Core Functionality

- ✅ **User Authentication**: Secure email/password authentication via Supabase
- ✅ **Role Management**: CEO, Admin, and Employee roles with distinct permissions
- ✅ **Approval Workflow**: Multi-level approval system for new user registrations
- ✅ **Daily Logs**: Create, edit, delete, and view work log entries
- ✅ **Team Monitoring**: Admin and CEO can view all team member logs
- ✅ **College Management**: CEO can manage college partnerships (CRUD operations)
- ✅ **Company Management**: CEO can manage company partnerships (CRUD operations)
- ✅ **Metrics Dashboard**: Track submission rates, inactive users, and statistics
- ✅ **Responsive Design**: Desktop-first design with mobile adaptation
- ✅ **Professional UI**: Enterprise-grade interface with shadcn/ui components

### Technical Features

- ✅ **Type Safety**: Full TypeScript implementation
- ✅ **Database Security**: Row Level Security (RLS) policies
- ✅ **Soft Delete**: Non-destructive deletion for audit trails
- ✅ **Real-time Auth**: Automatic session management
- ✅ **Form Validation**: Zod schema validation
- ✅ **Error Handling**: User-friendly error messages with toast notifications
- ✅ **Loading States**: Proper loading indicators throughout
- ✅ **Empty States**: Helpful messages when no data is available

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- pnpm or npm package manager

### Installation

```bash
# Install dependencies
pnpm install

# Verify setup
npm run lint
```

### First-Time Setup

**Login as CEO:**

The CEO account is pre-created in the system with complete oversight ("eyes on all").

- **Email:** `intouract.22@gmail.com`
- **Password:** `InTouract@1438`
- **Role:** CEO (Superowner)

**Role Hierarchy:**
- **CEO** → Approves Admins, views all data, manages system
- **Admin** → Approves Employees, views team logs
- **Employee** → Manages own logs only

**Note:** Users can register as Admin or Employee. CEO cannot be registered (pre-created superowner).

For detailed setup instructions, see [QUICKSTART.md](./QUICKSTART.md) and [ROLE_BASED_ACCESS.md](./ROLE_BASED_ACCESS.md)

## 📚 Documentation

- **[Role-Based Access Guide](./ROLE_BASED_ACCESS.md)** - Complete role hierarchy and permissions
- **[Quick Start Guide](./QUICKSTART.md)** - Get up and running in 5 minutes
- **[User Guide](./USER_GUIDE.md)** - Complete user documentation
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment instructions
- **[Project Summary](./PROJECT_SUMMARY.md)** - Technical architecture and features
- **[Implementation Plan](./TODO.md)** - Development tracking and progress

## 🛠 Tech Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS 3.4
- **Routing**: React Router v7
- **State Management**: React Context API
- **Form Handling**: React Hook Form + Zod
- **Date Utilities**: date-fns

### Backend

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API Layer**: Custom TypeScript wrapper
- **Security**: Row Level Security (RLS)

### Development Tools

- **Type Checking**: TypeScript 5.9
- **Linting**: Biome
- **CSS Processing**: PostCSS + Autoprefixer

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Shared components (RouteGuard, PageMeta)
│   ├── dashboard/       # Dashboard-specific components
│   ├── layout/          # Layout components (Sidebar, Topbar)
│   └── ui/              # shadcn/ui component library
├── contexts/
│   └── AuthContext.tsx  # Authentication context
├── db/
│   ├── api.ts           # Database API layer
│   └── supabase.ts      # Supabase client configuration
├── pages/
│   ├── dashboard/       # Dashboard pages (by role)
│   ├── Login.tsx        # Login page
│   ├── Register.tsx     # Registration page
│   └── NotFound.tsx     # 404 page
├── types/
│   └── types.ts         # TypeScript type definitions
├── App.tsx              # Main application component
├── routes.tsx           # Route configuration
└── index.css            # Global styles and design system
```

## 👥 User Roles

### 🔵 CEO (Chief Executive Officer)

**Full system access with capabilities:**
- Approve/reject Admin and Employee requests
- View all team logs
- Manage personal logs
- Manage colleges and companies
- View comprehensive metrics

### 🟢 Admin (Administrator)

**Team management with capabilities:**
- Approve/reject Employee requests
- View all employee logs
- Manage personal logs
- Filter and monitor team activity

### 🟡 Employee

**Personal work management with capabilities:**
- Create and manage personal logs
- View personal profile
- Track personal work history

## 🔒 Security

### Authentication

- Secure password hashing via Supabase Auth
- Session management with automatic refresh
- Protected routes with role-based access

### Authorization

- Row Level Security (RLS) policies at database level
- Role-based access control throughout the application
- Users can only modify their own data
- Admin/CEO oversight capabilities

### Data Protection

- Soft delete for audit trails
- No direct database access from frontend
- API-level permission checks
- Secure environment variable management

## 🎨 Design System

### Color Palette

- **Primary**: Deep Blue (#1E40AF) - Professional and trustworthy
- **Secondary**: Light Gray - Clean and modern
- **Accent**: Success Green (#10B981) - Positive actions
- **Destructive**: Error Red - Warnings and errors

### UI Principles

- Card-based layouts with subtle shadows
- Consistent 8px border radius
- Hover states on interactive elements
- Clear visual hierarchy
- Responsive design (desktop-first)

## 📊 Database Schema

### Tables

- **profiles**: User information and role management
- **daily_logs**: Work log entries with soft delete
- **colleges**: College partnership records
- **companies**: Company partnership records

### Enums

- **user_role**: CEO, ADMIN, EMPLOYEE
- **user_status**: PENDING, ACTIVE, REJECTED
- **log_status**: IN_PROGRESS, COMPLETED, BLOCKED
- **onboard_status**: NOT_STARTED, IN_PROGRESS, COMPLETED

## 🧪 Development

### Code Quality

```bash
# Run linter and type checking
npm run lint
```

### Environment Variables

The application is pre-configured with:
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `VITE_APP_ID`: Application identifier

## 🚢 Deployment

The application is production-ready and can be deployed to:

- **Vercel** (Recommended)
- **Netlify**
- **GitHub Pages**
- **Docker**
- **Traditional Web Servers** (Apache/Nginx)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📝 License

This project is proprietary software developed for InTouract.

## 🤝 Support

For technical support or questions:

1. Check the documentation files in this repository
2. Contact your system administrator
3. Reach out to the InTouract development team

## 🎯 Project Status

✅ **Complete and Production-Ready**

All features from the original specification have been implemented and tested:
- ✅ Authentication and authorization
- ✅ User management and approvals
- ✅ Daily log management
- ✅ Team collaboration features
- ✅ College and company management
- ✅ Metrics and analytics
- ✅ Responsive design
- ✅ Security implementation

## 📈 Version History

- **v1.0.0** (December 2025): Initial release
  - Complete authentication system
  - Role-based access control
  - Daily log management
  - College and company management
  - Metrics dashboard
  - Professional UI design

---

**Built with ❤️ for InTouract**

For more information, see the complete documentation in the repository.
#   I D L Y  
 