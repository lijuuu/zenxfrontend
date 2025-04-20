
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';
import { UserProfile } from '@/api/types';

interface UseSearchUsersOptions {
  enabled?: boolean;
  limit?: number;
}

export const useSearchUsers = (query: string, options: UseSearchUsersOptions = {}) => {
  return useQuery({
    queryKey: ['user-search', query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      
      const response = await axiosInstance.get('/users/search', {
        params: { query, limit: options.limit || 10 },
        headers: { 'X-Requires-Auth': 'true' }
      });
      
      // Ensure consistent naming convention with userID
      const users = response.data?.payload?.users || [];
      return users.map((user: any) => ({
        ...user,
        // Make sure userID exists and is not undefined
        userID: user.userID || user.userId || user.user_id || '',
      }));
    },
    enabled: !!query && query.length >= 2 && options.enabled !== false
  });
};
