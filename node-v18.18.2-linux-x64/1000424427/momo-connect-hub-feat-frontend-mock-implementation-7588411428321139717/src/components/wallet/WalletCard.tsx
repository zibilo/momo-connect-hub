import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Lock, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface WalletCardProps {
  balance: number;
  lockedBalance: number;
  currency: string;
  loading?: boolean;
}

export const WalletCard = ({ balance, lockedBalance, currency, loading }: WalletCardProps) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  const availableBalance = balance - lockedBalance;

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-primary to-primary/80">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-24 bg-primary-foreground/20" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-40 bg-primary-foreground/20" />
          <div className="flex gap-4">
            <Skeleton className="h-6 w-28 bg-primary-foreground/20" />
            <Skeleton className="h-6 w-28 bg-primary-foreground/20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium opacity-90">
          <Wallet className="h-4 w-4" />
          Solde disponible
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">{formatAmount(availableBalance)}</span>
          <span className="text-lg opacity-80">{currency}</span>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1.5 opacity-80">
            <TrendingUp className="h-4 w-4" />
            <span>Total: {formatAmount(balance)} {currency}</span>
          </div>
          {lockedBalance > 0 && (
            <div className="flex items-center gap-1.5 opacity-80">
              <Lock className="h-4 w-4" />
              <span>Bloqué: {formatAmount(lockedBalance)} {currency}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
