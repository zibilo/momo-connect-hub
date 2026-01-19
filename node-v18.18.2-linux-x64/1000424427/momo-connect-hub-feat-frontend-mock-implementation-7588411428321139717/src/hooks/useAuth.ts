import { useAuth as useSupabaseAuth } from '@/contexts/AuthContext';

/**
 * A simplified hook to access auth context.
 */
export function useAuth() {
  return useSupabaseAuth();
}
