import AppLayout from "@/components/layout/AppLayout";
import { useWalletContext } from '@/contexts/WalletContext';
import { WalletCard } from '@/components/wallet/WalletCard';
import { TransactionList } from '@/components/wallet/TransactionList';
import { DepositDialog } from '@/components/wallet/DepositDialog';
import { WithdrawDialog } from '@/components/wallet/WithdrawDialog';
import { deposit, withdraw } from '@/services/paymentService';
import { RefreshButton } from "@/components/common/RefreshButton";

const Dashboard = () => {
  const { wallet, transactions, loading, refreshWallet } = useWalletContext();
  const availableBalance = wallet ? wallet.balance - wallet.locked_balance : 0;

  const handleDeposit = async (amount: number, phoneNumber: string) => {
    await deposit(amount, phoneNumber);
    refreshWallet();
  };

  const handleWithdraw = async (amount: number, phoneNumber: string) => {
    await withdraw(amount, phoneNumber);
    refreshWallet();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <RefreshButton onClick={refreshWallet} isLoading={loading} />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <WalletCard
              balance={wallet?.balance || 0}
              lockedBalance={wallet?.locked_balance || 0}
              currency={wallet?.currency || 'XAF'}
              loading={loading}
            />
            <div className="flex gap-3">
              <DepositDialog onDeposit={handleDeposit} />
              <WithdrawDialog onWithdraw={handleWithdraw} maxAmount={availableBalance} />
            </div>
          </div>
          {/* <TransactionList
            transactions={transactions} 
            loading={loading} 
            onCheckStatus={() => {}}
          /> */}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
