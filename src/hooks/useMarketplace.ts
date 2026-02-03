import { useState, useEffect, useCallback } from 'react';
import { Ticket } from '@/types';
import {
  getMarketplaceTickets,
  getFeaturedTickets,
  searchMarketplace,
  MarketplaceFilters,
  MarketplaceResult,
} from '@/services/marketplaceService';

export function useMarketplace(filters: MarketplaceFilters = {}) {
  const [result, setResult] = useState<MarketplaceResult>({
    tickets: [],
    total: 0,
    page: 1,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMarketplaceTickets(filters);
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return {
    tickets: result.tickets,
    total: result.total,
    page: result.page,
    totalPages: result.totalPages,
    loading,
    error,
    refresh: fetchTickets,
  };
}

export function useFeaturedTickets(limit: number = 6) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFeaturedTickets(limit);
      setTickets(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return { tickets, loading, error, refresh: fetchTickets };
}

export function useMarketplaceSearch() {
  const [results, setResults] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await searchMarketplace(query);
      setResults(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de recherche');
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { results, loading, error, search, clear };
}
