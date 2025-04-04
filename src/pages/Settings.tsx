import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchUserProfile } from '@/store/slices/userSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListBullet, User2, KeyRound, Bell, ShieldCheck, HelpCircle } from 'lucide-react';
import MainNavbar from '@/components/MainNavbar';

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector(state => state.user);

  useEffect(() => {
    dispatch(fetchUserProfile("1")); // Use a default user ID or get from auth state
  }, [dispatch]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <MainNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Error loading settings</h1>
            <p className="text-gray-500 mt-2">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <MainNavbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-zinc-900/40 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center"><User2 className="mr-2 h-4 w-4" /> Account</CardTitle>
              <CardDescription>Manage your personal information and account settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" onClick={() => navigate('/profile/edit')}>Edit Profile</Button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/40 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center"><KeyRound className="mr-2 h-4 w-4" /> Security</CardTitle>
              <CardDescription>Update your password and manage security settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" onClick={() => navigate('/settings/security')}>Security Settings</Button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/40 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center"><Bell className="mr-2 h-4 w-4" /> Notifications</CardTitle>
              <CardDescription>Configure your notification preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" onClick={() => navigate('/settings/notifications')}>Notification Settings</Button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/40 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center"><ShieldCheck className="mr-2 h-4 w-4" /> Privacy</CardTitle>
              <CardDescription>Control your data privacy and visibility settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" onClick={() => navigate('/settings/privacy')}>Privacy Settings</Button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/40 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center"><ListBullet className="mr-2 h-4 w-4" /> Preferences</CardTitle>
              <CardDescription>Customize your experience with language and display settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" onClick={() => navigate('/settings/preferences')}>Preferences</Button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/40 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center"><HelpCircle className="mr-2 h-4 w-4" /> Help & Support</CardTitle>
              <CardDescription>Get assistance and find answers to common questions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" onClick={() => navigate('/settings/help')}>Help & Support</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
