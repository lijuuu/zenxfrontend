
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';

export interface ProblemsDoneStatistics {
  maxEasyCount: number;
  doneEasyCount: number;
  maxMediumCount: number;
  doneMediumCount: number;
  maxHardCount: number;
  doneHardCount: number;
}

interface GenericResponse {
  success: boolean;
  status: number;
  payload: ProblemsDoneStatistics;
  error: any;
}

export const useProblemStats = (userID?: string) => {
  return useQuery({
    queryKey: ['problemStats', userID],
    queryFn: async () => {
      if (!userID) {
        throw new Error('User ID is required');
      }
      
      const response = await axiosInstance.get<GenericResponse>('/problems/stats', {
        params: { userID },
        headers: { 'X-Requires-Auth': 'false' }, // Auth not required for public profiles
      });
      
      return response.data.payload;
    },
    enabled: !!userID, // Only run the query if userID is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
