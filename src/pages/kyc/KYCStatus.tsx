import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, AlertCircle, ShieldCheck } from 'lucide-react';

const KYCStatus = () => {
  const { appUser } = useAuth();

  const statusConfig = {
    none: {
      title: 'Vérification non commencée',
      description: 'Vous n\'avez pas encore soumis vos documents.',
      icon: <AlertCircle className="w-12 h-12 text-muted-foreground" />,
      color: 'text-muted-foreground',
      action: <Button asChild><Link to="/kyc/submit">Commencer la vérification</Link></Button>
    },
    pending: {
      title: 'Vérification en cours',
      description: 'Vos documents sont en cours d\'examen par notre équipe. Cela prend généralement moins de 24h.',
      icon: <Clock className="w-12 h-12 text-yellow-500" />,
      color: 'text-yellow-500',
      action: null
    },
    approved: {
      title: 'Vérification approuvée',
      description: 'Félicitations ! Votre identité a été vérifiée. Vous pouvez maintenant publier des tickets.',
      icon: <CheckCircle2 className="w-12 h-12 text-green-500" />,
      color: 'text-green-500',
      action: <Button asChild variant="outline"><Link to="/creator/dashboard">Aller au tableau de bord créateur</Link></Button>
    },
    rejected: {
      title: 'Vérification refusée',
      description: 'Malheureusement, vos documents n\'ont pas pu être validés. Veuillez réessayer avec des documents lisibles.',
      icon: <ShieldCheck className="w-12 h-12 text-red-500" />,
      color: 'text-red-500',
      action: <Button asChild><Link to="/kyc/submit">Soumettre à nouveau</Link></Button>
    }
  };

  const status = appUser?.kyc_status || 'none';
  const config = statusConfig[status];

    return (
      <AppLayout>
        <div className="container py-12 flex justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              {config.icon}
            </div>
            <CardTitle className={config.color}>{config.title}</CardTitle>
            <CardDescription>{config.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {config.action}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default KYCStatus;
