import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ShieldCheck } from 'lucide-react';

interface SubscriptionStatusProps {
  subscription: {
    plan: string;
    expires: string;
  } | null;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ subscription }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Abonnement Créateur</CardTitle>
          <Badge variant={subscription ? "default" : "destructive"}>
            {subscription ? "Actif" : "Inactif"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscription ? (
          <>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Plan {subscription.plan}</p>
                <p className="text-xs text-muted-foreground">Outils de vente activés</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm">Expire le: <b>{subscription.expires}</b></p>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Prenez un abonnement pour commencer à vendre vos pronostics.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;