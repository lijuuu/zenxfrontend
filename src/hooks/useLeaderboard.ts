
import { useQuery } from "@tanstack/react-query";
import { getUserLeaderboardData, LeaderboardData } from "@/api/leaderboardApi";

export const useLeaderboard = (userId?: string) => {
  return useQuery({
    queryKey: ['leaderboard', userId],
    queryFn: () => getUserLeaderboardData(userId),
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
