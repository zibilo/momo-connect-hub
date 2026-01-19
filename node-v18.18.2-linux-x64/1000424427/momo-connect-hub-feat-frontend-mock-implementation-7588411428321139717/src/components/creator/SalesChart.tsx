import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
  { name: 'Lun', sales: 4000 },
  { name: 'Mar', sales: 3000 },
  { name: 'Mer', sales: 2000 },
  { name: 'Jeu', sales: 2780 },
  { name: 'Ven', sales: 1890 },
  { name: 'Sam', sales: 2390 },
  { name: 'Dim', sales: 3490 },
];

const SalesChart = () => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Volume de ventes hebdomadaire</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
              <Tooltip />
              <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;