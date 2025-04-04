
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchUserProfile } from '@/store/slices/userSlice';
import MainNavbar from '@/components/MainNavbar';
import SettingsTabs from '@/components/settings/SettingsTabs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { List } from 'lucide-react'; // Changed from ListBullet to List

const Settings = () => {
  const dispatch = useAppDispatch();
  const { profile, status } = useAppSelector(state => state.user);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    // Only fetch if we don't already have the profile
    if (!profile) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, profile]);

  return (
    <div className="min-h-screen bg-zinc-950">
      <MainNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <List className="mr-2 h-6 w-6" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        
        <Tabs defaultValue="profile" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-fit grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="2fa">Security</TabsTrigger>
          </TabsList>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            {status === 'loading' ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : profile ? (
              <SettingsTabs tab={activeTab} profile={profile} />
            ) : (
              <div className="text-center py-10">
                <p className="text-zinc-500">Failed to load profile data.</p>
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
