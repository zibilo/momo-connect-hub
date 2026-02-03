import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import MyTickets from "./pages/MyTickets";
import TicketDetails from "./pages/TicketDetails";
import PersonalBets from "./pages/PersonalBets";
import CreatePersonalBet from "./pages/CreatePersonalBet";
import Wallet from "./pages/Wallet";
import Verification from "./pages/Verification";
import KYCSubmit from "./pages/kyc/KYCSubmit";
import KYCStatus from "./pages/kyc/KYCStatus";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import TransactionsMonitor from "./pages/admin/TransactionsMonitor";
import KYCReview from "./pages/admin/KYCReview";
import CreatorDashboard from "./pages/creator/CreatorDashboard";
import MyPublishedTickets from "./pages/creator/MyPublishedTickets";
import CreateTicket from "./pages/creator/CreateTicket";
import Commissions from "./pages/creator/Commissions";
import Subscriptions from "./pages/creator/Subscriptions";
import PrintTickets from "./pages/creator/PrintTickets";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HoverReceiver from "@/visual-edits/VisualEditsMessenger";
import { AuthProvider } from "@/contexts/AuthContext";
import { WalletProvider } from "@/contexts/WalletContext";
import { OnlineStatusProvider } from "@/contexts/OnlineStatusContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HoverReceiver />
      <BrowserRouter>
        <AuthProvider>
          <OnlineStatusProvider>
            <WalletProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/my-tickets" element={<MyTickets />} />
                <Route path="/tickets/:id" element={<TicketDetails />} />
                <Route path="/personal-bets" element={<PersonalBets />} />
                <Route path="/personal-bets/create" element={<CreatePersonalBet />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/verification" element={<Verification />} />
                <Route path="/kyc/submit" element={<KYCSubmit />} />
                <Route path="/kyc/status" element={<KYCStatus />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UsersManagement />} />
                <Route path="/admin/transactions" element={<TransactionsMonitor />} />
                <Route path="/admin/kyc" element={<KYCReview />} />
                <Route path="/creator/dashboard" element={<CreatorDashboard />} />
                <Route path="/creator/tickets" element={<MyPublishedTickets />} />
                <Route path="/creator/tickets/create" element={<CreateTicket />} />
                <Route path="/creator/commissions" element={<Commissions />} />
                <Route path="/creator/subscriptions" element={<Subscriptions />} />
                <Route path="/creator/print" element={<PrintTickets />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </WalletProvider>
          </OnlineStatusProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;