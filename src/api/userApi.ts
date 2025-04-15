
import { UserProfile } from '@/store/slices/authSlice';
import { mockUsers, mockFriends } from './mockData';
import {  Friend } from './types';
import axiosInstance from '@/utils/axiosInstance';

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

export const setUpTwoFactorAuth = async (): Promise<{ qrCode: string }> => {
  return new Promise(resolve => {
    // Simulate 2FA setup
    setTimeout(() => resolve({ qrCode: 'https://example.com/qr-code.png' }), 800);
  });
};


export const getUserProfile = async (userID?: string): Promise<UserProfile> => {
  const url = userID ? `/users/public/profile/${userID}` : `/users/profile`;
  const res = await axiosInstance.get(url, {
    headers: {
      'X-Requires-Auth': userID?'false':'true',
    },
  });

  localStorage.setItem("userid",res.data.payload.userProfile?.userID)

  // console.log("triggered api getUserProfile, ", res.data);
  return res.data.payload.userProfile;
};


export const updateUserProfile = async (
  profileData: Partial<UserProfile>
): Promise<UserProfile> => {
  const res = await axiosInstance.put(`/users/profile/update`, profileData, {
    headers: {
      'X-Requires-Auth': 'true', 
    },
  });
  return res.data;
};