"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PhysicalTicket } from '@/types/ticket';
import { formatCurrency } from '@/lib/currency';
import { formatDateTime } from '@/lib/dates';
import { Printer, QrCode, CheckCircle, XCircle } from 'lucide-react';

interface PrintQueueProps {
  tickets: PhysicalTicket[];
  isLoading?: boolean;
  onPrint?: (ticketId: string) => void;
  onMarkSold?: (ticketId: string) => void;
}

export function PrintQueue({ tickets, isLoading, onPrint, onMarkSold }: PrintQueueProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">File d'Impression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const pendingPrint = tickets.filter(t => !t.printed_at);
  const printed = tickets.filter(t => t.printed_at && !t.sold);
  const sold = tickets.filter(t => t.sold);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">File d'Impression</CardTitle>
        <Printer className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted/50 rounded-lg text-center">
          <div>
            <p className="text-2xl font-bold">{pendingPrint.length}</p>
            <p className="text-xs text-muted-foreground">À imprimer</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{printed.length}</p>
            <p className="text-xs text-muted-foreground">Imprimés</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{sold.length}</p>
            <p className="text-xs text-muted-foreground">Vendus</p>
          </div>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucun ticket physique en attente
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 bg-card border rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-primary" />
                    <span className="font-mono text-sm">{ticket.verification_code}</span>
                  </div>
                  <Badge variant={ticket.sold ? 'default' : ticket.printed_at ? 'secondary' : 'outline'}>
                    {ticket.sold ? 'Vendu' : ticket.printed_at ? 'Imprimé' : 'En attente'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {ticket.ticket?.title || 'Ticket'}
                  </span>
                  <span className="font-medium">
                    {formatCurrency(ticket.ticket?.price || 0)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {!ticket.printed_at && onPrint && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onPrint(ticket.id)}
                      className="flex-1"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Imprimer
                    </Button>
                  )}
                  {ticket.printed_at && !ticket.sold && onMarkSold && (
                    <Button
                      size="sm"
                      onClick={() => onMarkSold(ticket.id)}
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marquer vendu
                    </Button>
                  )}
                  {ticket.sold && ticket.sold_at && (
                    <p className="text-xs text-muted-foreground">
                      Vendu le {formatDateTime(ticket.sold_at)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PrintQueue;
