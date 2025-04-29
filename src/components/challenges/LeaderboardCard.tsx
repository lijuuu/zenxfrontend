
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Shield, Crown } from 'lucide-react';
import { LeaderboardEntry } from '@/api/challengeTypes';
import { cn } from '@/lib/utils';

interface LeaderboardCardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  className?: string;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ entries, currentUserId, className }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  if (!entries.length) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Trophy className="h-5 w-5 text-amber-500 mr-2" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            No scores yet. Be the first to solve a problem!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Trophy className="h-5 w-5 text-amber-500 mr-2" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          className="space-y-2"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {entries.map((entry, index) => {
            const isCurrentUser = entry.userId === currentUserId;
            const getRankIcon = () => {
              switch (entry.rank) {
                case 1:
                  return <Crown className="h-4 w-4 text-amber-500" />;
                case 2:
                  return <Medal className="h-4 w-4 text-zinc-400" />;
                case 3:
                  return <Medal className="h-4 w-4 text-amber-700" />;
                default:
                  return <Shield className="h-4 w-4 text-zinc-600" />;
              }
            };

            return (
              <motion.div
                key={entry.userId}
                variants={item}
                className={cn(
                  "flex items-center justify-between p-2.5 rounded-md",
                  isCurrentUser ? "bg-primary/10 border border-primary/30" : 
                  index === 0 ? "bg-amber-500/10 border border-amber-500/20" : 
                  index === 1 ? "bg-zinc-400/10 border border-zinc-400/20" : 
                  index === 2 ? "bg-amber-700/10 border border-amber-700/20" : 
                  "bg-secondary/20 border border-transparent"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex items-center justify-center w-7 h-7 rounded-full",
                    index === 0 ? "bg-amber-500/20" : 
                    index === 1 ? "bg-zinc-400/20" : 
                    index === 2 ? "bg-amber-700/20" : 
                    "bg-zinc-700/20"
                  )}>
                    {getRankIcon()}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {isCurrentUser ? 'You' : `User ${entry.userId.substring(0, 6)}...`}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span>
                        {entry.problemsCompleted} solved
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "font-mono font-semibold",
                    index === 0 ? "text-amber-500" : 
                    index === 1 ? "text-zinc-400" : 
                    index === 2 ? "text-amber-700" : ""
                  )}>
                    {entry.totalScore} pts
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
