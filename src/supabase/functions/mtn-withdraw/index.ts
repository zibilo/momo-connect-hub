import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { transfer } from '../_shared/mtn-sdk.ts';
import { supabaseAdmin } from '../_shared/supabase-admin.ts';
import { corsHeaders } from '../_shared/cors.ts';

interface WithdrawRequest {
  amount: number;
  phone_number: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user from token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { amount, phone_number }: WithdrawRequest = await req.json();

    // Validate input
    if (!amount || amount < 100) {
      return new Response(
        JSON.stringify({ error: 'Le montant minimum est de 100 XAF' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (amount > 500000) {
      return new Response(
        JSON.stringify({ error: 'Le montant maximum de retrait est de 500,000 XAF' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!phone_number) {
      return new Response(
        JSON.stringify({ error: 'Le numéro de téléphone est requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user's wallet with balance check
    const { data: wallet, error: walletError } = await supabaseAdmin
      .from('wallets')
      .select('id, balance, locked_balance')
      .eq('user_id', user.id)
      .single();

    if (walletError || !wallet) {
      return new Response(
        JSON.stringify({ error: 'Portefeuille non trouvé' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check available balance
    const availableBalance = wallet.balance - wallet.locked_balance;
    if (availableBalance < amount) {
      return new Response(
        JSON.stringify({ 
          error: 'Solde insuffisant',
          available_balance: availableBalance,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate external reference
    const externalId = crypto.randomUUID();

    // Lock the amount in wallet
    const { error: lockError } = await supabaseAdmin
      .from('wallets')
      .update({
        locked_balance: wallet.locked_balance + Math.round(amount),
      })
      .eq('id', wallet.id);

    if (lockError) {
      console.error('Lock balance error:', lockError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors du verrouillage du montant' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create pending transaction
    const { data: transaction, error: txError } = await supabaseAdmin
      .from('transactions')
      .insert({
        user_id: user.id,
        wallet_id: wallet.id,
        type: 'withdrawal',
        status: 'pending',
        amount: Math.round(amount),
        phone_number,
        external_reference: externalId,
      })
      .select()
      .single();

    if (txError) {
      // Unlock amount if transaction creation fails
      await supabaseAdmin
        .from('wallets')
        .update({
          locked_balance: wallet.locked_balance,
        })
        .eq('id', wallet.id);

      console.error('Transaction creation error:', txError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la création de la transaction' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create initial audit log
    await supabaseAdmin.from('transaction_audit_logs').insert({
      transaction_id: transaction.id,
      new_status: 'pending',
      metadata: { action: 'withdrawal_initiated', phone_number, amount },
    });

    try {
      // Call MTN SDK to initiate transfer
      const { referenceId } = await transfer(
        Math.round(amount),
        phone_number,
        externalId,
        `Retrait de ${amount} XAF`,
        `Retrait wallet - ${externalId}`
      );

      // Update transaction with MTN reference
      await supabaseAdmin
        .from('transactions')
        .update({
          mtn_reference: referenceId,
          status: 'processing',
        })
        .eq('id', transaction.id);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Retrait en cours de traitement.',
          transaction_id: transaction.id,
          reference: referenceId,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (mtnError: unknown) {
      console.error('MTN API error:', mtnError);
      const errorMessage = mtnError instanceof Error ? mtnError.message : 'Unknown error';

      // Unlock amount and mark transaction as failed
      await supabaseAdmin
        .from('wallets')
        .update({
          locked_balance: wallet.locked_balance,
        })
        .eq('id', wallet.id);

      await supabaseAdmin
        .from('transactions')
        .update({
          status: 'failed',
          error_message: errorMessage,
        })
        .eq('id', transaction.id);

      return new Response(
        JSON.stringify({ error: 'Erreur lors du transfert MTN' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Withdraw error:', error);
    return new Response(
      JSON.stringify({ error: 'Une erreur est survenue' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
