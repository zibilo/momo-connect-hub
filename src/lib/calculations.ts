import { PLATFORM_COMMISSION_RATE } from './constants';

export function calculateTotalOdds(odds: number[]): number {
  if (odds.length === 0) return 0;
  return odds.reduce((acc, odd) => acc * odd, 1);
}

export function calculatePotentialGain(stake: number, totalOdds: number): number {
  return Math.floor(stake * totalOdds);
}

export function calculateCommission(amount: number, rate: number = PLATFORM_COMMISSION_RATE): number {
  return Math.floor(amount * rate);
}

export function calculateNetAmount(amount: number, rate: number = PLATFORM_COMMISSION_RATE): number {
  return amount - calculateCommission(amount, rate);
}

export function calculateCreatorEarnings(salePrice: number, commissionRate: number): {
  gross: number;
  commission: number;
  net: number;
} {
  const commission = calculateCommission(salePrice, commissionRate);
  return {
    gross: salePrice,
    commission,
    net: salePrice - commission,
  };
}

export function formatOdds(odds: number): string {
  return odds.toFixed(2);
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function calculateSuccessRate(won: number, total: number): number {
  if (total === 0) return 0;
  return won / total;
}

export function calculateROI(totalWinnings: number, totalStake: number): number {
  if (totalStake === 0) return 0;
  return (totalWinnings - totalStake) / totalStake;
}

export function roundToNearest(value: number, nearest: number): number {
  return Math.round(value / nearest) * nearest;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
