import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/api/userApi';

type Props = {
  userID?: string;
  username?: string;
};

export const useGetUserProfile = ({ userID, username }: Props = {}) => {
  const queryKey = ['userProfile', userID || username];

  return useQuery({
    queryKey,
    queryFn: () => getUserProfile({ userID, username }),
    staleTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: true,
  });
};
