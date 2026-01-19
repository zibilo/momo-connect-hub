import { supabase } from '@/integrations/supabase/client';

/**
 * A generic function to handle Supabase Edge Function calls.
 * @param functionName - The name of the Edge Function to invoke.
 * @param body - The data to send to the function.
 * @returns The data returned from the function.
 * @throws An error if the function call fails.
 */
export async function invokeEdgeFunction<T>(functionName: string, body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke(functionName, {
    body,
  });

  if (error) {
    throw new Error(`Failed to invoke ${functionName}: ${error.message}`);
  }

  return data as T;
}
