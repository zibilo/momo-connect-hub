"use client";

import React from 'react';
import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { Tag } from 'lucide-react';

interface PriceTagProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function PriceTag({ 
  price, 
  originalPrice, 
  size = 'md',
  showIcon = false,
  className 
}: PriceTagProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount 
    ? Math.round((1 - price / originalPrice) * 100) 
    : 0;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showIcon && <Tag className="w-4 h-4 text-muted-foreground" />}
      <div className="flex items-baseline gap-2">
        <span className={cn("font-bold text-primary", sizeClasses[size])}>
          {formatCurrency(price)}
        </span>
        {hasDiscount && (
          <>
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(originalPrice)}
            </span>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-1.5 py-0.5 rounded">
              -{discountPercent}%
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default PriceTag;
