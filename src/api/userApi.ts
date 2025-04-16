
import { UserProfile } from '@/store/slices/authSlice';
import { mockUsers, mockFriends } from './mockData';
import { Friend } from './types';
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
  try {
    const url = userID ? `/users/public/profile/${userID}` : `/users/profile`;
    const requiresAuth = !userID; // If userID is provided, it's a public profile and doesn't require auth
    
    const res = await axiosInstance.get(url, {
      headers: {
        'X-Requires-Auth': requiresAuth ? 'true' : 'false',
      },
    });

    // Store current user ID in localStorage for later use if it's the authenticated user's profile
    if (!userID && res.data.payload.userProfile?.userID) {
      localStorage.setItem("userid", res.data.payload.userProfile.userID);
    }

    return res.data.payload.userProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile");
  }
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

export interface SearchUsersResponse {
  users: UserProfile[];
  totalCount: number;
  nextPageToken?: string;
  message?: string;
}

export const searchUsers = async (
  query: string,
  pageToken?: string,
  limit: number = 10
): Promise<SearchUsersResponse> => {
  let url = `/users/search?query=${encodeURIComponent(query)}&limit=${limit}`;
  
  if (pageToken) {
    url += `&pageToken=${encodeURIComponent(pageToken)}`;
  }
  
  const res = await axiosInstance.get(url, {
    headers: {
      'X-Requires-Auth': 'true',
    },
  });

  return res.data.payload;
};
