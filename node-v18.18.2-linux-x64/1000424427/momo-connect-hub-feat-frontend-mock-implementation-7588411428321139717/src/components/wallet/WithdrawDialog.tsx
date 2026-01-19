import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowUpRight, Loader2, Phone, Banknote } from 'lucide-react';

interface WithdrawDialogProps {
  onWithdraw: (amount: number, phoneNumber: string) => Promise<any>;
  maxAmount: number;
}

export const WithdrawDialog = ({ onWithdraw, maxAmount }: WithdrawDialogProps) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

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

    if (numAmount > maxAmount) {
      toast({
        variant: 'destructive',
        title: 'Solde insuffisant',
        description: `Votre solde disponible est de ${formatAmount(maxAmount)} XAF`,
      });
      return;
    }

    if (!phoneNumber.match(/^(\+?242)?0?[0-9]{9}$/)) {
      toast({
        variant: 'destructive',
        title: 'Numéro invalide',
        description: 'Entrez un numéro MTN MoMo valide (Congo-Brazzaville)',
      });
      return;
    }

    setLoading(true);
    try {
      await onWithdraw(numAmount, phoneNumber);
      toast({
        title: 'Retrait initié',
        description: 'Vous recevrez les fonds sur votre compte MTN MoMo sous peu',
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
        <Button variant="outline" className="gap-2">
          <ArrowUpRight className="h-4 w-4" />
          Retirer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Retrait MTN MoMo</DialogTitle>
          <DialogDescription>
            Transférez de l'argent de votre portefeuille vers votre compte MTN MoMo
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="withdraw-amount">Montant (XAF)</Label>
            <div className="relative">
              <Banknote className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="10000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10"
                min="1"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Solde disponible: {formatAmount(maxAmount)} XAF
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="withdraw-phone">Numéro MTN MoMo</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="withdraw-phone"
                type="tel"
                placeholder="+242 06 XXX XX XX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Format: +242XXXXXXXXX ou 06XXXXXXX
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmer le retrait
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
