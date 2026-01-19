import AppLayout from "@/components/layout/AppLayout";
import { PrintQueue } from "@/components/creator/PrintQueue";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer } from "lucide-react";

const mockToPrint = [
  { id: 'TK-9921', total_odds: 10.5, status: 'active' },
  { id: 'TK-1022', total_odds: 2.1, status: 'active' },
];

const PrintTickets = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Printer className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Impression de Tickets</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>File d'attente</CardTitle>
            <CardDescription>
              Imprimez vos tickets actifs pour les vendre physiquement avec un code QR de vérification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PrintQueue 
              ticketsToPrint={mockToPrint as any} 
              onPrint={(id) => alert(`Lancement de l'impression pour ${id}...`)} 
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PrintTickets;