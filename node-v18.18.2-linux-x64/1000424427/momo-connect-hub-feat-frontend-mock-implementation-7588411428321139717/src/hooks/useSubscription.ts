import { useSubscriptionContext } from '@/contexts/SubscriptionContext';
import { payForSubscription } from '@/services/paymentService';
import { SubscriptionPlanName } from '@/types/subscription';

export function useSubscription() {
  const { subscription, loading, refreshSubscription } = useSubscriptionContext();

  const subscribe = async (plan: SubscriptionPlanName, phoneNumber: string) => {
    // Handle the payment process
    await payForSubscription(plan, phoneNumber);
    // After payment confirmation (via webhook), refresh the subscription status
    refreshSubscription();
  };

  return {
    subscription,
    isLoading: loading,
    subscribe,
    refresh: refreshSubscription,
  };
}
