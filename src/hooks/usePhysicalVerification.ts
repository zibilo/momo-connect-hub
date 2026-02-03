import { useState, useCallback } from 'react';
import {
  verifyPhysicalTicket,
  claimPhysicalTicketGain,
  VerificationResult,
  ClaimResult,
} from '@/services/verificationService';

export function usePhysicalVerification() {
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [claimResult, setClaimResult] = useState<ClaimResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verify = useCallback(async (code: string) => {
    try {
      setLoading(true);
      setError(null);
      setClaimResult(null);
      
      const result = await verifyPhysicalTicket(code);
      setVerificationResult(result);
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur de vérification';
      setError(message);
      setVerificationResult(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const claim = useCallback(async (code: string, phoneNumber: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await claimPhysicalTicketGain(code, phoneNumber);
      setClaimResult(result);
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur de réclamation';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setVerificationResult(null);
    setClaimResult(null);
    setError(null);
  }, []);

  return {
    verificationResult,
    claimResult,
    loading,
    error,
    verify,
    claim,
    reset,
  };
}
