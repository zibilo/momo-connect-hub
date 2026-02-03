import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/lib/dates';
import { Wallet, TrendingUp, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Commission {
  id: string;
  ticket_id: string;
  amount: number;
  commission: number;
  commission_rate: number;
  sold_at: string;
  ticket?: {
    title: string;
  };
}

const Commissions = () => {
  const { user } = useAuth();
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchCommissions();
  }, [user]);

  const fetchCommissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ticket_sales')
        .select(`
          id,
          ticket_id,
          amount,
          commission,
          commission_rate,
          sold_at,
          ticket:tickets(title)
        `)
        .eq('seller_id', user?.id)
        .order('sold_at', { ascending: false });

      if (error) throw error;
      setCommissions((data as unknown as Commission[]) || []);
    } catch (error) {
      console.error('Error fetching commissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalCommissions: commissions.reduce((sum, c) => sum + c.commission, 0),
    totalSales: commissions.reduce((sum, c) => sum + c.amount, 0),
    count: commissions.length,
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mes Commissions</h1>
          <p className="text-muted-foreground mt-1">Historique de vos gains sur les ventes</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary" />
                Total Commissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{formatCurrency(stats.totalCommissions)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Ventes Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalSales)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-blue-500" />
                Nombre de Ventes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.count}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Historique des commissions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : commissions.length === 0 ? (
              <EmptyState
                icon={<Wallet className="w-8 h-8 text-muted-foreground" />}
                title="Aucune commission"
                description="Vos commissions apparaîtront ici lorsque vos tickets seront vendus."
              />
            ) : (
              <div className="space-y-4">
                {commissions.map(commission => (
                  <div key={commission.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium">{commission.ticket?.title || 'Ticket'}</h4>
                      <p className="text-sm text-muted-foreground">
                        Vente de {formatCurrency(commission.amount)} • {formatDate(commission.sold_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">+{formatCurrency(commission.commission)}</p>
                      <Badge variant="outline">{(commission.commission_rate * 100).toFixed(0)}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Commissions;
