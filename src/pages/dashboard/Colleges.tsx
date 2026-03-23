import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { collegesApi } from '@/db/api';
import type { College } from '@/types/types';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
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

export default function Colleges() {
  const { toast } = useToast();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    spoc_name: '',
    spoc_contact: '',
    spoc_email: '',
    intouract_spoc_name: '',
    intouract_spoc_contact: '',
    intouract_spoc_email: '',
    mou_duration: '',
    status: '',
    description: '',
  });

  const loadColleges = async () => {
    setLoading(true);
    const data = await collegesApi.getAll();
    setColleges(data);
    setLoading(false);
  };

  useEffect(() => {
    loadColleges();
  }, []);

  const handleOpenForm = (college?: College) => {
    if (college) {
      setEditingCollege(college);
      setFormData({
        name: college.name,
        address: college.address || '',
        spoc_name: college.spoc_name || '',
        spoc_contact: college.spoc_contact || '',
        spoc_email: college.spoc_email || '',
        intouract_spoc_name: college.intouract_spoc_name || '',
        intouract_spoc_contact: college.intouract_spoc_contact || '',
        intouract_spoc_email: college.intouract_spoc_email || '',
        mou_duration: college.mou_duration || '',
        status: college.status || '',
        description: college.description || '',
      });
    } else {
      setEditingCollege(undefined);
      setFormData({
        name: '',
        address: '',
        spoc_name: '',
        spoc_contact: '',
        spoc_email: '',
        intouract_spoc_name: '',
        intouract_spoc_contact: '',
        intouract_spoc_email: '',
        mou_duration: '',
        status: '',
        description: '',
      });
    }
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (editingCollege) {
        const success = await collegesApi.update(editingCollege.id, formData);
        if (success) {
          toast({ title: 'Success', description: 'College updated successfully' });
          loadColleges();
          setFormOpen(false);
        } else {
          throw new Error('Failed to update college');
        }
      } else {
        const newCollege = await collegesApi.create(formData);
        if (newCollege) {
          toast({ title: 'Success', description: 'College created successfully' });
          loadColleges();
          setFormOpen(false);
        } else {
          throw new Error('Failed to create college');
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    const success = await collegesApi.delete(deletingId);
    if (success) {
      toast({ title: 'Success', description: 'College deleted successfully' });
      loadColleges();
    } else {
      toast({ title: 'Error', description: 'Failed to delete college', variant: 'destructive' });
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const openDeleteDialog = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Colleges Management</h1>
          <p className="text-muted-foreground">Manage college partnerships and onboarding</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Colleges</CardTitle>
                <CardDescription>View and manage college records</CardDescription>
              </div>
              <Button onClick={() => handleOpenForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Add College
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : colleges.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No colleges yet. Add your first college to get started!
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>SPOC</TableHead>
                      <TableHead>MoU Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {colleges.map((college) => (
                      <TableRow key={college.id}>
                        <TableCell className="font-medium">{college.name}</TableCell>
                        <TableCell>{college.spoc_name || 'N/A'}</TableCell>
                        <TableCell>{college.mou_duration || 'N/A'}</TableCell>
                        <TableCell>
                          <StatusBadge status={college.status || 'N/A'} type="custom" />
                        </TableCell>
                        <TableCell>
                          {format(new Date(college.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenForm(college)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(college.id)}
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

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCollege ? 'Edit College' : 'Add New College'}</DialogTitle>
            <DialogDescription>
              {editingCollege ? 'Update college information' : 'Create a new college record'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Basic Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">College Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter college name"
                  required
                  disabled={formLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter college address"
                  disabled={formLoading}
                  rows={2}
                />
              </div>
            </div>

            {/* College SPOC Information */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-semibold">College SPOC (Single Point of Contact)</h3>
              
              <div className="space-y-2">
                <Label htmlFor="spoc_name">SPOC Name</Label>
                <Input
                  id="spoc_name"
                  value={formData.spoc_name}
                  onChange={(e) => setFormData({ ...formData, spoc_name: e.target.value })}
                  placeholder="Enter SPOC name"
                  disabled={formLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="spoc_contact">SPOC Contact</Label>
                  <Input
                    id="spoc_contact"
                    value={formData.spoc_contact}
                    onChange={(e) => setFormData({ ...formData, spoc_contact: e.target.value })}
                    placeholder="+91 1234567890"
                    disabled={formLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="spoc_email">SPOC Email</Label>
                  <Input
                    id="spoc_email"
                    type="email"
                    value={formData.spoc_email}
                    onChange={(e) => setFormData({ ...formData, spoc_email: e.target.value })}
                    placeholder="spoc@college.edu"
                    disabled={formLoading}
                  />
                </div>
              </div>
            </div>

            {/* InTouract SPOC Information */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-semibold">InTouract SPOC</h3>
              
              <div className="space-y-2">
                <Label htmlFor="intouract_spoc_name">InTouract SPOC Name</Label>
                <Input
                  id="intouract_spoc_name"
                  value={formData.intouract_spoc_name}
                  onChange={(e) => setFormData({ ...formData, intouract_spoc_name: e.target.value })}
                  placeholder="Enter InTouract representative name"
                  disabled={formLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="intouract_spoc_contact">InTouract SPOC Contact</Label>
                  <Input
                    id="intouract_spoc_contact"
                    value={formData.intouract_spoc_contact}
                    onChange={(e) => setFormData({ ...formData, intouract_spoc_contact: e.target.value })}
                    placeholder="+91 1234567890"
                    disabled={formLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="intouract_spoc_email">InTouract SPOC Email</Label>
                  <Input
                    id="intouract_spoc_email"
                    type="email"
                    value={formData.intouract_spoc_email}
                    onChange={(e) => setFormData({ ...formData, intouract_spoc_email: e.target.value })}
                    placeholder="rep@intouract.com"
                    disabled={formLoading}
                  />
                </div>
              </div>
            </div>

            {/* MoU and Status */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-semibold">MoU Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mou_duration">MoU Duration</Label>
                  <Input
                    id="mou_duration"
                    value={formData.mou_duration}
                    onChange={(e) => setFormData({ ...formData, mou_duration: e.target.value })}
                    placeholder="e.g., 2 years, 1 year"
                    disabled={formLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Input
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    placeholder="e.g., Active, Inactive"
                    disabled={formLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional notes and description"
                  disabled={formLoading}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)} disabled={formLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingCollege ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the college record.
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
