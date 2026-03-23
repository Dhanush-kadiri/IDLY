# InTouract's Daily Logger - Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying InTouract's Daily Logger application. The application is built with React + Vite + TypeScript and uses Supabase for backend services.

## Prerequisites

- Node.js 18+ installed
- pnpm or npm package manager
- Supabase account (free tier available)
- Git (for version control)

## Technology Stack

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **UI Components:** shadcn/ui with Radix UI
- **Styling:** Tailwind CSS
- **Backend/Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **State Management:** React Context API
- **Routing:** React Router v7
- **Form Handling:** React Hook Form with Zod validation
- **Date Handling:** date-fns

## Environment Setup

### 1. Supabase Configuration

The application is already configured with Supabase. The database schema has been created with the following structure:

#### Database Tables

- **profiles**: User profile information with role management
- **daily_logs**: Work log entries with soft delete support
- **colleges**: College/institution management
- **companies**: Company partnership management

#### Enums

- **user_role**: CEO, ADMIN, EMPLOYEE
- **user_status**: PENDING, ACTIVE, REJECTED
- **log_status**: IN_PROGRESS, COMPLETED, BLOCKED
- **onboard_status**: NOT_STARTED, IN_PROGRESS, COMPLETED

### 2. Environment Variables

The following environment variables are already configured in `.env`:

```
VITE_SUPABASE_URL=https://pphsrkwtberbijuobjwg.supabase.co
VITE_SUPABASE_ANON_KEY=[configured]
VITE_APP_ID=[configured]
```

**Note:** These are already set up and should not be modified unless deploying to a different Supabase project.

## Initial Setup

### 1. Install Dependencies

```bash
pnpm install
```

or

```bash
npm install
```

### 2. Database Initialization

The database schema has already been created via Supabase migrations. The following components are in place:

- All tables with proper indexes
- Row Level Security (RLS) policies
- Helper functions for role checking
- Triggers for user profile synchronization
- Views for public profile data

### 3. Create Initial CEO Account

**IMPORTANT:** The first user to register with the following credentials will become the CEO:

- **Email:** intouract.22@gmail.com
- **Password:** InTouract@1438

**Steps:**
1. Start the application (see Running Locally section)
2. Navigate to the registration page
3. Register with the CEO credentials above
4. Fill in all required fields
5. The account will be automatically created with CEO privileges

## Running Locally

### Development Mode

**Note:** The application uses a custom build system. Do not use `npm run dev` or `vite` directly.

### Validation and Testing

To validate the application:

```bash
npm run lint
```

This command will:
- Type-check all TypeScript files
- Run Biome linter
- Validate Tailwind CSS syntax
- Perform test build

## Deployment Options

### Option 1: Static Hosting (Recommended)

The application can be deployed to any static hosting service:

#### Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to configure your project

#### Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build the project:
```bash
npm run build
```

3. Deploy:
```bash
netlify deploy --prod
```

#### GitHub Pages

1. Update `vite.config.ts` with base path:
```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
})
```

2. Build and deploy:
```bash
npm run build
```

3. Deploy the `dist` folder to GitHub Pages

### Option 2: Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t intouract-logger .
docker run -p 80:80 intouract-logger
```

### Option 3: Traditional Web Server

1. Build the application:
```bash
npm run build
```

2. The built files will be in the `dist` directory

3. Configure your web server (Apache/Nginx) to serve the `dist` directory

4. Ensure proper routing for SPA:

**Nginx configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache configuration (.htaccess):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Post-Deployment Steps

### 1. Login as Default Admin

The default admin account is pre-created in the database. Simply log in:

**Default Admin Credentials:**
- Email: `intouract.22@gmail.com`
- Password: `InTouract@1438`
- Role: Admin (System Administrator)

**Steps:**
1. Navigate to `/login`
2. Enter the admin credentials
3. Click "Sign In"
4. Verify you have full admin access

**Important:** CEO is a superowner concept for system oversight. Users can register as Admin or Employee roles.

### 2. Test Core Functionality

1. **Authentication:**
   - Test login with default admin account
   - Test logout functionality

2. **User Management:**
   - Register a test Admin account
   - Approve the Admin account as an existing Admin
   - Register a test Employee account
   - Approve the Employee account as Admin

3. **Log Management:**
   - Create a test log entry
   - Edit the log entry
   - Delete the log entry

4. **College/Company Management:**
   - Add a test college
   - Add a test company
   - Verify CRUD operations work correctly

5. **Metrics Dashboard:**
   - Verify metrics are calculating correctly
   - Check inactive user tracking

### 3. Security Checklist

- [ ] Verify RLS policies are active on all tables
- [ ] Confirm only authenticated users can access protected routes
- [ ] Test role-based access control (CEO, Admin, Employee)
- [ ] Verify soft delete is working for logs
- [ ] Confirm email verification is disabled (as configured)

## Monitoring and Maintenance

### Database Monitoring

Monitor your Supabase dashboard for:
- Database size and usage
- API request counts
- Authentication metrics
- Error logs

### Application Monitoring

Consider implementing:
- Error tracking (e.g., Sentry)
- Analytics (e.g., Google Analytics, Plausible)
- Performance monitoring (e.g., Web Vitals)

### Backup Strategy

Supabase provides automatic backups, but consider:
- Regular database exports
- Backup of environment variables
- Version control for all code changes

## Troubleshooting

### Build Errors

If you encounter build errors:
1. Clear node_modules and reinstall:
```bash
rm -rf node_modules
pnpm install
```

2. Clear build cache:
```bash
rm -rf dist
```

3. Run lint to identify issues:
```bash
npm run lint
```

### Database Connection Issues

If the application cannot connect to Supabase:
1. Verify environment variables are set correctly
2. Check Supabase project status in dashboard
3. Verify API keys are valid and not expired
4. Check network connectivity

### Authentication Issues

If users cannot log in:
1. Verify Supabase Auth is enabled
2. Check email verification is disabled (as configured)
3. Verify user status is ACTIVE in profiles table
4. Check RLS policies allow user access

### Performance Issues

If the application is slow:
1. Check database indexes are in place
2. Monitor Supabase API usage
3. Optimize queries in db/api.ts
4. Consider implementing pagination for large datasets
5. Enable caching where appropriate

## Scaling Considerations

### Database Optimization

- Add indexes for frequently queried columns
- Implement query result caching
- Use database connection pooling
- Monitor and optimize slow queries

### Frontend Optimization

- Implement code splitting
- Use lazy loading for routes
- Optimize images and assets
- Enable compression (gzip/brotli)
- Use CDN for static assets

### Supabase Limits

Free tier limits:
- 500 MB database space
- 2 GB bandwidth per month
- 50,000 monthly active users

Consider upgrading to Pro tier for production use.

## Support and Resources

- **Supabase Documentation:** https://supabase.com/docs
- **React Documentation:** https://react.dev
- **Vite Documentation:** https://vitejs.dev
- **shadcn/ui Documentation:** https://ui.shadcn.com

## Version History

- **v1.0.0** (December 2025): Initial release
  - Complete authentication system
  - Role-based access control
  - Daily log management
  - College and company management
  - Metrics dashboard
  - Responsive design

---

For additional support or questions, please contact the development team.
