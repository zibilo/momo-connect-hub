import React from 'react';
import { TicketStatus } from '@/types/ticket';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TicketStatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

const TicketStatusBadge: React.FC<TicketStatusBadgeProps> = ({ status, className }) => {
  const config = {
    pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
    active: { label: 'En cours', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
    won: { label: 'Gagné', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
    lost: { label: 'Perdu', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
    cancelled: { label: 'Annulé', className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
  };

  const { label, className: statusClass } = config[status] || config.pending;

  return (
    <Badge className={cn('px-2 py-0.5 font-medium border-none shadow-none', statusClass, className)}>
      {label}
    </Badge>
  );
};

export default TicketStatusBadge;
