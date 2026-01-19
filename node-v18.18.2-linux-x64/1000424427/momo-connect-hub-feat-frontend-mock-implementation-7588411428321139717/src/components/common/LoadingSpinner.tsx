import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className }) => {
  return <Loader2 className={cn('h-8 w-8 animate-spin text-primary', className)} />;
};
