import React from 'react';
import { Ticket } from '@/types/ticket';
import TicketCard from '../tickets/TicketCard';
import { EmptyState } from '../common/EmptyState';
import { Search } from 'lucide-react';

interface MarketplaceGridProps {
  tickets: Ticket[];
  isLoading?: boolean;
}

const MarketplaceGrid: React.FC<MarketplaceGridProps> = ({ tickets, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <EmptyState
        icon={<Search className="w-8 h-8 text-muted-foreground" />}
        title="Aucun ticket trouvé"
        description="Essayez de modifier vos filtres pour trouver ce que vous cherchez."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
};

export default MarketplaceGrid;
