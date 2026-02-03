import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { Subscription, SubscriptionPlan, SUBSCRIPTION_PLANS } from '@/types';

interface SubscriptionContextType {
  subscription: Subscription | null;
  isCreator: boolean;
  canCreateTickets: boolean;
  ticketsCreatedThisMonth: number;
  maxTicketsPerMonth: number;
  commissionRate: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function useSubscriptionContext() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return context;
}

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [ticketsCreatedThisMonth, setTicketsCreatedThisMonth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setTicketsCreatedThisMonth(0);
      setLoading(false);
      return;
    }

    try {
      setError(null);

      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (subError && subError.code !== 'PGRST116') {
        throw subError;
      }

      setSubscription(subData as Subscription | null);

      if (subData) {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count, error: countError } = await supabase
          .from('tickets')
          .select('*', { count: 'exact', head: true })
          .eq('creator_id', user.id)
          .gte('created_at', startOfMonth.toISOString());

        if (countError) throw countError;
        setTicketsCreatedThisMonth(count || 0);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const currentPlan = subscription
    ? SUBSCRIPTION_PLANS.find(p => p.id === subscription.plan)
    : null;

  const isCreator = !!subscription && subscription.status === 'active';
  const maxTicketsPerMonth = currentPlan?.max_tickets_per_month ?? 0;
  const canCreateTickets = isCreator && (maxTicketsPerMonth === -1 || ticketsCreatedThisMonth < maxTicketsPerMonth);
  const commissionRate = currentPlan?.commission_rate ?? 0.05;

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isCreator,
        canCreateTickets,
        ticketsCreatedThisMonth,
        maxTicketsPerMonth,
        commissionRate,
        loading,
        error,
        refresh: fetchSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}
