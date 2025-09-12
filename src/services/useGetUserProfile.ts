import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/api/userApi';

type Props = {
  userId?: string;
  username?: string;
};

type Options = {
  enabled?: boolean;
};

export const useGetUserProfile = ({ userId, username }: Props = {}, options: Options = {}) => {
  const queryKey = ['userProfile', userId || username];

  return useQuery({
    queryKey,
    queryFn: () => getUserProfile({ userId, username }),
    staleTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: options.enabled !== undefined ? options.enabled : true,
  });
};

