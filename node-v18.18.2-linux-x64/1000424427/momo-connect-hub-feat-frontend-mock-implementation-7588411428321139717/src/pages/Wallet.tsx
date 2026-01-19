

import { useWallet } from '@/hooks/useWallet';
import { WalletCard } from '@/components/wallet/WalletCard';
import { TransactionList } from '@/components/wallet/TransactionList';
import { DepositDialog } from '@/components/wallet/DepositDialog';
import { WithdrawDialog } from '@/components/wallet/WithdrawDialog';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck } from "lucide-react";

const WalletPage = () => {
  const { wallet, transactions, loading, deposit, withdraw, checkTransactionStatus } = useWallet();

  const availableBalance = wallet ? wallet.balance - wallet.locked_balance : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mon Portefeuille</h1>
        <p className="text-muted-foreground">Gérez vos dépôts, retraits et consultez votre historique.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <WalletCard
            balance={wallet?.balance || 0}
            lockedBalance={wallet?.locked_balance || 0}
            currency={wallet?.currency || 'XAF'}
            loading={loading}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-card border rounded-lg flex flex-col items-center justify-center text-center space-y-2">
              <h3 className="font-medium">Recharger</h3>
              <p className="text-xs text-muted-foreground mb-2">Via MTN MoMo</p>
              <DepositDialog onDeposit={deposit} />
            </div>
            <div className="p-4 bg-card border rounded-lg flex flex-col items-center justify-center text-center space-y-2">
              <h3 className="font-medium">Retirer</h3>
              <p className="text-xs text-muted-foreground mb-2">Vers MTN MoMo</p>
              <WithdrawDialog onWithdraw={withdraw} maxAmount={availableBalance} />
            </div>
          </div>

          <Alert>
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Sécurité garantie</AlertTitle>
            <AlertDescription>
              Toutes les transactions sont sécurisées et cryptées. Vos fonds sont protégés conformément aux régulations MTN.
            </AlertDescription>
          </Alert>
        </div>

        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Résumé Rapide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Dépôts ce mois</span>
                <span className="font-medium text-green-600">+ 50,000 XAF</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Retraits ce mois</span>
                <span className="font-medium text-orange-600">- 12,000 XAF</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Commissions</span>
                <span className="font-medium">0 XAF</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="all">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Historique des transactions</h2>
            <TabsList>
              <TabsTrigger value="all">Tout</TabsTrigger>
              <TabsTrigger value="deposits">Dépôts</TabsTrigger>
              <TabsTrigger value="withdrawals">Retraits</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all">
            <TransactionList transactions={transactions} loading={loading} onCheckStatus={checkTransactionStatus} />
          </TabsContent>
          <TabsContent value="deposits">
            <TransactionList transactions={transactions.filter(t => t.type === 'deposit')} loading={loading} onCheckStatus={checkTransactionStatus} />
          </TabsContent>
          <TabsContent value="withdrawals">
            <TransactionList transactions={transactions.filter(t => t.type === 'withdrawal')} loading={loading} onCheckStatus={checkTransactionStatus} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WalletPage;