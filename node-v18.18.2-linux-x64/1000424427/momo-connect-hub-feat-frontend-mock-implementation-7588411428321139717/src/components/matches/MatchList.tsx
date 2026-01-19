import React from 'react';
import { useMatches } from '@/hooks/useMatches';
import { MatchCard } from './MatchCard';
import { SkeletonLoader } from '../common/SkeletonLoader';

export const MatchList: React.FC = () => {
  const { matches, isLoading } = useMatches();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonLoader className="h-24 w-full" />
        <SkeletonLoader className="h-24 w-full" />
        <SkeletonLoader className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {matches?.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
};
