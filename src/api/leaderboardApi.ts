
import { LeaderboardEntry } from './types';
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
    let id = userId;
    
    // If no userId is provided, we'll use a default one for demo
    if (!id) {
      id = "03e40494-92b1-4d3d-bcdf-a9cad80c5993"; // Default user ID
    }
    
    const response = await axiosInstance.get(`/problems/leaderboard/data?userID=${id}`);
    return response.data.payload;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    throw new Error("Failed to fetch leaderboard data");
  }
};
