import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/api/userApi';

export const useGetUserProfile = (userId: string = "") => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => getUserProfile(userId),
    staleTime: 1000 * 60 * 5, 
    // refetchOnWindowFocus: true,
  });
};