import AppLayout from "@/components/layout/AppLayout";
import SubscriptionStatus from "@/components/subscription/SubscriptionStatus";
import StatsCards from "@/components/creator/StatsCards";
import SalesChart from "@/components/creator/SalesChart";
import CommissionHistory from "@/components/creator/CommissionHistory";
import { useSubscription } from "@/hooks/useSubscription";
import { formatDate } from "@/lib/dates";

const CreatorDashboard = () => {
  const { subscription, isLoading } = useSubscription();

  const subDetails = subscription ? {
    plan: subscription.plan_name,
    expires: formatDate(subscription.end_date),
  } : null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Creator Dashboard</h1>
        <StatsCards />
        <div className="grid gap-6 md:grid-cols-2">
          <SalesChart />
          <SubscriptionStatus subscription={subDetails} />
        </div>
        <CommissionHistory />
      </div>
    </AppLayout>
  );
};

export default CreatorDashboard;
