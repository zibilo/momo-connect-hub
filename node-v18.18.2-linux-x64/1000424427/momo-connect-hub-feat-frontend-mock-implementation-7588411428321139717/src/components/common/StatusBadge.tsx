import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusType = 
  | 'pending' 
  | 'active' 
  | 'won' 
  | 'successful' 
  | 'lost' 
  | 'failed' 
  | 'cancelled' 
  | 'expired' 
  | 'processing';

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  let variant: "default" | "secondary" | "destructive" | "outline" = "default";
  let label = status;
  let bgClass = "";

  switch (status) {
    case 'pending':
    case 'processing':
      variant = "secondary";
      label = status === 'pending' ? 'En attente' : 'Traitement';
      bgClass = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
      break;
    case 'active':
      variant = "default";
      label = 'Actif';
      bgClass = "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
      break;
    case 'won':
    case 'successful':
      variant = "default";
      label = status === 'won' ? 'Gagné' : 'Réussi';
      bgClass = "bg-green-100 text-green-800 hover:bg-green-100/80";
      break;
    case 'lost':
    case 'failed':
    case 'expired':
      variant = "destructive";
      label = status === 'lost' ? 'Perdu' : (status === 'expired' ? 'Expiré' : 'Échoué');
      break;
    case 'cancelled':
      variant = "outline";
      label = 'Annulé';
      break;
    default:
      variant = "secondary";
  }

  return (
    <Badge variant={variant} className={cn("capitalize", bgClass, className)}>
      {label}
    </Badge>
  );
};
