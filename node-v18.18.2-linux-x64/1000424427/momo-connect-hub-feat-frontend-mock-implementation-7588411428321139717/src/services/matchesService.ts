import { invokeEdgeFunction } from './api';
import { Match } from '@/types/match';

/**
 * Fetches the list of current matches from the sports API.
 * @returns A promise that resolves to an array of matches.
 */
export async function getMatches(): Promise<Match[]> {
  // This would typically call an edge function that syncs with a sports API.
  console.log("Fetching matches...");
  // return invokeEdgeFunction<Match[]>('matches-sync', {});
  return Promise.resolve([]); // Placeholder
}

/**
 * Fetches the results for finished matches.
 * @returns A promise that resolves to an array of match results.
 */
export async function getMatchResults(): Promise<Partial<Match>[]> {
  console.log("Fetching match results...");
  // return invokeEdgeFunction<Partial<Match>[]>('results-sync', {});
  return Promise.resolve([]); // Placeholder
}
