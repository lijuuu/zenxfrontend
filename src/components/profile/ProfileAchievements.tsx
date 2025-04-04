
import React from 'react';
import { Badge as BadgeType } from '@/api/types';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Star, Zap, Medal } from 'lucide-react';

interface ProfileAchievementsProps {
  badges: BadgeType[];
}

const getBadgeIcon = (rarity: string) => {
  switch (rarity) {
    case 'legendary':
      return <Trophy className="h-4 w-4 text-amber-500" />;
    case 'epic':
      return <Medal className="h-4 w-4 text-purple-500" />;
    case 'rare':
      return <Star className="h-4 w-4 text-blue-500" />;
    case 'uncommon':
      return <Award className="h-4 w-4 text-green-500" />;
    default:
      return <Zap className="h-4 w-4 text-zinc-500" />;
  }
};

const getBadgeColor = (rarity: string) => {
  switch (rarity) {
    case 'legendary':
      return 'bg-amber-100/50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/50';
    case 'epic':
      return 'bg-purple-100/50 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800/50';
    case 'rare':
      return 'bg-blue-100/50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/50';
    case 'uncommon':
      return 'bg-green-100/50 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800/50';
    default:
      return 'bg-zinc-100/50 text-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800/50';
  }
};

const ProfileAchievements: React.FC<ProfileAchievementsProps> = ({ badges }) => {
  if (badges.length === 0) {
    return (
      <div className="text-center py-8">
        <Award className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
        <h3 className="text-lg font-medium">No Badges Yet</h3>
        <p className="text-muted-foreground mt-1">
          Complete challenges and solve problems to earn badges
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {badges.map((badge) => (
          <div 
            key={badge.id} 
            className={`p-4 rounded-lg border ${getBadgeColor(badge.rarity)} flex items-center gap-3`}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getBadgeColor(badge.rarity)}`}>
              {getBadgeIcon(badge.rarity)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center">
                <h3 className="font-medium">{badge.name}</h3>
                <Badge variant="outline" className="ml-2 text-xs capitalize">
                  {badge.rarity}
                </Badge>
              </div>
              <p className="text-sm mt-1">{badge.description}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Earned on {new Date(badge.earnedDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileAchievements;
