import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  return (
    <div className="bg-destructive text-destructive-foreground px-4 py-2 text-center text-sm flex items-center justify-center gap-2">
      <WifiOff className="w-4 h-4" />
      <span>Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.</span>
    </div>
  );
}
