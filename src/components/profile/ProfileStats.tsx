
import React from "react";
import { UserProfile } from "@/api/types";
import { Trophy, Puzzle, BarChart3, CheckCircle } from "lucide-react";
import { useProblemStats } from "@/services/useProblemStats";

interface ProfileStatsProps {
  profile: UserProfile;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ profile }) => {
  // Use our new hook with React Query
  const { data: problemStats, isLoading } = useProblemStats(profile.userId);

  // Calculate total problems
  let totalSolved = 0;
  let totalAvailable = 0;
  let easyPercentage = 0;
  let mediumPercentage = 0;
  let hardPercentage = 0;

  if (problemStats) {
    // Use our problem stats hook data
    totalSolved = problemStats.doneEasyCount + problemStats.doneMediumCount + problemStats.doneHardCount;
    totalAvailable = problemStats.maxEasyCount + problemStats.maxMediumCount + problemStats.maxHardCount;
    
    easyPercentage = problemStats.maxEasyCount
      ? Math.round((problemStats.doneEasyCount / problemStats.maxEasyCount) * 100)
      : 0;
      
    mediumPercentage = problemStats.maxMediumCount
      ? Math.round((problemStats.doneMediumCount / problemStats.maxMediumCount) * 100)
      : 0;
      
    hardPercentage = problemStats.maxHardCount
      ? Math.round((problemStats.doneHardCount / problemStats.maxHardCount) * 100)
      : 0;
  } else if (profile?.stats) {
    // Fallback to profile stats
    totalSolved =
      (profile?.stats?.easy?.solved || 0) +
      (profile?.stats?.medium?.solved || 0) +
      (profile?.stats?.hard?.solved || 0);

    totalAvailable =
      (profile?.stats?.easy?.total || 0) +
      (profile?.stats?.medium?.total || 0) +
      (profile?.stats?.hard?.total || 0);

    // Calculate problem percentages safely
    easyPercentage = profile?.stats?.easy?.total
      ? Math.round(((profile?.stats?.easy?.solved || 0) / profile?.stats?.easy?.total) * 100)
      : 0;

    mediumPercentage = profile?.stats?.medium?.total
      ? Math.round(((profile?.stats?.medium?.solved || 0) / profile?.stats?.medium?.total) * 100)
      : 0;

    hardPercentage = profile?.stats?.hard?.total
      ? Math.round(((profile?.stats?.hard?.solved || 0) / profile?.stats?.hard?.total) * 100)
      : 0;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Problems Done */}
      <div className="border border-border/50 rounded-lg p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-green-100/50 dark:bg-green-900/20 flex items-center justify-center">
          <CheckCircle className="h-6 w-6 text-green-500" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Problems Done</p>
          <div className="mt-1 flex items-baseline">
            <span className="text-xl font-bold">{isLoading ? "..." : totalSolved}</span>
            <span className="ml-1 text-xs text-muted-foreground">/ {isLoading ? "..." : totalAvailable}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span>Easy: {easyPercentage}%</span>
            <span>Medium: {mediumPercentage}%</span>
            <span>Hard: {hardPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Contest Participation */}
      <div className="border border-border/50 rounded-lg p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-blue-100/50 dark:bg-blue-900/20 flex items-center justify-center">
          <Trophy className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Contest Participation</p>
          <div className="mt-1 flex items-baseline">
            <span className="text-xl font-bold">0</span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span>Coming Soon</span>
          </div>
        </div>
      </div>

      {/* Global Ranking */}
      <div className="border border-border/50 rounded-lg p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-purple-100/50 dark:bg-purple-900/20 flex items-center justify-center">
          <BarChart3 className="h-6 w-6 text-purple-500" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Global Ranking</p>
          <div className="mt-1 flex items-baseline">
            <span className="text-xl font-bold">#{profile?.globalRank || '-'}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span>Rating: {profile?.currentRating || 0}</span>
            <span>
              Top{" "}
              {profile?.ranking && profile?.ranking <= 100
                ? profile?.ranking
                : Math.round((profile?.ranking || 0) / 100) * 100}
            </span>
          </div>
        </div>
      </div>

      {/* Challenge Stats */}
      <div className="border border-border/50 rounded-lg p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-amber-100/50 dark:bg-amber-900/20 flex items-center justify-center">
          <Puzzle className="h-6 w-6 text-amber-500" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Challenge Stats</p>
          <div className="mt-1 flex items-baseline">
            <span className="text-xl font-bold">0</span>
            <span className="ml-1 text-xs text-muted-foreground">challenges</span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span>Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
