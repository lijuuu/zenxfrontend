
import React, { useState, useEffect } from 'react';
import MainNavbar from '@/components/common/MainNavbar';
import {  useAppSelector } from '@/hooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileEditTab from '@/components/settings/ProfileEditTab';
import TwoFactorAuthTab from '@/components/settings/TwoFactorAuthTab';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NotificationsSettingsTab from '@/components/settings/NotificationsSettingsTab';

const Settings = () => {
  const { userProfile, loading } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <MainNavbar />
        <div className="pt-16 container mx-auto px-4">
          <div className="py-16 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <MainNavbar />
        <div className="pt-16 container mx-auto px-4">
          <div className="py-16 text-center">
            <h1 className="text-2xl font-bold">User profile not available</h1>
            <p className="mt-2 text-zinc-400">Please try logging in again</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <MainNavbar />
      
      <div className="pt-16 pb-16 container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 mt-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-zinc-400 text-sm">
                Manage your <span className="text-green-500">zenx</span> account preferences
              </p>
            </div>
            
            <Tabs 
              defaultValue="profile" 
              className="w-full" 
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-1 h-auto gap-2">
                <TabsTrigger value="profile" className="justify-start">
                  Profile Settings
                </TabsTrigger>
                <TabsTrigger value="security" className="justify-start">
                  Security & 2FA
                </TabsTrigger>
                <TabsTrigger value="notifications" className="justify-start">
                  Notifications
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Card className="bg-zinc-900/40 border-zinc-800">
              <CardHeader className="p-4">
                <CardTitle className="text-sm flex items-center">
                  <span className="text-green-500 text-xs mr-1">zenx</span> Account
                </CardTitle>
                <CardDescription className="text-xs">
                  {userProfile.email || userProfile.userName}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <Tabs 
              defaultValue="profile" 
              className="w-full" 
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <div className="space-y-6">
                <TabsContent value="profile" className="space-y-6">
                  <ProfileEditTab user={userProfile} />
                </TabsContent>
                
                <TabsContent value="security" className="space-y-6">
                  <TwoFactorAuthTab userProfile={userProfile} />
                </TabsContent>
                
                <TabsContent value="notifications" className="space-y-6">
                  <NotificationsSettingsTab userProfile={userProfile} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
