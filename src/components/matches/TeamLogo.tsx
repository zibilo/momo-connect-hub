"use client";

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Team } from '@/types/match';
import { cn } from '@/lib/utils';

interface TeamLogoProps {
  team: Team;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

export function TeamLogo({ team, size = 'md', showName = false, className }: TeamLogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const initials = team.short_name || team.name.slice(0, 2).toUpperCase();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={team.logo_url} alt={team.name} />
        <AvatarFallback className={cn("bg-muted font-semibold", textSizeClasses[size])}>
          {initials}
        </AvatarFallback>
      </Avatar>
      {showName && (
        <span className={cn("font-medium truncate", textSizeClasses[size])}>
          {team.name}
        </span>
      )}
    </div>
  );
}

export default TeamLogo;
