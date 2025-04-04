import { UserProfile, UsersResponse } from './types';
import { GenericResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Function to get the current user's profile
export const getCurrentUser = async (userId?: string): Promise<UserProfile> => {
  const token = localStorage.getItem('accessToken');
  let url = `${API_BASE_URL}/users/me`;
  if (userId) {
    url = `${API_BASE_URL}/users/${userId}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user profile: ${response.status}`);
  }

  return await response.json();
};

// Function to update the current user's profile
export const updateCurrentUser = async (userData: Partial<UserProfile>): Promise<UserProfile> => {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update user profile: ${response.status}`);
  }

  return await response.json();
};

// Function to search users by username
export const searchUsers = async (query: string): Promise<UsersResponse> => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/users/search?q=${query}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to search users: ${response.status}`);
    }

    return await response.json();
};

// Function to follow a user
export const followUser = async (userIdToFollow: string): Promise<GenericResponse> => {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${API_BASE_URL}/users/${userIdToFollow}/follow`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to follow user: ${response.status}`);
  }

  return await response.json();
};

// Function to unfollow a user
export const unfollowUser = async (userIdToUnfollow: string): Promise<GenericResponse> => {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${API_BASE_URL}/users/${userIdToUnfollow}/unfollow`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to unfollow user: ${response.status}`);
  }

  return await response.json();
};

// Add missing getUserFollowers and getUserFollowing functions
export const getUserFollowers = async (userId: string): Promise<UserProfile[]> => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch(`${API_BASE_URL}/users/${userId}/followers`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch followers: ${response.status}`);
  }

  return await response.json();
};

export const getUserFollowing = async (userId: string): Promise<UserProfile[]> => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch(`${API_BASE_URL}/users/${userId}/following`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch following: ${response.status}`);
  }

  return await response.json();
};

// Add missing setUpTwoFactorAuth function
export const setUpTwoFactorAuth = async (): Promise<any> => {
  try {
    // Mock implementation - in a real app this would call a backend endpoint
    return {
      success: true,
      qrCodeUrl: 'https://mock-qr-code-url.com',
      secret: 'MOCK2FASECRET',
    };
  } catch (error) {
    console.error('Error setting up 2FA:', error);
    throw error;
  }
};

// Fix includes check on followers/following
export const isFollowing = (user: UserProfile, targetUserId: string): boolean => {
  if (!user.following) return false;
  
  if (Array.isArray(user.following)) {
    return user.following.includes(targetUserId);
  }
  
  // If it's a number, we can't check specific follows
  return false;
};

export const isFollower = (user: UserProfile, targetUserId: string): boolean => {
  if (!user.followers) return false;
  
  if (Array.isArray(user.followers)) {
    return user.followers.includes(targetUserId);
  }
  
  // If it's a number, we can't check specific followers
  return false;
};

// Replace getUserProfile with a compatibility function if needed
export const getUserProfile = async (userId?: string): Promise<UserProfile> => {
  return getCurrentUser(userId);
};
