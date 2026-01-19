import { useQuery } from '@tanstack/react-query';
// import { getCreatorStats } from '@/services/creatorService'; // Service to be created

export function useCreatorStats() {
  // const { data: stats, isLoading, error, refetch } = useQuery({
  //   queryKey: ['creatorStats'],
  //   queryFn: getCreatorStats,
  // });

  return {
    // stats,
    // isLoading,
    // error,
    // refresh: refetch,
  };
}
