"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SubscriptionPlanDetails } from '@/types/subscription';
import { formatCurrency } from '@/lib/currency';
import { Loader2, Wallet, CheckCircle, AlertCircle, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentDialogProps {
  plan: SubscriptionPlanDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  walletBalance: number;
}

export function PaymentDialog({ 
  plan, 
  isOpen, 
  onClose, 
  onConfirm,
  walletBalance 
}: PaymentDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!plan) return null;

  const hasEnoughBalance = walletBalance >= plan.price;

  const handleConfirm = async () => {
    if (!hasEnoughBalance) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Confirmer l'abonnement
          </DialogTitle>
          <DialogDescription>
            Vous êtes sur le point de souscrire au plan {plan.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-semibold">{plan.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Durée</span>
              <span>{plan.duration_days} jours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Commission</span>
              <span>{(plan.commission_rate * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tickets/mois</span>
              <span>{plan.max_tickets_per_month === -1 ? 'Illimité' : plan.max_tickets_per_month}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(plan.price)}</span>
            </div>
          </div>

          <div className={cn(
            "flex items-center gap-3 p-3 rounded-lg",
            hasEnoughBalance ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          )}>
            <Wallet className="w-5 h-5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Solde: {formatCurrency(walletBalance)}</p>
              {!hasEnoughBalance && (
                <p className="text-xs">Solde insuffisant - Rechargez votre portefeuille</p>
              )}
            </div>
            {hasEnoughBalance ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!hasEnoughBalance || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Traitement...
              </>
            ) : (
              `Payer ${formatCurrency(plan.price)}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PaymentDialog;
