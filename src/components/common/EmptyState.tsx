import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: React.ElementType | React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: React.ReactNode;
}

export const EmptyState = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  action,
}: EmptyStateProps) => {
  const renderIcon = () => {
    if (!Icon) return null;
    
    if (React.isValidElement(Icon)) {
      return Icon;
    }
    
    const IconComponent = Icon as React.ElementType;
    return <IconComponent className="w-6 h-6 text-muted-foreground" />;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-card rounded-lg border border-dashed border-muted-foreground/25">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        {renderIcon()}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && <p className="text-muted-foreground mb-6 max-w-xs mx-auto">{description}</p>}
      {action ? (
        action
      ) : (
        actionLabel && onAction && (
          <Button onClick={onAction}>{actionLabel}</Button>
        )
      )}
    </div>
  );
};
