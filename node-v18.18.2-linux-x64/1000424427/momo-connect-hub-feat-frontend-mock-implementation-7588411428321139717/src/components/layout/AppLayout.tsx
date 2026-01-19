import React from 'react';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Ticket, 
  PlusCircle, 
  CreditCard, 
  User, 
  LogOut,
  Wallet,
  Printer,
  ShoppingBag
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { OfflineBanner } from "../common/OfflineBanner";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { signOut, user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { title: "Tableau de bord", icon: LayoutDashboard, path: "/dashboard" },
    { title: "Marché aux tickets", icon: ShoppingBag, path: "/marketplace" },
    { title: "Mes Tickets", icon: Ticket, path: "/creator/my-tickets" },
    { title: "Créer un Ticket", icon: PlusCircle, path: "/creator/create" },
    { title: "Impression", icon: Printer, path: "/creator/print" },
    { title: "Abonnements", icon: CreditCard, path: "/creator/subscriptions" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="p-4 border-b">
            <div className="flex items-center gap-2 font-bold text-xl">
              <Wallet className="h-6 w-6 text-primary" />
              <span>MoMo Hub</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="p-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                  >
                    <Link to={item.path}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium truncate max-w-[150px]">
                    {user?.user_metadata?.full_name || "Utilisateur"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                    {user?.email}
                  </span>
                </div>
              </div>
              <SidebarMenuButton onClick={() => signOut()} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <LogOut />
                <span>Déconnexion</span>
              </SidebarMenuButton>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b px-6 bg-background sticky top-0 z-10">
            <SidebarTrigger />
            <div className="flex-1" />
            <OfflineBanner />
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <div className="container mx-auto max-w-6xl">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;