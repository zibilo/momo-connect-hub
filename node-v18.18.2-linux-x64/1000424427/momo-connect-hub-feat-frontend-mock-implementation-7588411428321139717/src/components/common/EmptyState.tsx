import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2">{description}</p>
    </div>
  );
};
