import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/common/StatusBadge";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { Calendar, Ticket as TicketIcon } from "lucide-react";

// Mock data
const MY_TICKETS = [
  {
    id: "t1",
    title: "Combiné Premier League",
    purchase_date: "2025-05-20",
    price: 500,
    status: "active",
    potential_gain: 15000,
    creator: "ProBet 242"
  },
  {
    id: "t2",
    title: "Score Exact Real-Barça",
    purchase_date: "2025-05-18",
    price: 2000,
    status: "won",
    potential_gain: 50000,
    creator: "Master Prono"
  },
  {
    id: "t3",
    title: "Fun Bet NBA",
    purchase_date: "2025-05-15",
    price: 500,
    status: "lost",
    potential_gain: 25000,
    creator: "US Sports"
  }
];

const MyTickets = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mes Tickets</h1>
        <p className="text-muted-foreground">Retrouvez l'historique de vos achats et leurs résultats.</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">En cours</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MY_TICKETS.filter(t => t.status === 'active').map((ticket) => (
              <TicketItem key={ticket.id} ticket={ticket} />
            ))}
            {MY_TICKETS.filter(t => t.status === 'active').length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground bg-card rounded-lg border border-dashed">
                Aucun ticket en cours. Allez sur la marketplace pour en acheter.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MY_TICKETS.filter(t => t.status !== 'active').map((ticket) => (
              <TicketItem key={ticket.id} ticket={ticket} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const TicketItem = ({ ticket }: { ticket: any }) => (
  <Card className="hover:shadow-md transition-shadow cursor-pointer">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium line-clamp-1">
        {ticket.title}
      </CardTitle>
      <StatusBadge status={ticket.status} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        <CurrencyDisplay amount={ticket.potential_gain} />
      </div>
      <p className="text-xs text-muted-foreground">Gain potentiel</p>
      
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Acheté le:</span>
          <span className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" /> {ticket.purchase_date}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Créateur:</span>
          <span className="font-medium">{ticket.creator}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Prix:</span>
          <span><CurrencyDisplay amount={ticket.price} /></span>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default MyTickets;