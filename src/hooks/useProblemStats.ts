
import { useState, useEffect } from 'react';
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
  const [problemStats, setProblemStats] = useState<ProblemsDoneStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!userID) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get<GenericResponse>('/problems/stats', {
          params: { userID },
          headers: { 'X-Requires-Auth': 'false' }, // Auth not required
        });
        setProblemStats(response.data.payload);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch statistics'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [userID]);

  return { problemStats, isLoading, error };
};
