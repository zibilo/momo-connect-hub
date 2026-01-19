import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
// import { getPersonalBets, createPersonalBet } from '@/services/personalBetsService'; // Service to be created
import { Selection } from '@/types/ticket';

export function usePersonalBets() {
  const [isCreating, setIsCreating] = useState(false);

  // const { data: personalBets, isLoading, refetch } = useQuery({
  //   queryKey: ['personalBets'],
  //   queryFn: getPersonalBets,
  // });

  const createNewBet = async (selections: Selection[]) => {
    setIsCreating(true);
    try {
      // await createPersonalBet(selections);
      // refetch();
    } catch (error) {
      console.error("Failed to create personal bet:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return {
    // personalBets,
    // isLoading,
    isCreating,
    createNewBet,
    // refresh: refetch,
  };
}
