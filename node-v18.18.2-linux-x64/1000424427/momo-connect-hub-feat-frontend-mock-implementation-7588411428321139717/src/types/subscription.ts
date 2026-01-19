export type SubscriptionPlanName = '1_day' | '2_week' | '1_month' | '1_year' | 'enterprise';

export interface SubscriptionPlan {
  name: SubscriptionPlanName;
  price: number;
  duration_days: number;
  can_print: boolean;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_name: SubscriptionPlanName;
  start_date: string;
  end_date: string;
  is_active: boolean;
}
