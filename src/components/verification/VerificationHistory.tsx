"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PhysicalTicket, Ticket } from '@/types/ticket';
import { formatCurrency } from '@/lib/currency';
import { formatDateTime } from '@/lib/dates';
import { History, CheckCircle, Clock, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerificationHistoryItem {
  id: string;
  verification_code: string;
  ticket: Ticket;
  verified_at: string;
  status: 'valid' | 'invalid' | 'claimed';
  claimed_amount?: number;
}

interface VerificationHistoryProps {
  history: VerificationHistoryItem[];
  isLoading?: boolean;
}

export function VerificationHistory({ history, isLoading }: VerificationHistoryProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="w-5 h-5" />
            Historique des vérifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusConfig = {
    valid: { 
      label: 'Valide', 
      icon: <CheckCircle className="w-4 h-4" />, 
      className: 'bg-green-100 text-green-800' 
    },
    invalid: { 
      label: 'Invalide', 
      icon: <XCircle className="w-4 h-4" />, 
      className: 'bg-red-100 text-red-800' 
    },
    claimed: { 
      label: 'Réclamé', 
      icon: <CheckCircle className="w-4 h-4" />, 
      className: 'bg-blue-100 text-blue-800' 
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="w-5 h-5" />
          Historique des vérifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Aucune vérification récente</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {history.map((item) => {
              const config = statusConfig[item.status];
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">
                        {item.verification_code}
                      </span>
                      <Badge className={cn("text-xs flex items-center gap-1", config.className)}>
                        {config.icon}
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-sm truncate text-muted-foreground">
                      {item.ticket.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(item.verified_at)}
                    </p>
                  </div>
                  {item.claimed_amount && (
                    <div className="text-right ml-3">
                      <p className="text-sm font-semibold text-green-600">
                        +{formatCurrency(item.claimed_amount)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default VerificationHistory;
