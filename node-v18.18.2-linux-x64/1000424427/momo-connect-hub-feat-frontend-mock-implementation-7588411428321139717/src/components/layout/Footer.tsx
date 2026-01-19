export const Footer = () => {
  return (
    <footer className="border-t py-6 bg-background">
      <div className="container px-4 text-center text-sm text-muted-foreground">
        <p>© 2025 MoMo Hub. Tous droits réservés.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="hover:text-primary">Conditions d'utilisation</a>
          <a href="#" className="hover:text-primary">Politique de confidentialité</a>
          <a href="#" className="hover:text-primary">Aide</a>
        </div>
      </div>
    </footer>
  );
};