import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { UserRole, Profile } from '@/types/types';
import { profilesApi } from '@/db/api';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    requestedRole: 'EMPLOYEE' as UserRole,
    title: '',
    reportsTo: '',
  });
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState<Profile[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load managers when component mounts
  useEffect(() => {
    loadManagers();
  }, []);

  const loadManagers = async () => {
    setLoadingManagers(true);
    try {
      console.log('Loading managers for registration...');
      const allManagers = await profilesApi.getAllManagers();
      console.log('Managers loaded:', allManagers);
      setManagers(allManagers);
      
      if (allManagers.length === 0) {
        console.warn('No managers found. This might be a configuration issue.');
        toast({
          title: 'Notice',
          description: 'No managers available. Please contact the administrator.',
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Failed to load managers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load managers. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingManagers(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    // Validate manager selection for Employees
    if (formData.requestedRole === 'EMPLOYEE' && !formData.reportsTo) {
      toast({
        title: 'Error',
        description: 'Please select a reporting manager',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    const { error } = await signUp({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      phone: formData.phone || undefined,
      requestedRole: formData.requestedRole,
      title: formData.title || undefined,
      reportsTo: formData.requestedRole === 'EMPLOYEE' ? formData.reportsTo : undefined,
    });

    if (error) {
      toast({
        title: 'Registration Failed',
        description: error.message || 'Failed to create account',
        variant: 'destructive',
      });
      setLoading(false);
    } else {
      toast({
        title: 'Success',
        description: 'Account created! Please wait for approval from your reporting manager.',
      });
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Register for InTouract's Daily Logger
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Software Engineer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Requested Role *</Label>
              <Select
                value={formData.requestedRole}
                onValueChange={(value) => setFormData({ ...formData, requestedRole: value as UserRole, reportsTo: '' })}
                disabled={loading}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMPLOYEE">Employee</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Manager Selection - Only for Employees */}
            {formData.requestedRole === 'EMPLOYEE' && (
              <div className="space-y-2">
                <Label htmlFor="manager">Reporting Manager *</Label>
                <Select
                  value={formData.reportsTo}
                  onValueChange={(value) => setFormData({ ...formData, reportsTo: value })}
                  disabled={loading || loadingManagers}
                >
                  <SelectTrigger id="manager">
                    <SelectValue placeholder={loadingManagers ? "Loading managers..." : "Select your manager"} />
                  </SelectTrigger>
                  <SelectContent>
                    {managers.length === 0 && !loadingManagers ? (
                      <SelectItem value="none" disabled>
                        No managers available - Please contact administrator
                      </SelectItem>
                    ) : (
                      managers.map((manager) => (
                        <SelectItem key={manager.id} value={manager.id}>
                          {manager.name} {manager.title ? `- ${manager.title}` : `(${manager.system_role})`}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select the manager you will report to. Your approval request will be sent to them.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
