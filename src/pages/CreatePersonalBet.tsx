import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Users, ArrowLeft, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const CreatePersonalBet = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    stake: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const stake = parseInt(form.stake);
    if (!form.title || !stake || stake < 100) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs. Mise minimum: 100 FCFA',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('personal_bets').insert({
        title: form.title,
        description: form.description,
        stake: stake,
        odds: 2.0,
        creator_id: user.id,
        status: 'open',
      });

      if (error) throw error;

      toast({
        title: 'Pari créé',
        description: 'Votre pari personnel a été créé avec succès.',
      });

      navigate('/personal-bets');
    } catch (error) {
      console.error('Error creating bet:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le pari. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <LogIn className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Connectez-vous</h2>
          <p className="text-muted-foreground mb-4">Vous devez être connecté pour créer un pari.</p>
          <Button asChild>
            <Link to="/login">Se connecter</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <Button asChild variant="ghost">
          <Link to="/personal-bets">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Créer un Pari Personnel
            </CardTitle>
            <CardDescription>
              Créez un pari et partagez-le avec vos amis pour qu'ils puissent participer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titre du pari *</Label>
                <Input
                  id="title"
                  placeholder="Ex: PSG vs OM - Victoire PSG"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez les conditions du pari..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stake">Mise (FCFA) *</Label>
                <Input
                  id="stake"
                  type="number"
                  placeholder="1000"
                  min={100}
                  value={form.stake}
                  onChange={(e) => setForm({ ...form, stake: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">Mise minimum: 100 FCFA</p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Comment ça marche ?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>1. Créez votre pari avec une mise</li>
                  <li>2. Partagez le lien avec vos amis</li>
                  <li>3. Un ami accepte le pari avec la même mise</li>
                  <li>4. Le gagnant remporte la cagnotte</li>
                </ul>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  'Créer le pari'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CreatePersonalBet;
