
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sword, Award, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ChatBattleNotificationProps {
  challenge: {
    id: string;
    title: string;
    isPrivate: boolean;
    difficulty: 'easy' | 'medium' | 'hard';
    expiresIn: string;
    sender: {
      name: string;
      avatar: string;
    };
    timestamp: string;
  };
}

const ChatBattleNotification: React.FC<ChatBattleNotificationProps> = ({ challenge }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/10 text-green-500';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'hard':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-green-500/10 text-green-500';
    }
  };

  return (
    <div className="bg-accent/5 p-3 rounded-lg border border-accent/20">
      <div className="flex items-center gap-3 mb-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={challenge.sender.avatar} alt={challenge.sender.name} />
          <AvatarFallback>{challenge.sender.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium text-sm">{challenge.sender.name}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Expires in {challenge.expiresIn}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-md bg-accent/10">
          <Sword className="h-4 w-4 text-accent" />
        </div>
        <div className="flex-1">
          <div className="font-medium">{challenge.title}</div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className={`${getDifficultyColor(challenge.difficulty)} border-0`}>
              {challenge.difficulty}
            </Badge>
            {challenge.isPrivate && (
              <Badge variant="outline" className="bg-zinc-500/10 text-zinc-400 border-0">
                Private
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button className="w-1/2 bg-accent hover:bg-accent/90">
          Accept
        </Button>
        <Button variant="outline" className="w-1/2">
          Decline
        </Button>
      </div>
    </div>
  );
};

export default ChatBattleNotification;
