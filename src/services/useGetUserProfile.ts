
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/api/userApi';

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(),
    staleTime: 1000 * 60 * 5, 
    // refetchOnWindowFocus: true,
  });
};
