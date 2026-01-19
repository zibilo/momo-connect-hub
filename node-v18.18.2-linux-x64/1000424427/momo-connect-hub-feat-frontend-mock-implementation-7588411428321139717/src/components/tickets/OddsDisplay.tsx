import React from 'react';

interface OddsDisplayProps {
  totalOdds: number;
  potentialGain: number;
}

export const OddsDisplay: React.FC<OddsDisplayProps> = ({ totalOdds, potentialGain }) => {
  return (
    <div className="p-4 border rounded-lg text-center">
      <p className="text-sm text-muted-foreground">Total Odds</p>
      <p className="text-2xl font-bold">{totalOdds.toFixed(2)}</p>
      <p className="mt-2 text-sm text-muted-foreground">Potential Gain</p>
      <p className="text-lg font-semibold">{potentialGain.toFixed(2)} FCFA</p>
    </div>
  );
};
