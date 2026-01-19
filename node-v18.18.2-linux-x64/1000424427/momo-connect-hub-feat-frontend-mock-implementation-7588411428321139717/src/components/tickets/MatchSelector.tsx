import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMatches } from '@/hooks/useMatches';

interface MatchSelectorProps {
  onSelectMatch: (matchId: string) => void;
}

export const MatchSelector: React.FC<MatchSelectorProps> = ({ onSelectMatch }) => {
  const { matches, isLoading } = useMatches();

  if (isLoading) return <p>Loading matches...</p>;

  return (
    <Select onValueChange={onSelectMatch}>
      <SelectTrigger>
        <SelectValue placeholder="Select a match" />
      </SelectTrigger>
      <SelectContent>
        {matches?.map((match) => (
          <SelectItem key={match.id} value={match.id}>
            {match.home_team.name} vs {match.away_team.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
