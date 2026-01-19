import { invokeEdgeFunction } from './api';
import { SubscriptionPlanName } from '@/types/subscription';
import { Transaction } from '@/types/transaction';

/**
 * Initiates a deposit request.
 * @param amount - The amount to deposit.
 * @param phoneNumber - The phone number to deposit from.
 * @returns A promise that resolves to the pending transaction.
 */
export async function deposit(amount: number, phoneNumber: string): Promise<Transaction> {
  console.log(`Initiating deposit of ${amount} from ${phoneNumber}...`);
  return invokeEdgeFunction<Transaction>('mtn-deposit', { amount, phoneNumber });
}

/**
 * Initiates a withdrawal request.
 * @param amount - The amount to withdraw.
 * @param phoneNumber - The phone number to withdraw to.
 * @returns A promise that resolves to the pending transaction.
 */
export async function withdraw(amount: number, phoneNumber: string): Promise<Transaction> {
  console.log(`Initiating withdrawal of ${amount} to ${phoneNumber}...`);
  return invokeEdgeFunction<Transaction>('mtn-withdraw', { amount, phoneNumber });
}

/**
 * Pays for a creator subscription.
 * @param plan - The subscription plan to purchase.
 * @param phoneNumber - The phone number to pay with.
 * @returns A promise that resolves to the pending transaction.
 */
export async function payForSubscription(plan: SubscriptionPlanName, phoneNumber: string): Promise<Transaction> {
  console.log(`Paying for ${plan} subscription with ${phoneNumber}...`);
  return invokeEdgeFunction<Transaction>('subscription-pay', { plan, phoneNumber });
}
