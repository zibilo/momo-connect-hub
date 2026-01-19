import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SelectionRow } from './SelectionRow';
import { OddsDisplay } from './OddsDisplay';
import { Plus, Send } from 'lucide-react';

export const CreateTicketForm = () => {
  const [selections, setSelections] = useState([{ id: '1' }]);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Nouveau Ticket de Prédiction</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Pronostics des matchs</Label>
          {selections.map((s) => (
            <SelectionRow key={s.id} onRemove={() => setSelections(selections.filter(x => x.id !== s.id))} />
          ))}
          <Button variant="outline" size="sm" onClick={() => setSelections([...selections, { id: Date.now().toString() }])} className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Ajouter un match
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <div className="space-y-2">
            <Label>Prix de vente (XAF)</Label>
            <select className="w-full p-2 border rounded-md bg-background">
              <option value="100">100 XAF</option>
              <option value="300">300 XAF</option>
              <option value="1000">1000 XAF</option>
            </select>
          </div>
          <OddsDisplay totalOdds={15.42} potentialGain={15420} />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Send className="h-4 w-4 mr-2" /> Publier sur le marché
        </Button>
      </CardFooter>
    </Card>
  );
};