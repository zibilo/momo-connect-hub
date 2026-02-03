import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ticket } from '@/types/ticket';
import TicketStatusBadge from './TicketStatusBadge';
import OddsDisplay from './OddsDisplay';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/lib/dates';
import { Link } from 'react-router-dom';
import { Trophy, ExternalLink } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
  showLink?: boolean;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, showLink = true }) => {
  const potentialGain = ticket.stake_suggestion 
    ? Math.floor(ticket.stake_suggestion * ticket.total_odds)
    : Math.floor(ticket.price * ticket.total_odds * 10);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-4 flex flex-row items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm truncate max-w-[150px]">{ticket.title}</span>
        </div>
        <TicketStatusBadge status={ticket.status} />
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Prix</p>
            <p className="font-bold">{formatCurrency(ticket.price)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Côte Totale</p>
            <OddsDisplay odds={ticket.total_odds} size="lg" />
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Gain Potentiel</p>
            <p className="font-bold text-green-600">{formatCurrency(potentialGain)}</p>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{ticket.selections?.length || 0} Sélections</span>
          <span>{formatDate(ticket.created_at)}</span>
        </div>
      </CardContent>
      {showLink && (
        <CardFooter className="p-4 pt-0">
          <Button asChild variant="outline" className="w-full gap-2">
            <Link to={`/tickets/${ticket.id}`}>
              <ExternalLink className="w-4 h-4" />
              Détails du ticket
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default TicketCard;
