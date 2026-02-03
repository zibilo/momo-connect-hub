"use client";

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreatorProfile } from '@/types/user';
import { Star, Trophy, Users, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreatorProfileCardProps {
  creator: CreatorProfile;
  onSubscribe?: () => void;
  isSubscribed?: boolean;
  compact?: boolean;
}

export function CreatorProfileCard({ 
  creator, 
  onSubscribe, 
  isSubscribed,
  compact = false 
}: CreatorProfileCardProps) {
  const initials = creator.display_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={creator.avatar_url} alt={creator.display_name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-medium truncate">{creator.display_name}</span>
            {creator.is_featured && (
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <Star className="w-3 h-3 text-yellow-500" />
              {creator.rating.toFixed(1)}
            </span>
            <span>{creator.success_rate.toFixed(0)}% réussite</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-3">
          <Avatar className="w-20 h-20">
            <AvatarImage src={creator.avatar_url} alt={creator.display_name} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex items-center justify-center gap-2">
          <h3 className="text-lg font-semibold">{creator.display_name}</h3>
          {creator.is_featured && (
            <Badge variant="default" className="bg-primary">
              <CheckCircle className="w-3 h-3 mr-1" />
              Vérifié
            </Badge>
          )}
        </div>
        {creator.description && (
          <p className="text-sm text-muted-foreground mt-1">{creator.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-muted/50 rounded-lg">
            <Trophy className="w-4 h-4 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold">{creator.total_tickets}</p>
            <p className="text-xs text-muted-foreground">Tickets</p>
          </div>
          <div className="p-2 bg-muted/50 rounded-lg">
            <Users className="w-4 h-4 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold">{creator.total_sales}</p>
            <p className="text-xs text-muted-foreground">Ventes</p>
          </div>
          <div className="p-2 bg-muted/50 rounded-lg">
            <Star className="w-4 h-4 mx-auto mb-1 text-yellow-500" />
            <p className="text-lg font-bold">{creator.rating.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">Note</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
          <span className="text-sm font-medium">Taux de réussite</span>
          <span className="text-lg font-bold text-green-600">{creator.success_rate.toFixed(0)}%</span>
        </div>

        {onSubscribe && (
          <Button
            onClick={onSubscribe}
            variant={isSubscribed ? "outline" : "default"}
            className="w-full"
          >
            {isSubscribed ? 'Abonné' : "S'abonner"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default CreatorProfileCard;
