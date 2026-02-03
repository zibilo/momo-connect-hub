import AppLayout from "@/components/layout/AppLayout";
import { useWalletContext } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import { WalletCard } from '@/components/wallet/WalletCard';
import { TransactionList } from '@/components/wallet/TransactionList';
import { DepositDialog } from '@/components/wallet/DepositDialog';
import { WithdrawDialog } from '@/components/wallet/WithdrawDialog';
import { initiateDeposit, initiateWithdrawal } from '@/services/paymentService';
import { RefreshButton } from "@/components/common/RefreshButton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { wallet, transactions, loading: walletLoading, refresh } = useWalletContext();
  const availableBalance = wallet ? wallet.balance - (wallet.locked_balance || 0) : 0;

  const handleDeposit = async (amount: number, phoneNumber: string) => {
    await initiateDeposit({ amount, phone_number: phoneNumber });
    refresh();
  };

  const handleWithdraw = async (amount: number, phoneNumber: string) => {
    await initiateWithdrawal({ amount, phone_number: phoneNumber });
    refresh();
  };

  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <LogIn className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Connectez-vous pour accéder au Dashboard</h2>
          <p className="text-muted-foreground mb-4">Vous devez être connecté pour voir votre portefeuille et vos transactions.</p>
          <Button asChild>
            <Link to="/login">Se connecter</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <RefreshButton onClick={refresh} loading={walletLoading} />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <WalletCard
              balance={wallet?.balance || 0}
              lockedBalance={wallet?.locked_balance || 0}
              currency={wallet?.currency || 'FCFA'}
              loading={walletLoading}
            />
            <div className="flex gap-3">
              <DepositDialog onDeposit={handleDeposit} />
              <WithdrawDialog onWithdraw={handleWithdraw} maxAmount={availableBalance} />
            </div>
          </div>
          <TransactionList transactions={transactions} />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
