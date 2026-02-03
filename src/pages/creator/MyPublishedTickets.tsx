import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/common/EmptyState';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/lib/dates';
import { Trophy, Plus, Clock, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface TicketData {
  id: string;
  title: string;
  price: number;
  total_odds: number;
  status: string;
  visibility: string;
  created_at: string;
  sales_count?: number;
}

const MyPublishedTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (user) fetchTickets();
  }, [user]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('creator_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets((data as TicketData[]) || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(t => {
    if (activeTab === 'all') return true;
    return t.status === activeTab;
  });

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      active: { variant: 'secondary', label: 'Actif' },
      won: { variant: 'default', label: 'Gagné' },
      lost: { variant: 'destructive', label: 'Perdu' },
      pending: { variant: 'outline', label: 'En attente' },
    };
    const c = config[status] || config.pending;
    return <Badge variant={c.variant}>{c.label}</Badge>;
  };

  const getVisibilityBadge = (visibility: string) => {
    const labels: Record<string, string> = {
      public: 'Public',
      subscribers: 'Abonnés',
      private: 'Privé',
    };
    return <Badge variant="outline">{labels[visibility] || visibility}</Badge>;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mes Tickets Publiés</h1>
            <p className="text-muted-foreground mt-1">Gérez vos tickets de paris</p>
          </div>
          <Button asChild>
            <Link to="/creator/tickets/create">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Ticket
            </Link>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Tous ({tickets.length})</TabsTrigger>
            <TabsTrigger value="active">Actifs</TabsTrigger>
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
            ) : filteredTickets.length === 0 ? (
              <EmptyState
                icon={<Trophy className="w-8 h-8 text-muted-foreground" />}
                title="Aucun ticket"
                description="Créez votre premier ticket pour commencer à vendre."
                action={
                  <Button asChild>
                    <Link to="/creator/tickets/create">
                      <Plus className="w-4 h-4 mr-2" />
                      Créer un ticket
                    </Link>
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-4">
                {filteredTickets.map(ticket => (
                  <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{ticket.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>Cote: {ticket.total_odds?.toFixed(2)}</span>
                              <span>•</span>
                              <span>{formatDate(ticket.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Prix</p>
                            <p className="font-semibold">{formatCurrency(ticket.price)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getVisibilityBadge(ticket.visibility)}
                            {getStatusBadge(ticket.status)}
                          </div>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/tickets/${ticket.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
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

export default MyPublishedTickets;
