import axiosInstance from '@/utils/axiosInstance';
import { UserProfile } from '@/types/challengeTypes';

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  try {
    const response = await axiosInstance.get(`/users/${userId}`, {
      headers: {
        'X-Requires-Auth': 'false',
      },
    });
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    const response = await axiosInstance.patch(`/users/${userId}`, updates);
    return response.data.payload;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const getFollowers = async (userId: string): Promise<UserProfile[]> => {
  try {
    const response = await axiosInstance.get(`/users/${userId}/followers`);
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching followers:', error);
    throw error;
  }
};

export const getFollowing = async (userId: string): Promise<UserProfile[]> => {
  try {
    const response = await axiosInstance.get(`/users/${userId}/following`);
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching following:', error);
    throw error;
  }
};

export const followUser = async (targetUserId: string): Promise<void> => {
  try {
    await axiosInstance.post(`/users/follow/${targetUserId}`);
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
};

export const unfollowUser = async (targetUserId: string): Promise<void> => {
  try {
    await axiosInstance.post(`/users/unfollow/${targetUserId}`);
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
};

export const searchUsers = async (query: string): Promise<UserProfile[]> => {
  try {
    const response = await axiosInstance.get(`/users/search?q=${query}`);
    return response.data.payload;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

export const setUpTwoFactorAuth = async (userId: string, enable: boolean) => {
  try {
    const response = await axiosInstance.post('/auth/2fa/setup', {
      user_id: userId,
      enable: enable
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
