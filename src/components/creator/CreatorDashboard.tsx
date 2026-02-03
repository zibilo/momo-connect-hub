"use client";

import React from 'react';
import { StatsCards } from './StatsCards';
import { SalesChart } from './SalesChart';
import { CommissionHistory } from './CommissionHistory';
import { PrintQueue } from './PrintQueue';
import { Commission } from '@/types/transaction';
import { PhysicalTicket } from '@/types/ticket';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CreatorDashboardProps {
  stats: {
    totalTickets: number;
    totalSales: number;
    totalRevenue: number;
    successRate: number;
    ticketsTrend?: number;
    salesTrend?: number;
    revenueTrend?: number;
  };
  salesData: {
    date: string;
    sales: number;
    revenue: number;
  }[];
  commissions: Commission[];
  printQueue: PhysicalTicket[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onPrintTicket?: (ticketId: string) => void;
  onMarkSold?: (ticketId: string) => void;
}

export function CreatorDashboard({
  stats,
  salesData,
  commissions,
  printQueue,
  isLoading,
  onRefresh,
  onPrintTicket,
  onMarkSold,
}: CreatorDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tableau de Bord Créateur</h1>
          <p className="text-muted-foreground">Gérez vos tickets et suivez vos performances</p>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          )}
          <Button asChild>
            <Link to="/creator/tickets/new">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Ticket
            </Link>
          </Button>
        </div>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart data={salesData} />
        <CommissionHistory commissions={commissions} isLoading={isLoading} />
      </div>

      <PrintQueue
        tickets={printQueue}
        isLoading={isLoading}
        onPrint={onPrintTicket}
        onMarkSold={onMarkSold}
      />
    </div>
  );
}

export default CreatorDashboard;
