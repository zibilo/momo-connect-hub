import { COUNTRY_CODE, PHONE_REGEX, MOMO_PHONE_REGEX } from './constants';

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  let normalized = cleaned;
  if (cleaned.startsWith('242')) {
    normalized = cleaned.slice(3);
  } else if (cleaned.startsWith('00242')) {
    normalized = cleaned.slice(5);
  }
  
  if (normalized.length === 9) {
    return `${normalized.slice(0, 2)} ${normalized.slice(2, 5)} ${normalized.slice(5, 7)} ${normalized.slice(7)}`;
  }
  
  return phone;
}

export function normalizePhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('242')) {
    return cleaned;
  } else if (cleaned.startsWith('00242')) {
    return cleaned.slice(2);
  } else if (cleaned.length === 9) {
    return '242' + cleaned;
  }
  
  return cleaned;
}

export function formatPhoneForDisplay(phone: string): string {
  const normalized = normalizePhoneNumber(phone);
  if (normalized.length === 12 && normalized.startsWith('242')) {
    const local = normalized.slice(3);
    return `+242 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5, 7)} ${local.slice(7)}`;
  }
  return phone;
}

export function isValidPhone(phone: string): boolean {
  const normalized = normalizePhoneNumber(phone);
  return PHONE_REGEX.test(normalized) || PHONE_REGEX.test(phone);
}

export function isValidMoMoPhone(phone: string): boolean {
  const normalized = normalizePhoneNumber(phone);
  return MOMO_PHONE_REGEX.test(normalized) || MOMO_PHONE_REGEX.test(phone);
}

export function getMobileOperator(phone: string): 'mtn' | 'airtel' | 'unknown' {
  const normalized = normalizePhoneNumber(phone);
  const prefix = normalized.slice(3, 5);
  
  if (['04', '05', '06'].includes(prefix)) {
    return 'mtn';
  }
  
  return 'unknown';
}

export function maskPhoneNumber(phone: string): string {
  const formatted = formatPhoneForDisplay(phone);
  const parts = formatted.split(' ');
  if (parts.length >= 3) {
    return `${parts[0]} ${parts[1]} *** ** ${parts[parts.length - 1]}`;
  }
  return phone.slice(0, 4) + '****' + phone.slice(-2);
}
