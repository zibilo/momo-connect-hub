export type TransactionType = 
  | 'deposit' 
  | 'withdrawal' 
  | 'ticket_purchase' 
  | 'ticket_sale' 
  | 'subscription_payment'
  | 'commission'
  | 'gain_claim'
  | 'refund';

export type TransactionStatus = 
  | 'pending' 
  | 'processing' 
  | 'successful' 
  | 'failed' 
  | 'cancelled';

export type PaymentProvider = 'mtn_momo' | 'airtel_money' | 'wallet';

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  fee?: number;
  net_amount: number;
  currency: string;
  provider?: PaymentProvider;
  phone_number?: string;
  reference_id?: string;
  external_reference?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  error_message?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  locked_balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface WalletHistory {
  id: string;
  wallet_id: string;
  transaction_id: string;
  transaction?: Transaction;
  previous_balance: number;
  new_balance: number;
  amount: number;
  type: 'credit' | 'debit';
  created_at: string;
}

export interface Commission {
  id: string;
  ticket_sale_id: string;
  creator_id: string;
  amount: number;
  rate: number;
  status: 'pending' | 'paid';
  paid_at?: string;
  created_at: string;
}
