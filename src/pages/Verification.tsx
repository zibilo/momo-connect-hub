import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Search, CheckCircle2, XCircle, AlertCircle, Trophy, Ticket } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/lib/dates';

interface VerificationResult {
  valid: boolean;
  ticket?: {
    id: string;
    title: string;
    total_odds: number;
    status: string;
    price: number;
    created_at: string;
    selections: unknown[];
  };
  message: string;
}

const Verification = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('verification_code', code.trim().toUpperCase())
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setResult({
          valid: true,
          ticket: data,
          message: 'Ticket vérifié avec succès',
        });
      } else {
        setResult({
          valid: false,
          message: 'Code invalide ou ticket introuvable',
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      setResult({
        valid: false,
        message: 'Erreur lors de la vérification',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      won: { variant: 'default', label: 'Gagné' },
      lost: { variant: 'destructive', label: 'Perdu' },
      active: { variant: 'secondary', label: 'En cours' },
      pending: { variant: 'outline', label: 'En attente' },
    };
    const c = config[status] || config.pending;
    return <Badge variant={c.variant}>{c.label}</Badge>;
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Vérification de Ticket</h1>
          <p className="text-muted-foreground mt-1">Vérifiez l'authenticité d'un ticket physique</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Entrez le code de vérification
            </CardTitle>
            <CardDescription>
              Le code se trouve sur le ticket physique ou dans le QR code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ex: ABC123XYZ"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="font-mono text-lg tracking-wider"
                maxLength={20}
              />
              <Button onClick={handleVerify} disabled={loading || !code.trim()}>
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Vérifier
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className={result.valid ? 'border-green-500' : 'border-red-500'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.valid ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <span className="text-green-600">Ticket Authentique</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-red-500" />
                    <span className="text-red-600">Vérification Échouée</span>
                  </>
                )}
              </CardTitle>
              <CardDescription>{result.message}</CardDescription>
            </CardHeader>

            {result.valid && result.ticket && (
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-primary" />
                      <span className="font-semibold">{result.ticket.title}</span>
                    </div>
                    {getStatusBadge(result.ticket.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Prix</p>
                      <p className="font-semibold">{formatCurrency(result.ticket.price)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Cote totale</p>
                      <p className="font-semibold">{result.ticket.total_odds.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sélections</p>
                      <p className="font-semibold">{(result.ticket.selections as unknown[])?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="font-semibold">{formatDate(result.ticket.created_at)}</p>
                    </div>
                  </div>

                  {result.ticket.status === 'won' && (
                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg flex items-center gap-2 text-green-700 dark:text-green-300">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Ce ticket est gagnant ! Le détenteur peut réclamer ses gains.</span>
                    </div>
                  )}

                  {result.ticket.status === 'lost' && (
                    <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-300">
                      <XCircle className="w-5 h-5" />
                      <span>Ce ticket est perdant.</span>
                    </div>
                  )}

                  {(result.ticket.status === 'active' || result.ticket.status === 'pending') && (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                      <AlertCircle className="w-5 h-5" />
                      <span>Les matchs de ce ticket sont en cours ou à venir.</span>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Verification;
