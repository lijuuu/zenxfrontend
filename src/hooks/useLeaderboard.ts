
import { useQuery } from "@tanstack/react-query";
import { getUserLeaderboardData } from "@/api/leaderboardApi";

export const useLeaderboard = (userId?: string) => {
  return useQuery({
    queryKey: ['leaderboard', userId],
    queryFn: () => getUserLeaderboardData(userId),
    refetchOnWindowFocus: true,
    retry: 1,
    // staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!userId, // Only run the query if userId is provided
  });
};
