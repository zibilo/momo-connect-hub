import { supabase } from '@/integrations/supabase/client';
import { Match, Competition, Sport, MatchStatus } from '@/types';

export interface MatchFilters {
  sport?: Sport;
  competition_id?: string;
  status?: MatchStatus;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export async function getMatches(filters: MatchFilters = {}): Promise<Match[]> {
  let query = supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id(*),
      away_team:teams!away_team_id(*),
      competition:competitions(*)
    `)
    .order('start_time', { ascending: true });

  if (filters.sport) {
    query = query.eq('sport', filters.sport);
  }

  if (filters.competition_id) {
    query = query.eq('competition_id', filters.competition_id);
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.date_from) {
    query = query.gte('start_time', filters.date_from);
  }

  if (filters.date_to) {
    query = query.lte('start_time', filters.date_to);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data as unknown as Match[]) || [];
}

export async function getUpcomingMatches(limit: number = 20): Promise<Match[]> {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id(*),
      away_team:teams!away_team_id(*),
      competition:competitions(*)
    `)
    .gte('start_time', now)
    .in('status', ['scheduled', 'live'])
    .order('start_time', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data as unknown as Match[]) || [];
}

export async function getLiveMatches(): Promise<Match[]> {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id(*),
      away_team:teams!away_team_id(*),
      competition:competitions(*)
    `)
    .eq('status', 'live')
    .order('start_time', { ascending: true });

  if (error) throw error;
  return (data as unknown as Match[]) || [];
}

export async function getMatchById(id: string): Promise<Match | null> {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id(*),
      away_team:teams!away_team_id(*),
      competition:competitions(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as unknown as Match;
}

export async function getCompetitions(sport?: Sport): Promise<Competition[]> {
  let query = supabase
    .from('competitions')
    .select('*')
    .order('name', { ascending: true });

  if (sport) {
    query = query.eq('sport', sport);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data as Competition[]) || [];
}

export async function getMatchOdds(matchId: string) {
  const { data, error } = await supabase
    .from('match_odds')
    .select('*')
    .eq('match_id', matchId)
    .eq('is_available', true);

  if (error) throw error;
  return data || [];
}

export async function searchMatches(query: string): Promise<Match[]> {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!home_team_id(*),
      away_team:teams!away_team_id(*),
      competition:competitions(*)
    `)
    .or(`home_team.name.ilike.%${query}%,away_team.name.ilike.%${query}%`)
    .order('start_time', { ascending: true })
    .limit(20);

  if (error) throw error;
  return (data as unknown as Match[]) || [];
}
