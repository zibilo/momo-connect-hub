"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { TicketFilter as TicketFilterType } from '@/types/ticket';
import { formatCurrency } from '@/lib/currency';
import { Filter, X, RotateCcw } from 'lucide-react';

interface TicketFilterProps {
  filters: TicketFilterType;
  onFilterChange: (filters: TicketFilterType) => void;
  onReset?: () => void;
}

const SPORTS = [
  { value: 'football', label: 'Football' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'volleyball', label: 'Volleyball' },
  { value: 'handball', label: 'Handball' },
];

export function TicketFilter({ filters, onFilterChange, onReset }: TicketFilterProps) {
  const updateFilter = <K extends keyof TicketFilterType>(
    key: K,
    value: TicketFilterType[K]
  ) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtres
        </CardTitle>
        {hasActiveFilters && onReset && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Réinitialiser
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Sport</Label>
          <Select
            value={filters.sport || ''}
            onValueChange={(value) => updateFilter('sport', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous les sports" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les sports</SelectItem>
              {SPORTS.map((sport) => (
                <SelectItem key={sport.value} value={sport.value}>
                  {sport.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Côte minimum</Label>
          <div className="pt-2">
            <Slider
              value={[filters.minOdds || 1]}
              onValueChange={([value]) => updateFilter('minOdds', value)}
              min={1}
              max={50}
              step={0.5}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1.00</span>
              <span className="font-medium">{(filters.minOdds || 1).toFixed(2)}</span>
              <span>50.00</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Côte maximum</Label>
          <div className="pt-2">
            <Slider
              value={[filters.maxOdds || 100]}
              onValueChange={([value]) => updateFilter('maxOdds', value)}
              min={1}
              max={100}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1.00</span>
              <span className="font-medium">{(filters.maxOdds || 100).toFixed(2)}</span>
              <span>100.00</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Prix min</Label>
            <Input
              type="number"
              placeholder="0"
              value={filters.minPrice || ''}
              onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          <div className="space-y-2">
            <Label>Prix max</Label>
            <Input
              type="number"
              placeholder="∞"
              value={filters.maxPrice || ''}
              onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Statut</Label>
          <Select
            value={filters.status || ''}
            onValueChange={(value) => updateFilter('status', value as TicketFilterType['status'] || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="active">En cours</SelectItem>
              <SelectItem value="won">Gagné</SelectItem>
              <SelectItem value="lost">Perdu</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

export default TicketFilter;
