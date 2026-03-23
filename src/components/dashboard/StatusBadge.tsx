import { Badge } from '@/components/ui/badge';
import type { LogStatus, UserStatus, OnboardStatus } from '@/types/types';

interface StatusBadgeProps {
  status: LogStatus | UserStatus | OnboardStatus | string;
  type?: 'log' | 'user' | 'onboard' | 'custom';
}

export function StatusBadge({ status, type = 'log' }: StatusBadgeProps) {
  const getVariant = () => {
    if (type === 'log') {
      switch (status as LogStatus) {
        case 'COMPLETED':
          return 'default';
        case 'IN_PROGRESS':
          return 'secondary';
        case 'BLOCKED':
          return 'destructive';
        default:
          return 'outline';
      }
    }

    if (type === 'user') {
      switch (status as UserStatus) {
        case 'ACTIVE':
          return 'default';
        case 'PENDING':
          return 'secondary';
        case 'REJECTED':
          return 'destructive';
        default:
          return 'outline';
      }
    }

    if (type === 'onboard') {
      switch (status as OnboardStatus) {
        case 'COMPLETED':
          return 'default';
        case 'IN_PROGRESS':
          return 'secondary';
        case 'NOT_STARTED':
          return 'outline';
        default:
          return 'outline';
      }
    }

    return 'outline';
  };

  const getLabel = () => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return <Badge variant={getVariant()}>{getLabel()}</Badge>;
}
