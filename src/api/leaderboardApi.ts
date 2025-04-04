
import { mockLeaderboard, mockFriendsLeaderboard } from './mockData';
import { LeaderboardEntry } from './types';

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
