import { useQuery } from '@tanstack/react-query';
import { getMarketplaceTickets, purchaseTicket } from '@/services/marketplaceService';

export function useMarketplace() {
  const { data: tickets, isLoading, error, refetch } = useQuery({
    queryKey: ['marketplaceTickets'],
    queryFn: getMarketplaceTickets,
  });

  const buyTicket = async (ticketId: string) => {
    try {
      await purchaseTicket(ticketId);
      // Potentially refetch marketplace tickets or user's tickets
    } catch (err) {
      console.error("Purchase failed:", err);
      // Handle error
    }
  };

  return {
    tickets,
    isLoading,
    error,
    buyTicket,
    refresh: refetch,
  };
}
