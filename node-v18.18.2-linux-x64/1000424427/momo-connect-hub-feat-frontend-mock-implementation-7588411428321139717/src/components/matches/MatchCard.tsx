import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Match } from '@/types/match';
import { TeamLogo } from './TeamLogo';
import { formatDate } from '@/lib/dates';
import { LiveMatchIndicator } from './LiveMatchIndicator';

interface MatchCardProps {
  match: Match;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{match.competition.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-around">
        <div className="flex flex-col items-center gap-2">
          <TeamLogo team={match.home_team} />
          <span className="font-semibold">{match.home_team.name}</span>
        </div>

        <div className="text-center">
          {match.status === 'live' && <LiveMatchIndicator />}
          {match.status === 'scheduled' && <p className="text-sm">{formatDate(match.start_time, 'p')}</p>}
          {match.status === 'finished' && (
            <p className="text-2xl font-bold">
              {match.result?.home_score} - {match.result?.away_score}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          <TeamLogo team={match.away_team} />
          <span className="font-semibold">{match.away_team.name}</span>
        </div>
      </CardContent>
    </Card>
  );
};
