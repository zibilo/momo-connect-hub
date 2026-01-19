import AppLayout from "@/components/layout/AppLayout";
import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";

const Subscriptions = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Subscriptions</h1>
        <p>Choose a plan to start publishing your predictions.</p>
        <SubscriptionPlans />
      </div>
    </AppLayout>
  );
};

export default Subscriptions;
