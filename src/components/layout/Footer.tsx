import { Link } from 'react-router-dom';
import { Ticket } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Ticket className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              La plateforme de vente de tickets de paris sportifs au Congo.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link></li>
              <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><Link to="/wallet" className="hover:text-foreground transition-colors">Portefeuille</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Créateurs</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/creator/subscriptions" className="hover:text-foreground transition-colors">Devenir créateur</Link></li>
              <li><Link to="/creator/dashboard" className="hover:text-foreground transition-colors">Dashboard créateur</Link></li>
              <li><Link to="/creator/commissions" className="hover:text-foreground transition-colors">Commissions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/help" className="hover:text-foreground transition-colors">Centre d'aide</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">Conditions d'utilisation</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Politique de confidentialité</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
