"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/currency';
import { BarChart3 } from 'lucide-react';

interface SalesDataPoint {
  date: string;
  sales: number;
  revenue: number;
}

interface SalesChartProps {
  data: SalesDataPoint[];
  title?: string;
}

export function SalesChart({ data, title = "Ventes des 7 derniers jours" }: SalesChartProps) {
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <BarChart3 className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end gap-2 h-40">
            {data.map((point, index) => {
              const height = (point.revenue / maxRevenue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center">
                    <span className="text-xs text-muted-foreground mb-1">
                      {point.sales}
                    </span>
                    <div
                      className="w-full bg-primary rounded-t-sm transition-all duration-300 hover:bg-primary/80"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-2">
            {data.map((point, index) => (
              <div key={index} className="flex-1 text-center">
                <span className="text-xs text-muted-foreground">
                  {new Date(point.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t flex justify-between text-sm">
            <div>
              <p className="text-muted-foreground">Total Ventes</p>
              <p className="font-semibold">{data.reduce((acc, d) => acc + d.sales, 0)}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">Total Revenus</p>
              <p className="font-semibold">{formatCurrency(data.reduce((acc, d) => acc + d.revenue, 0))}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SalesChart;
