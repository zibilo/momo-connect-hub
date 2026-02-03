import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { Wallet, Transaction } from '@/types';

interface WalletContextType {
  wallet: Wallet | null;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    if (!user) {
      setWallet(null);
      setTransactions([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const [walletResult, txResult] = await Promise.all([
        supabase
          .from('wallets')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50)
      ]);

      if (walletResult.error) {
        console.warn('Wallet error:', walletResult.error.message);
      } else {
        setWallet(walletResult.data as Wallet | null);
      }

      if (txResult.error) {
        console.warn('Transactions error:', txResult.error.message);
      } else {
        setTransactions((txResult.data as Transaction[]) || []);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      console.error('Wallet fetch error:', message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchWallet();
    }
  }, [authLoading, user?.id, fetchWallet]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`wallet-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wallets', filter: `user_id=eq.${user.id}` }, fetchWallet)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` }, fetchWallet)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchWallet]);

  return (
    <WalletContext.Provider value={{ wallet, transactions, loading, error, refresh: fetchWallet }}>
      {children}
    </WalletContext.Provider>
  );
}
