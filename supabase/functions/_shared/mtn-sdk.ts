// MTN MoMo SDK for Sandbox Testing
// Handles API User creation, API Key generation, OAuth tokens, and payment operations

const MTN_ENV = 'sandbox' as const;
const MTN_CURRENCY = 'EUR'; // Sandbox uses EUR

// Sandbox URLs
const SANDBOX_BASE_URL = 'https://sandbox.momodeveloper.mtn.com';

// Production URLs (for future use)
const PRODUCTION_BASE_URL = 'https://proxy.momoapi.mtn.com';

// Use sandbox for now
const BASE_URL = SANDBOX_BASE_URL;

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface RequestToPayResponse {
  status: string;
  financialTransactionId?: string;
  externalId: string;
  amount: string;
  currency: string;
  payer: {
    partyIdType: string;
    partyId: string;
  };
  payerMessage?: string;
  payeeNote?: string;
  reason?: string;
}

interface TransferResponse {
  status: string;
  financialTransactionId?: string;
  externalId: string;
  amount: string;
  currency: string;
  payee: {
    partyIdType: string;
    partyId: string;
  };
  payerMessage?: string;
  payeeNote?: string;
  reason?: string;
}

// Token cache with expiry tracking
let collectionsToken: { token: string; expiresAt: number } | null = null;
let disbursementsToken: { token: string; expiresAt: number } | null = null;

// API User and Key cache
let collectionsApiCredentials: { apiUser: string; apiKey: string } | null = null;
let disbursementsApiCredentials: { apiUser: string; apiKey: string } | null = null;

function generateUUID(): string {
  return crypto.randomUUID();
}

