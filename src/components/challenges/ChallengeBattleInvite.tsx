
import React from 'react';
import { Sword, Trophy, Users, Clock, ArrowRight, Shield, FileCode, Zap, Flame, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ChallengeBattleInviteProps {
  challenge: {
    id: string;
    title: string;
    isPrivate: boolean;
    accessCode?: string;
    expiresIn?: string;
    participants?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
  };
  onAccept: () => void;
  onDecline?: () => void;
}

const ChallengeBattleInvite: React.FC<ChallengeBattleInviteProps> = ({ 
  challenge, 
  onAccept,
  onDecline
}) => {
  return (
    <Card className="w-full max-w-md my-2 overflow-hidden border-green-500/30 dark:bg-background/70">
      <div className="h-2 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500" />
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          {challenge.isPrivate ? (
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 mr-3 overflow-hidden">
                <Flame className="h-6 w-6 text-orange-500 absolute animate-pulse" />
                <Sword className="h-6 w-6 text-orange-500" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-background">
                VS
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 mr-3 overflow-hidden">
                <Star className="h-6 w-6 text-blue-500 absolute animate-pulse opacity-50" />
                <Trophy className="h-6 w-6 text-blue-500" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-background">
                GO
              </div>
            </div>
          )}
          
          <div>
            <div className="flex items-center">
              <h3 className="font-semibold text-lg">{challenge.title}</h3>
              {challenge.isPrivate && (
                <Badge variant="outline" className="ml-2 text-xs font-semibold bg-orange-100/50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800/50">
                  Battle
                </Badge>
              )}
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1 gap-3">
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                <span>{challenge.participants || 2}</span>
              </div>
              {challenge.difficulty && (
                <div className="flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  <span className="capitalize">{challenge.difficulty}</span>
                </div>
              )}
              {challenge.expiresIn && (
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{challenge.expiresIn}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {challenge.isPrivate && challenge.accessCode && (
          <div className="mb-3 p-2 bg-orange-50/50 dark:bg-orange-900/10 rounded-md border border-orange-200 dark:border-orange-800/50 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Access Code:</span>
              <code className="font-mono bg-orange-100/80 dark:bg-orange-900/30 px-2 py-0.5 rounded text-orange-800 dark:text-orange-300">
                {challenge.accessCode}
              </code>
            </div>
          </div>
        )}
        
        <div className="mt-3 mb-4">
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full animate-pulse" style={{ width: '75%' }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">Battle starting soon...</span>
            <span className="text-xs font-medium">3/4 participants ready</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center space-x-2">
            {challenge.isPrivate ? (
              <Sword className="h-4 w-4 text-orange-500" />
            ) : (
              <Trophy className="h-4 w-4 text-blue-500" />
            )}
            <span className="text-sm font-medium">
              {challenge.isPrivate ? 'Coding battle invitation' : 'Challenge invitation'}
            </span>
          </div>
          
          <div className="flex space-x-2">
            {onDecline && (
              <Button variant="outline" size="sm" onClick={onDecline}>
                Decline
              </Button>
            )}
            <Button onClick={onAccept} className="bg-green-500 hover:bg-green-600" size="sm">
              <Zap className="mr-1.5 h-3.5 w-3.5" />
              {challenge.isPrivate ? 'Accept Battle' : 'Join Challenge'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChallengeBattleInvite;
