import { supabase } from '@/integrations/supabase/client';
import { callEdgeFunction } from './api';
import { Ticket, PurchasedTicket, TicketFilter, TicketStatus, TicketVisibility } from '@/types';
import { TicketInput } from '@/lib/validation';

export async function getTickets(filters: TicketFilter = {}): Promise<Ticket[]> {
  let query = supabase
    .from('tickets')
    .select(`
      *,
      creator:creator_profiles(*)
    `)
    .order('created_at', { ascending: false });

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.visibility) {
    query = query.eq('visibility', filters.visibility);
  }

  if (filters.creator_id) {
    query = query.eq('creator_id', filters.creator_id);
  }

  if (filters.minOdds) {
    query = query.gte('total_odds', filters.minOdds);
  }

  if (filters.maxOdds) {
    query = query.lte('total_odds', filters.maxOdds);
  }

  if (filters.minPrice) {
    query = query.gte('price', filters.minPrice);
  }

  if (filters.maxPrice) {
    query = query.lte('price', filters.maxPrice);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data as unknown as Ticket[]) || [];
}

export async function getTicketById(id: string): Promise<Ticket | null> {
  const { data, error } = await supabase
    .from('tickets')
    .select(`
      *,
      creator:creator_profiles(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as unknown as Ticket;
}

export async function createTicket(input: TicketInput): Promise<Ticket> {
  const result = await callEdgeFunction<{ ticket: Ticket }>('ticket-create', input as unknown as Record<string, unknown>);
  return result.ticket;
}

export async function purchaseTicket(ticketId: string): Promise<PurchasedTicket> {
  const result = await callEdgeFunction<{ purchase: PurchasedTicket }>('ticket-purchase', {
    ticket_id: ticketId,
  });
  return result.purchase;
}

export async function getUserPurchasedTickets(userId: string): Promise<PurchasedTicket[]> {
  const { data, error } = await supabase
    .from('purchased_tickets')
    .select(`
      *,
      ticket:tickets(
        *,
        creator:creator_profiles(*)
      )
    `)
    .eq('user_id', userId)
    .order('purchased_at', { ascending: false });

  if (error) throw error;
  return (data as unknown as PurchasedTicket[]) || [];
}

export async function getCreatorTickets(creatorId: string): Promise<Ticket[]> {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as unknown as Ticket[]) || [];
}

export async function updateTicketStatus(ticketId: string, status: TicketStatus): Promise<void> {
  const { error } = await supabase
    .from('tickets')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', ticketId);

  if (error) throw error;
}

export async function verifyTicketResults(ticketId: string): Promise<{ status: TicketStatus }> {
  return callEdgeFunction<{ status: TicketStatus }>('ticket-verify-results', {
    ticket_id: ticketId,
  });
}

export async function getTicketSelections(ticketId: string) {
  const { data, error } = await supabase
    .from('ticket_selections')
    .select(`
      *,
      match:matches(
        *,
        home_team:teams!home_team_id(*),
        away_team:teams!away_team_id(*)
      )
    `)
    .eq('ticket_id', ticketId);

  if (error) throw error;
  return data || [];
}
