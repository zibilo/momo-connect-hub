import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Wallet {
  balance: number;
  locked_balance: number;
  currency: string;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  status: 'pending' | 'processing' | 'successful' | 'failed' | 'cancelled';
  amount: number;
  phone_number: string;
  created_at: string;
  error_message?: string;
}

export const useWallet = () => {
  const { user, session } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('balance, locked_balance, currency')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setWallet(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, [user]);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('id, type, status, amount, phone_number, created_at, error_message')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setTransactions(data as Transaction[]);
    } catch (err: any) {
      setError(err.message);
    }
  }, [user]);

  const deposit = async (amount: number, phoneNumber: string) => {
    if (!session?.access_token) throw new Error('Non authentifié');

    const response = await fetch(
      `https://frgeeutseqjzuddqdlls.supabase.co/functions/v1/mtn-deposit`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ amount, phone_number: phoneNumber }),
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erreur lors du dépôt');
    
    await fetchWallet();
    await fetchTransactions();
    return data;
  };

  const withdraw = async (amount: number, phoneNumber: string) => {
    if (!session?.access_token) throw new Error('Non authentifié');

    const response = await fetch(
      `https://frgeeutseqjzuddqdlls.supabase.co/functions/v1/mtn-withdraw`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ amount, phone_number: phoneNumber }),
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erreur lors du retrait');
    
    await fetchWallet();
    await fetchTransactions();
    return data;
  };

  const checkTransactionStatus = async (transactionId: string) => {
    if (!session?.access_token) throw new Error('Non authentifié');

    const response = await fetch(
      `https://frgeeutseqjzuddqdlls.supabase.co/functions/v1/mtn-check-status`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ transaction_id: transactionId }),
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erreur lors de la vérification');
    
    // Refresh data after checking status
    await fetchWallet();
    await fetchTransactions();
    return data;
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchWallet(), fetchTransactions()]).finally(() =>
        setLoading(false)
      );
    }
  }, [user, fetchWallet, fetchTransactions]);

  return {
    wallet,
    transactions,
    loading,
    error,
    deposit,
    withdraw,
    checkTransactionStatus,
    refresh: () => Promise.all([fetchWallet(), fetchTransactions()]),
  };
};
