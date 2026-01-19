import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const CommissionHistory = () => {
  const history = [
    { id: "1", date: "20/03/2024", ticket: "#TK-8273", amount: "500", status: "payé" },
    { id: "2", date: "19/03/2024", ticket: "#TK-8124", amount: "1,200", status: "payé" },
    { id: "3", date: "18/03/2024", ticket: "#TK-7955", amount: "300", status: "en attente" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dernières Commissions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>ID Ticket</TableHead>
              <TableHead>Montant (XAF)</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.date}</TableCell>
                <TableCell className="font-mono">{row.ticket}</TableCell>
                <TableCell className="font-bold">{row.amount}</TableCell>
                <TableCell>
                  <Badge variant={row.status === 'payé' ? 'default' : 'secondary'}>
                    {row.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CommissionHistory;