import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/dashboard/EmployeeDashboard';
import MyLogs from './pages/dashboard/MyLogs';
import TeamLogs from './pages/dashboard/TeamLogs';
import Approvals from './pages/dashboard/Approvals';
import UserManagement from './pages/dashboard/UserManagement';
import Colleges from './pages/dashboard/Colleges';
import Companies from './pages/dashboard/Companies';
import Metrics from './pages/dashboard/Metrics';
import NotFound from './pages/NotFound';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
  },
  {
    name: 'Register',
    path: '/register',
    element: <Register />,
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    element: <EmployeeDashboard />,
  },
  {
    name: 'My Logs',
    path: '/dashboard/logs',
    element: <MyLogs />,
  },
  {
    name: 'Team Logs',
    path: '/dashboard/team-logs',
    element: <TeamLogs />,
  },
  {
    name: 'Approvals',
    path: '/dashboard/approvals',
    element: <Approvals />,
  },
  {
    name: 'User Management',
    path: '/dashboard/users',
    element: <UserManagement />,
  },
  {
    name: 'Colleges',
    path: '/dashboard/colleges',
    element: <Colleges />,
  },
  {
    name: 'Companies',
    path: '/dashboard/companies',
    element: <Companies />,
  },
  {
    name: 'Metrics',
    path: '/dashboard/metrics',
    element: <Metrics />,
  },
  {
    name: 'Not Found',
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
