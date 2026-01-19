import React from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const { isOnline } = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="bg-yellow-500 text-yellow-900 text-center p-2 text-sm flex items-center justify-center gap-2">
      <WifiOff className="h-4 w-4" />
      <span>You are currently offline. Some features may be unavailable.</span>
    </div>
  );
};
