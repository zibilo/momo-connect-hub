import { useState } from 'react';
import { verifyPhysicalTicket, claimPhysicalTicketGain } from '@/services/verificationService';
import { Ticket } from '@/types/ticket';

export function usePhysicalVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [verifiedTicket, setVerifiedTicket] = useState<Ticket | null>(null);

  const verifyTicket = async (verificationCode: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const ticket = await verifyPhysicalTicket(verificationCode);
      setVerifiedTicket(ticket);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const claimGain = async (ticketId: string) => {
    // Handle claim logic
    await claimPhysicalTicketGain(ticketId);
    // Maybe refresh wallet or show success message
  };

  return {
    verifiedTicket,
    isLoading,
    error,
    verifyTicket,
    claimGain,
  };
}
