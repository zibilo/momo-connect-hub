import React from 'react';

interface PriceTagProps {
  price: number;
  currency?: string;
}

export const PriceTag: React.FC<PriceTagProps> = ({ price, currency = "FCFA" }) => {
  return (
    <div className="px-3 py-1 bg-primary text-primary-foreground font-bold rounded-full">
      {price} {currency}
    </div>
  );
};
