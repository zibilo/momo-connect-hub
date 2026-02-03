"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Radio } from 'lucide-react';

interface LiveMatchIndicatorProps {
  minute?: number;
  className?: string;
}

export function LiveMatchIndicator({ minute, className }: LiveMatchIndicatorProps) {
  return (
    <Badge 
      variant="destructive" 
      className={cn(
        "bg-red-500 hover:bg-red-500 animate-pulse flex items-center gap-1",
        className
      )}
    >
      <Radio className="w-3 h-3" />
      <span>LIVE</span>
      {minute !== undefined && <span>{minute}'</span>}
    </Badge>
  );
}

export default LiveMatchIndicator;
