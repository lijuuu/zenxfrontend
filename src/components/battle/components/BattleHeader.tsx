
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Clock } from 'lucide-react';
import { Room } from '../types';

interface BattleHeaderProps {
  roomId?: string;
  room?: Room;
  timeRemaining: string;
  onExitClick: () => void;
}

const BattleHeader: React.FC<BattleHeaderProps> = ({ 
  roomId, 
  room, 
  timeRemaining,
  onExitClick 
}) => {
  return (
    <div className="border-b border-zinc-800 flex justify-between p-3 bg-zinc-900/80 backdrop-blur sticky top-0 z-30">
      <div className="flex items-center gap-2 overflow-hidden">
        <Trophy className="text-amber-500 h-5 w-5 flex-shrink-0" />
        <div className="truncate">
          <span className="font-medium text-lg truncate">Coding Battle: {room?.challengeId}</span>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span>Room: {roomId}</span>
            <span>•</span>
            <span className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              {room?.participantIds.length} Participants
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 border border-red-800/50 bg-red-900/20 rounded-md">
          <Clock className="h-4 w-4 text-red-500" />
          <span className="font-medium text-red-400">{timeRemaining}</span>
        </div>
        
        <Button 
          variant="destructive" 
          size="sm"
          className="bg-red-900/30 hover:bg-red-800 border border-red-800/50 text-red-400"
          onClick={onExitClick}
        >
          Exit Challenge
        </Button>
      </div>
    </div>
  );
};

export default BattleHeader;
