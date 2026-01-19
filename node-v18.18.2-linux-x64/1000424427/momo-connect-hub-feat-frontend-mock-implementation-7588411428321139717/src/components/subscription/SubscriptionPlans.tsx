import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const plans = [
  { name: "24 Heures", price: "500", duration: "1 jour", features: ["10 tickets max", "Comm. 70%"] },
  { name: "Hebdomadaire", price: "3,000", duration: "7 jours", features: ["Tickets illimités", "Impression QR", "Comm. 85%"], recommended: true },
  { name: "Mensuel", price: "10,000", duration: "30 jours", features: ["Tout l'hebdo", "Stats premium", "Support 24/7", "Comm. 95%"] },
];

export const SubscriptionPlans = () => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <Card key={plan.name} className={plan.recommended ? "border-primary shadow-lg" : ""}>
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.duration}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold">{plan.price} XAF</div>
            <ul className="space-y-2 text-sm">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" /> {f}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant={plan.recommended ? "default" : "outline"}>
              Choisir ce plan
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};