import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Team } from '@/types/match';

interface TeamLogoProps {
  team: Team;
}

export const TeamLogo: React.FC<TeamLogoProps> = ({ team }) => {
  return (
    <Avatar>
      <AvatarImage src={team.logo_url} alt={team.name} />
      <AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};
