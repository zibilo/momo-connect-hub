import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Ticket, Award } from 'lucide-react';

const StatsCards = () => {
  const stats = [
    { title: "Revenus", value: "45,250 XAF", icon: TrendingUp, trend: "+12%" },
    { title: "Ventes", value: "124", icon: Ticket, trend: "+5%" },
    { title: "Abonnés", value: "18", icon: Users, trend: "+2" },
    { title: "Win Rate", value: "72%", icon: Award, trend: "+1.5%" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-green-500 font-medium">{stat.trend} ce mois</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;