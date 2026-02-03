"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Match, MatchStatus } from '@/types/match';
import { TeamLogo } from './TeamLogo';
import { LiveMatchIndicator } from './LiveMatchIndicator';
import { formatMatchDate } from '@/lib/dates';
import { cn } from '@/lib/utils';
import { Calendar, MapPin } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  onClick?: () => void;
  selected?: boolean;
  compact?: boolean;
}

export function MatchCard({ match, onClick, selected, compact = false }: MatchCardProps) {
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';
  const isScheduled = match.status === 'scheduled';

  const statusConfig: Record<MatchStatus, { label: string; className: string }> = {
    scheduled: { label: 'Programmé', className: 'bg-blue-100 text-blue-800' },
    live: { label: 'En direct', className: 'bg-red-100 text-red-800' },
    finished: { label: 'Terminé', className: 'bg-gray-100 text-gray-800' },
    postponed: { label: 'Reporté', className: 'bg-yellow-100 text-yellow-800' },
    cancelled: { label: 'Annulé', className: 'bg-gray-100 text-gray-500' },
  };

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={cn(
          "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
          selected ? "border-primary bg-primary/5" : "border-transparent bg-muted/50 hover:bg-muted"
        )}
      >
        <div className="flex items-center gap-3 flex-1">
          <TeamLogo team={match.home_team} size="sm" />
          <span className="text-sm font-medium">vs</span>
          <TeamLogo team={match.away_team} size="sm" />
        </div>
        {isLive && <LiveMatchIndicator />}
        {!isLive && (
          <span className="text-xs text-muted-foreground">
            {formatMatchDate(match.start_time)}
          </span>
        )}
      </div>
    );
  }

  return (
    <Card
      onClick={onClick}
      className={cn(
        "overflow-hidden cursor-pointer transition-all hover:shadow-md",
        selected && "ring-2 ring-primary",
        onClick && "cursor-pointer"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {match.competition && (
              <Badge variant="outline" className="text-xs">
                {match.competition.short_name || match.competition.name}
              </Badge>
            )}
            {isLive ? (
              <LiveMatchIndicator />
            ) : (
              <Badge className={cn("text-xs", statusConfig[match.status].className)}>
                {statusConfig[match.status].label}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <TeamLogo team={match.home_team} size="lg" className="justify-center mb-2" />
            <p className="font-semibold text-sm truncate">{match.home_team.name}</p>
          </div>

          <div className="flex flex-col items-center px-4">
            {isFinished || isLive ? (
              <div className="text-2xl font-bold">
                <span>{match.home_score ?? 0}</span>
                <span className="mx-2 text-muted-foreground">-</span>
                <span>{match.away_score ?? 0}</span>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-lg font-semibold text-muted-foreground">VS</p>
              </div>
            )}
          </div>

          <div className="flex-1 text-center">
            <TeamLogo team={match.away_team} size="lg" className="justify-center mb-2" />
            <p className="font-semibold text-sm truncate">{match.away_team.name}</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatMatchDate(match.start_time)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default MatchCard;
