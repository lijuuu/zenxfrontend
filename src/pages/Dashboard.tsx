
import React, { useEffect } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchUserProfile } from '@/store/slices/userSlice';
import { fetchProblems } from '@/store/slices/problemsSlice';
import { fetchUserChallenges } from '@/store/slices/challengesSlice';
import { fetchLeaderboard } from '@/store/slices/leaderboardSlice';
import StatsCard from '@/components/StatsCard';
import MainNavbar from '@/components/MainNavbar';
import { Code, Award, Target, User as UserIcon, Activity, Users, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import RecentSubmissions from '@/components/profile/RecentSubmissions';
import ProfileAchievements from '@/components/profile/ProfileAchievements';
import ProblemsSolvedChart from '@/components/profile/ProblemsSolvedChart';
import ChallengesList from '@/components/profile/ChallengesList';
import { MonthlyActivityHeatmap } from '@/components/activity/MonthlyActivityHeatmap';
import { SidebarProvider } from '@/components/ui/sidebar';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { profile, loading: userLoading } = useAppSelector((state) => state.user);
  const { problems, loading: problemsLoading } = useAppSelector((state) => state.problems);
  const { challenges, loading: challengesLoading } = useAppSelector((state) => state.challenges);
  const { entries: leaderboardEntries } = useAppSelector((state) => state.leaderboard);

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchProblems());
    dispatch(fetchUserChallenges());
    dispatch(fetchLeaderboard({ period: "weekly" }));
  }, [dispatch]);

  const isLoading = userLoading || problemsLoading || challengesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MainNavbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-32 w-full mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96 col-span-2" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  const userRank = leaderboardEntries.findIndex(entry => entry.user.id === profile?.userID) + 1;

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <MainNavbar />
        <div className="container mx-auto px-4 py-8">
          <ProfileHeader
            username={profile?.userName || ''}
            fullName={`${profile?.firstName || ''} ${profile?.lastName || ''}`}
            profileImage={profile?.avatarURL || ''}
            location={profile?.country || ''}
            joinDate={new Date(profile?.createdAt || 0).toLocaleDateString()}
            github={profile?.socials?.github || ''}
            twitter={profile?.socials?.twitter || ''}
            linkedin={profile?.socials?.linkedin || ''}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
            <StatsCard
              title="Problems Solved"
              value={profile?.stats?.easy.solved + profile?.stats?.medium.solved + profile?.stats?.hard.solved || 0}
              icon={<Code className="h-4 w-4 text-blue-400" />}
              change="+5 this week"
            />
            <StatsCard
              title="Current Streak"
              value={profile?.currentStreak || 0}
              icon={<Activity className="h-4 w-4 text-green-400" />}
              change="Personal best: 14"
            />
            <StatsCard
              title="Global Rank"
              value={userRank > 0 ? `#${userRank}` : 'Unranked'}
              icon={<Award className="h-4 w-4 text-yellow-400" />}
            />
            <StatsCard
              title="Rating"
              value={profile?.currentRating || 0}
              icon={<Target className="h-4 w-4 text-red-400" />}
              change="+15 points"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ProblemsSolvedChart
                easySolved={profile?.stats?.easy.solved || 0}
                easyTotal={profile?.stats?.easy.total || 0}
                mediumSolved={profile?.stats?.medium.solved || 0}
                mediumTotal={profile?.stats?.medium.total || 0}
                hardSolved={profile?.stats?.hard.solved || 0}
                hardTotal={profile?.stats?.hard.total || 0}
              />
              <MonthlyActivityHeatmap
                data={profile?.activityHeatmap?.data || []}
                startDate={profile?.activityHeatmap?.startDate || ''}
              />
              <RecentSubmissions
                submissions={[]}
                isLoading={false}
              />
            </div>
            <div className="space-y-6">
              <ProfileStats
                problemsSolved={profile?.stats?.easy.solved + profile?.stats?.medium.solved + profile?.stats?.hard.solved || 0}
                contestsParticipated={profile?.achievements?.weeklyContests + profile?.achievements?.monthlyContests || 0}
                currentStreak={profile?.currentStreak || 0}
                longestStreak={profile?.longestStreak || 0}
                contribution={profile?.activityHeatmap?.data?.reduce((sum, day) => sum + day.count, 0) || 0}
              />
              <ProfileAchievements
                achievements={profile?.achievements || { weeklyContests: 0, monthlyContests: 0, specialEvents: 0 }}
                badges={profile?.badges || []}
              />
              <ChallengesList challenges={challenges} />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
