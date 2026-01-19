import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createTicket, getMyTickets } from '@/services/ticketsService';
import { Selection } from '@/types/ticket';

export function useTickets() {
  const [isCreating, setIsCreating] = useState(false);

  const { data: myTickets, isLoading, refetch } = useQuery({
    queryKey: ['myTickets'],
    queryFn: getMyTickets,
  });

  const createNewTicket = async (selections: Selection[], price: 100 | 300 | 1000) => {
    setIsCreating(true);
    try {
      await createTicket(selections, price);
      refetch(); // Refetch the user's tickets after creating a new one
    } catch (error) {
      console.error("Failed to create ticket:", error);
      // Handle error (e.g., show a toast notification)
    } finally {
      setIsCreating(false);
    }
  };

  return {
    myTickets,
    isLoading,
    isCreating,
    createNewTicket,
    refresh: refetch,
  };
}
