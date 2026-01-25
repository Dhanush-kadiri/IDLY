import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { profilesApi } from '@/db/api';
import type { Profile } from '@/types/types';
import { Trash2, Shield, User } from 'lucide-react';
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

export default function UserManagement() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<Profile | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      console.log('Loading users...');
      const data = await profilesApi.getAllActiveUsers();
      console.log('Users loaded:', data);
      console.log('Current profile:', profile);
      
      // Filter based on role
      if (profile?.system_role === 'CEO') {
        // CEO sees all users except themselves
        const filtered = data.filter(u => u.id !== user?.id);
        console.log('CEO filtered users:', filtered);
        setUsers(filtered);
      } else if (profile?.system_role === 'ADMIN') {
        // Admin sees only Employees who report to them
        const filtered = data.filter(u => 
          u.system_role === 'EMPLOYEE' && u.reports_to === user?.id
        );
        console.log('Admin filtered users (reporting to them):', filtered);
        setUsers(filtered);
      } else {
        console.log('No role match, setting empty');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [profile]);

  const handleDeleteClick = (userToDelete: Profile) => {
    // Check permissions
    if (profile?.system_role === 'ADMIN' && userToDelete.system_role !== 'EMPLOYEE') {
      toast({
        title: 'Permission Denied',
        description: 'Admins can only delete Employees',
        variant: 'destructive',
      });
      return;
    }

    if (profile?.system_role === 'CEO' && userToDelete.system_role === 'CEO') {
      toast({
        title: 'Cannot Delete',
        description: 'Cannot delete CEO account',
        variant: 'destructive',
      });
      return;
    }

    setDeletingUser(userToDelete);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;

    setProcessingId(deletingUser.id);
    const success = await profilesApi.deleteUser(deletingUser.id);
    
    if (success) {
      toast({
        title: 'Success',
        description: `User ${deletingUser.name} has been deleted`,
      });
      loadUsers();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    }
    
    setProcessingId(null);
    setDeleteDialogOpen(false);
    setDeletingUser(null);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'CEO':
        return <Shield className="h-4 w-4 text-purple-500" />;
      case 'ADMIN':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'EMPLOYEE':
        return <User className="h-4 w-4 text-green-500" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const canDeleteUser = (userToCheck: Profile) => {
    if (profile?.system_role === 'CEO') {
      return userToCheck.system_role !== 'CEO';
    }
    if (profile?.system_role === 'ADMIN') {
      return userToCheck.system_role === 'EMPLOYEE';
    }
    return false;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            {profile?.system_role === 'CEO' 
              ? 'Manage all Admins and Employees'
              : 'Manage Employees'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
            <CardDescription>
              {profile?.system_role === 'CEO' 
                ? 'You can delete Admins and Employees'
                : 'You can delete Employees only'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No users found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((userItem) => (
                      <TableRow key={userItem.id}>
                        <TableCell className="font-medium">{userItem.name}</TableCell>
                        <TableCell>{userItem.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getRoleIcon(userItem.system_role || userItem.requested_role)}
                            <span className="font-medium">
                              {userItem.system_role || userItem.requested_role}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{userItem.title || '-'}</TableCell>
                        <TableCell>
                          <StatusBadge status={userItem.status} />
                        </TableCell>
                        <TableCell>
                          {userItem.created_at 
                            ? format(new Date(userItem.created_at), 'MMM dd, yyyy')
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {canDeleteUser(userItem) && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClick(userItem)}
                              disabled={processingId === userItem.id}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user <strong>{deletingUser?.name}</strong> ({deletingUser?.email}).
              <br /><br />
              All their data including daily logs will be removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
