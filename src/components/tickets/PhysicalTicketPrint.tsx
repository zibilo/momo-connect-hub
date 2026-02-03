"use client";

import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PhysicalTicket, Ticket } from '@/types/ticket';
import { formatCurrency } from '@/lib/currency';
import { formatDateTime } from '@/lib/dates';
import { QrCode, Printer, CheckCircle } from 'lucide-react';

interface PhysicalTicketPrintProps {
  physicalTicket: PhysicalTicket;
  onPrint?: () => void;
}

export function PhysicalTicketPrint({ physicalTicket, onPrint }: PhysicalTicketPrintProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const ticket = physicalTicket.ticket;

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    }
    window.print();
  };

  const totalOdds = ticket?.selections?.reduce((acc, s) => acc * s.odds, 1) || 1;

  return (
    <div className="space-y-4">
      <div className="flex justify-end print:hidden">
        <Button onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Imprimer
        </Button>
      </div>

      <div 
        ref={printRef}
        className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 max-w-md mx-auto print:border-solid print:border-black"
      >
        <div className="text-center border-b pb-4 mb-4">
          <h2 className="text-xl font-bold">TICKET DE PARI</h2>
          <p className="text-sm text-muted-foreground">BetTicket Pro</p>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Titre:</span>
            <span className="font-medium text-sm">{ticket?.title || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Sélections:</span>
            <span className="font-medium">{ticket?.selections?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Côte Totale:</span>
            <span className="font-bold font-mono">{totalOdds.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Prix:</span>
            <span className="font-bold">{formatCurrency(ticket?.price || 0)}</span>
          </div>
        </div>

        {ticket?.selections && ticket.selections.length > 0 && (
          <div className="border-t border-b py-3 mb-4">
            <p className="text-xs font-semibold mb-2">SÉLECTIONS:</p>
            <div className="space-y-1">
              {ticket.selections.slice(0, 5).map((selection, index) => (
                <div key={selection.id || index} className="text-xs flex justify-between">
                  <span className="truncate flex-1">
                    {selection.match?.home_team?.name} vs {selection.match?.away_team?.name}
                  </span>
                  <span className="font-mono ml-2">{selection.odds.toFixed(2)}</span>
                </div>
              ))}
              {ticket.selections.length > 5 && (
                <p className="text-xs text-muted-foreground">
                  +{ticket.selections.length - 5} autres
                </p>
              )}
            </div>
          </div>
        )}

        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gray-100 rounded-lg mb-2">
            {physicalTicket.qr_code_url ? (
              <img 
                src={physicalTicket.qr_code_url} 
                alt="QR Code" 
                className="w-full h-full object-contain"
              />
            ) : (
              <QrCode className="w-16 h-16 text-gray-400" />
            )}
          </div>
          <p className="font-mono text-lg font-bold tracking-wider">
            {physicalTicket.verification_code}
          </p>
          <p className="text-xs text-muted-foreground">Code de vérification</p>
        </div>

        <div className="text-center border-t pt-4 space-y-1">
          <p className="text-xs text-muted-foreground">
            Imprimé le {formatDateTime(physicalTicket.printed_at || new Date().toISOString())}
          </p>
          <p className="text-xs text-muted-foreground">
            Conservez ce ticket pour récupérer vos gains
          </p>
        </div>

        {physicalTicket.sold && (
          <div className="mt-4 p-2 bg-green-50 rounded text-center">
            <CheckCircle className="w-4 h-4 inline mr-1 text-green-600" />
            <span className="text-sm text-green-600 font-medium">VENDU</span>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default PhysicalTicketPrint;
