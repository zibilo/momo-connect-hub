import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { requestToPay } from '../_shared/mtn-sdk.ts';
import { supabaseAdmin } from '../_shared/supabase-admin.ts';
import { corsHeaders } from '../_shared/cors.ts';

interface DepositRequest {
  amount: number;
  phone_number: string;
}

interface DepositResponse {
  success?: boolean;
  message?: string;
  transaction_id?: string;
  reference?: string;
  error?: string;
  details?: string;
}

/**
 * Log function with timestamp and context
 */
function log(context: string, message: string, data?: unknown): void {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [DEPOSIT] [${context}]`;
  
  if (data) {
    console.log(`${prefix} ${message}`, data);
  } else {
    console.log(`${prefix} ${message}`);
  }
}

/**
 * Main handler
 */
serve(async (req) => {
  log('REQUEST', `Received ${req.method} request`);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    log('CORS', 'Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ============================================
    // 1. VERIFY AUTHENTICATION
    // ============================================
    log('AUTH', 'Verifying authorization header');
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      log('AUTH', 'ERROR: No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    log('AUTH', 'Authorization header found, validating user token');

    // Get user from token
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      log('AUTH', 'ERROR: Missing Supabase configuration');
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error',
          details: 'SUPABASE_URL or SUPABASE_ANON_KEY not configured'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError) {
      log('AUTH', 'ERROR: Failed to get user from token', userError.message);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token', details: userError.message }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!user) {
      log('AUTH', 'ERROR: No user found in token');
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    log('AUTH', 'User authenticated successfully', { user_id: user.id });

    // ============================================
    // 2. PARSE AND VALIDATE REQUEST BODY
    // ============================================
    log('REQUEST', 'Parsing request body');

    let depositRequest: DepositRequest;
    try {
      depositRequest = await req.json();
    } catch (parseError) {
      log('REQUEST', 'ERROR: Failed to parse JSON body', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { amount, phone_number } = depositRequest;

    log('REQUEST', 'Validating request data', { amount, phone_number });

    // Validate amount
    if (!amount || typeof amount !== 'number') {
      log('VALIDATION', 'ERROR: Amount is missing or invalid', { amount });
      return new Response(
        JSON.stringify({ error: 'Le montant est requis et doit être un nombre' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (amount < 100) {
      log('VALIDATION', 'ERROR: Amount is below minimum', { amount, minimum: 100 });
      return new Response(
        JSON.stringify({ error: 'Le montant minimum est de 100 XAF' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (amount > 1000000) {
      log('VALIDATION', 'ERROR: Amount exceeds maximum', { amount, maximum: 1000000 });
      return new Response(
        JSON.stringify({ error: 'Le montant maximum est de 1,000,000 XAF' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate phone number
    if (!phone_number || typeof phone_number !== 'string') {
      log('VALIDATION', 'ERROR: Phone number is missing or invalid', { phone_number });
      return new Response(
        JSON.stringify({ error: 'Le numéro de téléphone est requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    log('VALIDATION', 'All validations passed');

    // ============================================
    // 3. RETRIEVE USER WALLET
    // ============================================
    log('WALLET', 'Retrieving user wallet');

    const { data: wallet, error: walletError } = await supabaseAdmin
      .from('wallets')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (walletError) {
      log('WALLET', 'ERROR: Failed to retrieve wallet', walletError.message);
      return new Response(
        JSON.stringify({ error: 'Portefeuille non trouvé', details: walletError.message }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!wallet) {
      log('WALLET', 'ERROR: No wallet found for user', { user_id: user.id });
      return new Response(
        JSON.stringify({ error: 'Portefeuille non trouvé' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    log('WALLET', 'Wallet retrieved successfully', { wallet_id: wallet.id });

    // ============================================
    // 4. CREATE PENDING TRANSACTION
    // ============================================
    log('TRANSACTION', 'Creating pending transaction');

    const externalId = crypto.randomUUID();

    const { data: transaction, error: txError } = await supabaseAdmin
      .from('transactions')
      .insert({
        user_id: user.id,
        wallet_id: wallet.id,
        type: 'deposit',
        status: 'pending',
        amount: Math.round(amount),
        phone_number,
        external_reference: externalId,
      })
      .select()
      .single();

    if (txError) {
      log('TRANSACTION', 'ERROR: Failed to create transaction', txError.message);
      return new Response(
        JSON.stringify({ 
          error: 'Erreur lors de la création de la transaction',
          details: txError.message 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!transaction) {
      log('TRANSACTION', 'ERROR: Transaction created but not returned');
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la création de la transaction' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    log('TRANSACTION', 'Transaction created successfully', { 
      transaction_id: transaction.id,
      external_reference: externalId 
    });

    // ============================================
    // 5. CREATE INITIAL AUDIT LOG
    // ============================================
    log('AUDIT', 'Creating initial audit log');

    const { error: auditError } = await supabaseAdmin.from('transaction_audit_logs').insert({
      transaction_id: transaction.id,
      new_status: 'pending',
      metadata: { action: 'deposit_initiated', phone_number },
    });

    if (auditError) {
      log('AUDIT', 'WARNING: Failed to create audit log (non-critical)', auditError.message);
      // Don't fail the request if audit logging fails
    } else {
      log('AUDIT', 'Audit log created successfully');
    }

    // ============================================
    // 6. CALL MTN SDK TO INITIATE PAYMENT
    // ============================================
    log('MTN', 'Calling MTN SDK to initiate payment request');

    try {
      const { referenceId } = await requestToPay(
        Math.round(amount),
        phone_number,
        externalId,
        `Dépôt de ${amount} XAF`,
        `Dépôt wallet - ${externalId}`
      );

      log('MTN', 'Payment request initiated successfully', { referenceId });

      // ============================================
      // 7. UPDATE TRANSACTION WITH MTN REFERENCE
      // ============================================
      log('TRANSACTION', 'Updating transaction with MTN reference');

      const { error: updateError } = await supabaseAdmin
        .from('transactions')
        .update({
          mtn_reference: referenceId,
          status: 'processing',
        })
        .eq('id', transaction.id);

      if (updateError) {
        log('TRANSACTION', 'ERROR: Failed to update transaction status', updateError.message);
        // Log but continue - the transaction is already created and MTN request is sent
      } else {
        log('TRANSACTION', 'Transaction status updated to processing', { referenceId });
      }

      // ============================================
      // 8. RETURN SUCCESS RESPONSE
      // ============================================
      log('DEPOSIT', 'Deposit request completed successfully');

      const successResponse: DepositResponse = {
        success: true,
        message: 'Demande de paiement envoyée. Veuillez confirmer sur votre téléphone.',
        transaction_id: transaction.id,
        reference: referenceId,
      };

      return new Response(
        JSON.stringify(successResponse),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (mtnError: unknown) {
      // ============================================
      // 9. HANDLE MTN ERROR
      // ============================================
      const errorMessage = mtnError instanceof Error ? mtnError.message : String(mtnError);
      
      log('MTN', 'ERROR: MTN API request failed', { 
        error: errorMessage,
        stack: mtnError instanceof Error ? mtnError.stack : undefined
      });

      // Update transaction as failed
      log('TRANSACTION', 'Updating transaction status to failed');

      const { error: failError } = await supabaseAdmin
        .from('transactions')
        .update({
          status: 'failed',
          error_message: errorMessage,
        })
        .eq('id', transaction.id);

      if (failError) {
        log('TRANSACTION', 'WARNING: Failed to update transaction as failed', failError.message);
      } else {
        log('TRANSACTION', 'Transaction marked as failed');
      }

      // Create audit log for failure
      try {
        await supabaseAdmin.from('transaction_audit_logs').insert({
          transaction_id: transaction.id,
          new_status: 'failed',
          metadata: { 
            action: 'deposit_failed', 
            error: errorMessage 
          },
        });
      } catch (auditErr) {
        const auditErrMsg = auditErr instanceof Error ? auditErr.message : String(auditErr);
        log('AUDIT', 'WARNING: Failed to create failure audit log', auditErrMsg);
      }

      // Return error response with details
      const errorResponse: DepositResponse = {
        error: 'Erreur lors de la demande de paiement MTN',
        details: errorMessage,
      };

      log('DEPOSIT', 'Deposit request failed');

      return new Response(
        JSON.stringify(errorResponse),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error: unknown) {
    // ============================================
    // 10. HANDLE UNEXPECTED ERRORS
    // ============================================
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    log('ERROR', 'Unexpected error occurred', { 
      error: errorMessage,
      stack: errorStack
    });

    const errorResponse: DepositResponse = {
      error: 'Une erreur inattendue est survenue',
      details: errorMessage,
    };

    return new Response(
      JSON.stringify(errorResponse),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
