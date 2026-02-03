import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CreatorStats {
  totalTickets: number;
  totalSales: number;
  totalRevenue: number;
  totalCommissions: number;
  successRate: number;
  averageOdds: number;
  thisMonthSales: number;
  thisMonthRevenue: number;
}

interface SalesData {
  date: string;
  sales: number;
  revenue: number;
}

export function useCreatorStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<CreatorStats | null>(null);
  const [salesHistory, setSalesHistory] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!user) {
      setStats(null);
      setSalesHistory([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: profile, error: profileError } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      const { data: tickets, error: ticketsError } = await supabase
        .from('tickets')
        .select('id, total_odds, status, price')
        .eq('creator_id', user.id);

      if (ticketsError) throw ticketsError;

      const { data: sales, error: salesError } = await supabase
        .from('ticket_sales')
        .select('amount, commission, sold_at')
        .eq('seller_id', user.id);

      if (salesError) throw salesError;

      const wonTickets = tickets?.filter(t => t.status === 'won').length || 0;
      const totalTickets = tickets?.length || 0;
      const totalOdds = tickets?.reduce((acc, t) => acc + t.total_odds, 0) || 0;

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const thisMonthSales = sales?.filter(s => new Date(s.sold_at) >= startOfMonth) || [];

      setStats({
        totalTickets,
        totalSales: sales?.length || 0,
        totalRevenue: sales?.reduce((acc, s) => acc + s.amount, 0) || 0,
        totalCommissions: sales?.reduce((acc, s) => acc + s.commission, 0) || 0,
        successRate: totalTickets > 0 ? wonTickets / totalTickets : 0,
        averageOdds: totalTickets > 0 ? totalOdds / totalTickets : 0,
        thisMonthSales: thisMonthSales.length,
        thisMonthRevenue: thisMonthSales.reduce((acc, s) => acc + s.amount, 0),
      });

      const salesByDate = new Map<string, { sales: number; revenue: number }>();
      sales?.forEach(sale => {
        const date = new Date(sale.sold_at).toISOString().split('T')[0];
        const existing = salesByDate.get(date) || { sales: 0, revenue: 0 };
        salesByDate.set(date, {
          sales: existing.sales + 1,
          revenue: existing.revenue + sale.amount,
        });
      });

      const history: SalesData[] = Array.from(salesByDate.entries())
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-30);

      setSalesHistory(history);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, salesHistory, loading, error, refresh: fetchStats };
}
