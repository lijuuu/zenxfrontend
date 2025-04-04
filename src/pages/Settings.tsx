
import React, { useEffect } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchUserProfile } from '@/store/slices/userSlice';
import MainNavbar from '@/components/MainNavbar';
import SettingsTabs from '@/components/settings/SettingsTabs';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarProvider } from '@/components/ui/sidebar';

const Settings = () => {
  const dispatch = useAppDispatch();
  const { profile, status } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const isLoading = status === 'loading' || !profile;

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen bg-background">
          <MainNavbar />
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold mb-8 text-foreground">Settings</h1>
              <Skeleton className="h-[600px] w-full" />
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <MainNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-8 text-foreground">Settings</h1>
            <SettingsTabs user={profile} />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
