"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BetSelection, Match } from '@/types/match';
import { formatCurrency } from '@/lib/currency';
import { Trash2, Plus, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PersonalBetFormProps {
  selections: BetSelection[];
  onRemoveSelection: (selectionId: string) => void;
  onClearAll: () => void;
  onSubmit: (stake: number) => Promise<void>;
  minStake?: number;
  maxStake?: number;
  walletBalance: number;
}

export function PersonalBetForm({
  selections,
  onRemoveSelection,
  onClearAll,
  onSubmit,
  minStake = 100,
  maxStake = 1000000,
  walletBalance,
}: PersonalBetFormProps) {
  const [stake, setStake] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalOdds = selections.reduce((acc, s) => acc * s.odds, 1);
  const stakeAmount = parseInt(stake) || 0;
  const potentialWin = Math.floor(stakeAmount * totalOdds);
  const hasEnoughBalance = walletBalance >= stakeAmount;
  const isValidStake = stakeAmount >= minStake && stakeAmount <= maxStake && hasEnoughBalance;

  const handleSubmit = async () => {
    if (!isValidStake || selections.length === 0) return;
    setIsSubmitting(true);
    try {
      await onSubmit(stakeAmount);
      setStake('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  if (selections.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            Sélectionnez des matchs pour créer votre pari
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Votre Pari</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClearAll}>
          <Trash2 className="w-4 h-4 mr-1" />
          Tout effacer
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {selections.map((selection) => (
            <div
              key={selection.id}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {selection.match?.home_team?.name} vs {selection.match?.away_team?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selection.market}: <span className="font-medium">{selection.selection}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <span className="font-mono text-sm font-semibold text-primary">
                  {selection.odds.toFixed(2)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onRemoveSelection(selection.id)}
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-primary/5 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Côte totale</span>
            <span className="text-xl font-bold font-mono text-primary">
              {totalOdds.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Mise</Label>
          <Input
            type="number"
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            placeholder={`Min: ${formatCurrency(minStake)}`}
            min={minStake}
            max={Math.min(maxStake, walletBalance)}
          />
          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => setStake(amount.toString())}
                disabled={amount > walletBalance}
              >
                {formatCurrency(amount)}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Solde: {formatCurrency(walletBalance)}
          </p>
        </div>

        {stakeAmount > 0 && (
          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-green-600" />
                <span className="font-medium">Gain potentiel</span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(potentialWin)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          disabled={!isValidStake || isSubmitting}
        >
          {isSubmitting ? 'Placement en cours...' : 'Placer le pari'}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PersonalBetForm;
