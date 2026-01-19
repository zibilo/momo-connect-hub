import { invokeEdgeFunction } from './api';
import { Ticket, PersonalBet, Selection } from '@/types/ticket';

/**
 * Creates a new ticket for a creator.
 * @param selections - The list of match selections.
 * @param price - The price of the ticket.
 * @returns A promise that resolves to the newly created ticket.
 */
export async function createTicket(selections: Selection[], price: 100 | 300 | 1000): Promise<Ticket> {
  console.log("Creating ticket...", { selections, price });
  return invokeEdgeFunction<Ticket>('ticket-create', { selections, price });
}

/**
 * Fetches the tickets for the currently authenticated user.
 * @returns A promise that resolves to an array of tickets.
 */
export async function getMyTickets(): Promise<Ticket[]> {
  console.log("Fetching my tickets...");
  // This would typically be a Supabase RLS query, not an edge function.
  return Promise.resolve([]); // Placeholder
}
