
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchUserProfile } from '@/store/slices/userSlice';
import MainNavbar from '@/components/MainNavbar';
import SettingsTabs from '@/components/settings/SettingsTabs';
import { Skeleton } from '@/components/ui/skeleton';
import { UserProfile, User } from '@/api/types';
import { SidebarProvider } from '@/components/ui/sidebar';

const Settings = () => {
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector((state) => state.user);
  const [fullProfile, setFullProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Convert the basic profile to a full UserProfile with all required fields
  useEffect(() => {
    if (profile) {
      const enhancedProfile: UserProfile = {
        // Core UserProfile properties
        userID: profile.userID || '',
        userName: profile.userName || '',
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        avatarURL: profile.avatarURL || '',
        email: profile.email || '',
        role: profile.role || 'user',
        country: profile.country || '',
        isBanned: profile.isBanned || false,
        isVerified: profile.isVerified || false,
        primaryLanguageID: profile.primaryLanguageID || '',
        muteNotifications: profile.muteNotifications || false,
        socials: profile.socials || {
          github: '',
          twitter: '',
          linkedin: ''
        },
        createdAt: profile.createdAt || 0,
        
        // Additional UI properties
        id: profile.userID,
        username: profile.userName,
        fullName: `${profile.firstName} ${profile.lastName}`,
        joinedDate: new Date(profile.createdAt).toISOString(),
        problemsSolved: 0,
        dayStreak: 0,
        ranking: 0,
        profileImage: profile.avatarURL,
        
        // Additional required fields for UserProfile
        stats: {
          easy: { solved: 0, total: 0 },
          medium: { solved: 0, total: 0 },
          hard: { solved: 0, total: 0 }
        },
        achievements: {
          weeklyContests: 0,
          monthlyContests: 0,
          specialEvents: 0
        },
        badges: [],
        activityHeatmap: {
          startDate: new Date().toISOString(),
          data: []
        },
        currentStreak: 0,
        longestStreak: 0,
        currentRating: 0,
        globalRank: 0
      };

      setFullProfile(enhancedProfile);
    }
  }, [profile]);

  if (loading || !fullProfile) {
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
            <SettingsTabs profile={fullProfile} />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
