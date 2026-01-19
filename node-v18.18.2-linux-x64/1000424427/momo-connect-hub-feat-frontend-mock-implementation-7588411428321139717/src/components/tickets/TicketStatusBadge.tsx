import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TicketStatus } from '@/types/ticket';

interface TicketStatusBadgeProps {
  status: TicketStatus;
}

export const TicketStatusBadge: React.FC<TicketStatusBadgeProps> = ({ status }) => {
  const getVariant = () => {
    switch (status) {
      case 'won':
        return 'default'; // Or a custom 'success' variant
      case 'pending':
      case 'active':
        return 'secondary';
      case 'lost':
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return <Badge variant={getVariant()}>{status}</Badge>;
};
