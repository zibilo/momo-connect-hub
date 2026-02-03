"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ticket, TicketStatus, PhysicalTicket } from '@/types/ticket';
import { TicketStatusBadge } from '@/components/tickets/TicketStatusBadge';
import { SelectionRow } from '@/components/tickets/SelectionRow';
import { formatCurrency } from '@/lib/currency';
import { formatDateTime } from '@/lib/dates';
import { CheckCircle, XCircle, Clock, AlertTriangle, Trophy, Banknote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerificationResultData {
  ticket: Ticket;
  physicalTicket?: PhysicalTicket;
  isValid: boolean;
  canClaim: boolean;
  claimAmount?: number;
  message?: string;
}

interface VerificationResultProps {
  result: VerificationResultData;
  onClaim?: () => void;
  onClose?: () => void;
}

export function VerificationResult({ result, onClaim, onClose }: VerificationResultProps) {
  const { ticket, physicalTicket, isValid, canClaim, claimAmount, message } = result;
  
  const totalOdds = ticket.selections.reduce((acc, s) => acc * s.odds, 1);
  const wonSelections = ticket.selections.filter(s => s.outcome === 'won').length;
  const lostSelections = ticket.selections.filter(s => s.outcome === 'lost').length;

  const getStatusIcon = () => {
    if (!isValid) return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
    if (ticket.status === 'won') return <Trophy className="w-8 h-8 text-green-500" />;
    if (ticket.status === 'lost') return <XCircle className="w-8 h-8 text-red-500" />;
    if (ticket.status === 'active') return <Clock className="w-8 h-8 text-blue-500" />;
    return <CheckCircle className="w-8 h-8 text-gray-500" />;
  };

  const getStatusMessage = () => {
    if (!isValid) return 'Ticket invalide ou déjà réclamé';
    if (ticket.status === 'won') return 'Ticket gagnant !';
    if (ticket.status === 'lost') return 'Ticket perdant';
    if (ticket.status === 'active') return 'Match en cours';
    return 'En attente des résultats';
  };

  const getStatusColor = () => {
    if (!isValid) return 'bg-yellow-50 border-yellow-200';
    if (ticket.status === 'won') return 'bg-green-50 border-green-200';
    if (ticket.status === 'lost') return 'bg-red-50 border-red-200';
    return 'bg-blue-50 border-blue-200';
  };

  return (
    <div className="space-y-4">
      <Card className={cn("border-2", getStatusColor())}>
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <div className="w-16 h-16 rounded-full bg-white mx-auto mb-3 flex items-center justify-center shadow-sm">
              {getStatusIcon()}
            </div>
            <h3 className="text-xl font-bold">{getStatusMessage()}</h3>
            {message && (
              <p className="text-sm text-muted-foreground mt-1">{message}</p>
            )}
          </div>

          {canClaim && claimAmount && (
            <div className="p-4 bg-green-100 rounded-lg text-center mb-4">
              <p className="text-sm text-green-700 mb-1">Montant à réclamer</p>
              <p className="text-3xl font-bold text-green-700">
                {formatCurrency(claimAmount)}
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2 bg-white rounded-lg">
              <p className="text-xs text-muted-foreground">Sélections</p>
              <p className="font-bold">{ticket.selections.length}</p>
            </div>
            <div className="p-2 bg-white rounded-lg">
              <p className="text-xs text-muted-foreground">Côte</p>
              <p className="font-bold font-mono">{totalOdds.toFixed(2)}</p>
            </div>
            <div className="p-2 bg-white rounded-lg">
              <p className="text-xs text-muted-foreground">Résultats</p>
              <p className="font-bold text-green-600">{wonSelections}W</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{ticket.title}</CardTitle>
            <TicketStatusBadge status={ticket.status} />
          </div>
          <p className="text-xs text-muted-foreground">
            Code: {physicalTicket?.verification_code || ticket.verification_code}
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="max-h-60 overflow-y-auto space-y-2">
            {ticket.selections.map((selection) => (
              <SelectionRow 
                key={selection.id} 
                selection={selection}
                showOutcome
                compact
              />
            ))}
          </div>

          {physicalTicket && (
            <div className="pt-3 border-t text-xs text-muted-foreground space-y-1">
              <p>Imprimé le: {formatDateTime(physicalTicket.printed_at)}</p>
              {physicalTicket.sold_at && (
                <p>Vendu le: {formatDateTime(physicalTicket.sold_at)}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        {canClaim && onClaim && (
          <Button onClick={onClaim} className="flex-1" size="lg">
            <Banknote className="w-4 h-4 mr-2" />
            Réclamer {claimAmount && formatCurrency(claimAmount)}
          </Button>
        )}
        {onClose && (
          <Button variant="outline" onClick={onClose} className={!canClaim ? "flex-1" : ""}>
            Fermer
          </Button>
        )}
      </div>
    </div>
  );
}

export default VerificationResult;
