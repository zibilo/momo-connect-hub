export const APP_NAME = 'BetTicket';
export const APP_DESCRIPTION = 'Plateforme de vente de tickets de paris sportifs';

export const CURRENCY = 'FCFA';
export const CURRENCY_SYMBOL = 'FCFA';
export const COUNTRY_CODE = '+242';

export const MIN_DEPOSIT = 500;
export const MAX_DEPOSIT = 500000;
export const MIN_WITHDRAWAL = 1000;
export const MAX_WITHDRAWAL = 1000000;

export const MIN_TICKET_PRICE = 100;
export const MAX_TICKET_PRICE = 50000;
export const DEFAULT_TICKET_PRICE = 500;

export const PLATFORM_COMMISSION_RATE = 0.01;

export const PHONE_REGEX = /^(\+242|242)?[0-9]{9}$/;
export const MOMO_PHONE_REGEX = /^(\+242|242)?(04|05|06)[0-9]{7}$/;

export const TRANSACTION_POLL_INTERVAL = 5000;
export const TRANSACTION_TIMEOUT = 300000;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
};

export const SPORTS = [
  { id: 'football', name: 'Football', icon: '⚽' },
  { id: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 'tennis', name: 'Tennis', icon: '🎾' },
  { id: 'volleyball', name: 'Volleyball', icon: '🏐' },
  { id: 'handball', name: 'Handball', icon: '🤾' },
] as const;

export const MARKETS = {
  '1X2': { name: 'Résultat final', selections: ['1', 'X', '2'] },
  'BTTS': { name: 'Les deux équipes marquent', selections: ['Oui', 'Non'] },
  'OVER_UNDER': { name: 'Plus/Moins de buts', selections: ['Plus', 'Moins'] },
  'DOUBLE_CHANCE': { name: 'Double chance', selections: ['1X', '12', 'X2'] },
} as const;

export const SUPABASE_URL = 'https://frgeeutseqjzuddqdlls.supabase.co';
export const SUPABASE_FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  MARKETPLACE: '/marketplace',
  WALLET: '/wallet',
  MY_TICKETS: '/my-tickets',
  PERSONAL_BETS: '/personal-bets',
  VERIFICATION: '/verification',
    CREATOR: {
      DASHBOARD: '/creator/dashboard',
      CREATE_TICKET: '/creator/tickets/create',
      MY_TICKETS: '/creator/tickets',
      SUBSCRIPTIONS: '/creator/subscriptions',
      PRINT: '/creator/print',
      COMMISSIONS: '/creator/commissions',
    },
  KYC: {
    SUBMIT: '/kyc/submit',
    STATUS: '/kyc/status',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    KYC_REVIEW: '/admin/kyc-review',
    USERS: '/admin/users',
    TRANSACTIONS: '/admin/transactions',
  },
} as const;
