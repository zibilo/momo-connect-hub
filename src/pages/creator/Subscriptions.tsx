import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';
import { formatCurrency } from '@/lib/currency';
import { Users, Crown, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Subscription {
  id: string;
  subscriber_id: string;
  plan: string;
  status: string;
  started_at: string;
  expires_at: string;
  subscriber?: {
    full_name: string;
  };
}

const Subscriptions = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchSubscriptions();
  }, [user]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          id,
          subscriber_id,
          plan,
          status,
          started_at,
          expires_at,
          subscriber:profiles!subscriber_id(full_name)
        `)
        .eq('creator_id', user?.id)
        .order('started_at', { ascending: false });

      if (error) throw error;
      setSubscriptions((data as unknown as Subscription[]) || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');

  const getPlanBadge = (plan: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'outline'; label: string; icon: React.ReactNode }> = {
      premium: { variant: 'default', label: 'Premium', icon: <Crown className="w-3 h-3" /> },
      basic: { variant: 'secondary', label: 'Basic', icon: <Star className="w-3 h-3" /> },
    };
    const c = config[plan] || config.basic;
    return (
      <Badge variant={c.variant} className="flex items-center gap-1">
        {c.icon}
        {c.label}
      </Badge>
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mes Abonnés</h1>
          <p className="text-muted-foreground mt-1">Gérez vos abonnements</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Abonnés Actifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{activeSubscriptions.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-500" />
                Premium
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {activeSubscriptions.filter(s => s.plan === 'premium').length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des abonnés</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : subscriptions.length === 0 ? (
              <EmptyState
                icon={<Users className="w-8 h-8 text-muted-foreground" />}
                title="Aucun abonné"
                description="Vos abonnés apparaîtront ici."
              />
            ) : (
              <div className="space-y-4">
                {subscriptions.map(sub => (
                  <div key={sub.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{sub.subscriber?.full_name || 'Utilisateur'}</h4>
                        <p className="text-sm text-muted-foreground">
                          Expire le {new Date(sub.expires_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPlanBadge(sub.plan)}
                      <Badge variant={sub.status === 'active' ? 'default' : 'outline'}>
                        {sub.status === 'active' ? 'Actif' : 'Expiré'}
                      </Badge>
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

export default Subscriptions;
