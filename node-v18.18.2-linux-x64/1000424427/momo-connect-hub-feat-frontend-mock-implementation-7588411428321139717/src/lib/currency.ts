import { z } from 'zod';

/**
 * Formats a number as a currency string (FCFA).
 * @param amount - The amount to format.
 * @returns The formatted currency string.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
  }).format(amount);
}

export const AmountSchema = z.number().positive({ message: "Amount must be positive" });
