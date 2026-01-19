import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { CurrencyDisplay } from "@/components/common/CurrencyDisplay";

const personalBetSchema = z.object({
  stakeAmount: z.string().refine((val) => parseInt(val) >= 100, "Mise minimum de 100 FCFA"),
  title: z.string().optional(),
});

interface PersonalBetFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
}

// Mock Matches (Simplified)
const MOCK_MATCHES = [
  { id: "m1", name: "Liverpool vs Man City" },
  { id: "m2", name: "Bayern vs Dortmund" },
  { id: "m3", name: "Inter vs Milan" },
];

export const PersonalBetForm = ({ onSubmit, loading }: PersonalBetFormProps) => {
  const form = useForm<z.infer<typeof personalBetSchema>>({
    resolver: zodResolver(personalBetSchema),
    defaultValues: {
      stakeAmount: "1000",
      title: "",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selections, setSelections] = useState<any[]>([]);

  const addSelection = () => {
    const randomMatch = MOCK_MATCHES[Math.floor(Math.random() * MOCK_MATCHES.length)];
    setSelections([...selections, { 
      id: Math.random().toString(), 
      match: randomMatch, 
      prediction: "Over 2.5", 
      odds: (1.2 + Math.random()).toFixed(2) 
    }]);
  };

  const removeSelection = (index: number) => {
    const newSelections = [...selections];
    newSelections.splice(index, 1);
    setSelections(newSelections);
  };

  const totalOdds = selections.reduce((acc, curr) => acc * parseFloat(curr.odds), 1);
  const stake = parseInt(form.watch("stakeAmount") || "0");
  const potentialGain = Math.floor(stake * totalOdds);

  const handleSubmit = async (values: z.infer<typeof personalBetSchema>) => {
    await onSubmit({ ...values, selections, totalOdds, potentialGain });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre (Optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Mon fun bet du Samedi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Mes Sélections</h3>
            <Button type="button" variant="outline" size="sm" onClick={addSelection}>
              <Plus className="h-4 w-4 mr-1" /> Ajouter
            </Button>
          </div>

          {selections.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-md">
              Ajoutez des matchs pour calculer vos gains potentiels
            </div>
          ) : (
            <div className="space-y-2">
              {selections.map((sel, index) => (
                <Card key={sel.id}>
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="text-sm">
                      <div className="font-medium">{sel.match.name}</div>
                      <div className="text-muted-foreground">{sel.prediction} @ {sel.odds}</div>
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeSelection(index)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="stakeAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mise (XAF)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex flex-col justify-end pb-2">
            <span className="text-sm text-muted-foreground mb-1">Gain Potentiel</span>
            <div className="text-2xl font-bold text-green-600">
              <CurrencyDisplay amount={potentialGain} />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading || selections.length === 0}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer le Pari
        </Button>
      </form>
    </Form>
  );
};