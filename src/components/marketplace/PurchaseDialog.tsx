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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Ticket } from '@/types/ticket';
import { formatCurrency } from '@/lib/currency';
import { AlertCircle, CheckCircle, Loader2, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PurchaseDialogProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (isPhysical: boolean) => Promise<void>;
  walletBalance: number;
}

export function PurchaseDialog({ 
  ticket, 
  isOpen, 
  onClose, 
  onConfirm, 
  walletBalance 
}: PurchaseDialogProps) {
  const [isPhysical, setIsPhysical] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!ticket) return null;

  const totalPrice = isPhysical ? ticket.price + 500 : ticket.price;
  const hasEnoughBalance = walletBalance >= totalPrice;

  const handleConfirm = async () => {
    if (!hasEnoughBalance) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await onConfirm(isPhysical);
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
          <DialogTitle>Confirmer l'achat</DialogTitle>
          <DialogDescription>
            Vous êtes sur le point d'acheter ce ticket
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">{ticket.title}</h4>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Côte totale</span>
              <span className="font-mono">{ticket.total_odds.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-muted-foreground">Sélections</span>
              <span>{ticket.selections?.length || 0}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="physical" 
              checked={isPhysical}
              onCheckedChange={(checked) => setIsPhysical(checked === true)}
            />
            <Label htmlFor="physical" className="text-sm cursor-pointer">
              Ticket physique (+{formatCurrency(500)} frais d'impression)
            </Label>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Prix du ticket</span>
              <span className="font-medium">{formatCurrency(ticket.price)}</span>
            </div>
            {isPhysical && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Frais d'impression</span>
                <span>{formatCurrency(500)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          <div className={cn(
            "flex items-center gap-2 p-3 rounded-lg",
            hasEnoughBalance ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          )}>
            <Wallet className="w-5 h-5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Solde: {formatCurrency(walletBalance)}</p>
              {!hasEnoughBalance && (
                <p className="text-xs">Solde insuffisant</p>
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
              'Confirmer l\'achat'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PurchaseDialog;
