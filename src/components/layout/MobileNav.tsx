import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Wallet, Ticket, QrCode, TrendingUp, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

const navItems = [
  { href: ROUTES.DASHBOARD, label: 'Accueil', icon: Home },
  { href: ROUTES.MARKETPLACE, label: 'Marketplace', icon: ShoppingBag },
  { href: ROUTES.CREATOR.DASHBOARD, label: 'Créateur', icon: TrendingUp },
  { href: ROUTES.CREATOR.SUBSCRIPTIONS, label: 'Abonnements', icon: Star },
  { href: ROUTES.WALLET, label: 'Wallet', icon: Wallet },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t border-border safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'text-primary')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
