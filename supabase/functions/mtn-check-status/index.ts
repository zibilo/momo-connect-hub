import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { getRequestToPayStatus, getTransferStatus } from '../_shared/mtn-sdk.ts';
import { supabaseAdmin } from '../_shared/supabase-admin.ts';
import { corsHeaders } from '../_shared/cors.ts';

interface CheckStatusRequest {
  transaction_id: string;
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
      Deno.env.get('SUPABASE_PUBLISHABLE_KEY')!,
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
    const { transaction_id }: CheckStatusRequest = await req.json();

    if (!transaction_id) {
      return new Response(
        JSON.stringify({ error: 'Transaction ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get transaction (verify ownership)
    const { data: transaction, error: txError } = await supabaseAdmin
      .from('transactions')
      .select('*, wallet:wallets(*)')
      .eq('id', transaction_id)
      .eq('user_id', user.id)
      .single();

    if (txError || !transaction) {
      return new Response(
        JSON.stringify({ error: 'Transaction not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If already completed, return current status
    if (transaction.status === 'successful' || transaction.status === 'failed') {
      return new Response(
        JSON.stringify({
          status: transaction.status,
          transaction_id: transaction.id,
          amount: transaction.amount,
          type: transaction.type,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check status with MTN
    if (!transaction.mtn_reference) {
      return new Response(
        JSON.stringify({
          status: transaction.status,
          message: 'Transaction not yet submitted to MTN',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    try {
      let mtnStatus;
      if (transaction.type === 'deposit') {
        mtnStatus = await getRequestToPayStatus(transaction.mtn_reference);
      } else {
        mtnStatus = await getTransferStatus(transaction.mtn_reference);
      }

      console.log('MTN Status:', JSON.stringify(mtnStatus));

      // Process based on MTN status
      if (mtnStatus.status === 'SUCCESSFUL') {
        if (transaction.type === 'deposit') {
          // Credit wallet
          const newBalance = transaction.wallet.balance + transaction.amount;
          await supabaseAdmin
            .from('wallets')
            .update({ balance: newBalance })
            .eq('id', transaction.wallet_id);
        } else {
          // Debit wallet for withdrawal
          const newBalance = transaction.wallet.balance - transaction.amount;
          const newLockedBalance = Math.max(0, transaction.wallet.locked_balance - transaction.amount);
          await supabaseAdmin
            .from('wallets')
            .update({ balance: newBalance, locked_balance: newLockedBalance })
            .eq('id', transaction.wallet_id);
        }

        await supabaseAdmin
          .from('transactions')
          .update({ status: 'successful' })
          .eq('id', transaction.id);

        return new Response(
          JSON.stringify({
            status: 'successful',
            transaction_id: transaction.id,
            amount: transaction.amount,
            type: transaction.type,
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      } else if (mtnStatus.status === 'FAILED') {
        // For failed withdrawals, unlock the balance
        if (transaction.type === 'withdrawal') {
          const newLockedBalance = Math.max(0, transaction.wallet.locked_balance - transaction.amount);
          await supabaseAdmin
            .from('wallets')
            .update({ locked_balance: newLockedBalance })
            .eq('id', transaction.wallet_id);
        }

        await supabaseAdmin
          .from('transactions')
          .update({
            status: 'failed',
            error_message: mtnStatus.reason || 'Transaction failed',
          })
          .eq('id', transaction.id);

        return new Response(
          JSON.stringify({
            status: 'failed',
            error: mtnStatus.reason || 'Transaction failed',
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Still pending
      return new Response(
        JSON.stringify({
          status: 'processing',
          message: 'Transaction en cours de traitement',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (mtnError) {
      console.error('MTN status check error:', mtnError);
      return new Response(
        JSON.stringify({
          status: transaction.status,
          message: 'Unable to check status with MTN',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Check status error:', error);
    return new Response(
      JSON.stringify({ error: 'Une erreur est survenue' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
