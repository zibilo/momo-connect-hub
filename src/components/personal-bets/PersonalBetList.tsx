"use client";

import React from 'react';
import { PersonalBetCard } from './PersonalBetCard';
import { BetSelection, BetOutcome } from '@/types/match';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Inbox } from 'lucide-react';

interface PersonalBet {
  id: string;
  selections: BetSelection[];
  stake: number;
  total_odds: number;
  potential_win: number;
  status: BetOutcome;
  created_at: string;
}

interface PersonalBetListProps {
  bets: PersonalBet[];
  isLoading?: boolean;
  onViewDetails?: (betId: string) => void;
}

export function PersonalBetList({ bets, isLoading, onViewDetails }: PersonalBetListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const pendingBets = bets.filter(b => b.status === 'pending');
  const wonBets = bets.filter(b => b.status === 'won');
  const lostBets = bets.filter(b => b.status === 'lost');
  const voidBets = bets.filter(b => b.status === 'void');

  const renderBetList = (betList: PersonalBet[]) => {
    if (betList.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Inbox className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Aucun pari dans cette catégorie</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {betList.map((bet) => (
          <PersonalBetCard
            key={bet.id}
            bet={bet}
            onViewDetails={() => onViewDetails?.(bet.id)}
          />
        ))}
      </div>
    );
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="all">
          Tous ({bets.length})
        </TabsTrigger>
        <TabsTrigger value="pending">
          En cours ({pendingBets.length})
        </TabsTrigger>
        <TabsTrigger value="won">
          Gagnés ({wonBets.length})
        </TabsTrigger>
        <TabsTrigger value="lost">
          Perdus ({lostBets.length})
        </TabsTrigger>
        <TabsTrigger value="void">
          Annulés ({voidBets.length})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="mt-4">
        {renderBetList(bets)}
      </TabsContent>
      <TabsContent value="pending" className="mt-4">
        {renderBetList(pendingBets)}
      </TabsContent>
      <TabsContent value="won" className="mt-4">
        {renderBetList(wonBets)}
      </TabsContent>
      <TabsContent value="lost" className="mt-4">
        {renderBetList(lostBets)}
      </TabsContent>
      <TabsContent value="void" className="mt-4">
        {renderBetList(voidBets)}
      </TabsContent>
    </Tabs>
  );
}

export default PersonalBetList;
