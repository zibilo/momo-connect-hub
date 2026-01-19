import { useQuery } from '@tanstack/react-query';
import { getMatches } from '@/services/matchesService';

export function useMatches() {
  const { data: matches, isLoading, error, refetch } = useQuery({
    queryKey: ['matches'],
    queryFn: getMatches,
  });

  return {
    matches,
    isLoading,
    error,
    refresh: refetch,
  };
}
