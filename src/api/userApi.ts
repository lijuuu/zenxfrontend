
import { UserProfile } from '@/store/slices/authSlice';
import { mockUsers, mockFriends } from './mockData';
import {  Friend } from './types';

export const getFriends = async (): Promise<Friend[]> => {
  return new Promise(resolve => {
    // Ensure friends have properly typed status
    const typedFriends = mockFriends.map(friend => ({
      ...friend,
      status: friend.status as "online" | "offline" | "in-match" | "coding"
    }));
    
    setTimeout(() => resolve(typedFriends), 500);
  });
};

export const getOnlineFriends = async (): Promise<Friend[]> => {
  return new Promise(resolve => {
    const onlineFriends = mockFriends.filter(f => f.status === "online");
    
    // Ensure friends have properly typed status
    const typedFriends = onlineFriends.map(friend => ({
      ...friend,
      status: friend.status as "online" | "offline" | "in-match" | "coding"
    }));
    
    setTimeout(() => resolve(typedFriends), 500);
  });
};

export const getRecentlyActiveFriends = async (): Promise<Friend[]> => {
  return new Promise(resolve => {
    // Ensure friends have properly typed status
    const typedFriends = mockFriends.map(friend => ({
      ...friend,
      status: friend.status as "online" | "offline" | "in-match" | "coding"
    }));
    
    setTimeout(() => resolve(typedFriends), 500);
  });
};

// Add missing functions
export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  return new Promise(resolve => {
    const user = mockUsers.find(u => u.userID === userId) || mockUsers[0];
    setTimeout(() => resolve(user), 500);
  });
};

export const updateUserProfile = async (profileData: Partial<any>): Promise<any> => {
  return new Promise(resolve => {
    // Simulate API call to update profile
    console.log('Updating profile with data:', profileData);
    setTimeout(() => resolve(profileData), 700);
  });
};

export const setUpTwoFactorAuth = async (): Promise<{ qrCode: string }> => {
  return new Promise(resolve => {
    // Simulate 2FA setup
    setTimeout(() => resolve({ qrCode: 'https://example.com/qr-code.png' }), 800);
  });
};
