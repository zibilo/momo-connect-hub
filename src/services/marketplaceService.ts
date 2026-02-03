import { supabase } from '@/integrations/supabase/client';
import { Ticket, TicketFilter, CreatorProfile } from '@/types';

export interface MarketplaceFilters extends TicketFilter {
  sortBy?: 'price_asc' | 'price_desc' | 'odds_asc' | 'odds_desc' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}

export interface MarketplaceResult {
  tickets: Ticket[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getMarketplaceTickets(filters: MarketplaceFilters = {}): Promise<MarketplaceResult> {
  const { page = 1, limit = 12, sortBy = 'newest', ...ticketFilters } = filters;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('tickets')
    .select(`
      *,
      creator:creator_profiles(*)
    `, { count: 'exact' })
    .eq('visibility', 'public')
    .eq('status', 'pending')
    .gt('expires_at', new Date().toISOString());

  if (ticketFilters.sport) {
    query = query.contains('selections', [{ sport: ticketFilters.sport }]);
  }

  if (ticketFilters.minOdds) {
    query = query.gte('total_odds', ticketFilters.minOdds);
  }

  if (ticketFilters.maxOdds) {
    query = query.lte('total_odds', ticketFilters.maxOdds);
  }

  if (ticketFilters.minPrice) {
    query = query.gte('price', ticketFilters.minPrice);
  }

  if (ticketFilters.maxPrice) {
    query = query.lte('price', ticketFilters.maxPrice);
  }

  if (ticketFilters.creator_id) {
    query = query.eq('creator_id', ticketFilters.creator_id);
  }

  switch (sortBy) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'odds_asc':
      query = query.order('total_odds', { ascending: true });
      break;
    case 'odds_desc':
      query = query.order('total_odds', { ascending: false });
      break;
    case 'popular':
      query = query.order('sales_count', { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    tickets: (data as unknown as Ticket[]) || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export async function getFeaturedTickets(limit: number = 6): Promise<Ticket[]> {
  const { data, error } = await supabase
    .from('tickets')
    .select(`
      *,
      creator:creator_profiles(*)
    `)
    .eq('visibility', 'public')
    .eq('status', 'pending')
    .gt('expires_at', new Date().toISOString())
    .order('sales_count', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as unknown as Ticket[]) || [];
}

export async function getFeaturedCreators(limit: number = 10): Promise<CreatorProfile[]> {
  const { data, error } = await supabase
    .from('creator_profiles')
    .select('*')
    .eq('is_featured', true)
    .order('success_rate', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as CreatorProfile[]) || [];
}

export async function getCreatorProfile(userId: string): Promise<CreatorProfile | null> {
  const { data, error } = await supabase
    .from('creator_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as CreatorProfile;
}

export async function searchMarketplace(query: string): Promise<Ticket[]> {
  const { data, error } = await supabase
    .from('tickets')
    .select(`
      *,
      creator:creator_profiles(*)
    `)
    .eq('visibility', 'public')
    .eq('status', 'pending')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;
  return (data as unknown as Ticket[]) || [];
}

export async function getTopCreators(limit: number = 10): Promise<CreatorProfile[]> {
  const { data, error } = await supabase
    .from('creator_profiles')
    .select('*')
    .order('total_sales', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as CreatorProfile[]) || [];
}
