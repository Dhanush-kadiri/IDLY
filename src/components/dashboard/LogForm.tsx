import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { dailyLogsApi } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import type { DailyLog, LogStatus } from '@/types/types';
import { Loader2, Plus, X } from 'lucide-react';

interface LogFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log?: DailyLog;
  onSuccess: () => void;
}

export function LogForm({ open, onOpenChange, log, onSuccess }: LogFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'IN_PROGRESS' as LogStatus,
    links: [] as string[],
  });
  const [newLink, setNewLink] = useState('');

  useEffect(() => {
    if (log) {
      setFormData({
        title: log.title,
        description: log.description || '',
        status: log.status,
        links: log.links || [],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'IN_PROGRESS',
        links: [],
      });
    }
  }, [log, open]);

  const handleAddLink = () => {
    if (newLink.trim()) {
      setFormData(prev => ({
        ...prev,
        links: [...prev.links, newLink.trim()],
      }));
      setNewLink('');
    }
  };

  const handleRemoveLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      if (log) {
        const success = await dailyLogsApi.updateLog(log.id, formData);
        if (success) {
          toast({
            title: 'Success',
            description: 'Log updated successfully',
          });
          onSuccess();
          onOpenChange(false);
        } else {
          throw new Error('Failed to update log');
        }
      } else {
        const newLog = await dailyLogsApi.createLog({
          user_id: user.id,
          ...formData,
        });
        if (newLog) {
          toast({
            title: 'Success',
            description: 'Log created successfully',
          });
          onSuccess();
          onOpenChange(false);
        } else {
          throw new Error('Failed to create log');
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{log ? 'Edit Log' : 'Create New Log'}</DialogTitle>
          <DialogDescription>
            {log ? 'Update your work log entry' : 'Add a new work log entry'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What did you work on?"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide details about your work..."
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as LogStatus })}
              disabled={loading}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Related Links</Label>
            <div className="flex space-x-2">
              <Input
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="https://example.com"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddLink();
                  }
                }}
              />
              <Button type="button" onClick={handleAddLink} disabled={loading} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.links.length > 0 && (
              <div className="space-y-2 mt-2">
                {formData.links.map((link, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline truncate flex-1"
                    >
                      {link}
                    </a>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveLink(index)}
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {log ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
