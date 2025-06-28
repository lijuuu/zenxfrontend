import React, { useState, useEffect } from "react";
import { UserProfile } from "@/api/types";
import { useToast } from "@/hooks/use-toast";
import {
  Edit,
  Copy,
  CalendarDays,
  BarChart3,
  Clock,
  Trophy,
  Award,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";
import { useMonthlyActivity } from "@/services/useMonthlyActivityHeatmap";
import { useLeaderboard } from "@/hooks";
import { parseISO, startOfWeek, endOfWeek, isWithinInterval, format } from "date-fns";
import { useProblemStats } from "@/hooks/useProblemStats";
import { useOwner } from "@/hooks/useOwner";
import { formatDate } from "@/utils/formattedDate";
import { calculateStreak } from "@/utils/streakcalcUtils";

interface ProfileHeaderProps {
  profile: UserProfile;
  userID?: string;
  showStats?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = React.memo(({ profile, userID, showStats = true }) => {
  const { toast } = useToast();
  const [dayStreak, setDayStreak] = useState(0);
  const navigate = useNavigate();

  // Hook providing current owner user ID
  const { ownerUserID } = useOwner();

  // Get leaderboard data
  const { data: leaderboardData } = useLeaderboard(profile.userID);

  // Get problem stats data
  const { problemStats } = useProblemStats(profile.userID);

  const now = new Date();
  const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const currentMonth = currentDate.getMonth() + 1; // 1-12
  const currentYear = currentDate.getFullYear(); // e.g., 2025

  // Fetch monthly activity data to calculate streak
  const { data: monthlyActivityData, isLoading: activityLoading } = useMonthlyActivity(
    profile.userID || "",
    currentMonth,
    currentYear
  );

  // Calculate problems done
  const problemsDone = problemStats
    ? problemStats.doneEasyCount + problemStats.doneMediumCount + problemStats.doneHardCount
    : profile.stats
      ? (profile.stats.easy?.solved || 0) + (profile.stats.medium?.solved || 0) + (profile.stats.hard?.solved || 0)
      : profile.problemsSolved || 0;

  // Calculate day streak
  useEffect(() => {
    if (monthlyActivityData && !activityLoading) {
      console.log("ProfileHeader - useEffect - Monthly Activity Data:", JSON.stringify(monthlyActivityData, null, 2));
      const streak = calculateStreak(monthlyActivityData, currentDate);
      console.log("ProfileHeader - use  - Calculated Streak:", streak);
      setDayStreak(streak);
    }
  }, [monthlyActivityData, activityLoading, currentDate]);

  // Use ownership from useOwner hook
  const isOwnProfile = ownerUserID === profile.userID;

  const handleCopyUsername = () => {
    navigator.clipboard.writeText(profile.userName);
    toast({
      title: "Username copied",
      description: `@${profile.userName} copied to clipboard`,
    });
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    const fullNameChars = `${profile.firstName} ${profile.lastName}`
      .split(" ")
      .map((n) => n[0])
      .join("");
    if (fullNameChars) return fullNameChars;
    if (profile.userName) return profile.userName.charAt(0).toUpperCase();
    return "U";
  };

  // Calculate contest participation
  const contestsParticipated =
    (profile.achievements?.weeklyContests || 0) +
    (profile.achievements?.monthlyContests || 0) +
    (profile.achievements?.specialEvents || 0);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex flex-col items-center md:items-start">
        <div className="relative">
          <Avatar className="h-24 w-24 border-4 border-background shadow-md">
            <AvatarImage
              src={profile?.profileImage || profile.avatarURL || "https://res.cloudinary.com/dcfoqhrxb/image/upload/v1751096235/demo/avatar_rlqkrp.jpg"}
              alt={profile.firstName + " " + profile.lastName}
            />
            <AvatarFallback className="text-xl font-bold">{getInitials()}</AvatarFallback>
          </Avatar>

          {profile.isOnline && (
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background"></span>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col md:items-start items-center text-center md:text-left">
        <div className="flex flex-wrap gap-2 items-center">
          <h1 className="text-2xl font-bold">
            {profile.firstName} {profile.lastName}
          </h1>

          {profile.ranking && profile.ranking <= 100 && (
            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-300 text-zinc-900">
              Top {profile.ranking}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1 mt-1">
          <span className="text-lg text-muted-foreground font-medium">@{profile.userName}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyUsername}>
                  <Copy className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy username</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex gap-2 mt-3">
          {profile.country && (
            <>
              <img
                src={`https://flagcdn.com/24x18/${profile.country?.toLowerCase()}.png`}
                alt={profile.country}
                className="h-5 rounded"
              />
              <p>{profile.country.toUpperCase()}</p>
            </>
          )}
        </div>

        {profile.bio && <p className="mt-2 text-muted-foreground">{profile.bio}</p>}

        <div className="flex flex-wrap items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>Joined {formatDate(profile?.createdAt)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {isOwnProfile ? (
            <Button
              variant="outline"
              className="flex items-center gap-1.5"
              onClick={() => navigate("/settings")}
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <Button variant="outline" onClick={() => navigate("/chat")} className="text-white">
              Message
            </Button>
          )}
        </div>
      </div>

      {showStats && (
        <div className="md:ml-auto w-full md:w-auto mt-4 md:mt-0">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col items-center p-3 border border-border/50 rounded-lg bg-zinc-800/30 min-w-[120px]">
              <BarChart3 className="h-4 w-4 text-green-400 mb-1" />
              <span className="text-xl font-bold">{problemsDone}</span>
              <span className="text-xs text-muted-foreground">Problems Done</span>
            </div>

            <div className="flex flex-col items-center p-3 border border-border/50 rounded-lg bg-zinc-800/30 min-w-[120px]">
              <Clock className="h-4 w-4 text-amber-400 mb-1" />
              <span className="text-xl font-bold">{dayStreak}</span>
              <span className="text-xs text-muted-foreground">Day Streak</span>
            </div>

            <div className="flex flex-col items-center p-3 border border-border/50 rounded-lg bg-zinc-800/30 min-w-[120px]">
              <Trophy className="h-4 w-4 text-amber-500 mb-1" />
              <span className="text-xl font-bold">
                #{leaderboardData?.GlobalRank || "-"}
              </span>
              <span className="text-xs text-muted-foreground">Global Rank</span>
            </div>

            <div className="flex flex-col items-center p-3 border border-border/50 rounded-lg bg-zinc-800/30 min-w-[120px]">
              <Award className="h-4 w-4 text-blue-400 mb-1" />
              <span className="text-xl font-bold">{contestsParticipated}</span>
              <span className="text-xs text-muted-foreground">Challenges</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default ProfileHeader;