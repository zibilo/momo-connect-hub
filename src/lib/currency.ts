import { CURRENCY_SYMBOL } from './constants';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' ' + CURRENCY_SYMBOL;
}

export function formatCompactCurrency(amount: number): string {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1).replace('.0', '') + 'M ' + CURRENCY_SYMBOL;
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(1).replace('.0', '') + 'K ' + CURRENCY_SYMBOL;
  }
  return formatCurrency(amount);
}

export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^\d]/g, '');
  return parseInt(cleaned, 10) || 0;
}

export function formatInputCurrency(value: string): string {
  const number = parseCurrency(value);
  if (isNaN(number) || number === 0) return '';
  return new Intl.NumberFormat('fr-FR').format(number);
}

export function validateAmount(amount: number, min: number, max: number): { valid: boolean; error?: string } {
  if (isNaN(amount) || amount <= 0) {
    return { valid: false, error: 'Montant invalide' };
  }
  if (amount < min) {
    return { valid: false, error: `Montant minimum: ${formatCurrency(min)}` };
  }
  if (amount > max) {
    return { valid: false, error: `Montant maximum: ${formatCurrency(max)}` };
  }
  return { valid: true };
}
