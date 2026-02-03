export type SubscriptionPlan = 'basic' | 'premium' | 'pro';

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'pending';

export interface SubscriptionPlanDetails {
  id: SubscriptionPlan;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  features: string[];
  max_tickets_per_month: number;
  commission_rate: number;
  is_popular?: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  price_paid: number;
  starts_at: string;
  expires_at: string;
  auto_renew: boolean;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionHistory {
  id: string;
  user_id: string;
  subscription_id: string;
  plan: SubscriptionPlan;
  action: 'subscribed' | 'renewed' | 'upgraded' | 'downgraded' | 'cancelled' | 'expired';
  amount?: number;
  created_at: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlanDetails[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Pour débuter en tant que créateur',
    price: 5000,
    duration_days: 30,
    features: [
      'Créer jusqu\'à 10 tickets/mois',
      'Commission: 5%',
      'Support standard',
      'Statistiques de base'
    ],
    max_tickets_per_month: 10,
    commission_rate: 0.05,
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Pour les créateurs réguliers',
    price: 15000,
    duration_days: 30,
    features: [
      'Créer jusqu\'à 50 tickets/mois',
      'Commission: 3%',
      'Support prioritaire',
      'Statistiques avancées',
      'Badge Premium'
    ],
    max_tickets_per_month: 50,
    commission_rate: 0.03,
    is_popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Pour les professionnels',
    price: 35000,
    duration_days: 30,
    features: [
      'Tickets illimités',
      'Commission: 1%',
      'Support VIP 24/7',
      'Analytics complet',
      'Badge Pro vérifié',
      'Mise en avant sur la marketplace'
    ],
    max_tickets_per_month: -1,
    commission_rate: 0.01,
  },
];
