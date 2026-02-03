import { formatCurrency, formatCompactCurrency } from '@/lib/currency';

interface CurrencyDisplayProps {
  amount: number;
  compact?: boolean;
  className?: string;
}

export function CurrencyDisplay({ amount, compact = false, className }: CurrencyDisplayProps) {
  const formatted = compact ? formatCompactCurrency(amount) : formatCurrency(amount);
  
  return <span className={className}>{formatted}</span>;
}
