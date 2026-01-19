import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { WalletProvider } from "@/contexts/WalletContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { OnlineStatusProvider } from "@/contexts/OnlineStatusContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import WalletPage from "./pages/Wallet";
import Marketplace from "./pages/Marketplace";
import MyTickets from "./pages/MyTickets";
import PersonalBets from "./pages/PersonalBets";
import CreatorDashboard from "./pages/creator/CreatorDashboard";
import CreateTicket from "./pages/creator/CreateTicket";
import Subscriptions from "./pages/creator/Subscriptions";
import Verification from "./pages/Verification";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <OnlineStatusProvider>
          <AuthProvider>
            <SubscriptionProvider>
              <WalletProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  
                  {/* Protected Routes inside AppLayout */}
                  <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/wallet" element={<WalletPage />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/my-tickets" element={<MyTickets />} />
                    <Route path="/personal-bets" element={<PersonalBets />} />
                    <Route path="/verification" element={<Verification />} />
                    
                    {/* Creator Routes */}
                    <Route path="/creator" element={<CreatorDashboard />} />
                    <Route path="/creator/create-ticket" element={<CreateTicket />} />
                    <Route path="/creator/subscriptions" element={<Subscriptions />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminDashboard />} />
                  </Route>

                  {/* Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </WalletProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </OnlineStatusProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
