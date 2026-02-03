import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Ticket, PurchasedTicket, TicketFilter } from '@/types';
import {
  getTickets,
  getTicketById,
  getUserPurchasedTickets,
  getCreatorTickets,
  purchaseTicket,
  createTicket,
} from '@/services/ticketsService';
import { TicketInput } from '@/lib/validation';

export function useTickets(filters: TicketFilter = {}) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTickets(filters);
      setTickets(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return { tickets, loading, error, refresh: fetchTickets };
}

export function useTicket(ticketId: string | null) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTicket = useCallback(async () => {
    if (!ticketId) {
      setTicket(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getTicketById(ticketId);
      setTicket(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  return { ticket, loading, error, refresh: fetchTicket };
}

export function useMyPurchasedTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<PurchasedTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    if (!user) {
      setTickets([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getUserPurchasedTickets(user.id);
      setTickets(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return { tickets, loading, error, refresh: fetchTickets };
}

export function useCreatorTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    if (!user) {
      setTickets([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getCreatorTickets(user.id);
      setTickets(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return { tickets, loading, error, refresh: fetchTickets };
}

export function useTicketActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purchase = async (ticketId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await purchaseTicket(ticketId);
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur d\'achat';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const create = async (input: TicketInput) => {
    try {
      setLoading(true);
      setError(null);
      const result = await createTicket(input);
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur de création';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { purchase, create, loading, error };
}
