import { Selection } from '@/types/ticket';

/**
 * Calculates the total odds from a list of selections.
 * @param selections - An array of selections.
 * @returns The total odds.
 */
export function calculateTotalOdds(selections: Selection[]): number {
  if (selections.length === 0) {
    return 1;
  }
  return selections.reduce((total, selection) => total * selection.odds, 1);
}

/**
 * Calculates the potential gain for a given stake and odds.
 * @param stake - The amount of money staked.
 * @param odds - The total odds of the ticket.
 * @returns The potential gain.
 */
export function calculatePotentialGain(stake: number, odds: number): number {
  return stake * odds;
}
