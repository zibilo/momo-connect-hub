import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ className }) => {
  return <Skeleton className={cn('h-4 w-full', className)} />;
};
