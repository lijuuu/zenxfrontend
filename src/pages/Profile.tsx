import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Puzzle, Trophy, Github, Globe, MapPin, Clock, BarChart3, Activity, User, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getChallenges } from "@/api/challengeApi";
import { Challenge } from "@/api/types";
import { useIsMobile } from "@/hooks/use-mobile";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ChallengesList from "@/components/profile/ChallengesList";
import MonthlyActivityHeatmap from "@/components/activity/MonthlyActivityHeatmap";
import ProblemsSolvedChart from "@/components/profile/ProblemsSolvedChart";
import RecentSubmissions from "@/components/profile/RecentSubmissions";
import ProfileAchievements from "@/components/profile/ProfileAchievements";
import MainNavbar from "@/components/common/MainNavbar";
import { useGetUserProfile } from "@/services/useGetUserProfile";
import { useLeaderboard } from "@/hooks";
import { Link } from "react-router-dom";
import { useProblemStats } from "@/services/useProblemStats";
import { useOwner } from "@/hooks/useOwner";

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    error,
  } = useGetUserProfile({ username });

  const { ownerUserID } = useOwner();

  // Check if the current user is the profile owner
  const isOwner = profile?.userID && ownerUserID ? profile.userID === ownerUserID : false;

  if (profileError) {
    toast({ title: "Failed to load profile", description: error.message });
  }

  // Fetch leaderboard data for this user on component mount
  const { data: leaderboardData } = useLeaderboard(profile?.userID);

  useEffect(() => {
    const loadChallenges = async () => {
      if (profile?.userID) {
        try {
          const userChallenges = await getChallenges({ userId: profile.userID });
          setChallenges(userChallenges || []);
        } catch (error) {
          console.error("Failed to load user challenges:", error);
          toast({
            title: "Error",
            description: "Failed to load user challenges. Please try again.",
            variant: "destructive",
          });
        }
      }
    };

    // if (!username) return;
    loadChallenges();
  }, [profile?.userID, username, toast]);

  // Count private and public challenges
  const privateChallenges = Array.isArray(challenges)
    ? challenges.filter((c) => c.isPrivate).length
    : 0;

  const publicChallenges = Array.isArray(challenges)
    ? challenges.filter((c) => !c.isPrivate).length
    : 0;


  if (profileLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white pt-5 pb-8">
        <MainNavbar />
        <div className="page-container pt-16">
          <Card className="w-full max-w-6xl mx-auto">
            <CardHeader>
              <div className="h-24 w-full animate-pulse bg-zinc-800 rounded-md"></div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-20 animate-pulse bg-zinc-800 rounded-md"></div>
                <div className="h-20 animate-pulse bg-zinc-800 rounded-md"></div>
                <div className="h-20 animate-pulse bg-zinc-800 rounded-md"></div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-40 animate-pulse bg-zinc-800 rounded-md"></div>
                <div className="h-40 animate-pulse bg-zinc-800 rounded-md"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white pt-5 pb-8">
        <MainNavbar />
        <div className="page-container pt-16">
          <Card className="w-full max-w-6xl mx-auto">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Failed to load profile</p>
              <Button
                className="mt-4 bg-green-500 hover:bg-green-600 text-white"
                onClick={() => navigate("/dashboard")}
              >
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <MainNavbar />
      <main className="pt-20 pb-8">
        <div className="page-container">
          <div className="w-full max-w-6xl mx-auto">
            {/* Profile Overview */}
            <Card className="mb-6 bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
              <CardContent className="p-6">
                <ProfileHeader
                  profile={profile}
                  userID={profile?.userID}
                  showStats={true}
                  isOwner={isOwner}
                />
              </CardContent>
            </Card>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-8 space-y-6">
                {/* Problems Solved Chart */}
                <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-green-500" /> Problems Done
                    </CardTitle>
                    <CardDescription>Progress across difficulty levels</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <ProblemsSolvedChart profile={profile} />
                  </CardContent>
                </Card>

                {/* Recent Submissions */}
                <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-500" /> Recent Submissions
                    </CardTitle>
                    <CardDescription>Latest coding activity</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <RecentSubmissions userId={profile.userID} />
                  </CardContent>
                </Card>

                {/* Achievements */}
                {profile.badges && profile.badges.length > 0 && (
                  <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-amber-500" /> Achievements
                      </CardTitle>
                      <CardDescription>Badges and recognitions</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <ProfileAchievements badges={profile.badges || []} />
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Column */}
              <div className="lg:col-span-4 space-y-6">
                {/* Monthly Activity Heatmap */}
                <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-500" /> Monthly Activity
                    </CardTitle>
                    <CardDescription>Coding patterns and consistency</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <MonthlyActivityHeatmap
                      userID={profile.userID}
                      showTitle={false}
                      staticMode={false}
                      variant="profile"
                      compact={true}
                    />
                  </CardContent>
                </Card>

                {/* Challenges Card */}
                {/* Challenges Card */}
                {(
                  <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Puzzle className="h-5 w-5 text-amber-500" /> Challenges
                      </CardTitle>
                      <CardDescription>
                        Total: {challenges.length} ({publicChallenges} public, {privateChallenges} private)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {challenges.length > 0 ? (
                        <ChallengesList challenges={challenges} />
                      ) : (
                        <div className="text-center py-6" role="alert" aria-live="polite">
                          <Puzzle className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                          <h3 className="text-lg font-medium">No challenges available</h3>
                          <p className="text-muted-foreground mt-1">
                            Join or create challenges to get started
                          </p>
                          <Button className="mt-4 bg-green-500 hover:bg-green-600 text-white">
                            <Puzzle className="mr-2 h-4 w-4" />
                            Explore Challenges
                          </Button>
                        </div>
                      )}
                      <div className="mt-4 pt-4 border-t border-zinc-700/50">
                        <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                          <Puzzle className="mr-2 h-4 w-4" />
                          View All Challenges
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Top Performers from Leaderboard */}
                {leaderboardData?.TopKGlobal && leaderboardData.TopKGlobal.length > 0 && (
                  <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-amber-500" />
                        Top Performers
                      </CardTitle>
                      <CardDescription>This week's leading coders</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {leaderboardData.TopKGlobal.slice(0, 5).map((entry, index) => (
                          <div key={entry?.UserName} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-zinc-900 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium">
                                {index === 0 ? (
                                  <Trophy className="h-3.5 w-3.5 text-amber-500" />
                                ) : (
                                  <span className="text-zinc-400">{index + 1}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                  <img
                                    src={entry.AvatarURL}
                                    alt={entry.UserName}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium text-sm">{entry.UserName}</div>
                                  <div className="text-xs text-zinc-500">{entry.Entity.toUpperCase()}</div>
                                </div>
                              </div>
                            </div>
                            <div className="font-semibold text-sm">{entry.Score.toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                      <Link
                        to="/leaderboard"
                        className="mt-4 flex items-center text-sm text-green-400 hover:text-green-300 transition-colors group"
                      >
                        View full leaderboard
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </CardContent>
                  </Card>
                )}

                {/* Links & Info Card */}
                {(profile.website || profile.githubProfile || profile.location) && (
                  <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Links & Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {profile.website && (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                        >
                          <Globe className="h-4 w-4" />
                          <span className="text-sm truncate">{profile.website}</span>
                        </a>
                      )}
                      {profile.githubProfile && (
                        <a
                          href={`https://github.com/${profile.githubProfile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                        >
                          <Github className="h-4 w-4" />
                          <span className="text-sm truncate">{profile.githubProfile}</span>
                        </a>
                      )}
                      {profile.location && (
                        <div className="flex items-center gap-2 text-zinc-400">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{profile.location}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;