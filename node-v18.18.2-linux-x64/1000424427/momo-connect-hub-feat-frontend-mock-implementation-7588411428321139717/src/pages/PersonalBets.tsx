

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PersonalBetForm } from "@/components/personal-bets/PersonalBetForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";
import { useToast } from "@/hooks/use-toast";

const PersonalBets = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreateBet = async (data: any) => {
    console.log("Creating Personal Bet:", data);
    setOpen(false);
    toast({
      title: "Pari enregistré",
      description: "Bonne chance !",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paris Personnels</h1>
          <p className="text-muted-foreground">Suivez vos propres paris et calculez vos performances.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Nouveau Pari
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Créer un pari personnel</DialogTitle>
            </DialogHeader>
            <PersonalBetForm onSubmit={handleCreateBet} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">En cours</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-4 space-y-4">
          {/* Mock Active Bet */}
          <Card>
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-medium">Combiné du Dimanche</CardTitle>
              <Badge variant="secondary">En cours</Badge>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Mise:</span>
                <span className="font-medium">2,000 XAF</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Cote Total:</span>
                <span className="font-medium">4.50</span>
              </div>
              <div className="flex justify-between text-sm border-t pt-2 mt-2">
                <span className="font-medium">Gain Potentiel:</span>
                <span className="font-bold text-green-600"><CurrencyDisplay amount={9000} /></span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <div className="text-center py-8 text-muted-foreground">Aucun historique pour le moment.</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalBets;