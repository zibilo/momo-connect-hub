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
  payee?: {
    partyIdType: string;
    partyId: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('Disbursement webhook received');

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
      .eq('type', 'withdrawal')
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
      // Debit wallet and unlock balance
      const newBalance = transaction.wallet.balance - transaction.amount;
      const newLockedBalance = Math.max(0, transaction.wallet.locked_balance - transaction.amount);

      const { error: updateWalletError } = await supabaseAdmin
        .from('wallets')
        .update({
          balance: newBalance,
          locked_balance: newLockedBalance,
        })
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

      console.log('Withdrawal successful:', transaction.id, 'Amount:', transaction.amount);

    } else if (status === 'FAILED') {
      // Unlock the amount in wallet
      const newLockedBalance = Math.max(0, transaction.wallet.locked_balance - transaction.amount);

      await supabaseAdmin
        .from('wallets')
        .update({ locked_balance: newLockedBalance })
        .eq('id', transaction.wallet_id);

      // Update transaction as failed
      await supabaseAdmin
        .from('transactions')
        .update({
          status: 'failed',
          error_message: reason || 'Transfer failed',
        })
        .eq('id', transaction.id);

      console.log('Withdrawal failed:', transaction.id, 'Reason:', reason);
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
