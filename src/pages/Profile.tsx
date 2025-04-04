import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainNavbar from '@/components/MainNavbar';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileAchievements from '@/components/profile/ProfileAchievements';
import RecentSubmissions from '@/components/profile/RecentSubmissions';
import ChallengesList from '@/components/profile/ChallengesList';
import FollowList from '@/components/profile/FollowList';
import { UserProfile } from '@/api/types';
import { getUserProfile } from '@/api/userApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setUserSuccess, setUserLoading, setUserError } from '@/store/slices/userSlice';

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const currentUser = useAppSelector(state => state.user.profile);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        if (userId) {
          // Fetch specific user profile
          const data = await getUserProfile(userId);
          setProfile(data);
        } else if (currentUser) {
          // Use current user profile from state
          setProfile(currentUser);
        } else {
          // Fetch current user profile
          dispatch(setUserLoading());
          const data = await getUserProfile('current');
          dispatch(setUserSuccess(data));
          setProfile(data);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        if (!userId && error instanceof Error) {
          dispatch(setUserError(error.message));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, dispatch, currentUser]);

  if (isLoading) {
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
            <h1 className="text-2xl font-bold">User not found</h1>
            <p className="text-gray-500 mt-2">The profile you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <MainNavbar />
      <div className="container mx-auto px-4 py-8">
        <ProfileHeader profile={profile} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2">
            <Tabs defaultValue="stats" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="stats">Stats</TabsTrigger>
                <TabsTrigger value="submissions">Submissions</TabsTrigger>
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
                <TabsTrigger value="network">Network</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stats">
                <div className="space-y-8">
                  <ProfileStats profile={profile} />
                  <ProfileAchievements profile={profile} />
                </div>
              </TabsContent>
              
              <TabsContent value="submissions">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Submissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RecentSubmissions userId={profile.userID} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="challenges">
                <Card>
                  <CardHeader>
                    <CardTitle>Challenges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChallengesList userId={profile.userID} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="network">
                <FollowList userId={profile.userID} />
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card className="bg-zinc-900/40 border-zinc-800">
              <CardHeader>
                <CardTitle>Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add activity component here */}
                <div className="text-center py-6 text-zinc-500">
                  <p>Coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
