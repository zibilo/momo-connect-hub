import { callEdgeFunction } from './api';
import { Transaction, TransactionStatus } from '@/types';

export interface DepositRequest {
  amount: number;
  phone_number: string;
}

export interface WithdrawRequest {
  amount: number;
  phone_number: string;
}

export interface PaymentResponse {
  transaction_id: string;
  status: TransactionStatus;
  reference?: string;
  message?: string;
}

export interface TransactionStatusResponse {
  transaction_id: string;
  status: TransactionStatus;
  amount: number;
  phone_number: string;
  provider_status?: string;
  error_message?: string;
}

export async function initiateDeposit(request: DepositRequest): Promise<PaymentResponse> {
  return callEdgeFunction<PaymentResponse>('mtn-deposit', request);
}

export async function initiateWithdrawal(request: WithdrawRequest): Promise<PaymentResponse> {
  return callEdgeFunction<PaymentResponse>('mtn-withdraw', request);
}

export async function checkTransactionStatus(transactionId: string): Promise<TransactionStatusResponse> {
  return callEdgeFunction<TransactionStatusResponse>('mtn-check-status', {
    transaction_id: transactionId,
  });
}

export async function getWalletBalance(): Promise<{ balance: number; locked_balance: number; currency: string }> {
  return callEdgeFunction<{ balance: number; locked_balance: number; currency: string }>('wallet-balance', {});
}

export async function paySubscription(planId: string): Promise<PaymentResponse> {
  return callEdgeFunction<PaymentResponse>('subscription-pay', {
    plan_id: planId,
  });
}

export async function purchaseTicketWithWallet(ticketId: string): Promise<{
  success: boolean;
  purchase_id: string;
  new_balance: number;
}> {
  return callEdgeFunction<{
    success: boolean;
    purchase_id: string;
    new_balance: number;
  }>('ticket-purchase', {
    ticket_id: ticketId,
    payment_method: 'wallet',
  });
}

export function formatMoMoPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('242')) {
    return cleaned;
  }
  if (cleaned.length === 9) {
    return `242${cleaned}`;
  }
  return cleaned;
}

export function validateMoMoPhone(phone: string): boolean {
  const normalized = formatMoMoPhoneNumber(phone);
  const momoRegex = /^242(04|05|06)\d{7}$/;
  return momoRegex.test(normalized);
}

export const PAYMENT_ERRORS: Record<string, string> = {
  'INSUFFICIENT_FUNDS': 'Solde insuffisant sur votre compte Mobile Money',
  'INVALID_PHONE': 'Numéro de téléphone invalide',
  'TRANSACTION_FAILED': 'La transaction a échoué. Veuillez réessayer.',
  'TIMEOUT': 'Délai d\'attente dépassé. Veuillez vérifier votre téléphone.',
  'USER_CANCELLED': 'Transaction annulée par l\'utilisateur',
  'LIMIT_EXCEEDED': 'Limite de transaction dépassée',
  'SERVICE_UNAVAILABLE': 'Service temporairement indisponible',
};

export function getPaymentErrorMessage(errorCode: string): string {
  return PAYMENT_ERRORS[errorCode] || 'Une erreur est survenue lors du paiement';
}
