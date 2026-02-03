import { useState, useEffect, useCallback } from 'react';
import { Match, Sport, Competition } from '@/types';
import {
  getMatches,
  getUpcomingMatches,
  getLiveMatches,
  getMatchById,
  getCompetitions,
  getMatchOdds,
  MatchFilters,
} from '@/services/matchesService';

export function useMatches(filters: MatchFilters = {}) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMatches(filters);
      setMatches(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return { matches, loading, error, refresh: fetchMatches };
}

export function useUpcomingMatches(limit: number = 20) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUpcomingMatches(limit);
      setMatches(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return { matches, loading, error, refresh: fetchMatches };
}

export function useLiveMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLiveMatches();
      setMatches(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, [fetchMatches]);

  return { matches, loading, error, refresh: fetchMatches };
}

export function useMatch(matchId: string | null) {
  const [match, setMatch] = useState<Match | null>(null);
  const [odds, setOdds] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatch = useCallback(async () => {
    if (!matchId) {
      setMatch(null);
      setOdds([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [matchData, oddsData] = await Promise.all([
        getMatchById(matchId),
        getMatchOdds(matchId),
      ]);
      setMatch(matchData);
      setOdds(oddsData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    fetchMatch();
  }, [fetchMatch]);

  return { match, odds, loading, error, refresh: fetchMatch };
}

export function useCompetitions(sport?: Sport) {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompetitions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCompetitions(sport);
      setCompetitions(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [sport]);

  useEffect(() => {
    fetchCompetitions();
  }, [fetchCompetitions]);

  return { competitions, loading, error, refresh: fetchCompetitions };
}
