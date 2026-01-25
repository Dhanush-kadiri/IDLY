import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { profilesApi } from '@/db/api';
import type { Profile } from '@/types/types';
import { CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function Approvals() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [pendingUsers, setPendingUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadPendingUsers = async () => {
    setLoading(true);
    try {
      const data = await profilesApi.getPendingUsers();
      console.log('Pending users fetched:', data);
      
      if (profile?.system_role === 'CEO') {
        // CEO sees:
        // 1. Admin requests (no reports_to check needed)
        // 2. Employee requests where reports_to = CEO's ID
        const filtered = data.filter(u => 
          u.requested_role === 'ADMIN' || 
          (u.requested_role === 'EMPLOYEE' && u.reports_to === user?.id)
        );
        console.log('CEO filtered users:', filtered);
        setPendingUsers(filtered);
      } else if (profile?.system_role === 'ADMIN') {
        // Admin sees only Employee requests where reports_to = Admin's ID
        const filtered = data.filter(u => 
          u.requested_role === 'EMPLOYEE' && u.reports_to === user?.id
        );
        console.log('Admin filtered users:', filtered);
        setPendingUsers(filtered);
      } else {
        setPendingUsers([]);
      }
    } catch (error) {
      console.error('Error loading pending users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pending users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      loadPendingUsers();
    }
  }, [profile?.system_role]);

  const handleApprove = async (userId: string, requestedRole: string) => {
    if (!user) return;

    // CEO can only approve Admin requests
    if (profile?.system_role === 'CEO' && requestedRole !== 'ADMIN') {
      toast({
        title: 'Permission Denied',
        description: 'CEO can only approve Admin requests',
        variant: 'destructive',
      });
      return;
    }

    // Admin can only approve Employee requests
    if (profile?.system_role === 'ADMIN' && requestedRole !== 'EMPLOYEE') {
      toast({
        title: 'Permission Denied',
        description: 'Admins can only approve Employee requests',
        variant: 'destructive',
      });
      return;
    }

    setProcessingId(userId);
    const success = await profilesApi.approveUser(userId, requestedRole as any, user.id);
    
    if (success) {
      toast({
        title: 'Success',
        description: 'User approved successfully',
      });
      loadPendingUsers();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to approve user',
        variant: 'destructive',
      });
    }
    setProcessingId(null);
  };

  const handleReject = async (userId: string) => {
    setProcessingId(userId);
    const success = await profilesApi.rejectUser(userId);
    
    if (success) {
      toast({
        title: 'Success',
        description: 'User request rejected',
      });
      loadPendingUsers();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to reject user',
        variant: 'destructive',
      });
    }
    setProcessingId(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Pending Approvals</h1>
            <p className="text-muted-foreground">
              Review and approve user registration requests
            </p>
          </div>
          <Button 
            onClick={loadPendingUsers} 
            disabled={loading}
            variant="outline"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Requests</CardTitle>
            <CardDescription>
              {profile?.system_role === 'CEO' 
                ? 'Approve or reject Admin requests and Employee requests assigned to you'
                : profile?.system_role === 'ADMIN'
                ? 'Approve or reject Employee requests assigned to you'
                : 'No pending requests'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : pendingUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No pending approvals at this time
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Requested Role</TableHead>
                      <TableHead>Requested Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone || 'N/A'}</TableCell>
                        <TableCell>{user.title || 'N/A'}</TableCell>
                        <TableCell>
                          <StatusBadge status={user.requested_role} type="custom" />
                        </TableCell>
                        <TableCell>
                          {format(new Date(user.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(user.id, user.requested_role)}
                              disabled={processingId === user.id}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(user.id)}
                              disabled={processingId === user.id}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
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
    </DashboardLayout>
  );
}
