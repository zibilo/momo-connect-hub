import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/hooks/useWallet';
import { WalletCard } from '@/components/wallet/WalletCard';
import { TransactionList } from '@/components/wallet/TransactionList';
import { DepositDialog } from '@/components/wallet/DepositDialog';
import { WithdrawDialog } from '@/components/wallet/WithdrawDialog';
import { Button } from '@/components/ui/button';
import { LogOut, RefreshCw, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { wallet, transactions, loading, deposit, withdraw, refresh } = useWallet();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Déconnexion',
      description: 'À bientôt !',
    });
  };

  const handleRefresh = async () => {
    await refresh();
    toast({
      title: 'Actualisé',
      description: 'Données mises à jour',
    });
  };

  const availableBalance = wallet ? wallet.balance - wallet.locked_balance : 0;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Mon Portefeuille</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{user?.email}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Wallet Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <WalletCard
              balance={wallet?.balance || 0}
              lockedBalance={wallet?.locked_balance || 0}
              currency={wallet?.currency || 'XAF'}
              loading={loading}
            />
            <div className="flex gap-3">
              <DepositDialog onDeposit={deposit} />
              <WithdrawDialog onWithdraw={withdraw} maxAmount={availableBalance} />
            </div>
          </div>

          {/* Transactions */}
          <TransactionList transactions={transactions} loading={loading} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
