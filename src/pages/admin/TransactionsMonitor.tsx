import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/currency';
import { formatDateTime } from '@/lib/dates';

interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'commission';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
  created_at: string;
}

const TransactionsMonitor = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setTransactions((data as Transaction[]) || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
    if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
    return true;
  });

  const getTypeBadge = (type: string) => {
    const config: Record<string, { icon: React.ReactNode; label: string; className: string }> = {
      deposit: { icon: <ArrowDownLeft className="w-3 h-3" />, label: 'Dépôt', className: 'bg-green-100 text-green-700' },
      withdrawal: { icon: <ArrowUpRight className="w-3 h-3" />, label: 'Retrait', className: 'bg-red-100 text-red-700' },
      purchase: { icon: <Activity className="w-3 h-3" />, label: 'Achat', className: 'bg-blue-100 text-blue-700' },
      commission: { icon: <CheckCircle2 className="w-3 h-3" />, label: 'Commission', className: 'bg-purple-100 text-purple-700' },
    };
    const c = config[type] || config.purchase;
    return (
      <Badge variant="outline" className={`flex items-center gap-1 ${c.className}`}>
        {c.icon}
        {c.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      completed: { variant: 'default', label: 'Complété' },
      pending: { variant: 'secondary', label: 'En attente' },
      failed: { variant: 'destructive', label: 'Échoué' },
    };
    const c = config[status] || config.pending;
    return <Badge variant={c.variant}>{c.label}</Badge>;
  };

  const stats = {
    totalDeposits: transactions.filter(t => t.type === 'deposit' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    totalWithdrawals: transactions.filter(t => t.type === 'withdrawal' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    pending: transactions.filter(t => t.status === 'pending').length,
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Moniteur de Transactions</h1>
          <p className="text-muted-foreground mt-1">Suivez toutes les transactions de la plateforme</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ArrowDownLeft className="w-4 h-4 text-green-500" />
                Total Dépôts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalDeposits)}</p>
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
              <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalWithdrawals)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                En Attente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous types</SelectItem>
                  <SelectItem value="deposit">Dépôts</SelectItem>
                  <SelectItem value="withdrawal">Retraits</SelectItem>
                  <SelectItem value="purchase">Achats</SelectItem>
                  <SelectItem value="commission">Commissions</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="completed">Complétés</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="failed">Échoués</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Référence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map(tx => (
                    <TableRow key={tx.id}>
                      <TableCell>{formatDateTime(tx.created_at)}</TableCell>
                      <TableCell>{getTypeBadge(tx.type)}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(tx.amount)}</TableCell>
                      <TableCell>{getStatusBadge(tx.status)}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{tx.reference || '-'}</TableCell>
                    </TableRow>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Aucune transaction trouvée
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TransactionsMonitor;
