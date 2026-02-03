"use client";

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BetSelection, BetOutcome } from '@/types/match';
import { formatCurrency } from '@/lib/currency';
import { formatDateTime } from '@/lib/dates';
import { Trophy, Clock, CheckCircle, XCircle, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PersonalBet {
  id: string;
  selections: BetSelection[];
  stake: number;
  total_odds: number;
  potential_win: number;
  status: BetOutcome;
  created_at: string;
}

interface PersonalBetCardProps {
  bet: PersonalBet;
  onViewDetails?: () => void;
}

export function PersonalBetCard({ bet, onViewDetails }: PersonalBetCardProps) {
  const statusConfig: Record<BetOutcome, { label: string; icon: React.ReactNode; className: string }> = {
    pending: { 
      label: 'En cours', 
      icon: <Clock className="w-4 h-4" />, 
      className: 'bg-yellow-100 text-yellow-800' 
    },
    won: { 
      label: 'Gagné', 
      icon: <CheckCircle className="w-4 h-4" />, 
      className: 'bg-green-100 text-green-800' 
    },
    lost: { 
      label: 'Perdu', 
      icon: <XCircle className="w-4 h-4" />, 
      className: 'bg-red-100 text-red-800' 
    },
    void: { 
      label: 'Annulé', 
      icon: <Minus className="w-4 h-4" />, 
      className: 'bg-gray-100 text-gray-800' 
    },
  };

  const config = statusConfig[bet.status];

  return (
    <Card className={cn(
      "overflow-hidden transition-all",
      bet.status === 'won' && "border-green-200",
      bet.status === 'lost' && "border-red-200"
    )}>
      <CardHeader className="p-4 flex flex-row items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">
            {bet.selections.length} Sélection{bet.selections.length > 1 ? 's' : ''}
          </span>
        </div>
        <Badge className={cn("flex items-center gap-1", config.className)}>
          {config.icon}
          {config.label}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          {bet.selections.slice(0, 3).map((selection, index) => (
            <div key={selection.id || index} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
              <div className="flex-1 truncate">
                <p className="font-medium truncate">
                  {selection.match?.home_team?.name} vs {selection.match?.away_team?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selection.market}: {selection.selection}
                </p>
              </div>
              <Badge variant="outline" className="font-mono ml-2">
                {selection.odds.toFixed(2)}
              </Badge>
            </div>
          ))}
          {bet.selections.length > 3 && (
            <p className="text-xs text-muted-foreground text-center">
              +{bet.selections.length - 3} autre(s) sélection(s)
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Mise</p>
            <p className="font-semibold">{formatCurrency(bet.stake)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Côte</p>
            <p className="font-mono font-semibold">{bet.total_odds.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Gain potentiel</p>
            <p className={cn(
              "font-semibold",
              bet.status === 'won' ? "text-green-600" : "text-primary"
            )}>
              {formatCurrency(bet.potential_win)}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {formatDateTime(bet.created_at)}
        </span>
        {onViewDetails && (
          <Button variant="ghost" size="sm" onClick={onViewDetails}>
            Voir détails
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default PersonalBetCard;
