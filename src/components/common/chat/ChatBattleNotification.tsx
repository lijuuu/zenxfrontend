
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Clock, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BattleChallenge {
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
}

interface ChatBattleNotificationProps {
  challenge: BattleChallenge;
  onAccept?: () => void;
  onDecline?: () => void;
}

const ChatBattleNotification: React.FC<ChatBattleNotificationProps> = ({
  challenge,
  onAccept,
  onDecline
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-500 bg-green-500/10';
      case 'medium':
        return 'text-amber-500 bg-amber-500/10';
      case 'hard':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-zinc-500 bg-zinc-500/10';
    }
  };

  return (
    <div className="border border-zinc-700/50 rounded-lg p-3 bg-zinc-800/50">
      <div className="flex items-center gap-2 mb-2">
        <Trophy className="h-4 w-4 text-amber-500" />
        <span className="font-medium">Coding Battle Challenge</span>
      </div>

      <div className="flex items-start gap-3">
        <img
          src={challenge.sender.avatar}
          alt={challenge.sender.name}
          className="w-10 h-10 rounded-full"
        />
        
        <div className="flex-1">
          <div className="text-sm">{challenge.sender.name} challenged you to a coding battle!</div>
          <div className="text-xs text-zinc-400 mt-1">{challenge.title}</div>
          <div className="flex items-center gap-2 mt-2">
            <span className={cn("text-xs px-2 py-0.5 rounded-full", getDifficultyColor(challenge.difficulty))}>
              {challenge.difficulty}
            </span>
            <span className="text-xs flex items-center text-zinc-400">
              <Clock className="h-3 w-3 mr-1" />
              Expires in {challenge.expiresIn}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mt-3">
            <Button 
              size="sm" 
              className="h-8 bg-green-600 hover:bg-green-700"
              onClick={onAccept}
            >
              <Check className="h-4 w-4 mr-1" />
              Accept
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 border-zinc-700"
              onClick={onDecline}
            >
              <X className="h-4 w-4 mr-1" />
              Decline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBattleNotification;
