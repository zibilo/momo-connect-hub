import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import MarketplaceGrid from '@/components/marketplace/MarketplaceGrid';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Ticket, TicketStatus } from '@/types/ticket';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Marketplace = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sportFilter, setSportFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('visibility', 'public')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedTickets: Ticket[] = (data || []).map(t => ({
        id: t.id,
        creator_id: t.creator_id,
        title: t.title,
        description: t.description,
        selections: t.selections || [],
        total_odds: t.total_odds,
        stake_suggestion: t.stake_suggestion,
        price: t.price,
        visibility: t.visibility,
        status: t.status as TicketStatus,
        result_verified: t.result_verified || false,
        verification_code: t.verification_code,
        qr_code_url: t.qr_code_url,
        expires_at: t.expires_at,
        created_at: t.created_at,
        updated_at: t.updated_at,
      }));
      
      setTickets(formattedTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (search && !ticket.title.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'odds_desc':
        return b.total_odds - a.total_odds;
      case 'recent':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground mt-1">Découvrez les meilleurs tickets de paris</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un ticket..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={sportFilter} onValueChange={setSportFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous sports</SelectItem>
              <SelectItem value="football">Football</SelectItem>
              <SelectItem value="basketball">Basketball</SelectItem>
              <SelectItem value="tennis">Tennis</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Plus récents</SelectItem>
              <SelectItem value="price_asc">Prix croissant</SelectItem>
              <SelectItem value="price_desc">Prix décroissant</SelectItem>
              <SelectItem value="odds_desc">Meilleures cotes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <MarketplaceGrid tickets={sortedTickets} isLoading={loading} />
      </div>
    </AppLayout>
  );
};

export default Marketplace;
