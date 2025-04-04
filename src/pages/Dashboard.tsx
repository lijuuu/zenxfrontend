import React, { useEffect, useState } from 'react';
import MainNavbar from '@/components/MainNavbar';
import StatsCard from '@/components/StatsCard';
import ClearInactivityCard from '@/components/ClearInactivityCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ActivityHeatmap from '@/components/activity/ActivityHeatmap';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { getCurrentUser } from '@/api/userApi';
import { setUserSuccess, setUserLoading, setUserError, fetchUserProfile } from '@/store/slices/userSlice';
import { Loader2 } from 'lucide-react';
import { ActivityDay, HeatmapDataPoint } from '@/api/types';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { profile, status } = useAppSelector(state => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfileData = async () => {
      if (!profile) {
        dispatch(fetchUserProfile('1'));
      }
      setLoading(false);
    };

    fetchUserProfileData();
  }, [dispatch, profile]);

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-zinc-950">
        <MainNavbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <MainNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Error loading profile</h1>
            <p className="text-gray-500 mt-2">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  // Transform heatmap data for the activity heatmap component
  const activityData: HeatmapDataPoint[] = profile.activityHeatmap.data.map(item => ({
    date: item.date,
    count: item.count,
    present: item.present,
    level: item.level || (item.count > 3 ? 4 : item.count > 2 ? 3 : item.count > 1 ? 2 : item.count > 0 ? 1 : 0)
  }));

  return (
    <div className="min-h-screen bg-zinc-950">
      <MainNavbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Problems Solved"
            value={profile.problemsSolved?.toString() || "0"}
            description="Keep challenging yourself"
            trend={{
              value: "+5",
              label: "from last week",
              direction: "up"
            }}
          />
          <StatsCard
            title="Current Streak"
            value={profile.dayStreak?.toString() || "0"}
            description="Days in a row"
            trend={{
              value: "+2",
              label: "days",
              direction: "up"
            }}
          />
          <StatsCard
            title="Global Rank"
            value={`#${profile.ranking || 0}`}
            description="Among all users"
            trend={{
              value: "+10",
              label: "positions",
              direction: "up"
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-zinc-900/40 border-zinc-800">
              <CardHeader>
                <CardTitle>Activity</CardTitle>
                <CardDescription>Your coding activity over the past year</CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityHeatmap data={activityData} />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <ClearInactivityCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
