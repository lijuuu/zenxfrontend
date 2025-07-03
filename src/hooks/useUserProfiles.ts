
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { useState, useEffect } from "react";
import { getUserProfile } from "@/api/userApi";
import { toast } from "sonner";

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


export const useFetchCreatorProfiles = (creatorIds) => {
  const [profiles, setProfiles] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const creatorIdsKey = JSON.stringify(creatorIds.sort());

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!creatorIds.length) {
        setProfiles({});
        setIsLoading(false);
        return;
      }

      if (creatorIds.every((id) => profiles[id]?.userName)) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const profilePromises = creatorIds.map((id) =>
          profiles[id]?.userName
            ? Promise.resolve(profiles[id])
            : getUserProfile({ userID: id }).catch((err) => {
              console.error(`Failed to fetch profile for userID ${id}:`, err);
              return { userName: null, avatarURL: null };
            })
        );
        const results = await Promise.all(profilePromises);
        const profileMap = creatorIds.reduce((acc, id, index) => {
          const profile = results[index];
          acc[id] = profile && typeof profile === "object" && profile.userName && profile.avatarURL
            ? profile
            : { userName: null, avatarURL: null };
          return acc;
        }, { ...profiles });
        setProfiles(profileMap);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch creator profiles:", err);
        setError("Failed to fetch creator profiles");
        toast.error("Failed to fetch creator profiles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, [creatorIdsKey]);

  return { profiles, isLoading, error };
};