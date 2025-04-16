
import { mockLeaderboard, mockFriendsLeaderboard } from './mockData';
import { LeaderboardEntry } from './types';
import axiosInstance from '@/utils/axiosInstance';

// API functions
export const getLeaderboard = async (options?: { limit?: number; page?: number; period?: 'all' | 'monthly' | 'weekly' }): Promise<{ leaderboard: LeaderboardEntry[]; total: number }> => {
  return new Promise(resolve => {
    const limit = options?.limit || 10;
    const page = options?.page || 1;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // In a real app, sorting would be done server-side based on the period
    const sortedLeaderboard = [...mockLeaderboard];
    
    const paginatedLeaderboard = sortedLeaderboard.slice(startIndex, endIndex);
    
    setTimeout(() => resolve({
      leaderboard: paginatedLeaderboard,
      total: sortedLeaderboard.length
    }), 700);
  });
};

export const getGlobalRank = async (userId: string): Promise<{ rank: number; total: number }> => {
  return new Promise(resolve => {
    // For demo purposes, return a random rank for any user except the mock leaderboard users
    const userInLeaderboard = mockLeaderboard.find(entry => entry.user.id === userId);
    
    if (userInLeaderboard) {
      setTimeout(() => resolve({
        rank: userInLeaderboard.rank,
        total: 10000
      }), 500);
    } else {
      setTimeout(() => resolve({
        rank: 354, // For the default user
        total: 10000
      }), 500);
    }
  });
};

export const getFriendsLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  return new Promise(resolve => {
    // Return the friends leaderboard
    setTimeout(() => resolve(mockFriendsLeaderboard), 600);
  });
};

// New API function to get real leaderboard data
export interface LeaderboardUser {
  UserId: string;
  UserName: string;
  AvatarURL: string;
  Score: number;
  Entity: string;
}

export interface LeaderboardData {
  UserId: string;
  UserName: string;
  AvatarURL: string;
  ProblemsDone: number;
  Score: number;
  Entity: string;
  GlobalRank: number;
  EntityRank: number;
  TopKGlobal: LeaderboardUser[];
  TopKEntity: LeaderboardUser[];
}

export const getUserLeaderboardData = async (userId?: string): Promise<LeaderboardData> => {
  try {
    let id = userId;
    
    // If no userId is provided, we'll use a mock ID for demo
    if (!id) {
      id = "03e40494-92b1-4d3d-bcdf-a9cad80c5993"; // Default user ID
    }
    
    const response = await axiosInstance.get(`/problems/leaderboard/data?userID=${id}`);
    return response.data.payload;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    
    // Return a mock response if the API call fails
    return {
      UserId: "03e40494-92b1-4d3d-bcdf-a9cad80c5993",
      UserName: "liju6c94",
      AvatarURL: "https://res.cloudinary.com/dcfoqhrxb/image/upload/v1744434106/demo/avatar_q5h25r.jpg",
      ProblemsDone: 0,
      Score: 14,
      Entity: "in",
      GlobalRank: 19,
      EntityRank: 15,
      TopKGlobal: mockLeaderboard.slice(0, 10).map(entry => ({
        UserId: entry.user.id,
        UserName: entry.user.username,
        AvatarURL: entry.user.profileImage,
        Score: entry.score,
        Entity: "in"
      })),
      TopKEntity: mockLeaderboard.slice(0, 10).map(entry => ({
        UserId: entry.user.id,
        UserName: entry.user.username,
        AvatarURL: entry.user.profileImage,
        Score: entry.score,
        Entity: "in"
      }))
    };
  }
};
