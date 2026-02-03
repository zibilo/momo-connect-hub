import { BetSelection, BetOutcome } from './match';
import { CreatorProfile } from './user';

export type TicketStatus = 'pending' | 'active' | 'won' | 'lost' | 'partial' | 'cancelled';

export type TicketVisibility = 'public' | 'subscribers' | 'private';

export interface Ticket {
  id: string;
  creator_id: string;
  creator?: CreatorProfile;
  title: string;
  description?: string;
  selections: BetSelection[];
  total_odds: number;
  stake_suggestion?: number;
  price: number;
  visibility: TicketVisibility;
  status: TicketStatus;
  result_verified: boolean;
  verification_code?: string;
  qr_code_url?: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface PurchasedTicket {
  id: string;
  ticket_id: string;
  ticket: Ticket;
  user_id: string;
  purchase_price: number;
  purchased_at: string;
  is_physical: boolean;
  physical_code?: string;
  claimed: boolean;
  claimed_at?: string;
}

export interface PhysicalTicket {
  id: string;
  ticket_id: string;
  ticket: Ticket;
  verification_code: string;
  qr_code_url: string;
  printed_by: string;
  printed_at: string;
  sold: boolean;
  sold_at?: string;
  claimed: boolean;
  claimed_at?: string;
  claim_amount?: number;
}

export interface TicketSale {
  id: string;
  ticket_id: string;
  seller_id: string;
  buyer_id: string;
  amount: number;
  commission: number;
  commission_rate: number;
  sold_at: string;
}

export interface TicketFilter {
  sport?: string;
  minOdds?: number;
  maxOdds?: number;
  minPrice?: number;
  maxPrice?: number;
  creator_id?: string;
  status?: TicketStatus;
  visibility?: TicketVisibility;
}
