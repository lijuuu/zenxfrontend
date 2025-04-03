
import React from "react";
import { UserProfile } from "@/api/types";
import { Trophy, Puzzle, Star, Code, BarChart3, User, CheckCircle } from "lucide-react";

interface ProfileStatsProps {
  profile: UserProfile;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ profile }) => {
  // Calculate total problems
  const totalSolved = profile.stats.easy.solved + profile.stats.medium.solved + profile.stats.hard.solved;
  const totalAvailable = profile.stats.easy.total + profile.stats.medium.total + profile.stats.hard.total;
  
  // Calculate problem percentages
  const easyPercentage = profile.stats.easy.total ? 
    Math.round((profile.stats.easy.solved / profile.stats.easy.total) * 100) : 0;
  const mediumPercentage = profile.stats.medium.total ? 
    Math.round((profile.stats.medium.solved / profile.stats.medium.total) * 100) : 0;
  const hardPercentage = profile.stats.hard.total ? 
    Math.round((profile.stats.hard.solved / profile.stats.hard.total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="border border-border/50 rounded-lg p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-green-100/50 dark:bg-green-900/20 flex items-center justify-center">
          <CheckCircle className="h-6 w-6 text-green-500" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Problems Solved</p>
          <div className="mt-1 flex items-baseline">
            <span className="text-xl font-bold">{profile.problemsSolved}</span>
            <span className="ml-1 text-xs text-muted-foreground">/ {totalAvailable}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span>Easy: {easyPercentage}%</span>
            <span>Medium: {mediumPercentage}%</span>
            <span>Hard: {hardPercentage}%</span>
          </div>
        </div>
      </div>
      
      <div className="border border-border/50 rounded-lg p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-blue-100/50 dark:bg-blue-900/20 flex items-center justify-center">
          <Trophy className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Contest Participation</p>
          <div className="mt-1 flex items-baseline">
            <span className="text-xl font-bold">
              {profile.achievements.weeklyContests + profile.achievements.monthlyContests + profile.achievements.specialEvents}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span>Weekly: {profile.achievements.weeklyContests}</span>
            <span>Monthly: {profile.achievements.monthlyContests}</span>
            <span>Special: {profile.achievements.specialEvents}</span>
          </div>
        </div>
      </div>
      
      <div className="border border-border/50 rounded-lg p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-purple-100/50 dark:bg-purple-900/20 flex items-center justify-center">
          <BarChart3 className="h-6 w-6 text-purple-500" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Global Ranking</p>
          <div className="mt-1 flex items-baseline">
            <span className="text-xl font-bold">#{profile.globalRank || '-'}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span>Rating: {profile.currentRating || 0}</span>
            <span>Top {profile.ranking <= 100 ? profile.ranking : Math.round(profile.ranking / 100) * 100}</span>
          </div>
        </div>
      </div>
      
      <div className="border border-border/50 rounded-lg p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-amber-100/50 dark:bg-amber-900/20 flex items-center justify-center">
          <Puzzle className="h-6 w-6 text-amber-500" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Challenge Stats</p>
          <div className="mt-1 flex items-baseline">
            <span className="text-xl font-bold">{profile.badges?.length || 0}</span>
            <span className="ml-1 text-xs text-muted-foreground">badges earned</span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span>Public: {profile.achievements?.weeklyContests || 0}</span>
            <span>Private: {profile.achievements?.monthlyContests || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
