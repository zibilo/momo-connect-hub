import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TransactionStatus } from '@/types/transaction';

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
}

export const TransactionStatusBadge: React.FC<TransactionStatusBadgeProps> = ({ status }) => {
  const getVariant = () => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return <Badge variant={getVariant()}>{status}</Badge>;
};
