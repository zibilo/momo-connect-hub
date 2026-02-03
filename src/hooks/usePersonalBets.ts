import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BetSelection } from '@/types';

interface PersonalBet {
  id: string;
  user_id: string;
  stake: number;
  total_odds: number;
  potential_gain: number;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  selections: BetSelection[];
  created_at: string;
  settled_at?: string;
}

export function usePersonalBets() {
  const { user } = useAuth();
  const [bets, setBets] = useState<PersonalBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBets = useCallback(async () => {
    if (!user) {
      setBets([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('personal_bets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setBets((data as PersonalBet[]) || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createBet = async (stake: number, selections: Omit<BetSelection, 'id' | 'outcome'>[]) => {
    if (!user) throw new Error('Non authentifié');

    const totalOdds = selections.reduce((acc, s) => acc * s.odds, 1);
    const potentialGain = Math.floor(stake * totalOdds);

    const { data, error: insertError } = await supabase
      .from('personal_bets')
      .insert({
        user_id: user.id,
        stake,
        total_odds: totalOdds,
        potential_gain: potentialGain,
        status: 'pending',
        selections: selections.map(s => ({ ...s, id: crypto.randomUUID(), outcome: 'pending' })),
      })
      .select()
      .single();

    if (insertError) throw insertError;
    
    await fetchBets();
    return data as PersonalBet;
  };

  const cancelBet = async (betId: string) => {
    const { error: updateError } = await supabase
      .from('personal_bets')
      .update({ status: 'cancelled' })
      .eq('id', betId)
      .eq('status', 'pending');

    if (updateError) throw updateError;
    await fetchBets();
  };

  return {
    bets,
    loading,
    error,
    refresh: fetchBets,
    createBet,
    cancelBet,
  };
}
