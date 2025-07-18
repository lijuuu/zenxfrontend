/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Trophy, Users, Code, Zap, Plus, Play, User, ChevronRight, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import StatsCard from '@/components/common/StatsCard';
import MonthlyActivityHeatmap from '@/components/activity/MonthlyActivityHeatmap';
import MainNavbar from '@/components/common/MainNavbar';
import { useLeaderboard } from '@/hooks';
import { useGetUserProfile } from '@/services/useGetUserProfile';
import { useMonthlyActivity } from '@/services/useMonthlyActivityHeatmap';
import { format, startOfWeek, endOfWeek, parseISO, isWithinInterval } from 'date-fns';
import { calculateStreak } from '@/utils/streakcalcUtils';
import { useProblemStats } from '@/services/useProblemStats';
import AvatarHopLoading from '@/components/common/AvatarHopLoading';


// Loading Screen Component


const Dashboard = React.memo(() => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const { data: userProfile, isLoading: profileLoading, isError: profileError, error: profileErrorDetail } = useGetUserProfile();
  const userId = userProfile?.userID || localStorage.getItem('userid');
  const { data: leaderboardData, isLoading: leaderboardLoading } = useLeaderboard(userId);
  const { data: problemStats, isLoading: statsLoading } = useProblemStats(userId);
  const { data: monthlyActivityData, isLoading: activityLoading } = useMonthlyActivity(userId || '', currentMonth, currentYear);

  const [dayStreak, setDayStreak] = useState(0);

  const isLoading = profileLoading || leaderboardLoading || statsLoading || activityLoading;


  useEffect(() => {
    if (monthlyActivityData && !activityLoading) {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      setDayStreak(calculateStreak(monthlyActivityData, currentDate));
    }
  }, [monthlyActivityData, activityLoading]);

  const totalProblemsDone = problemStats ? problemStats.doneEasyCount + problemStats.doneMediumCount + problemStats.doneHardCount : 0;

  if (isLoading) return <AvatarHopLoading />;
  if (profileError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-zinc-400">
          <p>Error loading dashboard: {profileErrorDetail?.message || 'Unknown error'}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <MainNavbar />
      <main className="pt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="pt-6 pb-10">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-white">Welcome back, {userProfile?.userName || 'Coder'}</h1>
                <p className="text-zinc-400 mt-1">Continue improving your coding skills and climb the ranks</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-green-500 hover:bg-green-600 gap-2" onClick={() => navigate('/challenges')}>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCard
                  className="hover:scale-105 transition-transform duration-200 ease-in-out"
                  title="Problems Done"
                  value={totalProblemsDone}
                  icon={<Code className="h-4 w-4 text-green-400" />}
                />   
                <StatsCard
                  className="hover:scale-105 transition-transform duration-200 ease-in-out"
                  title="Current Streak"
                  value={`${dayStreak} day`}
                  icon={<Zap className="h-4 w-4 text-amber-400" />}
                />
                <StatsCard
                  className="hover:scale-105 transition-transform duration-200 ease-in-out"
                  title="Global Rank"
                  value={leaderboardData?.GlobalRank ? `#${leaderboardData.GlobalRank}` : '--'}
                  icon={<Trophy className="h-4 w-4 text-amber-500" />}
                />
                <StatsCard
                  className="hover:scale-105 transition-transform duration-200 ease-in-out"
                  title="Score"
                  value={leaderboardData?.Score || 0}
                  icon={<Award className="h-4 w-4 text-blue-400" />}
                />
              </div>
              <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Users className="h-5 w-5 text-green-400" />
                    1v1 Challenges
                  </CardTitle>
                  <CardDescription>Challenge friends or random opponents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-zinc-800/70 backdrop-blur-sm border border-zinc-700/50 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-green-500/10 p-2 rounded-lg">
                          <Play className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                          <div className="font-medium text-white">Quick Match</div>
                          <div className="text-sm text-zinc-400">Find an opponent with similar skill</div>
                        </div>
                      </div>
                      <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => navigate('/challenges')}>
                        Start
                      </Button>
                    </div>
                    <div className="bg-zinc-800/70 backdrop-blur-sm border border-zinc-700/50 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-500/10 p-2 rounded-lg">
                          <User className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium text-white">Challenge a Friend</div>
                          <div className="text-sm text-zinc-400">Send a challenge to a specific user</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-zinc-700 hover:bg-zinc-700" onClick={() => navigate('/challenges')}>
                        Select
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-white">
                    <User className="h-5 w-5 text-blue-400" />
                    Your Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-700">
                      <img
                        src={userProfile?.avatarURL || userProfile?.profileImage || "https://res.cloudinary.com/dcfoqhrxb/image/upload/v1751096235/demo/avatar_rlqkrp.jpg"}
                        alt={userProfile?.userName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-white">{userProfile?.firstName} {userProfile?.lastName}</h3>
                      <p className="text-zinc-400">@{userProfile?.userName}</p>
                    </div>
                  </div>
                  {userProfile?.bio && <p className="text-sm text-zinc-300 mb-4 line-clamp-3">{userProfile.bio}</p>}
                  <Link to="/profile">
                    <Button className="w-full text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700">
                      View Full Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <MonthlyActivityHeatmap
                userID={userProfile?.userID}
                showTitle={true}
                staticMode={true}
                variant="dashboard"
                compact={true}
                className="w-full"
              />
              <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-white">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Top Performers
                  </CardTitle>
                  <CardDescription>This week's leading coders</CardDescription>
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
                              <img src={entry.AvatarURL || "https://res.cloudinary.com/dcfoqhrxb/image/upload/v1751096235/demo/avatar_rlqkrp.jpg"} alt={entry.UserName} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-medium text-sm text-white">{entry.UserName}</div>
                              <div className="text-xs text-zinc-500">{entry.Entity.toUpperCase()}</div>
                            </div>
                          </div>
                        </div>
                        <div className="font-semibold text-sm text-white">{entry.Score.toLocaleString()}</div>
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
});

export default Dashboard;