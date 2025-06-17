/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Trophy, Users, Code, Zap, Plus, Play, User, ChevronRight, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import StatsCard from '@/components/common/StatsCard';
import MonthlyActivityHeatmap from '@/components/activity/MonthlyActivityHeatmap';
import ClearInactivityCard from '@/components/common/ClearInactivityCard';
import MainNavbar from '@/components/common/MainNavbar';
import { useLeaderboard } from '@/hooks';
import { useGetUserProfile } from "@/services/useGetUserProfile";
import { useEffect, useState } from 'react';
import { useMonthlyActivity } from '@/services/useMonthlyActivityHeatmap';
import { format, startOfWeek, endOfWeek, parseISO, isWithinInterval } from 'date-fns';
import { calculateStreak } from '@/utils/streakcalcUtils';
import { useProblemStats } from '@/services/useProblemStats';

// Loading Screen Component
const LoadingScreen = () => (
  <div className="fixed inset-0 bg-zinc-900 flex items-center justify-center z-50">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
      <p className="text-zinc-400 text-lg">Loading Dashboard...</p>
    </div>
  </div>
);



const Dashboard = React.memo(() => {
  const navigate = useNavigate();
  const now = new Date();
  const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const currentMonth = currentDate.getMonth() + 1; // 4 (April)
  const currentYear = currentDate.getFullYear(); // 2025

  // Combine queries to track loading state
  const {
    data: userProfile,
    isLoading: profileLoading,
    isError: profileError,
    error: profileErrorDetail,
  } = useGetUserProfile();

  const userId = userProfile?.userID || localStorage.getItem('userid');
  const { data: leaderboardData, isLoading: leaderboardLoading } = useLeaderboard(userId);
  const { data: problemStats, isLoading: statsLoading } = useProblemStats(userId);
  const { data: monthlyActivityData, isLoading: activityLoading } = useMonthlyActivity(userId || '', currentMonth, currentYear);

  const [weeklyContributions, setWeeklyContributions] = useState(0);
  const [weekLabel, setWeekLabel] = useState('');
  const [dayStreak, setDayStreak] = useState(0);

  // Calculate total loading state
  const isLoading = profileLoading || leaderboardLoading || statsLoading || activityLoading;
  const hasError = profileError;

  // Save userID to localStorage
  useEffect(() => {
    if (userProfile?.userID) {
      // console.log("Dashboard - useEffect - Saving userID to localStorage:", userProfile.userID);
      localStorage.setItem('userid', userProfile.userID);
    }
  }, [userProfile?.userID]);

  // Calculate weekly contributions and streak
  useEffect(() => {
    if (monthlyActivityData && !activityLoading) {
      // console.log("Dashboard - useEffect - Starting streak and contributions calculation");
      // console.log("Dashboard - useEffect - Monthly Activity Data:", JSON.stringify(monthlyActivityData, null, 2));

      const today = currentDate;
      const weekStart = startOfWeek(today);
      const weekEnd = endOfWeek(today);
      // console.log(
      //   "Dashboard - useEffect - Week Range - Start (local timezone):",
      //   weekStart.toString(),
      //   "End (local timezone):",
      //   weekEnd.toString()
      // );

      const weekLabelValue = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`;
      // console.log("Dashboard - useEffect - Setting Week Label:", weekLabelValue);
      setWeekLabel(weekLabelValue);

      const contributionsThisWeek = monthlyActivityData.reduce((count, day) => {
        const date = parseISO(day.date);
        const isInWeek = isWithinInterval(date, { start: weekStart, end: weekEnd });
        console.log(
          "Dashboard - useEffect - Checking Contribution for Day:",
          day.date,
          "Is in Week:",
          isInWeek,
          "Count:",
          day.count || 0
        );
        if (isInWeek && day.count > 0) {
          console.log(
            "Dashboard - useEffect - Adding contribution for",
            day.date,
            "Count:",
            day.count,
            "New Total:",
            count + day.count
          );
          return count + day.count;
        }
        return count;
      }, 0);
      // console.log("Dashboard - useEffect - Total Contributions This Week:", contributionsThisWeek);
      setWeeklyContributions(contributionsThisWeek);

      const streak = calculateStreak(monthlyActivityData, currentDate);
      // console.log("Dashboard - useEffect - Calculated Streak:", streak);
      setDayStreak(streak);
    }
  }, [monthlyActivityData, activityLoading]);

  const totalProblemsDone = problemStats
    ? problemStats.doneEasyCount + problemStats.doneMediumCount + problemStats.doneHardCount
    : 0;

  // Show loading screen if any query is loading
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show error message if any query fails
  if (hasError) {
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
    <div className="min-h-screen ">
      <MainNavbar />
      <main className="pt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="pt-6 pb-10">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-white">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCard
                  className="hover:scale-105 transition-transform duration-200 ease-in-out"
                  title="Problems Done"
                  value={totalProblemsDone}
                  change={statsLoading ? "Loading..." : ""}
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
                  value={leaderboardData?.GlobalRank ? `#${leaderboardData.GlobalRank}` : "-"}
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
                          <div className="font-medium text-white">Quick Match</div>
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
                          <div className="font-medium text-white">Challenge a Friend</div>
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

              <ClearInactivityCard referralLink={userProfile?.referralLink} />
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
                        src={userProfile?.avatarURL || userProfile?.profileImage}
                        alt={userProfile?.userName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-white">{userProfile?.firstName} {userProfile?.lastName}</h3>
                      <p className="text-zinc-400">@{userProfile?.userName}</p>
                    </div>
                  </div>

                  {userProfile?.bio && (
                    <p className="text-sm text-zinc-300 mb-4 line-clamp-3">{userProfile.bio}</p>
                  )}

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