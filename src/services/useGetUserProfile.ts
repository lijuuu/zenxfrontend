
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/api/userApi';

export const useGetUserProfile = (userID?: string) => {
  return useQuery({
    queryKey: ['userProfile',userID],
    queryFn: () => getUserProfile(userID),
    staleTime: 1000 * 60 * 5, 
    // refetchOnWindowFocus: true,
  });
};
