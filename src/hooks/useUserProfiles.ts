
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { UserProfile } from "@/api/types";

export const useUserProfiles = (userIds: string[] = []) => {
  return useQuery({
    queryKey: ["user-profiles", userIds],
    queryFn: async () => {
      if (!userIds.length) return [];
      
      const response = await axiosInstance.get('/users/batch', {
        params: { user_ids: userIds.join(',') },
        headers: {
          'X-Requires-Auth': 'true'
        }
      });
      
      return response.data?.payload?.users || [];
    },
    enabled: userIds.length > 0
  });
};
