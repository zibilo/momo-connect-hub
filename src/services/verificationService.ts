import { supabase } from '@/integrations/supabase/client';
import { callEdgeFunction } from './api';
import { PhysicalTicket } from '@/types';

export interface VerificationResult {
  valid: boolean;
  ticket?: PhysicalTicket;
  status: 'valid' | 'invalid' | 'claimed' | 'expired' | 'not_found';
  message: string;
  potential_gain?: number;
}

export interface ClaimResult {
  success: boolean;
  amount?: number;
  transaction_id?: string;
  message: string;
}

export async function verifyPhysicalTicket(code: string): Promise<VerificationResult> {
  return callEdgeFunction<VerificationResult>('physical-ticket-verify', {
    verification_code: code,
  });
}

export async function claimPhysicalTicketGain(
  code: string,
  phoneNumber: string
): Promise<ClaimResult> {
  return callEdgeFunction<ClaimResult>('physical-ticket-claim', {
    verification_code: code,
    phone_number: phoneNumber,
  });
}

export async function getPhysicalTicketByCode(code: string): Promise<PhysicalTicket | null> {
  const { data, error } = await supabase
    .from('physical_tickets')
    .select(`
      *,
      ticket:tickets(
        *,
        creator:creator_profiles(*)
      )
    `)
    .eq('verification_code', code)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as unknown as PhysicalTicket;
}

export async function generatePhysicalTicket(ticketId: string): Promise<PhysicalTicket> {
  const result = await callEdgeFunction<{ physical_ticket: PhysicalTicket }>('physical-ticket-generate', {
    ticket_id: ticketId,
  });
  return result.physical_ticket;
}

export async function getCreatorPhysicalTickets(creatorId: string): Promise<PhysicalTicket[]> {
  const { data, error } = await supabase
    .from('physical_tickets')
    .select(`
      *,
      ticket:tickets(*)
    `)
    .eq('printed_by', creatorId)
    .order('printed_at', { ascending: false });

  if (error) throw error;
  return (data as unknown as PhysicalTicket[]) || [];
}

export async function markPhysicalTicketAsSold(physicalTicketId: string): Promise<void> {
  const { error } = await supabase
    .from('physical_tickets')
    .update({
      sold: true,
      sold_at: new Date().toISOString(),
    })
    .eq('id', physicalTicketId);

  if (error) throw error;
}

export function generateVerificationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function formatVerificationCode(code: string): string {
  const clean = code.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  if (clean.length === 8) {
    return `${clean.slice(0, 4)}-${clean.slice(4)}`;
  }
  return clean;
}

export const VERIFICATION_STATUS_MESSAGES: Record<string, string> = {
  'valid': 'Ticket valide et gagnant!',
  'invalid': 'Ticket invalide',
  'claimed': 'Ce ticket a déjà été réclamé',
  'expired': 'Ce ticket a expiré',
  'not_found': 'Ticket non trouvé',
  'pending': 'Résultats en attente de vérification',
  'lost': 'Ce ticket est perdant',
};
