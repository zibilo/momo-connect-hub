import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowDownLeft, Loader2, Phone, Banknote } from 'lucide-react';

interface DepositDialogProps {
  onDeposit: (amount: number, phoneNumber: string) => Promise<any>;
}

export const DepositDialog = ({ onDeposit }: DepositDialogProps) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = parseInt(amount);
    if (isNaN(numAmount) || numAmount < 100) {
      toast({
        variant: 'destructive',
        title: 'Montant invalide',
        description: 'Le montant minimum est de 100 XAF',
      });
      return;
    }

    // Accept Congo numbers OR sandbox test numbers (46733123456)
    const isCongoNumber = phoneNumber.match(/^(\+?242)?0?[0-9]{9}$/);
    const isSandboxNumber = phoneNumber.match(/^46[0-9]{9}$/);
    
    if (!isCongoNumber && !isSandboxNumber) {
      toast({
        variant: 'destructive',
        title: 'Numéro invalide',
        description: 'Entrez un numéro MTN MoMo valide',
      });
      return;
    }

    setLoading(true);
    try {
      await onDeposit(numAmount, phoneNumber);
      toast({
        title: 'Dépôt initié',
        description: 'Confirmez le paiement sur votre téléphone MTN MoMo',
      });
      setOpen(false);
      setAmount('');
      setPhoneNumber('');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <ArrowDownLeft className="h-4 w-4" />
          Déposer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dépôt MTN MoMo</DialogTitle>
          <DialogDescription>
            Déposez de l'argent depuis votre compte MTN MoMo vers votre portefeuille
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Montant (XAF)</Label>
            <div className="relative">
              <Banknote className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="10000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10"
                min="100"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Numéro MTN MoMo</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="46733123456"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Sandbox: 46733123456 | Production: +242XXXXXXXXX
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmer le dépôt
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
