"use client";

import React from 'react';
import { Ticket } from '@/types/ticket';
import { TicketCard } from './TicketCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Inbox } from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
  isLoading?: boolean;
  onViewTicket?: (ticketId: string) => void;
  onPurchase?: (ticket: Ticket) => void;
  showTabs?: boolean;
}

export function TicketList({ 
  tickets, 
  isLoading, 
  onViewTicket,
  onPurchase,
  showTabs = false 
}: TicketListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const renderTicketGrid = (ticketList: Ticket[]) => {
    if (ticketList.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Inbox className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Aucun ticket trouvé</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ticketList.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onClick={() => onViewTicket?.(ticket.id)}
            onPurchase={onPurchase ? () => onPurchase(ticket) : undefined}
          />
        ))}
      </div>
    );
  };

  if (!showTabs) {
    return renderTicketGrid(tickets);
  }

  const pendingTickets = tickets.filter(t => t.status === 'pending');
  const activeTickets = tickets.filter(t => t.status === 'active');
  const wonTickets = tickets.filter(t => t.status === 'won');
  const lostTickets = tickets.filter(t => t.status === 'lost');

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="all">
          Tous ({tickets.length})
        </TabsTrigger>
        <TabsTrigger value="pending">
          En attente ({pendingTickets.length})
        </TabsTrigger>
        <TabsTrigger value="active">
          En cours ({activeTickets.length})
        </TabsTrigger>
        <TabsTrigger value="won">
          Gagnés ({wonTickets.length})
        </TabsTrigger>
        <TabsTrigger value="lost">
          Perdus ({lostTickets.length})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="mt-4">
        {renderTicketGrid(tickets)}
      </TabsContent>
      <TabsContent value="pending" className="mt-4">
        {renderTicketGrid(pendingTickets)}
      </TabsContent>
      <TabsContent value="active" className="mt-4">
        {renderTicketGrid(activeTickets)}
      </TabsContent>
      <TabsContent value="won" className="mt-4">
        {renderTicketGrid(wonTickets)}
      </TabsContent>
      <TabsContent value="lost" className="mt-4">
        {renderTicketGrid(lostTickets)}
      </TabsContent>
    </Tabs>
  );
}

export default TicketList;
