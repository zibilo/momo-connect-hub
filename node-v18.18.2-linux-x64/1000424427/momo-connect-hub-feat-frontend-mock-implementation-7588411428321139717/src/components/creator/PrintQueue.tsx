import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ticket } from '@/types/ticket';

interface PrintQueueProps {
  ticketsToPrint: Ticket[];
  onPrint: (ticketId: string) => void;
}

export const PrintQueue: React.FC<PrintQueueProps> = ({ ticketsToPrint, onPrint }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets Ready to Print</CardTitle>
      </CardHeader>
      <CardContent>
        {ticketsToPrint.length === 0 ? (
          <p>No tickets in the print queue.</p>
        ) : (
          <ul className="space-y-2">
            {ticketsToPrint.map((ticket) => (
              <li key={ticket.id} className="flex justify-between items-center">
                <span>Ticket #{ticket.id.slice(0, 8)}</span>
                <Button size="sm" onClick={() => onPrint(ticket.id)}>Print</Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
