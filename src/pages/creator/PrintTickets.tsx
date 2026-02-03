import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/lib/dates';
import { Printer, Trophy, QrCode, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TicketToPrint {
  id: string;
  title: string;
  price: number;
  total_odds: number;
  verification_code: string;
  status: string;
  created_at: string;
}

const PrintTickets = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<TicketToPrint[]>([]);
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchTickets();
  }, [user]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('id, title, price, total_odds, verification_code, status, created_at')
        .eq('creator_id', user?.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets((data as TicketToPrint[]) || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (ticket: TicketToPrint) => {
    setPrinting(ticket.id);
    
    const printContent = `
      <html>
        <head>
          <title>Ticket - ${ticket.title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .title { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
            .info { margin: 10px 0; }
            .label { color: #666; font-size: 12px; }
            .value { font-weight: bold; font-size: 16px; }
            .code { text-align: center; padding: 20px; background: #f0f0f0; margin: 20px 0; font-family: monospace; font-size: 24px; letter-spacing: 3px; }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">TICKET DE PARIS</div>
            <div>${ticket.title}</div>
          </div>
          <div class="info">
            <div class="label">Prix</div>
            <div class="value">${ticket.price} FCFA</div>
          </div>
          <div class="info">
            <div class="label">Cote Totale</div>
            <div class="value">${ticket.total_odds.toFixed(2)}</div>
          </div>
          <div class="info">
            <div class="label">Date</div>
            <div class="value">${new Date(ticket.created_at).toLocaleDateString('fr-FR')}</div>
          </div>
          <div class="code">${ticket.verification_code}</div>
          <div class="footer">
            Scannez le QR code ou entrez le code ci-dessus pour vérifier ce ticket.
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }

    toast({
      title: 'Impression lancée',
      description: 'Le ticket est prêt à être imprimé.',
    });

    setPrinting(null);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Imprimer des Tickets</h1>
          <p className="text-muted-foreground mt-1">Imprimez vos tickets physiques pour la vente</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Printer className="w-5 h-5" />
              Tickets Actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : tickets.length === 0 ? (
              <EmptyState
                icon={<Trophy className="w-8 h-8 text-muted-foreground" />}
                title="Aucun ticket actif"
                description="Créez des tickets pour pouvoir les imprimer."
              />
            ) : (
              <div className="space-y-4">
                {tickets.map(ticket => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{ticket.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{formatCurrency(ticket.price)}</span>
                          <span>•</span>
                          <span>Cote: {ticket.total_odds.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Code</p>
                        <p className="font-mono font-semibold">{ticket.verification_code}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePrint(ticket)}
                        disabled={printing === ticket.id}
                      >
                        {printing === ticket.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                        ) : (
                          <>
                            <Printer className="w-4 h-4 mr-1" />
                            Imprimer
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PrintTickets;
