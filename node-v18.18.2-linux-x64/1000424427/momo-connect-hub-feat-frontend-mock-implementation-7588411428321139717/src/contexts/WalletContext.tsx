import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Wallet, Transaction } from '@/types/transaction';
import { useAuth } from './AuthContext';
// import { getWallet, getTransactions } from '@/services/walletService'; // This service would need to be created

interface WalletContextType {
  wallet: Wallet | null;
  transactions: Transaction[];
  loading: boolean;
  refreshWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWalletData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // const [walletData, transactionsData] = await Promise.all([
      //   getWallet(user.id),
      //   getTransactions(user.id),
      // ]);
      // setWallet(walletData);
      // setTransactions(transactionsData);
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  return (
    <WalletContext.Provider value={{ wallet, transactions, loading, refreshWallet: fetchWalletData }}>
      {children}
    </WalletContext.Provider>
  );
};
