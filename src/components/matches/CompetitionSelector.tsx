"use client";

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Competition, Sport } from '@/types/match';
import { cn } from '@/lib/utils';

interface CompetitionSelectorProps {
  competitions: Competition[];
  selectedId?: string;
  onSelect: (competitionId: string | undefined) => void;
  showSportFilter?: boolean;
  selectedSport?: Sport;
  onSportChange?: (sport: Sport | undefined) => void;
}

const SPORTS: { value: Sport; label: string; emoji: string }[] = [
  { value: 'football', label: 'Football', emoji: '⚽' },
  { value: 'basketball', label: 'Basketball', emoji: '🏀' },
  { value: 'tennis', label: 'Tennis', emoji: '🎾' },
  { value: 'volleyball', label: 'Volleyball', emoji: '🏐' },
  { value: 'handball', label: 'Handball', emoji: '🤾' },
];

export function CompetitionSelector({ 
  competitions, 
  selectedId, 
  onSelect,
  showSportFilter = false,
  selectedSport,
  onSportChange
}: CompetitionSelectorProps) {
  const filteredCompetitions = selectedSport 
    ? competitions.filter(c => c.sport === selectedSport)
    : competitions;

  return (
    <div className="space-y-3">
      {showSportFilter && onSportChange && (
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={!selectedSport ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onSportChange(undefined)}
          >
            Tous
          </Badge>
          {SPORTS.map((sport) => (
            <Badge
              key={sport.value}
              variant={selectedSport === sport.value ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onSportChange(sport.value)}
            >
              <span className="mr-1">{sport.emoji}</span>
              {sport.label}
            </Badge>
          ))}
        </div>
      )}

      <Select
        value={selectedId || ''}
        onValueChange={(value) => onSelect(value || undefined)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Toutes les compétitions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les compétitions</SelectItem>
          {filteredCompetitions.map((competition) => (
            <SelectItem key={competition.id} value={competition.id}>
              <div className="flex items-center gap-2">
                {competition.logo_url && (
                  <img 
                    src={competition.logo_url} 
                    alt={competition.name} 
                    className="w-4 h-4 object-contain"
                  />
                )}
                <span>{competition.name}</span>
                {competition.country && (
                  <span className="text-xs text-muted-foreground">
                    ({competition.country})
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default CompetitionSelector;
