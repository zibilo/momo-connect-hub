"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatCompactCurrency } from '@/lib/currency';
import { TrendingUp, TrendingDown, Ticket, Users, DollarSign, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  className?: string;
}

function StatCard({ title, value, icon, trend, trendLabel, className }: StatCardProps) {
  const isPositiveTrend = trend && trend > 0;
  const isNegativeTrend = trend && trend < 0;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend !== undefined && (
              <div className="flex items-center gap-1">
                {isPositiveTrend && <TrendingUp className="w-4 h-4 text-green-500" />}
                {isNegativeTrend && <TrendingDown className="w-4 h-4 text-red-500" />}
                <span className={cn(
                  "text-sm",
                  isPositiveTrend && "text-green-500",
                  isNegativeTrend && "text-red-500",
                  !isPositiveTrend && !isNegativeTrend && "text-muted-foreground"
                )}>
                  {trend > 0 ? '+' : ''}{trend}%
                </span>
                {trendLabel && <span className="text-xs text-muted-foreground">{trendLabel}</span>}
              </div>
            )}
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CreatorStats {
  totalTickets: number;
  totalSales: number;
  totalRevenue: number;
  successRate: number;
  totalSubscribers?: number;
  ticketsTrend?: number;
  salesTrend?: number;
  revenueTrend?: number;
}

interface StatsCardsProps {
  stats: CreatorStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Tickets Créés"
        value={stats.totalTickets}
        icon={<Ticket className="w-6 h-6 text-primary" />}
        trend={stats.ticketsTrend}
        trendLabel="ce mois"
      />
      <StatCard
        title="Ventes Totales"
        value={stats.totalSales}
        icon={<Users className="w-6 h-6 text-primary" />}
        trend={stats.salesTrend}
        trendLabel="ce mois"
      />
      <StatCard
        title="Revenus"
        value={formatCompactCurrency(stats.totalRevenue)}
        icon={<DollarSign className="w-6 h-6 text-primary" />}
        trend={stats.revenueTrend}
        trendLabel="ce mois"
      />
      <StatCard
        title="Taux de Réussite"
        value={`${stats.successRate.toFixed(1)}%`}
        icon={<Percent className="w-6 h-6 text-primary" />}
      />
    </div>
  );
}

export default StatsCards;
