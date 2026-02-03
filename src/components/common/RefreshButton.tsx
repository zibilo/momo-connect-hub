import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RefreshButtonProps {
  onClick: () => void;
  loading?: boolean;
  className?: string;
}

export function RefreshButton({ onClick, loading = false, className }: RefreshButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={loading}
      className={className}
    >
      <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
    </Button>
  );
}
