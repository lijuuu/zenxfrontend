
import axiosInstance from '@/utils/axiosInstance';

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
    if (!userId) {
      // Try to get userId from localStorage as fallback
      userId = localStorage.getItem("userid") || undefined;
      
      if (!userId) {
        throw new Error("User ID is required");
      }
    }
    
    const response = await axiosInstance.get(`/problems/leaderboard/data?userID=${userId}`, {
      headers: {
        'X-Requires-Auth': 'false', // Public endpoint doesn't require auth
      },
    });
    
    return response.data.payload;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    throw new Error("Failed to fetch leaderboard data");
  }
};
