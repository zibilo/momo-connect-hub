import { z } from 'zod';

const CONGO_COUNTRY_CODE = '242';

/**
 * Formats a local Congolese phone number to the international format without the '+'.
 * e.g., "061234567" -> "242061234567"
 * @param localNumber - The local phone number.
 * @returns The formatted international number.
 */
export function formatPhoneNumber(localNumber: string): string {
  if (localNumber.startsWith(CONGO_COUNTRY_CODE)) {
    return localNumber;
  }
  if (localNumber.startsWith('0')) {
    return `${CONGO_COUNTRY_CODE}${localNumber.substring(1)}`;
  }
  return `${CONGO_COUNTRY_CODE}${localNumber}`;
}

export const PhoneNumberSchema = z.string().regex(/^(242)?(0[1-6])\d{7}$/, {
  message: "Invalid Congolese phone number",
});
