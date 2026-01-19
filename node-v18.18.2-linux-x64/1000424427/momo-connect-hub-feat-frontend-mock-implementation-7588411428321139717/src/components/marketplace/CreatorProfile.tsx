import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface CreatorProfileProps {
  creatorId: string;
  // creator data would be fetched based on ID
}

export const CreatorProfile: React.FC<CreatorProfileProps> = ({ creatorId }) => {
  // Placeholder data
  const creator = {
    name: "Expert Prono",
    avatarUrl: "https://github.com/shadcn.png",
    bio: "Top-rated creator with a high success rate.",
    stats: {
      ticketsSold: 1250,
      winRate: "78%",
    },
  };

  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <Avatar>
          <AvatarImage src={creator.avatarUrl} alt={creator.name} />
          <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{creator.name}</h3>
          <p className="text-sm text-muted-foreground">{creator.bio}</p>
          <div className="text-xs mt-1">
            <span>{creator.stats.ticketsSold} sold</span> | <span>{creator.stats.winRate} win rate</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
