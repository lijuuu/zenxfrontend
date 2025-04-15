
import { useQuery } from '@tanstack/react-query';
import { searchUsers, SearchUsersResponse } from '@/api/userApi';

export const useSearchUsers = (query: string, pageToken?: string, limit: number = 10) => {
  return useQuery({
    queryKey: ['searchUsers', query, pageToken, limit],
    queryFn: () => searchUsers(query, pageToken, limit),
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
