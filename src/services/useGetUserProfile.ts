
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/api/userApi';
// import { UserProfile } from '@/api/types';

export const useGetUserProfile = (userID?: string) => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(userID),
    staleTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: true,
  });
};
