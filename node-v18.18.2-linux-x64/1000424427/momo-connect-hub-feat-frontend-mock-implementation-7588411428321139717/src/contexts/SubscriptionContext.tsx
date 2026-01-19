import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserSubscription } from '@/types/subscription';
import { useAuth } from './AuthContext';
// import { getUserSubscription } from '@/services/subscriptionService'; // This service would need to be created

interface SubscriptionContextType {
  subscription: UserSubscription | null;
  loading: boolean;
  refreshSubscription: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscriptionContext = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptionData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // const subscriptionData = await getUserSubscription(user.id);
      // setSubscription(subscriptionData);
    } catch (error) {
      console.error("Failed to fetch subscription data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSubscriptionData();
  }, [fetchSubscriptionData]);

  return (
    <SubscriptionContext.Provider value={{ subscription, loading, refreshSubscription: fetchSubscriptionData }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
