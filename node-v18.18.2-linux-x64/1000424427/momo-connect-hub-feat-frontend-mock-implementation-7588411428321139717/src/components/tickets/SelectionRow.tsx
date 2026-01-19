import React from 'react';
import { MatchSelector } from './MatchSelector';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SelectionRowProps {
  onRemove: () => void;
  // Other props for handling selection data
}

export const SelectionRow: React.FC<SelectionRowProps> = ({ onRemove }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-grow">
        <MatchSelector onSelectMatch={(id) => console.log(id)} />
      </div>
      <Input placeholder="Prediction (e.g., 1-0)" className="w-32" />
      <Input placeholder="Odds" type="number" step="0.01" className="w-24" />
      <Button variant="ghost" size="icon" onClick={onRemove}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
