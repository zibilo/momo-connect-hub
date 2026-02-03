"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/lib/dates';
import { Commission } from '@/types/transaction';
import { DollarSign, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommissionHistoryProps {
  commissions: Commission[];
  isLoading?: boolean;
}

export function CommissionHistory({ commissions, isLoading }: CommissionHistoryProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historique des Commissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalPending = commissions
    .filter(c => c.status === 'pending')
    .reduce((acc, c) => acc + c.amount, 0);

  const totalPaid = commissions
    .filter(c => c.status === 'paid')
    .reduce((acc, c) => acc + c.amount, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Historique des Commissions</CardTitle>
        <DollarSign className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">En attente</p>
            <p className="text-xl font-bold text-yellow-600">{formatCurrency(totalPending)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total payé</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
          </div>
        </div>

        {commissions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucune commission pour le moment
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {commissions.map((commission) => (
              <div
                key={commission.id}
                className="flex items-center justify-between p-3 bg-card border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    commission.status === 'paid' ? "bg-green-100" : "bg-yellow-100"
                  )}>
                    {commission.status === 'paid' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{formatCurrency(commission.amount)}</p>
                    <p className="text-xs text-muted-foreground">
                      Taux: {(commission.rate * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={commission.status === 'paid' ? 'default' : 'secondary'}>
                    {commission.status === 'paid' ? 'Payé' : 'En attente'}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(commission.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CommissionHistory;
