export type TicketStatus = 'pending' | 'active' | 'won' | 'lost' | 'cancelled';

export interface Selection {
  match_id: string;
  prediction: string; // e.g., "1-0", "X", "2"
  odds: number;
  result?: 'won' | 'lost' | 'pending';
}

export interface Ticket {
  id: string;
  creator_id: string;
  selections: Selection[];
  price: 100 | 300 | 1000;
  total_odds: number;
  potential_gain: number;
  status: TicketStatus;
  created_at: string;
  is_physical: boolean;
  verification_code?: string;
}

export interface PersonalBet {
  id: string;
  user_id: string;
  selections: Selection[];
  total_odds: number;
  potential_gain: number;
  status: 'pending' | 'won' | 'lost';
  created_at: string;
}
