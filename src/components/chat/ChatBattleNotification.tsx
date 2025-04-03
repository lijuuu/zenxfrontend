
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sword, Trophy, Shield, Clock, Zap, Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

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
  onAccept?: () => void;
  onDecline?: () => void;
}

const ChatBattleNotification: React.FC<ChatBattleNotificationProps> = ({ 
  challenge,
  onAccept,
  onDecline
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleAccept = () => {
    toast({
      title: "Challenge accepted!",
      description: `You've joined the ${challenge.title} challenge`,
    });
    
    // In a real app, this would make an API call to accept the challenge
    if (onAccept) {
      onAccept();
    } else {
      navigate(`/challenges?id=${challenge.id}`);
    }
  };
  
  const handleDecline = () => {
    toast({
      description: "Challenge declined",
    });
    
    // In a real app, this would make an API call to decline the challenge
    if (onDecline) {
      onDecline();
    }
  };
  
  return (
    <Card className="w-full overflow-hidden border-green-200/50 dark:border-green-800/30 shadow-sm bg-white/95 dark:bg-zinc-900/90">
      <div className="h-1 bg-gradient-to-r from-green-500 via-green-400 to-emerald-500" />
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 relative">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10 overflow-hidden">
              <Flame className="h-5 w-5 text-green-500 absolute animate-pulse opacity-60" />
              <Sword className="h-5 w-5 text-green-500" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold border border-background">
              VS
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm flex items-center gap-1.5">
                Coding Battle Invitation
                <Badge variant="outline" className="text-[10px] font-normal py-0 px-1.5 h-4">
                  {challenge.difficulty}
                </Badge>
              </h3>
              <span className="text-xs text-muted-foreground">{challenge.timestamp}</span>
            </div>
            
            <p className="text-sm font-medium mt-1">{challenge.title}</p>
            <div className="flex items-center text-xs text-muted-foreground mt-1 gap-3">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {challenge.expiresIn}
              </span>
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {challenge.difficulty}
              </span>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <img 
                  src={challenge.sender.avatar} 
                  alt={challenge.sender.name} 
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-xs">
                  From <span className="font-medium">{challenge.sender.name}</span>
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={handleDecline}
                >
                  Decline
                </Button>
                <Button 
                  size="sm" 
                  className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleAccept}
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Accept
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBattleNotification;
