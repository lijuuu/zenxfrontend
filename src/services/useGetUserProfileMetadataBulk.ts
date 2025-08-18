import { useQuery } from '@tanstack/react-query';
import { getUserProfileMetadataBulk } from '@/api/userApi';

export const useGetUserProfileMetadataBulk = ( userIds : string[] ) => {
  const queryKey = ['userProfilesMetadata:', userIds];

  return useQuery({
    queryKey,
    queryFn: () => getUserProfileMetadataBulk(userIds),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: true,
  });
};

