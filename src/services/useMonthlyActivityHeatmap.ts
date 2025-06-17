
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';

interface ActivityDay {
  date: string;
  count: number;
  isActive: boolean;
}

interface MonthlyActivityHeatmapResponse {
  [x: string]: any;
  data: ActivityDay[];
}

interface GenericResponse {
  success: boolean;
  status: number;
  payload?: MonthlyActivityHeatmapResponse;
  error?: {
    errorType: string;
    code: number;
    message: string;
    details: string;
  };
}

interface MonthlyActivityRequest {
  userID: string;
  month: number;
  year: number;
}

const fetchMonthlyActivity = async (request: MonthlyActivityRequest) => {
  const { userID, month, year } = request;
  
  // Handle case when userID is missing
  if (!userID) {
    throw new Error('User ID is required for fetching activity data');
  }
  
  try {
    const response = await axiosInstance.get<GenericResponse>(
      `/problems/activity?userID=${userID}&month=${month}&year=${year}`,
      {
        headers: {
          'X-Requires-Auth': 'false', // Public endpoint doesn't require auth
        },
      }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error?.message || 'Failed to fetch activity');
    }
    
    return response.data.payload;
  } catch (error: any) {
    console.error("Error fetching monthly activity:", error);
    throw new Error(error.response?.data?.error?.message || error.message || 'Failed to fetch activity data');
  }
};

export const useMonthlyActivity = (userID: string, month: number, year: number) => {
  // Try to get userID from localStorage as fallback
  const effectiveUserID = userID || localStorage.getItem('userid') || '';
  
  const queryKey = ['monthlyActivity', effectiveUserID, month, year];
  
  return useQuery({
    queryKey,
    queryFn: () => fetchMonthlyActivity({ userID: effectiveUserID, month, year }),
    enabled: !!effectiveUserID && month >= 1 && month <= 12 && year >= 1970 && year <= 9999,
    retry: 1,
    refetchOnWindowFocus: true,
    staleTime: 0  // data is always stale, triggers refetch
  });
};
