import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/lib/dates';
import { Ticket, LogIn, Trophy, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface PurchasedTicketData {
  id: string;
  ticket_id: string;
  purchase_price: number;
  purchased_at: string;
  ticket: {
    id: string;
    title: string;
    total_odds: number;
    status: string;
    selections: unknown[];
  };
}

const MyTickets = () => {
  const { user, loading: authLoading } = useAuth();
  const [purchases, setPurchases] = useState<PurchasedTicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (user) {
      fetchPurchases();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('purchased_tickets')
        .select(`
          id,
          ticket_id,
          purchase_price,
          purchased_at,
          ticket:tickets(id, title, total_odds, status, selections)
        `)
        .eq('user_id', user?.id)
        .order('purchased_at', { ascending: false });

      if (error) throw error;
      setPurchases((data as unknown as PurchasedTicketData[]) || []);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <LogIn className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Connectez-vous</h2>
          <p className="text-muted-foreground mb-4">Vous devez être connecté pour voir vos tickets.</p>
          <Button asChild>
            <Link to="/login">Se connecter</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  const filteredPurchases = purchases.filter(p => {
    if (activeTab === 'all') return true;
    return p.ticket?.status === activeTab;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'won': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'lost': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'active': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      won: 'default',
      lost: 'destructive',
      active: 'secondary',
      pending: 'outline',
    };
    const labels: Record<string, string> = {
      won: 'Gagné',
      lost: 'Perdu',
      active: 'En cours',
      pending: 'En attente',
    };
    return <Badge variant={variants[status] || 'outline'}>{labels[status] || status}</Badge>;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mes Tickets</h1>
          <p className="text-muted-foreground mt-1">Suivez vos tickets achetés</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="active">En cours</TabsTrigger>
            <TabsTrigger value="won">Gagnés</TabsTrigger>
            <TabsTrigger value="lost">Perdus</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : filteredPurchases.length === 0 ? (
              <EmptyState
                icon={<Ticket className="w-8 h-8 text-muted-foreground" />}
                title="Aucun ticket"
                description={activeTab === 'all' 
                  ? "Vous n'avez pas encore acheté de tickets."
                  : `Aucun ticket ${activeTab === 'won' ? 'gagné' : activeTab === 'lost' ? 'perdu' : 'en cours'}.`
                }
                action={
                  <Button asChild>
                    <Link to="/marketplace">Explorer le marketplace</Link>
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-4">
                {filteredPurchases.map(purchase => (
                  <Card key={purchase.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{purchase.ticket?.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>Cote: {purchase.ticket?.total_odds?.toFixed(2)}</span>
                              <span>•</span>
                              <span>{formatDate(purchase.purchased_at)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Prix payé</p>
                            <p className="font-semibold">{formatCurrency(purchase.purchase_price)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(purchase.ticket?.status || 'pending')}
                            {getStatusBadge(purchase.ticket?.status || 'pending')}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default MyTickets;
