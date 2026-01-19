import AppLayout from "@/components/layout/AppLayout";
import { TicketList } from "@/components/tickets/TicketList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockMyTickets = [
  { id: '1', created_at: new Date().toISOString(), status: 'active', total_odds: 12.5, price: 300, potential_gain: 12500, selections: [{}, {}, {}] },
  { id: '2', created_at: new Date().toISOString(), status: 'won', total_odds: 4.2, price: 100, potential_gain: 4200, selections: [{}, {}] },
];

const MyPublishedTickets = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Mes Tickets</h1>
        
        <Tabs defaultValue="published">
          <TabsList>
            <TabsTrigger value="published">Mes Publications</TabsTrigger>
            <TabsTrigger value="purchased">Mes Achats</TabsTrigger>
          </TabsList>
          <TabsContent value="published" className="mt-6">
            <TicketList tickets={mockMyTickets as any} />
          </TabsContent>
          <TabsContent value="purchased" className="mt-6">
             <p className="text-muted-foreground text-center py-10 border rounded-lg border-dashed">
               Vous n'avez pas encore acheté de tickets.
             </p>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default MyPublishedTickets;