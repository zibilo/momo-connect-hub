import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Trophy, Plus, TrendingUp, Users, Wallet, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/currency';

const CreatorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTickets: 0,
    activeTickets: 0,
    totalSales: 0,
    totalCommissions: 0,
    subscribers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchStats();
  }, [user]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data: tickets } = await supabase
        .from('tickets')
        .select('id, status')
        .eq('creator_id', user?.id);

      const { data: sales } = await supabase
        .from('ticket_sales')
        .select('amount, commission')
        .eq('seller_id', user?.id);

      const totalTickets = tickets?.length || 0;
      const activeTickets = tickets?.filter(t => t.status === 'active').length || 0;
      const totalSales = sales?.reduce((sum, s) => sum + s.amount, 0) || 0;
      const totalCommissions = sales?.reduce((sum, s) => sum + s.commission, 0) || 0;

      setStats({
        totalTickets,
        activeTickets,
        totalSales,
        totalCommissions,
        subscribers: 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tableau de Bord Créateur</h1>
            <p className="text-muted-foreground mt-1">Gérez vos tickets et suivez vos performances</p>
          </div>
          <Button asChild>
            <Link to="/creator/tickets/create">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Ticket
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                Total Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loading ? '...' : stats.totalTickets}</p>
              <p className="text-xs text-muted-foreground">{stats.activeTickets} actifs</p>
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
              <p className="text-2xl font-bold text-green-600">{loading ? '...' : formatCurrency(stats.totalSales)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Wallet className="w-4 h-4 text-purple-500" />
                Commissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600">{loading ? '...' : formatCurrency(stats.totalCommissions)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                Abonnés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{loading ? '...' : stats.subscribers}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/creator/tickets/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un nouveau ticket
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/creator/tickets">
                  <Trophy className="w-4 h-4 mr-2" />
                  Voir mes tickets publiés
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/creator/commissions">
                  <Wallet className="w-4 h-4 mr-2" />
                  Historique des commissions
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/creator/print">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Imprimer des tickets
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conseils</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium mb-1">Augmentez vos ventes</h4>
                <p className="text-sm text-muted-foreground">
                  Publiez régulièrement des tickets avec des analyses détaillées pour fidéliser vos acheteurs.
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium mb-1">Diversifiez vos paris</h4>
                <p className="text-sm text-muted-foreground">
                  Proposez différents types de tickets (sûrs, risqués) pour toucher plus d'acheteurs.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default CreatorDashboard;
