"use client";

import React from 'react';
import { Match } from '@/types/match';
import { MatchCard } from './MatchCard';
import { Loader2, Search } from 'lucide-react';

interface MatchListProps {
  matches: Match[];
  isLoading?: boolean;
  selectedMatchId?: string;
  onSelectMatch?: (match: Match) => void;
  compact?: boolean;
  emptyMessage?: string;
}

export function MatchList({ 
  matches, 
  isLoading, 
  selectedMatchId, 
  onSelectMatch,
  compact = false,
  emptyMessage = "Aucun match disponible"
}: MatchListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Search className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-2">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            selected={selectedMatchId === match.id}
            onClick={() => onSelectMatch?.(match)}
            compact
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          selected={selectedMatchId === match.id}
          onClick={() => onSelectMatch?.(match)}
        />
      ))}
    </div>
  );
}

export default MatchList;
