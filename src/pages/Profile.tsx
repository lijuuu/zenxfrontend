
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Puzzle, Trophy, Github, Globe, MapPin, Clock, BarChart3, Activity, User,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getUserChallenges } from "@/api/challengeApi";
import { Challenge } from "@/api/types";
import { useIsMobile } from "@/hooks/use-mobile";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ChallengesList from "@/components/profile/ChallengesList";
import MonthlyActivityHeatmap from "@/components/activity/MonthlyActivityHeatmap";
import ProblemsSolvedChart from "@/components/profile/ProblemsSolvedChart";
import RecentSubmissions from "@/components/profile/RecentSubmissions";
import ProfileAchievements from "@/components/profile/ProfileAchievements";
import MainNavbar from "@/components/common/MainNavbar";
import { useGetUserProfile } from "@/services/useGetUserProfile";
import { useLeaderboard } from "@/hooks";
import { Link } from "react-router-dom";
import StatsCard from "@/components/common/StatsCard";

const Profile = () => {
  const { userID } = useParams<{ userID: string }>();
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    error
  } = useGetUserProfile(userID);

  // Fetch leaderboard data for this user
  const { data: leaderboardData } = useLeaderboard(profile?.userID);

  useEffect(() => {
    const loadChallenges = async () => {
      if (profile) {
        try {
          const userChallenges = await getUserChallenges(profile.userID);
          setChallenges(userChallenges);
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

    loadChallenges();
  }, [profile, toast]);

  // Count private and public challenges
  const privateChallenges = challenges.filter(c => c.isPrivate).length;
  const publicChallenges = challenges.filter(c => !c.isPrivate).length;

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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="h-64 animate-pulse bg-zinc-800 rounded-md"></div>
                <div className="h-64 animate-pulse bg-zinc-800 rounded-md"></div>
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
                className="mt-4 bg-green-500 hover:bg-green-600"
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
                {/* Profile Header Section */}
                <ProfileHeader profile={profile} userID={userID} />
              </CardContent>
            </Card>

            {/* Stats Cards - Similar to Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatsCard
                className="hover:scale-105 transition-transform duration-200 ease-in-out"
                title="Problems Solved"
                value={profile.problemsSolved || 0}
                icon={<BarChart3 className="h-4 w-4 text-green-400" />}
              />
              <StatsCard
                className="hover:scale-105 transition-transform duration-200 ease-in-out"
                title="Current Streak"
                value={`${profile.dayStreak || 0} days`}
                icon={<Clock className="h-4 w-4 text-amber-400" />}
              />
              {leaderboardData?.GlobalRank && (
                <StatsCard
                  className="hover:scale-105 transition-transform duration-200 ease-in-out"
                  title="Global Rank"
                  value={`#${leaderboardData.GlobalRank}`}
                  icon={<Trophy className="h-4 w-4 text-amber-500" />}
                />
              )}
              {leaderboardData?.Score && (
                <StatsCard
                  className="hover:scale-105 transition-transform duration-200 ease-in-out"
                  title="Current Rating"
                  value={leaderboardData.Score}
                  icon={<User className="h-4 w-4 text-blue-400" />}
                />
              )}
            </div>

            {/* Monthly Activity Heatmap - Interactive mode */}
            <Card className="mb-6 bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" /> Monthly Activity
                </CardTitle>
                <CardDescription>
                  Coding patterns and consistency
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <MonthlyActivityHeatmap 
                  userID={profile.userID} 
                  showTitle={false} 
                  staticMode={false} 
                  variant="profile" 
                />
              </CardContent>
            </Card>

            {/* Activity & Challenges Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column - Problems Solved */}
              <div className="lg:col-span-8 space-y-6">
                <Tabs defaultValue="problems" className="w-full">
                  <TabsList className="w-full justify-start bg-zinc-800 border-zinc-700">
                    <TabsTrigger value="problems" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">Problems Solved</TabsTrigger>
                    <TabsTrigger value="submissions" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">Recent Submissions</TabsTrigger>
                    <TabsTrigger value="achievements" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">Achievements</TabsTrigger>
                  </TabsList>

                  <TabsContent value="problems" className="mt-4">
                    <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
                      <CardContent className="p-4">
                        <ProblemsSolvedChart profile={profile} />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="submissions" className="mt-4">
                    <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
                      <CardContent className="p-4">
                        <RecentSubmissions userId={profile.userID} />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="achievements" className="mt-4">
                    <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
                      <CardContent className="p-4">
                        <ProfileAchievements badges={profile.badges || []} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Column - Challenges and Top Performers */}
              <div className="lg:col-span-4 space-y-6">
                {/* Challenges Card */}
                <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-amber-500" /> Challenges
                    </CardTitle>
                    <CardDescription>
                      Total: {challenges.length} ({publicChallenges} public, {privateChallenges} private)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChallengesList challenges={challenges} />

                    <div className="mt-4 pt-4 border-t border-zinc-700/50">
                      <Button className="w-full bg-green-500 hover:bg-green-600">
                        <Puzzle className="mr-2 h-4 w-4" />
                        View All Challenges
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Performers from Leaderboard (if available) */}
                {leaderboardData?.TopKGlobal && leaderboardData.TopKGlobal.length > 0 && (
                  <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-amber-500" />
                        Top Performers
                      </CardTitle>
                      <CardDescription>
                        This week's leading coders
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {leaderboardData.TopKGlobal.slice(0, 5).map((entry, index) => (
                          <div key={entry.UserId} className="flex items-center justify-between">
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

                      <Link to="/leaderboard" className="mt-4 flex items-center text-sm text-green-400 hover:text-green-300 transition-colors group">
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
