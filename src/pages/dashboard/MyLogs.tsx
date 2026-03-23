import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LogForm } from '@/components/dashboard/LogForm';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { dailyLogsApi } from '@/db/api';
import type { DailyLog } from '@/types/types';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function MyLogs() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<DailyLog | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingLogId, setDeletingLogId] = useState<string | null>(null);

  const loadLogs = async () => {
    if (!user) return;
    setLoading(true);
    const data = await dailyLogsApi.getUserLogs(user.id);
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, [user]);

  const handleEdit = (log: DailyLog) => {
    setEditingLog(log);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingLogId) return;

    const success = await dailyLogsApi.deleteLog(deletingLogId);
    if (success) {
      toast({
        title: 'Success',
        description: 'Log deleted successfully',
      });
      loadLogs();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete log',
        variant: 'destructive',
      });
    }
    setDeleteDialogOpen(false);
    setDeletingLogId(null);
  };

  const openDeleteDialog = (logId: string) => {
    setDeletingLogId(logId);
    setDeleteDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Work Logs</h1>
          <p className="text-muted-foreground">Manage your daily work activities</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All My Logs</CardTitle>
                <CardDescription>Your complete work log history</CardDescription>
              </div>
              <Button onClick={() => { setEditingLog(undefined); setFormOpen(true); }}>
                <Plus className="mr-2 h-4 w-4" />
                New Log
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No logs yet. Create your first log to get started!
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Links</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{log.title}</p>
                            {log.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {log.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={log.status} type="log" />
                        </TableCell>
                        <TableCell>
                          {format(new Date(log.created_at), 'MMM dd, yyyy')}
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
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(log)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(log.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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

      <LogForm
        open={formOpen}
        onOpenChange={setFormOpen}
        log={editingLog}
        onSuccess={loadLogs}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your log entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
