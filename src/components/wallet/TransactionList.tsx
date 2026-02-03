import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowDownLeft, ArrowUpRight, Clock, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  status: 'pending' | 'processing' | 'successful' | 'failed' | 'cancelled';
  amount: number;
  phone_number: string;
  created_at: string;
  error_message?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  loading?: boolean;
  onCheckStatus?: (transactionId: string) => Promise<any>;
}

const statusConfig = {
  pending: { label: 'En attente', variant: 'secondary' as const, icon: Clock },
  processing: { label: 'En cours', variant: 'secondary' as const, icon: Loader2 },
  successful: { label: 'Réussi', variant: 'default' as const, icon: CheckCircle },
  failed: { label: 'Échoué', variant: 'destructive' as const, icon: XCircle },
  cancelled: { label: 'Annulé', variant: 'outline' as const, icon: XCircle },
};

export const TransactionList = ({ transactions, loading, onCheckStatus }: TransactionListProps) => {
  const [checkingId, setCheckingId] = useState<string | null>(null);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  const handleCheckStatus = async (transactionId: string) => {
    if (!onCheckStatus) return;
    
    setCheckingId(transactionId);
    try {
      const result = await onCheckStatus(transactionId);
      if (result.status === 'successful') {
        toast.success('Transaction confirmée! Votre solde a été mis à jour.');
      } else if (result.status === 'failed') {
        toast.error(result.error || 'La transaction a échoué.');
      } else {
        toast.info('Transaction toujours en cours de traitement.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la vérification');
    } finally {
      setCheckingId(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historique des transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historique des transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Aucune transaction pour le moment
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Historique des transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="divide-y">
            {transactions.map((tx) => {
              const status = statusConfig[tx.status];
              const StatusIcon = status.icon;
              const isDeposit = tx.type === 'deposit';
              const canCheckStatus = (tx.status === 'pending' || tx.status === 'processing') && onCheckStatus;
              const isChecking = checkingId === tx.id;

              return (
                <div key={tx.id} className="flex items-center gap-4 p-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      isDeposit ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                    }`}
                  >
                    {isDeposit ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {isDeposit ? 'Dépôt' : 'Retrait'}
                      </span>
                      <Badge variant={status.variant} className="gap-1">
                        <StatusIcon className={`h-3 w-3 ${tx.status === 'processing' ? 'animate-spin' : ''}`} />
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {tx.phone_number} • {format(new Date(tx.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                    </p>
                    {tx.error_message && (
                      <p className="text-xs text-destructive mt-1">{tx.error_message}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {canCheckStatus && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCheckStatus(tx.id)}
                        disabled={isChecking}
                        className="h-8 px-2"
                      >
                        {isChecking ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        <span className="ml-1 hidden sm:inline">Vérifier</span>
                      </Button>
                    )}
                    <div className={`text-right font-semibold ${isDeposit ? 'text-green-600' : 'text-orange-600'}`}>
                      {isDeposit ? '+' : '-'}{formatAmount(tx.amount)} XAF
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
