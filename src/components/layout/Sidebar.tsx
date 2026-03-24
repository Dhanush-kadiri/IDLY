import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, FileText, Users, Building2, GraduationCap, BarChart3, UserCog } from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: ('CEO' | 'ADMIN' | 'EMPLOYEE')[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['CEO', 'ADMIN', 'EMPLOYEE'],
  },
  {
    title: 'My Logs',
    href: '/dashboard/logs',
    icon: FileText,
    roles: ['CEO', 'ADMIN', 'EMPLOYEE'],
  },
  {
    title: 'Team Logs',
    href: '/dashboard/team-logs',
    icon: FileText,
    roles: ['CEO', 'ADMIN'],
  },
  {
    title: 'Approvals',
    href: '/dashboard/approvals',
    icon: Users,
    roles: ['CEO', 'ADMIN'],
  },
  {
    title: 'User Management',
    href: '/dashboard/users',
    icon: UserCog,
    roles: ['CEO', 'ADMIN'],
  },
  {
    title: 'Colleges',
    href: '/dashboard/colleges',
    icon: GraduationCap,
    roles: ['CEO'],
  },
  {
    title: 'Companies',
    href: '/dashboard/companies',
    icon: Building2,
    roles: ['CEO'],
  },
  {
    title: 'Metrics',
    href: '/dashboard/metrics',
    icon: BarChart3,
    roles: ['CEO'],
  },
];

export function Sidebar() {
  const location = useLocation();
  const { profile } = useAuth();

  const filteredNavItems = navItems.filter(item => 
    profile?.system_role && item.roles.includes(profile.system_role)
  );

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <Link to="/dashboard" className="flex items-center space-x-3">
          <img 
            src="/assets/intouract-logo.jpg" 
            alt="InTouract Logo" 
            className="h-10 w-10 rounded-lg object-cover"
          />
          <div className="flex flex-col">
            <span className="font-bold text-base leading-tight">IDLY</span>
            <span className="text-xs text-muted-foreground leading-tight">Daily Logger</span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <div className="text-xs text-muted-foreground">
          <div className="font-medium text-foreground">{profile?.name || 'User'}</div>
          <div>{profile?.email}</div>
          <div className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-primary">
            {profile?.system_role || profile?.requested_role}
          </div>
        </div>
      </div>
    </div>
  );
}
