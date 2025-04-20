
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/api/userApi';
import { UserProfile } from '@/api/types';

interface UserProfilesMap {
  [key: string]: UserProfile;
}

export const useUserProfile = (userId?: string) => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => getUserProfile({ userID: userId }),
    enabled: !!userId,
  });
};

export const useUserProfiles = (userIds: string[] = []) => {
  const uniqueIds = Array.from(new Set(userIds));

  const queries = uniqueIds.map(id => ({
    queryKey: ['userProfile', id],
    queryFn: () => getUserProfile({ userID: id }),
  }));

  const results = useQuery({
    queryKey: ['userProfiles', uniqueIds],
    queryFn: async () => {
      const profiles = await Promise.all(
        uniqueIds.map(id => getUserProfile({ userID: id }))
      );
      
      // Create a map of userId to profile
      return profiles.reduce<UserProfilesMap>((acc, profile, index) => {
        if (profile) {
          acc[uniqueIds[index]] = profile;
        }
        return acc;
      }, {});
    },
    enabled: uniqueIds.length > 0,
  });

  return {
    ...results,
    profiles: results.data || {},
  };
};
