import React from 'react';
import { cn } from '@/lib/utils';

interface OddsDisplayProps {
  odds: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const OddsDisplay: React.FC<OddsDisplayProps> = ({ 
  odds, 
  size = 'md',
  className 
}) => {
  const sizeClasses = {
    sm: 'text-sm px-1.5 py-0.5',
    md: 'text-base px-2 py-1',
    lg: 'text-xl px-3 py-1.5 font-bold',
  };

  return (
    <span className={cn(
      'inline-flex items-center justify-center rounded bg-primary/10 text-primary font-mono',
      sizeClasses[size],
      className
    )}>
      {odds.toFixed(2)}
    </span>
  );
};

export default OddsDisplay;
