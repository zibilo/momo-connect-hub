import { invokeEdgeFunction } from './api';
import { Ticket } from '@/types/ticket';

/**
 * Verifies a physical ticket using its verification code.
 * @param verificationCode - The code printed on the physical ticket.
 * @returns A promise that resolves to the verified ticket.
 */
export async function verifyPhysicalTicket(verificationCode: string): Promise<Ticket> {
  console.log(`Verifying physical ticket with code ${verificationCode}...`);
  return invokeEdgeFunction<Ticket>('physical-ticket-verify', { verificationCode });
}

/**
 * Claims the gain from a winning physical ticket.
 * @param ticketId - The ID of the winning ticket.
 * @returns A promise that resolves when the gain has been claimed.
 */
export async function claimPhysicalTicketGain(ticketId: string): Promise<void> {
  console.log(`Claiming gain for ticket ${ticketId}...`);
  return invokeEdgeFunction<void>('physical-ticket-claim', { ticketId });
}
