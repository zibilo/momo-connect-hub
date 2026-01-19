import { useOnlineStatus as useBaseOnlineStatus } from '@/contexts/OnlineStatusContext';

/**
 * Hook to check if the user is currently online.
 */
export function useOnlineStatus() {
  return useBaseOnlineStatus();
}
