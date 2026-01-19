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
  access_token:  string;
  token_type:  string;
  expires_in:  number;
}

interface RequestToPayResponse {
  status: string;
  financialTransactionId?:  string;
  externalId:  string;
  amount: string;
  currency: string;
  payer:  {
    partyIdType:  string;
    partyId:  string;
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
  payee:  {
    partyIdType:  string;
    partyId:  string;
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
let disbursementsApiCredentials: { apiUser:  string; apiKey: string } | null = null;

function generateUUID(): string {
  return crypto.randomUUID();
}

/**
 * Validate that required environment variables are configured
 */
function validateEnvironmentVariables(type: 'collections' | 'disbursements'): void {
  const subscriptionKeyVar = type === 'collections' 
    ? 'MTN_COLLECTIONS_SUBSCRIPTION_KEY' 
    : 'MTN_DISBURSEMENTS_SUBSCRIPTION_KEY';
  
  const subscriptionKey = Deno.env.get(subscriptionKeyVar);
  
  if (!subscriptionKey) {
    throw new Error(`Environment variable ${subscriptionKeyVar} is not configured.  Please set it in Supabase Edge Functions configuration.`);
  }
  
  if (subscriptionKey.trim() === '') {
    throw new Error(`Environment variable ${subscriptionKeyVar} is empty. Please configure it with a valid MTN subscription key.`);
  }
  
  console.log(`✓ ${subscriptionKeyVar} is configured`);
}

/**
 * Create API User for sandbox environment
 */
async function createApiUser(subscriptionKey: string, callbackHost: string): Promise<string> {
  if (!subscriptionKey || subscriptionKey.trim() === '') {
    throw new Error('Subscription key is required to create API User');
  }

  const apiUser = generateUUID();
  
  console.log(`[MTN] Creating API User with ID: ${apiUser}`);
  console.log(`[MTN] Using subscription key (first 8 chars): ${subscriptionKey.substring(0, 8)}...`);
  console.log(`[MTN] Callback host: ${callbackHost}`);
  
  try {
    const url = `${BASE_URL}/v1_0/apiuser`;
    console.log(`[MTN] POST ${url}`);
    
    const response = await fetch(url, {
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

    console.log(`[MTN] Response status: ${response.status} ${response.statusText}`);
    
    // Log response headers for debugging
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => { headers[key] = value; });
    console.log(`[MTN] Response headers:`, JSON.stringify(headers));

    if (!response.ok && response.status !== 201) {
      const errorText = await response.text();
      console.error(`[MTN] Failed to create API User. Status: ${response.status}, Body: "${errorText}"`);
      throw new Error(`Failed to create API User: ${response.status} - ${errorText || 'Empty response'}`);
    }

    console.log(`[MTN] ✓ API User created successfully: ${apiUser}`);
    return apiUser;
  } catch (error) {
    console.error(`[MTN] Exception creating API User:`, error);
    throw error;
  }
}

/**
 * Create API Key for the API User
 */
async function createApiKey(apiUser: string, subscriptionKey: string): Promise<string> {
  if (!subscriptionKey || subscriptionKey.trim() === '') {
    throw new Error('Subscription key is required to create API Key');
  }

  console.log(`[MTN] Creating API Key for user: ${apiUser}`);
  
  try {
    const url = `${BASE_URL}/v1_0/apiuser/${apiUser}/apikey`;
    console.log(`[MTN] POST ${url}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
      },
    });

    console.log(`[MTN] Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[MTN] Failed to create API Key. Status: ${response.status}, Body: "${errorText}"`);
      throw new Error(`Failed to create API Key: ${response.status} - ${errorText || 'Empty response'}`);
    }

    const data = await response.json();
    console.log(`[MTN] ✓ API Key created successfully`);
    return data.apiKey;
  } catch (error) {
    console.error(`[MTN] Exception creating API Key:`, error);
    throw error;
  }
}

/**
 * Get or create API credentials
 */
async function getApiCredentials(
  type: 'collections' | 'disbursements'
): Promise<{ apiUser:  string; apiKey: string }> {
  // Check cache first
  const cache = type === 'collections' ?  collectionsApiCredentials : disbursementsApiCredentials;
  if (cache) {
    console.log(`[MTN] Using cached ${type} API credentials`);
    return cache;
  }

  // Validate environment variables
  validateEnvironmentVariables(type);

  const subscriptionKey = type === 'collections' 
    ?  Deno.env.get('MTN_COLLECTIONS_SUBSCRIPTION_KEY')!
    : Deno.env.get('MTN_DISBURSEMENTS_SUBSCRIPTION_KEY')!;
  
  // Sanitize callback host - remove any accidental spaces
  const rawCallbackHost = Deno.env.get('MTN_CALLBACK_HOST') || 'https://webhook.site';
  const callbackHost = rawCallbackHost.replace(/\s+/g, '');

  console.log(`[MTN] Creating new ${type} API credentials... `);
  console.log(`[MTN] Sanitized callback host: ${callbackHost}`);

  try {
    const apiUser = await createApiUser(subscriptionKey, callbackHost);
    const apiKey = await createApiKey(apiUser, subscriptionKey);

    const credentials = { apiUser, apiKey };

    // Cache credentials
    if (type === 'collections') {
      collectionsApiCredentials = credentials;
    } else {
      disbursementsApiCredentials = credentials;
    }

    return credentials;
  } catch (error) {
    console.error(`[MTN] Failed to get API credentials for ${type}:`, error);
    throw error;
  }
}

/**
 * Get OAuth token (with automatic renewal)
 */
async function getAccessToken(type: 'collections' | 'disbursements'): Promise<string> {
  const now = Date.now();
  const cache = type === 'collections' ?  collectionsToken : disbursementsToken;
  
  // Return cached token if still valid (with 30 second buffer)
  if (cache && cache.expiresAt > now + 30000) {
    console.log(`[MTN] Using cached ${type} access token (expires in ${Math.round((cache.expiresAt - now) / 1000)}s)`);
    return cache.token;
  }

  // Validate environment variables
  validateEnvironmentVariables(type);

  console.log(`[MTN] Fetching new ${type} access token...`);

  try {
    const credentials = await getApiCredentials(type);
    const subscriptionKey = type === 'collections'
      ? Deno.env.get('MTN_COLLECTIONS_SUBSCRIPTION_KEY')!
      : Deno.env. get('MTN_DISBURSEMENTS_SUBSCRIPTION_KEY')!;

    const basicAuth = btoa(`${credentials.apiUser}:${credentials.apiKey}`);
    const endpoint = type === 'collections' ? 'collection' : 'disbursement';

    console.log(`[MTN] Requesting token from ${BASE_URL}/${endpoint}/token/`);

    const response = await fetch(`${BASE_URL}/${endpoint}/token/`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Ocp-Apim-Subscription-Key': subscriptionKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[MTN] Failed to get ${type} access token:`, response.status, errorText);
      throw new Error(`Failed to get ${type} access token: ${response. status} - ${errorText}`);
    }

    const data:  TokenResponse = await response.json();
    
    const tokenData = {
      token: data.access_token,
      expiresAt: now + (data.expires_in * 1000),
    };

    // Cache token
    if (type === 'collections') {
      collectionsToken = tokenData;
    } else {
      disbursementsToken = tokenData;
    }

    console.log(`[MTN] ✓ ${type} access token obtained (expires in ${data.expires_in}s)`);
    return data.access_token;
  } catch (error) {
    console.error(`[MTN] Exception getting ${type} access token:`, error);
    throw error;
  }
}

/**
 * Format phone number for MTN Sandbox
 * In sandbox mode, ALWAYS use test number:  46733123456
 */
function formatPhoneNumber(phone: string): string {
  // For sandbox, ALWAYS use the test number
  if (MTN_ENV === 'sandbox') {
    console.log(`[MTN] Sandbox mode: Using test phone number 46733123456 (input was: ${phone})`);
    return '46733123456';
  }
  
  // Production:  Congo-Brazzaville format
  const cleaned = phone.replace(/\D/g, '');
  let productionPhone = cleaned;
  
  if (productionPhone.startsWith('242')) {
    productionPhone = productionPhone.substring(3);
  } else if (productionPhone.startsWith('00242')) {
    productionPhone = productionPhone.substring(5);
  }
  
  if (productionPhone.length !== 9) {
    throw new Error('Invalid phone number format for Congo-Brazzaville.  Expected 9 digits after country code.');
  }
  
  const formatted = `242${productionPhone}`;
  console.log(`[MTN] Production mode:  Formatted phone number: ${formatted}`);
  return formatted;
}

/**
 * Request to Pay (Collections - Deposit)
 */
export async function requestToPay(
  amount: number,
  phoneNumber: string,
  externalId: string,
  payerMessage?:  string,
  payeeNote?: string
): Promise<{ referenceId: string }> {
  try {
    console.log(`[MTN] Starting requestToPay:  amount=${amount}, phone=${phoneNumber}, externalId=${externalId}`);

    const token = await getAccessToken('collections');
    const subscriptionKey = Deno. env.get('MTN_COLLECTIONS_SUBSCRIPTION_KEY');
    
    if (!subscriptionKey) {
      throw new Error('MTN_COLLECTIONS_SUBSCRIPTION_KEY is not configured');
    }

    const referenceId = generateUUID();
    // Sanitize callback URL - remove any accidental spaces
    const rawCallbackUrl = Deno.env.get('MTN_CALLBACK_HOST');
    const callbackUrl = rawCallbackUrl ? rawCallbackUrl.replace(/\s+/g, '') : undefined;
    const formattedPhone = formatPhoneNumber(phoneNumber);

    const requestBody = {
      amount:  amount.toString(),
      currency: MTN_CURRENCY,
      externalId,
      payer: {
        partyIdType: 'MSISDN',
        partyId: formattedPhone,
      },
      payerMessage:  payerMessage || 'Dépôt sur votre portefeuille',
      payeeNote: payeeNote || 'Dépôt wallet',
    };

    console.log(`[MTN] Sending request to ${BASE_URL}/collection/v1_0/requesttopay`);
    console.log(`[MTN] Request body: `, JSON.stringify(requestBody, null, 2));

    // For sandbox, don't send X-Callback-Url - it must match exactly what was set in API User creation
    // Sandbox doesn't require callbacks, we'll poll for status instead
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
      'X-Reference-Id': referenceId,
      'X-Target-Environment': MTN_ENV,
      'Ocp-Apim-Subscription-Key': subscriptionKey,
      'Content-Type': 'application/json',
    };

    // Only add callback URL in production mode and if it matches the configured host
    if (MTN_ENV !== 'sandbox' && callbackUrl) {
      headers['X-Callback-Url'] = `${callbackUrl}/mtn-webhook-collection`;
    }

    console.log(`[MTN] Request headers (without auth):`, JSON.stringify({
      'X-Reference-Id': referenceId,
      'X-Target-Environment': MTN_ENV,
      'Has-Callback': !!headers['X-Callback-Url'],
    }));

    const response = await fetch(`${BASE_URL}/collection/v1_0/requesttopay`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    console.log(`[MTN] Request to Pay response status: ${response.status} ${response.statusText}`);
    
    // Log response headers for debugging
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => { responseHeaders[key] = value; });
    console.log(`[MTN] Response headers:`, JSON.stringify(responseHeaders));

    if (!response.ok && response.status !== 202) {
      const errorText = await response.text();
      console.error(`[MTN] Request to Pay failed. Status: ${response.status}, Body: "${errorText}"`);
      throw new Error(`Request to Pay failed: ${response.status} - ${errorText || 'Empty response from MTN'}`);
    }

    console.log(`[MTN] ✓ Request to Pay sent successfully with referenceId: ${referenceId}`);
    return { referenceId };
  } catch (error) {
    console.error(`[MTN] Exception in requestToPay:`, error);
    throw error;
  }
}

/**
 * Get Request to Pay Status
 */
export async function getRequestToPayStatus(referenceId: string): Promise<RequestToPayResponse> {
  try {
    console.log(`[MTN] Getting status for referenceId: ${referenceId}`);

    const token = await getAccessToken('collections');
    const subscriptionKey = Deno.env.get('MTN_COLLECTIONS_SUBSCRIPTION_KEY');

    if (!subscriptionKey) {
      throw new Error('MTN_COLLECTIONS_SUBSCRIPTION_KEY is not configured');
    }

    const response = await fetch(`${BASE_URL}/collection/v1_0/requesttopay/${referenceId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Target-Environment': MTN_ENV,
        'Ocp-Apim-Subscription-Key':  subscriptionKey,
      },
    });

    if (!response. ok) {
      const errorText = await response.text();
      console.error(`[MTN] Failed to get payment status: `, response.status, errorText);
      throw new Error(`Failed to get payment status: ${response.status} - ${errorText}`);
    }

    const status = await response.json();
    console.log(`[MTN] ✓ Payment status retrieved: `, JSON.stringify(status, null, 2));
    return status;
  } catch (error) {
    console.error(`[MTN] Exception in getRequestToPayStatus:`, error);
    throw error;
  }
}

/**
 * Transfer (Disbursements - Withdrawal)
 */
export async function transfer(
  amount: number,
  phoneNumber: string,
  externalId: string,
  payerMessage?: string,
  payeeNote?: string
): Promise<{ referenceId: string }> {
  try {
    console.log(`[MTN] Starting transfer: amount=${amount}, phone=${phoneNumber}, externalId=${externalId}`);

    const token = await getAccessToken('disbursements');
    const subscriptionKey = Deno.env. get('MTN_DISBURSEMENTS_SUBSCRIPTION_KEY');
    
    if (!subscriptionKey) {
      throw new Error('MTN_DISBURSEMENTS_SUBSCRIPTION_KEY is not configured');
    }

    const referenceId = generateUUID();
    // Sanitize callback URL - remove any accidental spaces
    const rawCallbackUrl = Deno.env.get('MTN_CALLBACK_HOST');
    const callbackUrl = rawCallbackUrl ? rawCallbackUrl.replace(/\s+/g, '') : undefined;
    const formattedPhone = formatPhoneNumber(phoneNumber);

    const requestBody = {
      amount:  amount.toString(),
      currency: MTN_CURRENCY,
      externalId,
      payee: {
        partyIdType: 'MSISDN',
        partyId: formattedPhone,
      },
      payerMessage: payerMessage || 'Retrait de votre portefeuille',
      payeeNote: payeeNote || 'Retrait wallet',
    };

    console.log(`[MTN] Sending transfer to ${BASE_URL}/disbursement/v1_0/transfer`);
    console.log(`[MTN] Request body:`, JSON.stringify(requestBody, null, 2));

    // For sandbox, don't send X-Callback-Url - it must match exactly what was set in API User creation
    const transferHeaders: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
      'X-Reference-Id': referenceId,
      'X-Target-Environment': MTN_ENV,
      'Ocp-Apim-Subscription-Key': subscriptionKey,
      'Content-Type': 'application/json',
    };

    // Only add callback URL in production mode
    if (MTN_ENV !== 'sandbox' && callbackUrl) {
      transferHeaders['X-Callback-Url'] = `${callbackUrl}/mtn-webhook-disbursement`;
    }

    const response = await fetch(`${BASE_URL}/disbursement/v1_0/transfer`, {
      method: 'POST',
      headers: transferHeaders,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok && response.status !== 202) {
      const errorText = await response.text();
      console.error(`[MTN] Transfer failed: `, response.status, errorText);
      throw new Error(`Transfer failed: ${response.status} - ${errorText}`);
    }

    console.log(`[MTN] ✓ Transfer sent successfully with referenceId:  ${referenceId}`);
    return { referenceId };
  } catch (error) {
    console.error(`[MTN] Exception in transfer:`, error);
    throw error;
  }
}

/**
 * Get Transfer Status
 */
export async function getTransferStatus(referenceId: string): Promise<TransferResponse> {
  try {
    console.log(`[MTN] Getting transfer status for referenceId:  ${referenceId}`);

    const token = await getAccessToken('disbursements');
    const subscriptionKey = Deno.env.get('MTN_DISBURSEMENTS_SUBSCRIPTION_KEY');

    if (!subscriptionKey) {
      throw new Error('MTN_DISBURSEMENTS_SUBSCRIPTION_KEY is not configured');
    }

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
      console.error(`[MTN] Failed to get transfer status:`, response.status, errorText);
      throw new Error(`Failed to get transfer status: ${response.status} - ${errorText}`);
    }

    const status = await response.json();
    console.log(`[MTN] ✓ Transfer status retrieved:`, JSON.stringify(status, null, 2));
    return status;
  } catch (error) {
    console.error(`[MTN] Exception in getTransferStatus:`, error);
    throw error;
  }
}

/**
 * Get Collections Account Balance
 */
export async function getCollectionsBalance(): Promise<{ availableBalance: string; currency: string }> {
  try {
    console.log(`[MTN] Getting collections account balance... `);

    const token = await getAccessToken('collections');
    const subscriptionKey = Deno.env.get('MTN_COLLECTIONS_SUBSCRIPTION_KEY');

    if (!subscriptionKey) {
      throw new Error('MTN_COLLECTIONS_SUBSCRIPTION_KEY is not configured');
    }

    const response = await fetch(`${BASE_URL}/collection/v1_0/account/balance`, {
      method: 'GET',
      headers:  {
        'Authorization': `Bearer ${token}`,
        'X-Target-Environment': MTN_ENV,
        'Ocp-Apim-Subscription-Key': subscriptionKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[MTN] Failed to get balance:`, response.status, errorText);
      throw new Error(`Failed to get balance: ${response.status} - ${errorText}`);
    }

    const balance = await response.json();
    console.log(`[MTN] ✓ Balance retrieved:`, JSON.stringify(balance, null, 2));
    return balance;
  } catch (error) {
    console.error(`[MTN] Exception in getCollectionsBalance:`, error);
    throw error;
  }
}

/**
 * Validate account holder
 */
export async function validateAccountHolder(phoneNumber: string): Promise<boolean> {
  try {
    console.log(`[MTN] Validating account holder: ${phoneNumber}`);

    const token = await getAccessToken('collections');
    const subscriptionKey = Deno.env.get('MTN_COLLECTIONS_SUBSCRIPTION_KEY');

    if (!subscriptionKey) {
      throw new Error('MTN_COLLECTIONS_SUBSCRIPTION_KEY is not configured');
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);

    const response = await fetch(
      `${BASE_URL}/collection/v1_0/accountholder/msisdn/${formattedPhone}/active`,
      {
        method: 'GET',
        headers:  {
          'Authorization': `Bearer ${token}`,
          'X-Target-Environment': MTN_ENV,
          'Ocp-Apim-Subscription-Key': subscriptionKey,
        },
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      const isActive = data.result === true;
      console.log(`[MTN] ✓ Account holder validation result: ${isActive}`);
      return isActive;
    }

    console.log(`[MTN] Account holder validation returned status: ${response.status}`);
    return false;
  } catch (error) {
    console.error(`[MTN] Exception in validateAccountHolder:`, error);
    throw error;
  }
}
