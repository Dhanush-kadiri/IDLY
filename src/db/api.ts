import { supabase } from './supabase';
import type { Profile, DailyLog, College, Company, UserRole, UserStatus, LogStatus, OnboardStatus, DashboardMetrics, LogWithUser } from '@/types/types';

export const profilesApi = {
  async getPendingUsers(role?: UserRole): Promise<Profile[]> {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('status', 'PENDING')
        .order('created_at', { ascending: true });

      if (role) {
        query = query.eq('requested_role', role);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Failed to fetch pending users:', error);
        throw error;
      }
      
      console.log('getPendingUsers result:', data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error in getPendingUsers:', error);
      return [];
    }
  },

  async approveUser(userId: string, systemRole: UserRole, approvedBy: string): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update({
        system_role: systemRole,
        status: 'ACTIVE' as UserStatus,
        approved_at: new Date().toISOString(),
        approved_by: approvedBy,
      })
      .eq('id', userId);

    if (error) {
      console.error('Failed to approve user:', error);
      return false;
    }
    return true;
  },

  async rejectUser(userId: string): Promise<boolean> {
    try {
      // First, delete from auth.users using RPC function
      const { error: authError } = await supabase.rpc('delete_auth_user', {
        user_id: userId
      });

      if (authError) {
        console.error('Failed to delete auth user:', authError);
        // Continue anyway to update profile status
      }

      // Update profile status to REJECTED (will be deleted by CASCADE)
      const { error } = await supabase
        .from('profiles')
        .update({
          status: 'REJECTED' as UserStatus,
        })
        .eq('id', userId);

      if (error) {
        console.error('Failed to reject user:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Failed to reject user:', error);
      return false;
    }
  },

  async getAllActiveUsers(): Promise<Profile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: true});

      if (error) {
        console.error('Failed to fetch active users:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        throw error;
      }
      
      console.log('getAllActiveUsers result:', data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error in getAllActiveUsers:', error);
      return [];
    }
  },

  async getAllManagers(): Promise<Profile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'ACTIVE')
        .in('system_role', ['CEO', 'ADMIN'])
        .order('system_role', { ascending: false }) // CEO first, then ADMINs
        .order('name', { ascending: true });

      if (error) {
        console.error('Failed to fetch managers:', error);
        throw error;
      }
      
      console.log('getAllManagers result:', data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error in getAllManagers:', error);
      return [];
    }
  },

  async deleteUser(userId: string): Promise<boolean> {
    try {
      // First, delete from profiles (this will cascade to daily_logs)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error('Failed to delete profile:', profileError);
        return false;
      }

      // Then, delete from auth.users using RPC function
      const { error: authError } = await supabase.rpc('delete_auth_user', {
        user_id: userId
      });

      if (authError) {
        console.error('Failed to delete auth user:', authError);
        // Profile is already deleted, so we consider this a partial success
      }

      return true;
    } catch (error) {
      console.error('Failed to delete user:', error);
      return false;
    }
  },
};

export const dailyLogsApi = {
  async getUserLogs(userId: string, limit = 50, offset = 0): Promise<DailyLog[]> {
    const { data, error } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Failed to fetch user logs:', error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  },

  async getAllLogs(filters?: { status?: LogStatus; startDate?: string; endDate?: string; managerId?: string }, limit = 50, offset = 0): Promise<LogWithUser[]> {
    let query = supabase
      .from('daily_logs')
      .select(`
        *,
        user:profiles!daily_logs_user_id_fkey(name, email, title, reports_to)
      `)
      .eq('deleted', false);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate);
    }

    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate);
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch all logs:', error);
      return [];
    }
    
    // Filter by manager if specified (for Admins who should only see their team's logs)
    if (filters?.managerId && Array.isArray(data)) {
      return data.filter(log => log.user?.reports_to === filters.managerId);
    }
    
    return Array.isArray(data) ? data : [];
  },

  async createLog(log: Omit<DailyLog, 'id' | 'created_at' | 'updated_at' | 'deleted'>): Promise<DailyLog | null> {
    const { data, error } = await supabase
      .from('daily_logs')
      .insert({
        user_id: log.user_id,
        title: log.title,
        description: log.description || null,
        status: log.status,
        links: log.links || [],
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error('Failed to create log:', error);
      return null;
    }
    return data;
  },

  async updateLog(logId: string, updates: Partial<Pick<DailyLog, 'title' | 'description' | 'status' | 'links'>>): Promise<boolean> {
    const { error } = await supabase
      .from('daily_logs')
      .update(updates)
      .eq('id', logId);

    if (error) {
      console.error('Failed to update log:', error);
      return false;
    }
    return true;
  },

  async deleteLog(logId: string): Promise<boolean> {
    const { error } = await supabase
      .from('daily_logs')
      .update({ deleted: true })
      .eq('id', logId);

    if (error) {
      console.error('Failed to delete log:', error);
      return false;
    }
    return true;
  },

  async getLogById(logId: string): Promise<DailyLog | null> {
    const { data, error } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('id', logId)
      .eq('deleted', false)
      .maybeSingle();

    if (error) {
      console.error('Failed to fetch log:', error);
      return null;
    }
    return data;
  },
};

