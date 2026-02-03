"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Match, MatchOdds } from '@/types/match';
import { TeamLogo } from '@/components/matches/TeamLogo';
import { LiveMatchIndicator } from '@/components/matches/LiveMatchIndicator';
import { formatMatchDate } from '@/lib/dates';
import { cn } from '@/lib/utils';
import { Check, Plus } from 'lucide-react';

interface MatchSelectorProps {
  matches: Match[];
  selectedMatchIds: string[];
  onSelectMatch: (match: Match) => void;
  onDeselectMatch: (matchId: string) => void;
  isLoading?: boolean;
}

export function MatchSelector({ 
  matches, 
  selectedMatchIds, 
  onSelectMatch, 
  onDeselectMatch,
  isLoading 
}: MatchSelectorProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun match disponible
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {matches.map((match) => {
        const isSelected = selectedMatchIds.includes(match.id);
        const isLive = match.status === 'live';

        return (
          <div
            key={match.id}
            onClick={() => isSelected ? onDeselectMatch(match.id) : onSelectMatch(match)}
            className={cn(
              "p-3 rounded-lg border cursor-pointer transition-all",
              isSelected 
                ? "border-primary bg-primary/5" 
                : "border-muted hover:border-muted-foreground/50"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center gap-2 flex-1">
                  <TeamLogo team={match.home_team} size="sm" />
                  <span className="text-sm font-medium truncate">{match.home_team.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">vs</span>
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <span className="text-sm font-medium truncate">{match.away_team.name}</span>
                  <TeamLogo team={match.away_team} size="sm" />
                </div>
              </div>

              <div className="ml-4 flex items-center gap-2">
                {isLive ? (
                  <LiveMatchIndicator />
                ) : (
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatMatchDate(match.start_time)}
                  </span>
                )}
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  {isSelected ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            {match.competition && (
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  {match.competition.name}
                </Badge>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default MatchSelector;
