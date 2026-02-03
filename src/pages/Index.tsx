import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowRight, Shield, Zap, Smartphone } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">MoMo Wallet</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Connexion</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">S'inscrire</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Gérez votre argent avec{' '}
            <span className="text-primary">MTN MoMo</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Déposez, retirez et gérez votre portefeuille électronique en toute sécurité.
            Simple, rapide et fiable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild className="gap-2">
              <Link to="/signup">
                Commencer gratuitement
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">J'ai déjà un compte</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4 p-6">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Paiement Mobile</h3>
            <p className="text-muted-foreground">
              Utilisez votre numéro MTN MoMo pour déposer et retirer de l'argent instantanément.
            </p>
          </div>
          <div className="text-center space-y-4 p-6">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">100% Sécurisé</h3>
            <p className="text-muted-foreground">
              Vos transactions sont protégées par les dernières technologies de sécurité.
            </p>
          </div>
          <div className="text-center space-y-4 p-6">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Ultra Rapide</h3>
            <p className="text-muted-foreground">
              Transactions instantanées avec confirmation en temps réel sur votre téléphone.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2025 MoMo Wallet. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
