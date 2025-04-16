
import React from 'react';
import { Trophy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LeaderboardEntry, UserData } from '../types';

interface LeaderboardPanelProps {
  leaderboard: LeaderboardEntry[];
  users: { [id: string]: UserData };
  currentUserId: string;
}

const LeaderboardPanel: React.FC<LeaderboardPanelProps> = ({ 
  leaderboard, 
  users, 
  currentUserId 
}) => {
  return (
    <div className="w-full md:w-[250px] md:min-w-[250px] border-l border-zinc-800 flex flex-col bg-zinc-900/40 overflow-hidden">
      <div className="p-3 border-b border-zinc-800">
        <h3 className="font-medium flex items-center gap-1.5">
          <Trophy className="h-4 w-4 text-amber-500" />
          Live Leaderboard
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-2">
          {leaderboard.map((entry, index) => {
            const user = users[entry.userId];
            const isCurrentUser = entry.userId === currentUserId;
            
            return (
              <div 
                key={entry.userId} 
                className={`flex items-center gap-2 p-2 rounded-md border ${isCurrentUser ? 'bg-green-900/20 border-green-800/50' : 'bg-zinc-800/40 border-zinc-700/50'} ${index === 0 ? 'bg-amber-900/20 border-amber-800/50' : ''}`}
              >
                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium
                  ${index === 0 ? 'bg-amber-500 text-white' : index === 1 ? 'bg-zinc-400 text-white' : index === 2 ? 'bg-amber-800 text-white' : 'bg-zinc-700 text-zinc-300'}`}>
                  {entry.rank}
                </div>
                
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.name.substr(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{user?.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-400">
                    <span>{entry.problemsCompleted} solved</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-sm font-bold text-amber-500">{entry.totalScore}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPanel;
