import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Flame, TrendingUp } from "lucide-react";

const mockTickets = [
  { id: '1', creator: 'ExpertFoot', odds: 12.5, price: 300, matches: 5, gain: 12500 },
  { id: '2', creator: 'PronosCongo', odds: 5.2, price: 100, matches: 3, gain: 5200 },
  { id: '3', creator: 'LeMaitre', odds: 45.0, price: 1000, matches: 8, gain: 45000 },
];

const Marketplace = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Marché aux tickets</h1>
          <p className="text-muted-foreground">Achetez les meilleurs pronostics de la communauté.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:border-primary transition-colors">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className="flex gap-1">
                    <TrendingUp className="h-3 w-3" /> {ticket.creator}
                  </Badge>
                  {ticket.price >= 1000 && <Badge className="bg-orange-500"><Flame className="h-3 w-3 mr-1"/> Top Gain</Badge>}
                </div>
                <CardTitle className="text-2xl mt-2">Cote: {ticket.odds}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p>Matches inclus: <b>{ticket.matches}</b></p>
                  <p>Gain potentiel: <b className="text-green-600">{ticket.gain} XAF</b></p>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between items-center">
                <span className="text-lg font-bold">{ticket.price} XAF</span>
                <Button size="sm" className="gap-2">
                  <ShoppingCart className="h-4 w-4" /> Acheter
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Marketplace;