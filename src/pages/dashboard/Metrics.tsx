import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { dashboardApi } from '@/db/api';
import type { DashboardMetrics } from '@/types/types';
import { Building2, GraduationCap, TrendingUp, Users } from 'lucide-react';

export default function Metrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMetrics = async () => {
    setLoading(true);
    const data = await dashboardApi.getMetrics(7);
    setMetrics(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8 text-muted-foreground">Loading metrics...</div>
      </DashboardLayout>
    );
  }

  if (!metrics) {
    return (
      <DashboardLayout>
        <div className="text-center py-8 text-muted-foreground">Failed to load metrics</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Metrics Dashboard</h1>
          <p className="text-muted-foreground">Overview of key performance indicators</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Colleges</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.collegeStats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {Object.keys(metrics.collegeStats.byStatus).length} status categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.companyStats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {Object.keys(metrics.companyStats.byStatus).length} status categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Submission Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.submissionRate.percentage.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.submissionRate.submitted} of {metrics.submissionRate.total} users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.inactiveUsers.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                No logs in last 7 days
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>College Statistics</CardTitle>
              <CardDescription>Breakdown by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(metrics.collegeStats.byStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{status}</span>
                    <span className="text-sm text-muted-foreground">{count}</span>
                  </div>
                ))}
                {Object.keys(metrics.collegeStats.byStatus).length === 0 && (
                  <p className="text-sm text-muted-foreground">No colleges yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company Statistics</CardTitle>
              <CardDescription>Breakdown by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(metrics.companyStats.byStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{status}</span>
                    <span className="text-sm text-muted-foreground">{count}</span>
                  </div>
                ))}
                {Object.keys(metrics.companyStats.byStatus).length === 0 && (
                  <p className="text-sm text-muted-foreground">No companies yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inactive Users</CardTitle>
            <CardDescription>Users who haven't submitted logs in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.inactiveUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                All users are active! 🎉
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Last Submission</TableHead>
                      <TableHead>Days Inactive</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metrics.inactiveUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.lastSubmission 
                            ? new Date(user.lastSubmission).toLocaleDateString()
                            : 'Never'}
                        </TableCell>
                        <TableCell>
                          {user.daysSinceLastSubmission !== null 
                            ? `${user.daysSinceLastSubmission} days`
                            : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
