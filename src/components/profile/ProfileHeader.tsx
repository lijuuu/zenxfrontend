import React, { useState, useEffect } from "react";
import { UserProfile } from "@/api/types";
import { useToast } from "@/hooks/use-toast";
import {
  Edit,
  Copy,
  UserPlus,
  UserMinus,
  Loader2,
  CalendarDays,
  BarChart3,
  Clock,
  Trophy,
  User,
  Award
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
import { useSelector } from "react-redux";
import { useMonthlyActivity } from "@/services/useMonthlyActivityHeatmap";
import { useLeaderboard } from "@/hooks";
import { parseISO, isSameDay, subDays } from "date-fns";
import { useProblemStats } from "@/hooks/useProblemStats";
import FollowersModal from "./FollowersModal";
import { useIsFollowing, useFollowAction, useFollowers, useFollowing } from "@/hooks/useFollow";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProfileHeaderProps {
  profile: UserProfile;
  userID?: string;
  showStats?: boolean;
  isOwner?:boolean
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, userID, showStats = true, isOwner = false }) => {
  const { toast } = useToast();
  const [showUnfollowDialog, setShowUnfollowDialog] = useState(false);
  const [dayStreak, setDayStreak] = useState(0);
  const authState = useSelector((state: any) => state.auth);

  // Get leaderboard data
  const { data: leaderboardData } = useLeaderboard(profile.userID);

  // Get problem stats data
  const { problemStats } = useProblemStats(profile.userID);

  // Get current month and year for activity data
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Fetch monthly activity data to calculate streak
  const monthlyActivity = useMonthlyActivity(
    profile.userID || '', 
    currentMonth,
    currentYear
  );

  // Calculate problems done
  const problemsDone = problemStats 
    ? problemStats.doneEasyCount + problemStats.doneMediumCount + problemStats.doneHardCount
    : profile.stats 
      ? (profile.stats.easy?.solved || 0) + (profile.stats.medium?.solved || 0) + (profile.stats.hard?.solved || 0)
      : profile.problemsSolved || 0;

  // Calculate day streak based on continuous active days
  useEffect(() => {
    if (monthlyActivity.data?.data) {
      // Sort days by date in descending order (most recent first)
      const sortedDays = [...monthlyActivity.data.data]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      let currentStreak = 0;
      let currentDate = new Date();
      
      // Check each day going backward from today
      while (true) {
        // Find if there's an activity for this day
        const dayActivity = sortedDays.find(day => 
          isSameDay(parseISO(day.date), currentDate) && day.count > 0
        );
        
        if (dayActivity) {
          currentStreak++;
          currentDate = subDays(currentDate, 1); // Move to previous day
        } else {
          break; // Break the streak when finding a day with no activity
        }
      }
      
      setDayStreak(currentStreak);
    }
  }, [monthlyActivity.data]);

  // Follow state logic
  const { data: isFollowingData, refetch: refetchIsFollowing } = useIsFollowing(profile.userID);
  const { follow, unfollow, isLoading: followActionLoading } = useFollowAction(profile.userID || "");
  // For showing modals
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  // For followers/following modal lists
  const { data: followers = [], refetch: refetchFollowers } = useFollowers(profile.userID, followersOpen);
  const { data: following = [], refetch: refetchFollowing } = useFollowing(profile.userID, followingOpen);

  const isOwnProfile = !userID || userID === profile.userID ||
    (authState.userProfile && (userID === authState.userProfile.userID || userID === authState.userID));

  const handleCopyUsername = () => {
    navigator.clipboard.writeText(profile.userName);
    toast({
      title: "Username copied",
      description: `@${profile.userName} copied to clipboard`,
    });
  };

  const handleFollow = async () => {
    if (!profile.userID) return;
    try {
      if (isFollowingData) {
        setShowUnfollowDialog(true);
      } else {
        await follow();
        toast({
          title: "Followed",
          description: `You are now following @${profile.userName}`,
        });
        refetchIsFollowing();
        refetchFollowers();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
      });
    }
  };

  const confirmUnfollow = async () => {
    try {
      await unfollow();
      toast({
        title: "Unfollowed",
        description: `You unfollowed @${profile.userName}`,
      });
      refetchIsFollowing();
      refetchFollowers();
      setShowUnfollowDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unfollow user",
        variant: "destructive",
      });
    }
  };

  const navigate = useNavigate();

  // Get initials for avatar fallback
  const getInitials = () => {
    const fullNameChars = `${profile.firstName} ${profile.lastName}`.split(' ').map(n => n[0]).join('');
    if (fullNameChars) return fullNameChars;
    if (profile.userName) return profile.userName.charAt(0).toUpperCase();
    return "U";
  };

  // Calculate contest participation
  const contestsParticipated = (profile.achievements?.weeklyContests || 0) + 
                              (profile.achievements?.monthlyContests || 0) + 
                              (profile.achievements?.specialEvents || 0);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex flex-col items-center md:items-start">
        <div className="relative">
          <Avatar className="h-24 w-24 border-4 border-background shadow-md">
            <AvatarImage src={profile?.profileImage || profile.avatarURL} alt={profile.firstName + ' ' + profile.lastName} />
            <AvatarFallback className="text-xl font-bold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          {profile.isOnline && (
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background"></span>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col md:items-start items-center text-center md:text-left">
        <div className="flex flex-wrap gap-2 items-center">
          <h1 className="text-2xl font-bold">{profile.firstName} {profile.lastName}</h1>

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
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleCopyUsername}
                >
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

        {profile.bio && (
          <p className="mt-2 text-muted-foreground">{profile.bio}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>Joined {new Date(profile.joinedDate || profile.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-sm underline decoration-dotted hover:text-green-400 transition" onClick={() => setFollowersOpen(true)}>
              <strong>{profile.followers}</strong> followers
            </button>
            <button className="text-sm underline decoration-dotted hover:text-green-400 transition" onClick={() => setFollowingOpen(true)}>
              <strong>{profile.following}</strong> following
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {isOwnProfile ? (
            <Button variant="outline" className="flex items-center gap-1.5" onClick={() => navigate("/settings")}>
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <Button
              variant={isFollowingData ? "outline" : "default"}
              className={`transition font-semibold px-6 py-2 rounded-lg shadow-sm ${
                isFollowingData
                  ? "border border-green-400 text-green-500 hover:bg-green-500/10"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
              onClick={handleFollow}
              disabled={followActionLoading}
            >
              {followActionLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : isFollowingData ? (
                <UserMinus className="h-4 w-4 mr-2" />
              ) : (
                <UserPlus className="h-4 w-4 mr-2" />
              )}
              {isFollowingData ? "Following" : "Follow"}
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate("/chat")} className="text-white">
            Message
          </Button>
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
              <span className="text-xl font-bold">#{leaderboardData?.GlobalRank || '-'}</span>
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

      {/* Followers/Following Modals */}
      <FollowersModal
        open={followersOpen}
        onOpenChange={setFollowersOpen}
        users={followers}
        title={"Followers"}
      />
      <FollowersModal
        open={followingOpen}
        onOpenChange={setFollowingOpen}
        users={following}
        title={"Following"}
      />

      {/* Unfollow Confirmation Dialog */}
      <AlertDialog open={showUnfollowDialog} onOpenChange={setShowUnfollowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unfollow {profile.userName}?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unfollow @{profile.userName}? You will no longer see their updates in your feed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmUnfollow}>Unfollow</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfileHeader;
