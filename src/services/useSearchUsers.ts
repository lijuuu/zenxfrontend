
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
      
      return response.data?.payload?.users || [];
    },
    enabled: !!query && query.length >= 2 && options.enabled !== false
  });
};
