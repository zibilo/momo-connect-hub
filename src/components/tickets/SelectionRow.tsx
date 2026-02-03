"use client";

import React from 'react';
import { BetSelection, BetOutcome } from '@/types/match';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TeamLogo } from '@/components/matches/TeamLogo';
import { formatMatchDate } from '@/lib/dates';
import { Trash2, CheckCircle, XCircle, Clock, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectionRowProps {
  selection: BetSelection;
  onRemove?: () => void;
  showOutcome?: boolean;
  compact?: boolean;
}

export function SelectionRow({ 
  selection, 
  onRemove, 
  showOutcome = false,
  compact = false 
}: SelectionRowProps) {
  const outcomeConfig: Record<BetOutcome, { label: string; icon: React.ReactNode; className: string }> = {
    pending: { 
      label: 'En cours', 
      icon: <Clock className="w-3 h-3" />, 
      className: 'bg-yellow-100 text-yellow-800' 
    },
    won: { 
      label: 'Gagné', 
      icon: <CheckCircle className="w-3 h-3" />, 
      className: 'bg-green-100 text-green-800' 
    },
    lost: { 
      label: 'Perdu', 
      icon: <XCircle className="w-3 h-3" />, 
      className: 'bg-red-100 text-red-800' 
    },
    void: { 
      label: 'Annulé', 
      icon: <Minus className="w-3 h-3" />, 
      className: 'bg-gray-100 text-gray-800' 
    },
  };

  const outcome = outcomeConfig[selection.outcome];

  if (compact) {
    return (
      <div className={cn(
        "flex items-center justify-between p-2 rounded text-sm",
        showOutcome && selection.outcome === 'won' && "bg-green-50",
        showOutcome && selection.outcome === 'lost' && "bg-red-50"
      )}>
        <div className="flex-1 min-w-0">
          <span className="truncate">
            {selection.match?.home_team?.name} vs {selection.match?.away_team?.name}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <span className="text-xs text-muted-foreground">{selection.selection}</span>
          <span className="font-mono font-semibold">{selection.odds.toFixed(2)}</span>
          {showOutcome && (
            <Badge className={cn("text-xs flex items-center gap-1", outcome.className)}>
              {outcome.icon}
            </Badge>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "p-3 rounded-lg border",
      showOutcome && selection.outcome === 'won' && "border-green-200 bg-green-50",
      showOutcome && selection.outcome === 'lost' && "border-red-200 bg-red-50",
      !showOutcome && "bg-muted/50"
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          {selection.match && (
            <>
              <TeamLogo team={selection.match.home_team} size="sm" />
              <span className="text-sm font-medium">vs</span>
              <TeamLogo team={selection.match.away_team} size="sm" />
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showOutcome && (
            <Badge className={cn("flex items-center gap-1", outcome.className)}>
              {outcome.icon}
              {outcome.label}
            </Badge>
          )}
          {onRemove && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRemove}>
              <Trash2 className="w-4 h-4 text-muted-foreground" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">
            {selection.match?.home_team?.name} vs {selection.match?.away_team?.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {selection.market}: <span className="font-medium">{selection.selection}</span>
          </p>
          {selection.match && (
            <p className="text-xs text-muted-foreground mt-1">
              {formatMatchDate(selection.match.start_time)}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-lg font-bold font-mono text-primary">
            {selection.odds.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SelectionRow;
