import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { dailyLogsApi } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import type { LogWithUser, LogStatus } from '@/types/types';
import { ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export default function TeamLogs() {
  const { user, profile } = useAuth();
  const [logs, setLogs] = useState<LogWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<{
    status?: LogStatus;
    startDate?: string;
    endDate?: string;
  }>({});

  const loadLogs = async () => {
    setLoading(true);
    // Admin should only see logs from employees who report to them
    const managerId = profile?.system_role === 'ADMIN' ? user?.id : undefined;
    const data = await dailyLogsApi.getAllLogs({ ...filters, managerId });
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    if (profile) {
      loadLogs();
    }
  }, [filters, profile]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Team Logs</h1>
          <p className="text-muted-foreground">View all team member work logs</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter logs by status and date range</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) =>
                    setFilters({ ...filters, status: value === 'all' ? undefined : (value as LogStatus) })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="BLOCKED">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value || undefined })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value || undefined })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Team Logs</CardTitle>
            <CardDescription>Complete history of team work logs</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No logs found matching the selected filters
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Links</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{log.user?.name || 'Unknown'}</p>
                            <p className="text-sm text-muted-foreground">{log.user?.email}</p>
                            {log.user?.title && (
                              <p className="text-xs text-muted-foreground">{log.user.title}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{log.title}</p>
                            {log.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {log.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={log.status} type="log" />
                        </TableCell>
                        <TableCell>
                          {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm')}
                        </TableCell>
                        <TableCell>
                          {log.links && log.links.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {log.links.slice(0, 2).map((link, idx) => (
                                <a
                                  key={idx}
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline text-sm flex items-center"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Link {idx + 1}
                                </a>
                              ))}
                              {log.links.length > 2 && (
                                <span className="text-sm text-muted-foreground">
                                  +{log.links.length - 2} more
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">No links</span>
                          )}
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
