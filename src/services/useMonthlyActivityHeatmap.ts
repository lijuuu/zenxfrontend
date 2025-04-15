import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';

interface ActivityDay {
  date: string;
  count: number;
  isActive: boolean;
}

interface MonthlyActivityHeatmapResponse {
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
  const response = await axiosInstance.get<GenericResponse>(
    `/problems/activity?userID=${userID}&month=${month}&year=${year}`
  );
  if (!response.data.success) {
    throw new Error(response.data.error?.message || 'Failed to fetch activity');
  }
  return response.data.payload;
};

export const useMonthlyActivity = (userID: string, month: number, year: number) => {
  const queryKey = ['monthlyActivity', userID, month, year];
  return useQuery({
    queryKey,
    queryFn: () => fetchMonthlyActivity({ userID, month, year }),
    enabled: !!userID && month >= 1 && month <= 12 && year >= 1970 && year <= 9999,
    staleTime: 5 * 60 * 1000,
  });
};