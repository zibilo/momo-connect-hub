import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { supabaseAdmin } from '../_shared/supabase-admin.ts';
import { corsHeaders } from '../_shared/cors.ts';

interface MtnCallback {
  externalId: string;
  financialTransactionId?: string;
  status: 'SUCCESSFUL' | 'FAILED' | 'PENDING';
  reason?: string;
  amount?: string;
  currency?: string;
  payer?: {
    partyIdType: string;
    partyId: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('Collection webhook received');

  try {
    const payload: MtnCallback = await req.json();
    console.log('Webhook payload:', JSON.stringify(payload));

    const { externalId, status, financialTransactionId, reason } = payload;

    if (!externalId) {
      console.error('Missing externalId in webhook');
      return new Response(
        JSON.stringify({ error: 'Missing externalId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find transaction by external reference
    const { data: transaction, error: txError } = await supabaseAdmin
      .from('transactions')
      .select('*, wallet:wallets(*)')
      .eq('external_reference', externalId)
      .eq('type', 'deposit')
      .single();

    if (txError || !transaction) {
      console.error('Transaction not found:', externalId);
      return new Response(
        JSON.stringify({ error: 'Transaction not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Idempotency check - don't process if already completed
    if (transaction.status === 'successful' || transaction.status === 'failed') {
      console.log('Transaction already processed:', transaction.id);
      return new Response(
        JSON.stringify({ message: 'Transaction already processed' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (status === 'SUCCESSFUL') {
      // Credit wallet balance
      const newBalance = transaction.wallet.balance + transaction.amount;

      const { error: updateWalletError } = await supabaseAdmin
        .from('wallets')
        .update({ balance: newBalance })
        .eq('id', transaction.wallet_id);

      if (updateWalletError) {
        console.error('Failed to update wallet:', updateWalletError);
        return new Response(
          JSON.stringify({ error: 'Failed to update wallet' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update transaction status
      await supabaseAdmin
        .from('transactions')
        .update({
          status: 'successful',
          mtn_reference: financialTransactionId || transaction.mtn_reference,
        })
        .eq('id', transaction.id);

      console.log('Deposit successful:', transaction.id, 'Amount:', transaction.amount);

    } else if (status === 'FAILED') {
      // Update transaction as failed
      await supabaseAdmin
        .from('transactions')
        .update({
          status: 'failed',
          error_message: reason || 'Payment failed',
        })
        .eq('id', transaction.id);

      console.log('Deposit failed:', transaction.id, 'Reason:', reason);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
