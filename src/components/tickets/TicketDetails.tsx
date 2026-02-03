"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ticket } from '@/types/ticket';
import { SelectionRow } from './SelectionRow';
import { TicketStatusBadge } from './TicketStatusBadge';
import { CreatorProfileCard } from '@/components/marketplace/CreatorProfile';
import { formatCurrency } from '@/lib/currency';
import { formatDateTime } from '@/lib/dates';
import { Calendar, User, QrCode, Copy, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TicketDetailsProps {
  ticket: Ticket;
  onPurchase?: () => void;
  onShare?: () => void;
  isPurchased?: boolean;
  showCreator?: boolean;
}

export function TicketDetails({ 
  ticket, 
  onPurchase, 
  onShare,
  isPurchased = false,
  showCreator = true 
}: TicketDetailsProps) {
  const totalOdds = ticket.selections.reduce((acc, s) => acc * s.odds, 1);
  const wonSelections = ticket.selections.filter(s => s.outcome === 'won').length;
  const lostSelections = ticket.selections.filter(s => s.outcome === 'lost').length;

  const handleCopyCode = () => {
    if (ticket.verification_code) {
      navigator.clipboard.writeText(ticket.verification_code);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{ticket.title}</CardTitle>
              {ticket.description && (
                <p className="text-muted-foreground mt-1">{ticket.description}</p>
              )}
            </div>
            <TicketStatusBadge status={ticket.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <p className="text-xs text-muted-foreground">Sélections</p>
              <p className="text-xl font-bold">{ticket.selections.length}</p>
              {ticket.status !== 'pending' && (
                <p className="text-xs text-muted-foreground">
                  {wonSelections}W / {lostSelections}L
                </p>
              )}
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <p className="text-xs text-muted-foreground">Côte Totale</p>
              <p className="text-xl font-bold font-mono text-primary">
                {totalOdds.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <p className="text-xs text-muted-foreground">Prix</p>
              <p className="text-xl font-bold">{formatCurrency(ticket.price)}</p>
            </div>
            {ticket.stake_suggestion && (
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Mise suggérée</p>
                <p className="text-xl font-bold">{formatCurrency(ticket.stake_suggestion)}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Créé le {formatDateTime(ticket.created_at)}
            </span>
            <Badge variant="outline" className="capitalize">
              {ticket.visibility}
            </Badge>
          </div>

          {ticket.verification_code && (
            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
              <QrCode className="w-5 h-5 text-primary" />
              <span className="font-mono text-sm flex-1">{ticket.verification_code}</span>
              <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            {!isPurchased && onPurchase && (
              <Button onClick={onPurchase} className="flex-1">
                Acheter - {formatCurrency(ticket.price)}
              </Button>
            )}
            {onShare && (
              <Button variant="outline" onClick={onShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sélections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ticket.selections.map((selection) => (
            <SelectionRow 
              key={selection.id} 
              selection={selection}
              showOutcome={ticket.status !== 'pending'}
            />
          ))}
        </CardContent>
      </Card>

      {showCreator && ticket.creator && (
        <CreatorProfileCard creator={ticket.creator} compact />
      )}
    </div>
  );
}

export default TicketDetails;
