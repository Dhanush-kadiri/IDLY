export type UserRole = 'CEO' | 'ADMIN' | 'EMPLOYEE';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'REJECTED';
export type LogStatus = 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
export type OnboardStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  requested_role: UserRole;
  system_role: UserRole | null;
  status: UserStatus;
  title: string | null;
  approved_at: string | null;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface DailyLog {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: LogStatus;
  links: string[];
  deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface College {
  id: string;
  name: string;
  status: string | null;
  onboard_status: OnboardStatus;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  status: string | null;
  onboard_status: OnboardStatus;
  created_at: string;
  updated_at: string;
}

export interface DashboardMetrics {
  collegeStats: {
    total: number;
    byStatus: Record<string, number>;
    byOnboardStatus: Record<OnboardStatus, number>;
  };
  companyStats: {
    total: number;
    byStatus: Record<string, number>;
    byOnboardStatus: Record<OnboardStatus, number>;
  };
  submissionRate: {
    submitted: number;
    total: number;
    percentage: number;
  };
  inactiveUsers: Array<{
    id: string;
    name: string | null;
    email: string;
    lastSubmission: string | null;
    daysSinceLastSubmission: number | null;
  }>;
}

export interface LogWithUser extends DailyLog {
  user?: {
    name: string | null;
    email: string;
    title: string | null;
  };
}
