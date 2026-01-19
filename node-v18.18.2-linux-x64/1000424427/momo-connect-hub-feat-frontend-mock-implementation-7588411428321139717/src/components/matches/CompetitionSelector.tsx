import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// This would likely fetch competitions from a service
const competitions = [
  { id: '1', name: 'Premier League' },
  { id: '2', name: 'La Liga' },
  { id: '3', name: 'Champions League' },
];

interface CompetitionSelectorProps {
  onSelectCompetition: (competitionId: string) => void;
}

export const CompetitionSelector: React.FC<CompetitionSelectorProps> = ({ onSelectCompetition }) => {
  return (
    <Select onValueChange={onSelectCompetition}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="All Competitions" />
      </SelectTrigger>
      <SelectContent>
        {competitions.map((comp) => (
          <SelectItem key={comp.id} value={comp.id}>
            {comp.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
