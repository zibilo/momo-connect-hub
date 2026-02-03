import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useWalletContext } from '@/contexts/WalletContext';
import { WalletCard } from '@/components/wallet/WalletCard';
import { TransactionList } from '@/components/wallet/TransactionList';
import { DepositDialog } from '@/components/wallet/DepositDialog';
import { WithdrawDialog } from '@/components/wallet/WithdrawDialog';
import { initiateDeposit, initiateWithdrawal, checkTransactionStatus } from '@/services/paymentService';
import { RefreshButton } from '@/components/common/RefreshButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { LogIn, ArrowUpRight, ArrowDownLeft, History } from 'lucide-react';

const Wallet = () => {
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

  const handleCheckStatus = async (transactionId: string) => {
    const result = await checkTransactionStatus(transactionId);
    refresh();
    return result;
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
          <h2 className="text-xl font-semibold mb-2">Connectez-vous</h2>
          <p className="text-muted-foreground mb-4">Vous devez être connecté pour accéder à votre portefeuille.</p>
          <Button asChild>
            <Link to="/login">Se connecter</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  const stats = {
    totalDeposits: transactions.filter(t => t.type === 'deposit' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    totalWithdrawals: transactions.filter(t => t.type === 'withdrawal' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    pendingCount: transactions.filter(t => t.status === 'pending').length,
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Portefeuille</h1>
            <p className="text-muted-foreground mt-1">Gérez vos fonds</p>
          </div>
          <RefreshButton onClick={refresh} loading={walletLoading} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <WalletCard
            balance={wallet?.balance || 0}
            lockedBalance={wallet?.locked_balance || 0}
            currency={wallet?.currency || 'FCFA'}
            loading={walletLoading}
          />

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ArrowDownLeft className="w-4 h-4 text-green-500" />
                Total Dépôts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat('fr-FR').format(stats.totalDeposits)} FCFA
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-red-500" />
                Total Retraits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                {new Intl.NumberFormat('fr-FR').format(stats.totalWithdrawals)} FCFA
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3">
          <DepositDialog onDeposit={handleDeposit} />
          <WithdrawDialog onWithdraw={handleWithdraw} maxAmount={availableBalance} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Historique des transactions
            </CardTitle>
            <CardDescription>
              {stats.pendingCount > 0 && `${stats.pendingCount} transaction(s) en attente`}
            </CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionList transactions={transactions} onCheckStatus={handleCheckStatus} />
            </CardContent>
          </Card>

      </div>
    </AppLayout>
  );
};

export default Wallet;
