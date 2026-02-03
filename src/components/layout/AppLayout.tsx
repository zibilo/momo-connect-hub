import { useState, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { Footer } from './Footer';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useWalletContext } from '@/contexts/WalletContext';
import { useOnlineStatusContext } from '@/contexts/OnlineStatusContext';
import { OfflineBanner } from '@/components/common/OfflineBanner';

interface AppLayoutProps {
  children?: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { wallet } = useWalletContext();
  const { isOnline } = useOnlineStatusContext();

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-h-screen">
        {!isOnline && <OfflineBanner />}
        
        <Header
          onMenuClick={() => setMobileMenuOpen(true)}
          balance={wallet?.balance ?? 0}
        />

        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>

        <Footer />
        <MobileNav />
      </div>
    </div>
  );
}
