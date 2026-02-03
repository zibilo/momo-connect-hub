import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Subscription, SUBSCRIPTION_PLANS, SubscriptionPlanDetails } from '@/types';
import { paySubscription } from '@/services/paymentService';

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      setSubscription(data as Subscription | null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const subscribe = async (planId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await paySubscription(planId);
      await fetchSubscription();
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur de paiement';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const currentPlan: SubscriptionPlanDetails | undefined = subscription
    ? SUBSCRIPTION_PLANS.find(p => p.id === subscription.plan)
    : undefined;

  const isActive = !!subscription && subscription.status === 'active';
  const daysRemaining = subscription
    ? Math.ceil((new Date(subscription.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return {
    subscription,
    currentPlan,
    isActive,
    daysRemaining,
    loading,
    error,
    subscribe,
    refresh: fetchSubscription,
    plans: SUBSCRIPTION_PLANS,
  };
}
