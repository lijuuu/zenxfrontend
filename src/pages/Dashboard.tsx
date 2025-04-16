
import { useQuery } from '@tanstack/react-query';
import { Trophy, Users, Code, Zap, Plus, Play, User, ChevronRight, Award, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import StatsCard from '@/components/common/StatsCard';
import MonthlyActivityHeatmap from '@/components/activity/MonthlyActivityHeatmap';
import ClearInactivityCard from '@/components/common/ClearInactivityCard';
import MainNavbar from '@/components/common/MainNavbar';
import { useLeaderboard } from '@/hooks';
import { useGetUserProfile } from "@/services/useGetUserProfile";
import { useEffect } from 'react';

const Dashboard = () => {
  const {
    data: userProfile,
    isLoading: profileLoading,
    isError: profileError,
    error
  } = useGetUserProfile();

  // Fetch top performers with the useLeaderboard hook
  const { data: leaderboardData } = useLeaderboard(userProfile?.userID);

  // Save userID to localStorage whenever it changes
  useEffect(() => {
    if (userProfile?.userID) {
      localStorage.setItem('userid', userProfile.userID);
    }
  }, [userProfile?.userID]);

  // Navigate to other pages
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <MainNavbar/>
      <main className="pt-16 pb-16">
        <div className="page-container">
          {/* Welcome Section */}
          <section className="pt-6 pb-10">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome back, {userProfile?.userName || 'Coder'}
                </h1>
                <p className="text-zinc-400 mt-1">
                  Continue improving your coding skills and climb the ranks
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="bg-green-500 hover:bg-green-600 gap-2" onClick={() => navigate("/challenges")}>
                  <Plus className="h-4 w-4" />
                  Create Challenge
                </Button>

                <Link to="/problems">
                  <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800 gap-2">
                    <Code className="h-4 w-4" />
                    Practice Problems
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Stats & Activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 ">
                <StatsCard
                  className="hover:scale-105 transition-transform duration-200 ease-in-out"
                  title="Problems Solved"
                  value={userProfile?.problemsSolved || 0}
                  change="+0 this week"
                  icon={<Code className="h-4 w-4 text-green-400" />}
                />
                <StatsCard
                  className="hover:scale-105 transition-transform duration-200 ease-in-out"
                  title="Current Streak"
                  value={`${userProfile?.dayStreak || 0} days`}
                  icon={<Zap className="h-4 w-4 text-amber-400" />}
                />
                <StatsCard
                  className="hover:scale-105 transition-transform duration-200 ease-in-out"
                  title="Global Rank"
                  value={leaderboardData?.GlobalRank ? `#${leaderboardData.GlobalRank}` : "-"}
                  change="0"
                  icon={<Trophy className="h-4 w-4 text-amber-500" />}
                />
                <StatsCard
                  className="hover:scale-105 transition-transform duration-200 ease-in-out"
                  title="Current Rating"
                  value={leaderboardData?.Score || 0}
                  change="+15"
                  icon={<Award className="h-4 w-4 text-blue-400" />}
                />
              </div>

              {/* Monthly Activity View */}
              <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-400" />
                    Monthly Activity
                  </CardTitle>
                  <CardDescription>
                    Coding patterns and consistency
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MonthlyActivityHeatmap userID={userProfile?.userID} showTitle={false} />
                </CardContent>
              </Card>

              {/* 1v1 Challenges */}
              <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-400" />
                    1v1 Challenges
                  </CardTitle>
                  <CardDescription>
                    Challenge friends or random opponents
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-zinc-800/70 backdrop-blur-sm border border-zinc-700/50 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-green-500/10 p-2 rounded-lg">
                          <Play className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                          <div className="font-medium">Quick Match</div>
                          <div className="text-sm text-zinc-400">Find an opponent with similar skill</div>
                        </div>
                      </div>
                      <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => navigate("/challenges")}>
                        Start
                      </Button>
                    </div>

                    <div className="bg-zinc-800/70 backdrop-blur-sm border border-zinc-700/50 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-500/10 p-2 rounded-lg">
                          <User className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium">Challenge a Friend</div>
                          <div className="text-sm text-zinc-400">Send a challenge to a specific user</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-zinc-700 hover:bg-zinc-700" onClick={() => navigate("/challenges")}>
                        Select
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Clear Recent Inactivity */}
              <ClearInactivityCard referralLink={userProfile?.referralLink}/>
            </div>

            {/* Right Column - Activity & Leaderboard */}
            <div className="space-y-6">
              {/* Profile Summary Card */}
              <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-400" />
                    Your Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-700">
                      <img
                        src={userProfile?.avatarURL || userProfile?.profileImage}
                        alt={userProfile?.userName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{userProfile?.firstName} {userProfile?.lastName}</h3>
                      <p className="text-zinc-400">@{userProfile?.userName}</p>
                    </div>
                  </div>
                  
                  {userProfile?.bio && (
                    <p className="text-sm text-zinc-300 mb-4 line-clamp-3">{userProfile.bio}</p>
                  )}

                  <Link to="/profile">
                    <Button className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700">
                      View Full Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Leaderboard Preview */}
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
                    {leaderboardData?.TopKGlobal?.slice(0, 5).map((entry, index) => (
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
