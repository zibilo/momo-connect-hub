export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'postponed' | 'cancelled';

export type Sport = 'football' | 'basketball' | 'tennis' | 'volleyball' | 'handball';

export interface Team {
  id: string;
  name: string;
  short_name: string;
  logo_url?: string;
  country?: string;
}

export interface Competition {
  id: string;
  name: string;
  short_name: string;
  logo_url?: string;
  country?: string;
  sport: Sport;
}

export interface Match {
  id: string;
  competition_id: string;
  competition?: Competition;
  home_team_id: string;
  home_team: Team;
  away_team_id: string;
  away_team: Team;
  start_time: string;
  status: MatchStatus;
  home_score?: number;
  away_score?: number;
  sport: Sport;
  created_at: string;
  updated_at: string;
}

export interface MatchOdds {
  id: string;
  match_id: string;
  market: string;
  selection: string;
  odds: number;
  is_available: boolean;
  updated_at: string;
}

export type BetOutcome = 'pending' | 'won' | 'lost' | 'void';

export interface BetSelection {
  id: string;
  match_id: string;
  match?: Match;
  market: string;
  selection: string;
  odds: number;
  outcome: BetOutcome;
}
