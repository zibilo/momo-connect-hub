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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhysicalTicket, Ticket } from '@/types/ticket';
import { formatCurrency } from '@/lib/currency';
import { Loader2, Wallet, Phone, CheckCircle, AlertCircle, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClaimGainDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (phoneNumber: string) => Promise<void>;
  ticket: Ticket;
  physicalTicket?: PhysicalTicket;
  claimAmount: number;
}

export function ClaimGainDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  ticket,
  physicalTicket,
  claimAmount 
}: ClaimGainDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isValidPhone = /^(\+?237)?[6-9]\d{8}$/.test(phoneNumber.replace(/\s/g, ''));

  const handleConfirm = async () => {
    if (!isValidPhone) {
      setError('Veuillez entrer un numéro de téléphone valide');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await onConfirm(phoneNumber.replace(/\s/g, ''));
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPhoneNumber('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Gain réclamé avec succès !</h3>
            <p className="text-muted-foreground mb-4">
              {formatCurrency(claimAmount)} seront envoyés au {phoneNumber}
            </p>
            <p className="text-sm text-muted-foreground">
              Vous recevrez un SMS de confirmation une fois le transfert effectué.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={handleClose} className="w-full">
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Réclamer vos gains
          </DialogTitle>
          <DialogDescription>
            Félicitations ! Votre ticket est gagnant.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <p className="text-sm text-green-700 mb-1">Montant à recevoir</p>
            <p className="text-3xl font-bold text-green-700">
              {formatCurrency(claimAmount)}
            </p>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ticket</span>
              <span className="font-medium">{ticket.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Code</span>
              <span className="font-mono">{physicalTicket?.verification_code || ticket.verification_code}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Numéro Mobile Money</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="6XX XXX XXX"
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Entrez le numéro sur lequel vous souhaitez recevoir vos gains
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!isValidPhone || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Traitement...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Réclamer {formatCurrency(claimAmount)}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ClaimGainDialog;
