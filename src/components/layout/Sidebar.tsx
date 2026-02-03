import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Wallet, Ticket, User, Settings, TrendingUp, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/constants';

const navItems = [
  { href: ROUTES.DASHBOARD, label: 'Accueil', icon: Home },
  { href: ROUTES.MARKETPLACE, label: 'Marketplace', icon: ShoppingBag },
  { href: ROUTES.WALLET, label: 'Portefeuille', icon: Wallet },
  { href: ROUTES.MY_TICKETS, label: 'Mes Tickets', icon: Ticket },
  { href: ROUTES.PERSONAL_BETS, label: 'Paris Perso', icon: TrendingUp },
  { href: ROUTES.VERIFICATION, label: 'Vérification', icon: QrCode },
];

const creatorItems = [
  { href: ROUTES.CREATOR.DASHBOARD, label: 'Dashboard Créateur', icon: TrendingUp },
  { href: ROUTES.CREATOR.CREATE_TICKET, label: 'Créer un Ticket', icon: Ticket },
  { href: ROUTES.CREATOR.MY_TICKETS, label: 'Mes Tickets Publiés', icon: ShoppingBag },
  { href: ROUTES.CREATOR.SUBSCRIPTIONS, label: 'Abonnements', icon: User },
];

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <Link to={ROUTES.HOME} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Ticket className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">BetTicket</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-border">
          <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
            Créateur
          </p>
          {creatorItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-border">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Settings className="w-5 h-5" />
          Paramètres
        </Link>
      </div>
    </aside>
  );
}
