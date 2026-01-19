import React from 'react';
import { formatCurrency } from '@/lib/currency';

interface CurrencyDisplayProps {
  amount: number;
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({ amount }) => {
  return <span>{formatCurrency(amount)}</span>;
};