// Create API User for sandbox environment
async function createApiUser(subscriptionKey: string, callbackHost: string): Promise<string> {
  const apiUser = generateUUID();
  
  const response = await fetch(`${BASE_URL}/v1_0/apiuser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Reference-Id': apiUser,
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    },
    body: JSON.stringify({
      providerCallbackHost: callbackHost,
    }),
  });

  if (!response.ok && response.status !== 201) {
    const errorText = await response.text();
    throw new Error(`Failed to create API User: ${response.status} - ${errorText}`);
  }

  return apiUser;
}

// Create API Key for the API User
async function createApiKey(apiUser: string, subscriptionKey: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/v1_0/apiuser/${apiUser}/apikey`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create API Key: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.apiKey;
}

// Get or create API credentials
async function getApiCredentials(
  type: 'collections' | 'disbursements'
): Promise<{ apiUser: string; apiKey: string }> {
  const cache = type === 'collections' ? collectionsApiCredentials : disbursementsApiCredentials;
  
  if (cache) {
    return cache;
  }

  const subscriptionKey = type === 'collections' 
    ? Deno.env.get('MTN_COLLECTIONS_SUBSCRIPTION_KEY')!
    : Deno.env.get('MTN_DISBURSEMENTS_SUBSCRIPTION_KEY')!;
  
  const callbackHost = Deno.env.get('MTN_CALLBACK_HOST') || 'https://webhook.site';

  const apiUser = await createApiUser(subscriptionKey, callbackHost);
  const apiKey = await createApiKey(apiUser, subscriptionKey);

  const credentials = { apiUser, apiKey };

  if (type === 'collections') {
    collectionsApiCredentials = credentials;
  } else {
    disbursementsApiCredentials = credentials;
  }

  return credentials;
}

// Get OAuth token (with automatic renewal)
async function getAccessToken(type: 'collections' | 'disbursements'): Promise<string> {
  const now = Date.now();
  const cache = type === 'collections' ? collectionsToken : disbursementsToken;
  
  // Return cached token if still valid (with 30 second buffer)
  if (cache && cache.expiresAt > now + 30000) {
    return cache.token;
  }

  const credentials = await getApiCredentials(type);
  const subscriptionKey = type === 'collections'
    ? Deno.env.get('MTN_COLLECTIONS_SUBSCRIPTION_KEY')!
    : Deno.env.get('MTN_DISBURSEMENTS_SUBSCRIPTION_KEY')!;

  const basicAuth = btoa(`${credentials.apiUser}:${credentials.apiKey}`);
  const endpoint = type === 'collections' ? 'collection' : 'disbursement';

  const response = await fetch(`${BASE_URL}/${endpoint}/token/`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get access token: ${response.status} - ${errorText}`);
  }

  const data: TokenResponse = await response.json();
  
  const tokenData = {
    token: data.access_token,
    expiresAt: now + (data.expires_in * 1000),
  };

  if (type === 'collections') {
    collectionsToken = tokenData;
  } else {
    disbursementsToken = tokenData;
  }

  return data.access_token;
}

// Format phone number for MTN Sandbox
// In sandbox mode, use test number format: 46733123456
function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // For sandbox, accept the test number format directly
  // The sandbox uses Swedish test numbers like 46733123456
  if (MTN_ENV === 'sandbox') {
    // If it's already a valid sandbox number, use it
    if (cleaned.length >= 10) {
      return cleaned;
    }
    // Default sandbox test number
    return '46733123456';
  }
  
  // Production: Congo-Brazzaville format
  let productionPhone = cleaned;
  if (productionPhone.startsWith('242')) {
    productionPhone = productionPhone.substring(3);
  } else if (productionPhone.startsWith('00242')) {
    productionPhone = productionPhone.substring(5);
  }
  
  if (productionPhone.length !== 9) {
    throw new Error('Invalid phone number format for Congo-Brazzaville. Expected 9 digits.');
  }
  
  return `242${productionPhone}`;
}

// Request to Pay (Collections - Deposit)
export async function requestToPay(
  amount: number,
  phoneNumber: string,
  externalId: string,
  payerMessage?: string,
  payeeNote?: string
): Promise<{ referenceId: string }> {
  const token = await getAccessToken('collections');
  const subscriptionKey = Deno.env.get('MTN_COLLECTIONS_SUBSCRIPTION_KEY')!;
  const referenceId = generateUUID();
  const callbackUrl = Deno.env.get('MTN_CALLBACK_HOST');

  const formattedPhone = formatPhoneNumber(phoneNumber);

  const response = await fetch(`${BASE_URL}/collection/v1_0/requesttopay`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Reference-Id': referenceId,
      'X-Target-Environment': MTN_ENV,
      'Ocp-Apim-Subscription-Key': subscriptionKey,
      'Content-Type': 'application/json',
      ...(callbackUrl ? { 'X-Callback-Url': `${callbackUrl}/webhooks/mtn/collection` } : {}),
    },
    body: JSON.stringify({
      amount: amount.toString(),
      currency: MTN_CURRENCY,
      externalId,
      payer: {
        partyIdType: 'MSISDN',
        partyId: formattedPhone,
      },
      payerMessage: payerMessage || 'Dépôt sur votre portefeuille',
      payeeNote: payeeNote || 'Dépôt wallet',
    }),
  });

  if (!response.ok && response.status !== 202) {
    const errorText = await response.text();
    throw new Error(`Request to Pay failed: ${response.status} - ${errorText}`);
  }

  return { referenceId };
}

// Get Request to Pay Status
export async function getRequestToPayStatus(referenceId: string): Promise<RequestToPayResponse> {
  const token = await getAccessToken('collections');
  const subscriptionKey = Deno.env.get('MTN_COLLECTIONS_SUBSCRIPTION_KEY')!;

  const response = await fetch(`${BASE_URL}/collection/v1_0/requesttopay/${referenceId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Target-Environment': MTN_ENV,
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get payment status: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

// Transfer (Disbursements - Withdrawal)
export async function transfer(
  amount: number,
  phoneNumber: string,
  externalId: string,
  payerMessage?: string,
  payeeNote?: string
): Promise<{ referenceId: string }> {
  const token = await getAccessToken('disbursements');
  const subscriptionKey = Deno.env.get('MTN_DISBURSEMENTS_SUBSCRIPTION_KEY')!;
  const referenceId = generateUUID();
  const callbackUrl = Deno.env.get('MTN_CALLBACK_HOST');

  const formattedPhone = formatPhoneNumber(phoneNumber);

  const response = await fetch(`${BASE_URL}/disbursement/v1_0/transfer`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Reference-Id': referenceId,
      'X-Target-Environment': MTN_ENV,
      'Ocp-Apim-Subscription-Key': subscriptionKey,
      'Content-Type': 'application/json',
      ...(callbackUrl ? { 'X-Callback-Url': `${callbackUrl}/webhooks/mtn/disbursement` } : {}),
    },
    body: JSON.stringify({
      amount: amount.toString(),
      currency: MTN_CURRENCY,
      externalId,
      payee: {
        partyIdType: 'MSISDN',
        partyId: formattedPhone,
      },
      payerMessage: payerMessage || 'Retrait de votre portefeuille',
      payeeNote: payeeNote || 'Retrait wallet',
    }),
  });

  if (!response.ok && response.status !== 202) {
    const errorText = await response.text();
    throw new Error(`Transfer failed: ${response.status} - ${errorText}`);
  }

  return { referenceId };
}

// Get Transfer Status
export async function getTransferStatus(referenceId: string): Promise<TransferResponse> {
  const token = await getAccessToken('disbursements');
  const subscriptionKey = Deno.env.get('MTN_DISBURSEMENTS_SUBSCRIPTION_KEY')!;

  const response = await fetch(`${BASE_URL}/disbursement/v1_0/transfer/${referenceId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Target-Environment': MTN_ENV,
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get transfer status: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

// Get Collections Account Balance
export async function getCollectionsBalance(): Promise<{ availableBalance: string; currency: string }> {
  const token = await getAccessToken('collections');
  const subscriptionKey = Deno.env.get('MTN_COLLECTIONS_SUBSCRIPTION_KEY')!;

  const response = await fetch(`${BASE_URL}/collection/v1_0/account/balance`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Target-Environment': MTN_ENV,
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get balance: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

// Validate account holder
export async function validateAccountHolder(phoneNumber: string): Promise<boolean> {
  const token = await getAccessToken('collections');
  const subscriptionKey = Deno.env.get('MTN_COLLECTIONS_SUBSCRIPTION_KEY')!;
  const formattedPhone = formatPhoneNumber(phoneNumber);

  const response = await fetch(
    `${BASE_URL}/collection/v1_0/accountholder/msisdn/${formattedPhone}/active`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Target-Environment': MTN_ENV,
        'Ocp-Apim-Subscription-Key': subscriptionKey,
      },
    }
  );

  if (response.status === 200) {
    const data = await response.json();
    return data.result === true;
  }

  return false;
}
