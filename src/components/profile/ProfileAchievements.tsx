import React from 'react';
import { Badge as BadgeType, UserProfile } from '@/api/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Trophy, Star, Zap, Shield, Target, Flame } from 'lucide-react';

export interface ProfileAchievementsProps {
  profile: UserProfile;
}

const Badge = ({ badge }: { badge: BadgeType }) => {
  const getBadgeIcon = (icon: string) => {
    switch (icon) {
      case 'trophy':
        return <Trophy className="h-5 w-5" />;
      case 'star':
        return <Star className="h-5 w-5" />;
      case 'zap':
        return <Zap className="h-5 w-5" />;
      case 'shield':
        return <Shield className="h-5 w-5" />;
      case 'target':
        return <Target className="h-5 w-5" />;
      case 'flame':
        return <Flame className="h-5 w-5" />;
      default:
        return <Award className="h-5 w-5" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return 'bg-amber-700/20 text-amber-600 border-amber-700/30';
      case 'silver':
        return 'bg-slate-300/20 text-slate-400 border-slate-300/30';
      case 'gold':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'platinum':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const earnedDate = badge.acquiredAt || badge.earnedDate;
  const tierClass = getTierColor(badge.tier || badge.rarity || 'bronze');

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${tierClass}`}>
      <div className={`p-2 rounded-full ${tierClass}`}>
        {getBadgeIcon(badge.icon)}
      </div>
      <div className="space-y-1">
        <h4 className="font-medium text-sm">{badge.name}</h4>
        <p className="text-xs text-muted-foreground">{badge.description}</p>
        {earnedDate && (
          <p className="text-xs text-muted-foreground">
            Earned on {new Date(earnedDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

const ProfileAchievements: React.FC<ProfileAchievementsProps> = ({ profile }) => {
  const badges = profile.badges || [];
  
  const achievementStats = [
    {
      title: 'Weekly Contests',
      value: profile.achievements?.weeklyContests || 0,
      icon: <Trophy className="h-4 w-4 text-yellow-500" />,
    },
    {
      title: 'Monthly Contests',
      value: profile.achievements?.monthlyContests || 0,
      icon: <Star className="h-4 w-4 text-blue-500" />,
    },
    {
      title: 'Special Events',
      value: profile.achievements?.specialEvents || 0,
      icon: <Zap className="h-4 w-4 text-purple-500" />,
    },
  ];

  return (
    <Card className="bg-zinc-900/40 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-500" />
          Achievements
        </CardTitle>
        <CardDescription>
          Badges and achievements earned by {profile.userName || profile.username}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {achievementStats.map((stat, i) => (
            <div key={i} className="bg-zinc-800/50 rounded-lg p-3 text-center">
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="text-xs text-zinc-400">{stat.title}</div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All Badges</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="rare">Rare</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {badges.length > 0 ? (
                  badges.map((badge) => (
                    <Badge key={badge.id} badge={badge} />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No badges earned yet
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="recent">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {badges.length > 0 ? (
                  badges
                    .filter(badge => badge.acquiredAt || badge.earnedDate)
                    .sort((a, b) => {
                      const dateA = new Date(a.acquiredAt || a.earnedDate || 0);
                      const dateB = new Date(b.acquiredAt || b.earnedDate || 0);
                      return dateB.getTime() - dateA.getTime();
                    })
                    .slice(0, 5)
                    .map((badge) => <Badge key={badge.id} badge={badge} />)
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent badges
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="rare">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {badges.length > 0 ? (
                  badges
                    .filter(badge => 
                      badge.tier === 'platinum' || 
                      badge.tier === 'gold' || 
                      badge.rarity === 'legendary' || 
                      badge.rarity === 'epic'
                    )
                    .map((badge) => <Badge key={badge.id} badge={badge} />)
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No rare badges yet
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProfileAchievements;
