"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BetSelection, Match } from '@/types/match';
import { TicketVisibility } from '@/types/ticket';
import { formatCurrency } from '@/lib/currency';
import { Trash2, Plus, Eye, Lock, Users, Ticket, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateTicketFormProps {
  selections: BetSelection[];
  onRemoveSelection: (selectionId: string) => void;
  onClearAll: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    price: number;
    visibility: TicketVisibility;
    stakeSuggestion?: number;
  }) => Promise<void>;
  onAddSelection: () => void;
  minPrice?: number;
  maxPrice?: number;
}

export function CreateTicketForm({
  selections,
  onRemoveSelection,
  onClearAll,
  onSubmit,
  onAddSelection,
  minPrice = 100,
  maxPrice = 50000,
}: CreateTicketFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stakeSuggestion, setStakeSuggestion] = useState('');
  const [visibility, setVisibility] = useState<TicketVisibility>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalOdds = selections.reduce((acc, s) => acc * s.odds, 1);
  const priceAmount = parseInt(price) || 0;
  const isValidForm = title.trim() && priceAmount >= minPrice && priceAmount <= maxPrice && selections.length > 0;

  const handleSubmit = async () => {
    if (!isValidForm) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        price: priceAmount,
        visibility,
        stakeSuggestion: stakeSuggestion ? parseInt(stakeSuggestion) : undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibilityOptions = [
    { value: 'public', label: 'Public', icon: Eye, description: 'Visible par tous' },
    { value: 'subscribers', label: 'Abonnés', icon: Users, description: 'Réservé aux abonnés' },
    { value: 'private', label: 'Privé', icon: Lock, description: 'Non listé' },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Ticket className="w-5 h-5" />
          Créer un Ticket
        </CardTitle>
        {selections.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            <Trash2 className="w-4 h-4 mr-1" />
            Effacer
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre du ticket *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Combo Ligue 1 - Journée 20"
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez votre analyse et vos choix..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Sélections ({selections.length})</Label>
            <Button variant="outline" size="sm" onClick={onAddSelection}>
              <Plus className="w-4 h-4 mr-1" />
              Ajouter
            </Button>
          </div>
          
          {selections.length === 0 ? (
            <div className="p-6 border-2 border-dashed rounded-lg text-center">
              <p className="text-muted-foreground text-sm">
                Ajoutez des sélections pour créer votre ticket
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selections.map((selection) => (
                <div
                  key={selection.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {selection.match?.home_team?.name} vs {selection.match?.away_team?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selection.market}: <span className="font-medium">{selection.selection}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <span className="font-mono text-sm font-semibold text-primary">
                      {selection.odds.toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onRemoveSelection(selection.id)}
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selections.length > 0 && (
            <div className="p-3 bg-primary/5 rounded-lg flex justify-between items-center">
              <span className="text-sm font-medium">Côte totale</span>
              <span className="text-xl font-bold font-mono text-primary">
                {totalOdds.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Prix de vente *</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={`Min: ${formatCurrency(minPrice)}`}
              min={minPrice}
              max={maxPrice}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stake">Mise suggérée</Label>
            <Input
              id="stake"
              type="number"
              value={stakeSuggestion}
              onChange={(e) => setStakeSuggestion(e.target.value)}
              placeholder="Optionnel"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Visibilité</Label>
          <div className="grid grid-cols-3 gap-2">
            {visibilityOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setVisibility(option.value as TicketVisibility)}
                  className={cn(
                    "p-3 rounded-lg border text-center transition-all",
                    visibility === option.value
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-muted-foreground/50"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 mx-auto mb-1",
                    visibility === option.value ? "text-primary" : "text-muted-foreground"
                  )} />
                  <p className="text-sm font-medium">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          disabled={!isValidForm || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Création...
            </>
          ) : (
            'Créer le ticket'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CreateTicketForm;
