export type TransactionType = 'deposit' | 'withdrawal' | 'subscription' | 'ticket_purchase' | 'gain_payout' | 'commission';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: 'FCFA';
  reference_id?: string; // For MTN MoMo transactions
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  user_id: string;
  balance: number;
  locked_balance: number;
  currency: 'FCFA';
  updated_at: string;
}
