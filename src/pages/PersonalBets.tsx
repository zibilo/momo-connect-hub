import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/common/EmptyState';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/lib/dates';
import { Users, Plus, LogIn, Trophy, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface PersonalBet {
  id: string;
  title: string;
  description: string;
  stake: number;
  odds: number;
  status: 'open' | 'accepted' | 'completed' | 'cancelled';
  creator_id: string;
  opponent_id?: string;
  winner_id?: string;
  created_at: string;
}

const PersonalBets = () => {
  const { user, loading: authLoading } = useAuth();
  const [bets, setBets] = useState<PersonalBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (user) {
      fetchBets();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchBets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('personal_bets')
        .select('*')
        .or(`creator_id.eq.${user?.id},opponent_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBets((data as PersonalBet[]) || []);
    } catch (error) {
      console.error('Error fetching bets:', error);
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
          <p className="text-muted-foreground mb-4">Vous devez être connecté pour voir vos paris personnels.</p>
          <Button asChild>
            <Link to="/login">Se connecter</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  const filteredBets = bets.filter(bet => {
    if (activeTab === 'all') return true;
    if (activeTab === 'created') return bet.creator_id === user?.id;
    if (activeTab === 'joined') return bet.opponent_id === user?.id;
    return bet.status === activeTab;
  });

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      open: { variant: 'outline', label: 'Ouvert' },
      accepted: { variant: 'secondary', label: 'En cours' },
      completed: { variant: 'default', label: 'Terminé' },
      cancelled: { variant: 'destructive', label: 'Annulé' },
    };
    const c = config[status] || config.open;
    return <Badge variant={c.variant}>{c.label}</Badge>;
  };

  const getResultIcon = (bet: PersonalBet) => {
    if (bet.status !== 'completed') return <Clock className="w-5 h-5 text-muted-foreground" />;
    if (bet.winner_id === user?.id) return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (bet.winner_id) return <XCircle className="w-5 h-5 text-red-500" />;
    return <Clock className="w-5 h-5 text-muted-foreground" />;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Paris Personnels</h1>
            <p className="text-muted-foreground mt-1">Créez et gérez vos paris entre amis</p>
          </div>
          <Button asChild>
            <Link to="/personal-bets/create">
              <Plus className="w-4 h-4 mr-2" />
              Créer un pari
            </Link>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="created">Créés</TabsTrigger>
            <TabsTrigger value="joined">Rejoints</TabsTrigger>
            <TabsTrigger value="open">Ouverts</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : filteredBets.length === 0 ? (
              <EmptyState
                icon={<Users className="w-8 h-8 text-muted-foreground" />}
                title="Aucun pari personnel"
                description="Créez votre premier pari et invitez vos amis à participer."
                action={
                  <Button asChild>
                    <Link to="/personal-bets/create">
                      <Plus className="w-4 h-4 mr-2" />
                      Créer un pari
                    </Link>
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-4">
                {filteredBets.map(bet => (
                  <Card key={bet.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            {getResultIcon(bet)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{bet.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">{bet.description}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <span>{formatDate(bet.created_at)}</span>
                              {bet.creator_id === user?.id && <Badge variant="outline" className="text-xs">Créateur</Badge>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Mise</p>
                            <p className="font-semibold">{formatCurrency(bet.stake)}</p>
                          </div>
                          {getStatusBadge(bet.status)}
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

export default PersonalBets;
