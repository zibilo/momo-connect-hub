import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Trophy, ArrowLeft, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Selection {
  id: string;
  market: string;
  selection: string;
  odds: number;
}

const CreateTicket = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    visibility: 'public',
  });
  const [selections, setSelections] = useState<Selection[]>([
    { id: '1', market: '', selection: '', odds: 1.5 },
  ]);

  const addSelection = () => {
    setSelections([
      ...selections,
      { id: Date.now().toString(), market: '', selection: '', odds: 1.5 },
    ]);
  };

  const removeSelection = (id: string) => {
    if (selections.length > 1) {
      setSelections(selections.filter(s => s.id !== id));
    }
  };

  const updateSelection = (id: string, field: keyof Selection, value: string | number) => {
    setSelections(selections.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const totalOdds = selections.reduce((acc, s) => acc * (s.odds || 1), 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const price = parseInt(form.price);
    if (!form.title || !price || price < 100) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs. Prix minimum: 100 FCFA',
        variant: 'destructive',
      });
      return;
    }

    if (selections.some(s => !s.market || !s.selection)) {
      toast({
        title: 'Erreur',
        description: 'Veuillez compléter toutes les sélections.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const verificationCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      const { error } = await supabase.from('tickets').insert({
        creator_id: user.id,
        title: form.title,
        description: form.description,
        price: price,
        visibility: form.visibility,
        total_odds: totalOdds,
        selections: selections.map(s => ({
          ...s,
          outcome: 'pending',
        })),
        status: 'active',
        verification_code: verificationCode,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });

      if (error) throw error;

      toast({
        title: 'Ticket créé',
        description: 'Votre ticket a été publié avec succès.',
      });

      navigate('/creator/tickets');
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le ticket. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Button asChild variant="ghost">
          <Link to="/creator/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Créer un Ticket
            </CardTitle>
            <CardDescription>
              Publiez un nouveau ticket de paris pour vos acheteurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="title">Titre du ticket *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Combo Ligue 1 - Journée 20"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez votre analyse..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Prix (FCFA) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="500"
                    min={100}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibilité</Label>
                  <Select value={form.visibility} onValueChange={(v) => setForm({ ...form, visibility: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="subscribers">Abonnés uniquement</SelectItem>
                      <SelectItem value="private">Privé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Sélections</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addSelection}>
                    <Plus className="w-4 h-4 mr-1" />
                    Ajouter
                  </Button>
                </div>

                {selections.map((selection, index) => (
                  <div key={selection.id} className="p-4 bg-muted rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Sélection {index + 1}</span>
                      {selections.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeSelection(selection.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Input
                        placeholder="Match / Marché"
                        value={selection.market}
                        onChange={(e) => updateSelection(selection.id, 'market', e.target.value)}
                      />
                      <Input
                        placeholder="Pronostic"
                        value={selection.selection}
                        onChange={(e) => updateSelection(selection.id, 'selection', e.target.value)}
                      />
                      <Input
                        type="number"
                        step="0.01"
                        min="1"
                        placeholder="Cote"
                        value={selection.odds}
                        onChange={(e) => updateSelection(selection.id, 'odds', parseFloat(e.target.value) || 1)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Cote Totale</span>
                  <span className="text-2xl font-bold text-primary">{totalOdds.toFixed(2)}</span>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  'Publier le ticket'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CreateTicket;
