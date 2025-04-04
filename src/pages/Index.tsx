
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchUserProfile } from '@/store/slices/userSlice';
import { Trophy, Users, Code, Zap, Plus, Play, User, ChevronRight, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import StatsCard from '@/components/StatsCard';
import MonthlyActivityHeatmap from '@/components/MonthlyActivityHeatmap';
import ClearInactivityCard from '@/components/ClearInactivityCard';
import { getUserProfile } from '@/api/userApi';
import { getProblems } from '@/api/problemApi';
import { getChallenges } from '@/api/challengeApi';
import { getLeaderboard } from '@/api/leaderboardApi';
import { useIsMobile } from '@/hooks/use-mobile';
import MainNavbar from '@/components/MainNavbar';
import { useAccentColor } from '@/contexts/AccentColorContext';

const Index = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector((state) => state.user.profile);
  const isMobile = useIsMobile();
  const { accentColor } = useAccentColor();

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);

    // Load user profile on mount
    dispatch(fetchUserProfile('1'));
  }, [dispatch]);

  // Fetch problem stats with React Query
  const { data: problemStats } = useQuery({
    queryKey: ['problemStats'],
    queryFn: () => getProblems(),
  });

  // Fetch recent challenges with React Query
  const { data: recentChallenges } = useQuery({
    queryKey: ['recentChallenges'],
    queryFn: () => getChallenges(),
  });

  // Fetch top performers with React Query
  const { data: topPerformers } = useQuery({
    queryKey: ['topPerformers'],
    queryFn: () => getLeaderboard({ period: 'weekly' }),
  });

  // Fetch user profile with React Query (separate from Redux for demonstration)
  const { data: userProfileData } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile('1'),
  });

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
                  Welcome back, {userProfile?.username || 'Coder'}
                </h1>
                <p className="text-zinc-400 mt-1">
                  Continue improving your coding skills and climb the ranks
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="accent-color gap-2" onClick={() => navigate("/challenges")}>
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
                  value={userProfileData?.problemsSolved || 147}
                  change="+3 this week"
                  icon={<Code className="h-4 w-4 text-accent" />}
                />
                <StatsCard
                  className="hover:scale-105 transition-transform duration-200 ease-in-out"
                  title="Current Streak"
                  value={`${userProfileData?.dayStreak || 26} days`}
                  icon={<Zap className="h-4 w-4 text-amber-400" />}
                />
                <StatsCard
                  className="hover:scale-105 transition-transform duration-200 ease-in-out"
                  title="Global Rank"
                  value={`#${userProfileData?.ranking || 354}`}
                  change="+12"
                  icon={<Trophy className="h-4 w-4 text-amber-500" />}
                />
                <StatsCard
                  className="hover:scale-105 transition-transform duration-200 ease-in-out"
                  title="Current Rating"
                  value={userProfileData?.ranking || 354}
                  change="+15"
                  icon={<Award className="h-4 w-4 text-blue-400" />}
                />
              </div>

              {/* 1v1 Challenges */}
              <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
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
                        <div className="bg-accent-5 p-2 rounded-lg">
                          <Play className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <div className="font-medium">Quick Match</div>
                          <div className="text-sm text-zinc-400">Find an opponent with similar skill</div>
                        </div>
                      </div>
                      <Button size="sm" className="accent-color" onClick={() => navigate("/challenges")}>
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
              <ClearInactivityCard />
            </div>

            {/* Right Column - Activity & Leaderboard */}
            <div className="space-y-6">
              {/* Monthly Activity Heatmap */}
              <MonthlyActivityHeatmap />

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
                    {(topPerformers?.leaderboard || []).slice(0, 5).map((entry, index) => (
                      <div key={entry.user.id} className="flex items-center justify-between">
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
                                src={entry.user.profileImage}
                                alt={entry.user.username}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{entry.user.fullName}</div>
                              <div className="text-xs text-zinc-500">@{entry.user.username}</div>
                            </div>
                          </div>
                        </div>
                        <div className="font-semibold text-sm">{entry.score.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>

                  <Link to="/leaderboard" className="mt-4 flex items-center text-sm text-accent hover:text-accent/80 transition-colors group">
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

export default Index;
