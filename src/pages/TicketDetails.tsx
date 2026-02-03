import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/currency';
import { formatDate, formatMatchDate } from '@/lib/dates';
import { Trophy, ArrowLeft, Clock, CheckCircle2, XCircle, ShoppingCart, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Ticket, TicketStatus } from '@/types/ticket';
import { BetSelection } from '@/types/match';
import { useAuth } from '@/contexts/AuthContext';
import { useWalletContext } from '@/contexts/WalletContext';
import { useToast } from '@/hooks/use-toast';

const TicketDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { wallet, refresh } = useWalletContext();
  const { toast } = useToast();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (id) fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setTicket({
        ...data,
        selections: (data.selections || []) as BetSelection[],
        status: data.status as TicketStatus,
      });
    } catch (error) {
      console.error('Error fetching ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user || !ticket || !wallet) return;

    if (wallet.balance < ticket.price) {
      toast({
        title: 'Solde insuffisant',
        description: 'Veuillez recharger votre portefeuille.',
        variant: 'destructive',
      });
      return;
    }

    setPurchasing(true);
    try {
      const { error: purchaseError } = await supabase
        .from('purchased_tickets')
        .insert({
          ticket_id: ticket.id,
          user_id: user.id,
          purchase_price: ticket.price,
        });

      if (purchaseError) throw purchaseError;

      const { error: walletError } = await supabase
        .from('wallets')
        .update({ balance: wallet.balance - ticket.price })
        .eq('user_id', user.id);

      if (walletError) throw walletError;

      toast({
        title: 'Achat réussi',
        description: 'Le ticket a été ajouté à votre collection.',
      });

      refresh();
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: 'Erreur',
        description: "L'achat a échoué. Veuillez réessayer.",
        variant: 'destructive',
      });
    } finally {
      setPurchasing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string; icon: React.ReactNode }> = {
      won: { variant: 'default', label: 'Gagné', icon: <CheckCircle2 className="w-3 h-3" /> },
      lost: { variant: 'destructive', label: 'Perdu', icon: <XCircle className="w-3 h-3" /> },
      active: { variant: 'secondary', label: 'En cours', icon: <Clock className="w-3 h-3" /> },
      pending: { variant: 'outline', label: 'En attente', icon: <Clock className="w-3 h-3" /> },
    };
    const c = config[status] || config.pending;
    return (
      <Badge variant={c.variant} className="flex items-center gap-1">
        {c.icon}
        {c.label}
      </Badge>
    );
  };

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'won':
        return <Badge variant="default" className="bg-green-500">Gagné</Badge>;
      case 'lost':
        return <Badge variant="destructive">Perdu</Badge>;
      default:
        return <Badge variant="outline">En attente</Badge>;
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  if (!ticket) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Ticket introuvable</h2>
          <Button asChild variant="outline">
            <Link to="/marketplace">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au marketplace
            </Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  const potentialGain = ticket.stake_suggestion 
    ? Math.floor(ticket.stake_suggestion * ticket.total_odds)
    : Math.floor(ticket.price * ticket.total_odds * 10);

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/marketplace">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Link>
        </Button>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    {ticket.title}
                  </CardTitle>
                  {getStatusBadge(ticket.status)}
                </div>
              </CardHeader>
              <CardContent>
                {ticket.description && (
                  <p className="text-muted-foreground mb-4">{ticket.description}</p>
                )}
                <div className="text-sm text-muted-foreground">
                  Créé le {formatDate(ticket.created_at)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sélections ({ticket.selections.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ticket.selections.map((selection, index) => (
                  <div key={selection.id || index} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{selection.market}</span>
                      {getOutcomeBadge(selection.outcome)}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{selection.selection}</span>
                      <span className="font-semibold text-primary">{selection.odds.toFixed(2)}</span>
                    </div>
                    {selection.match && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        {selection.match.home_team?.name} vs {selection.match.away_team?.name}
                        {selection.match.start_time && ` • ${formatMatchDate(selection.match.start_time)}`}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Résumé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prix</span>
                  <span className="font-bold">{formatCurrency(ticket.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cote totale</span>
                  <span className="font-bold text-primary">{ticket.total_odds.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gain potentiel</span>
                  <span className="font-bold text-green-600">{formatCurrency(potentialGain)}</span>
                </div>

                {user ? (
                  <Button 
                    className="w-full" 
                    onClick={handlePurchase}
                    disabled={purchasing || ticket.status !== 'active'}
                  >
                    {purchasing ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Acheter ce ticket
                      </>
                    )}
                  </Button>
                ) : (
                  <Button asChild className="w-full">
                    <Link to="/login">
                      <User className="w-4 h-4 mr-2" />
                      Se connecter pour acheter
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TicketDetails;
