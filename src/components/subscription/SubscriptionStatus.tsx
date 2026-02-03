"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Subscription, SUBSCRIPTION_PLANS } from '@/types/subscription';
import { formatCurrency } from '@/lib/currency';
import { formatDate, formatRelativeTime } from '@/lib/dates';
import { Calendar, Clock, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubscriptionStatusProps {
  subscription: Subscription | null;
  onRenew?: () => void;
  onUpgrade?: () => void;
  onCancel?: () => void;
}

export function SubscriptionStatus({ 
  subscription, 
  onRenew, 
  onUpgrade, 
  onCancel 
}: SubscriptionStatusProps) {
  if (!subscription) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">Aucun abonnement actif</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Souscrivez à un plan pour devenir créateur et vendre vos tickets
          </p>
          {onUpgrade && (
            <Button onClick={onUpgrade}>
              Voir les plans
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const plan = SUBSCRIPTION_PLANS.find(p => p.id === subscription.plan);
  const isExpired = subscription.status === 'expired';
  const isExpiringSoon = !isExpired && new Date(subscription.expires_at) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const daysLeft = Math.ceil((new Date(subscription.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const statusConfig = {
    active: { label: 'Actif', className: 'bg-green-100 text-green-800', icon: CheckCircle },
    expired: { label: 'Expiré', className: 'bg-red-100 text-red-800', icon: AlertTriangle },
    cancelled: { label: 'Annulé', className: 'bg-gray-100 text-gray-800', icon: AlertTriangle },
    pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800', icon: Clock },
  };

  const status = statusConfig[subscription.status];
  const StatusIcon = status.icon;

  return (
    <Card className={cn(
      isExpired && "border-red-200",
      isExpiringSoon && !isExpired && "border-yellow-200"
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">{plan?.name || subscription.plan}</h3>
            <p className="text-sm text-muted-foreground">{plan?.description}</p>
          </div>
          <Badge className={cn("flex items-center gap-1", status.className)}>
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Commission</p>
            <p className="font-semibold">{plan ? `${(plan.commission_rate * 100).toFixed(0)}%` : '-'}</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Tickets/mois</p>
            <p className="font-semibold">
              {plan ? (plan.max_tickets_per_month === -1 ? 'Illimité' : plan.max_tickets_per_month) : '-'}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Date de début
            </span>
            <span>{formatDate(subscription.starts_at)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              Expiration
            </span>
            <span className={cn(isExpired && "text-red-600", isExpiringSoon && !isExpired && "text-yellow-600")}>
              {formatDate(subscription.expires_at)}
              {!isExpired && ` (${daysLeft} jour${daysLeft > 1 ? 's' : ''})`}
            </span>
          </div>
          {subscription.auto_renew && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <RefreshCw className="w-4 h-4" />
              Renouvellement automatique activé
            </div>
          )}
        </div>

        {isExpiringSoon && !isExpired && (
          <div className="p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm mb-4">
            <AlertTriangle className="w-4 h-4 inline mr-2" />
            Votre abonnement expire bientôt. Pensez à le renouveler.
          </div>
        )}

        <div className="flex gap-2">
          {(isExpired || isExpiringSoon) && onRenew && (
            <Button onClick={onRenew} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Renouveler
            </Button>
          )}
          {!isExpired && onUpgrade && subscription.plan !== 'pro' && (
            <Button variant="outline" onClick={onUpgrade} className="flex-1">
              Upgrade
            </Button>
          )}
          {!isExpired && onCancel && (
            <Button variant="ghost" onClick={onCancel} className="text-muted-foreground">
              Annuler
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default SubscriptionStatus;