export const collegesApi = {
  async getAll(): Promise<College[]> {
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch colleges:', error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  },

  async create(college: Omit<College, 'id' | 'created_at' | 'updated_at'>): Promise<College | null> {
    const { data, error } = await supabase
      .from('colleges')
      .insert({
        name: college.name,
        status: college.status || null,
        onboard_status: college.onboard_status,
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error('Failed to create college:', error);
      return null;
    }
    return data;
  },

  async update(id: string, updates: Partial<Pick<College, 'name' | 'status' | 'onboard_status'>>): Promise<boolean> {
    const { error } = await supabase
      .from('colleges')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Failed to update college:', error);
      return false;
    }
    return true;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('colleges')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete college:', error);
      return false;
    }
    return true;
  },
};

export const companiesApi = {
  async getAll(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch companies:', error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  },

  async create(company: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .insert({
        name: company.name,
        status: company.status || null,
        onboard_status: company.onboard_status,
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error('Failed to create company:', error);
      return null;
    }
    return data;
  },

  async update(id: string, updates: Partial<Pick<Company, 'name' | 'status' | 'onboard_status'>>): Promise<boolean> {
    const { error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Failed to update company:', error);
      return false;
    }
    return true;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete company:', error);
      return false;
    }
    return true;
  },
};

export const dashboardApi = {
  async getMetrics(daysInactive = 7): Promise<DashboardMetrics> {
    const [colleges, companies, activeUsers, todayLogs] = await Promise.all([
      collegesApi.getAll(),
      companiesApi.getAll(),
      profilesApi.getAllActiveUsers(),
      supabase
        .from('daily_logs')
        .select('user_id')
        .eq('deleted', false)
        .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
        .then(({ data }) => data || []),
    ]);

    const collegeStats = {
      total: colleges.length,
      byStatus: colleges.reduce((acc, c) => {
        const status = c.status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byOnboardStatus: colleges.reduce((acc, c) => {
        acc[c.onboard_status] = (acc[c.onboard_status] || 0) + 1;
        return acc;
      }, {} as Record<OnboardStatus, number>),
    };

    const companyStats = {
      total: companies.length,
      byStatus: companies.reduce((acc, c) => {
        const status = c.status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byOnboardStatus: companies.reduce((acc, c) => {
        acc[c.onboard_status] = (acc[c.onboard_status] || 0) + 1;
        return acc;
      }, {} as Record<OnboardStatus, number>),
    };

    const uniqueSubmitters = new Set(todayLogs.map(log => log.user_id));
    const submissionRate = {
      submitted: uniqueSubmitters.size,
      total: activeUsers.length,
      percentage: activeUsers.length > 0 ? (uniqueSubmitters.size / activeUsers.length) * 100 : 0,
    };

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysInactive);

    const userLastSubmissions = await Promise.all(
      activeUsers.map(async user => {
        const { data } = await supabase
          .from('daily_logs')
          .select('created_at')
          .eq('user_id', user.id)
          .eq('deleted', false)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        return {
          user,
          lastSubmission: data?.created_at || null,
        };
      })
    );

    const inactiveUsers = userLastSubmissions
      .filter(({ lastSubmission }) => {
        if (!lastSubmission) return true;
        return new Date(lastSubmission) < cutoffDate;
      })
      .map(({ user, lastSubmission }) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        lastSubmission,
        daysSinceLastSubmission: lastSubmission
          ? Math.floor((Date.now() - new Date(lastSubmission).getTime()) / (1000 * 60 * 60 * 24))
          : null,
      }))
      .sort((a, b) => {
        if (a.daysSinceLastSubmission === null) return 1;
        if (b.daysSinceLastSubmission === null) return -1;
        return b.daysSinceLastSubmission - a.daysSinceLastSubmission;
      });

    return {
      collegeStats,
      companyStats,
      submissionRate,
      inactiveUsers,
    };
  },
};
