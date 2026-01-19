import { format } from 'date-fns';

/**
 * Formats a date string or Date object into a more readable format.
 * @param date - The date to format.
 * @param formatString - The desired output format.
 * @returns The formatted date string.
 */
export function formatDate(date: string | Date, formatString: string = 'PPpp'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatString);
}
