
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser, unfollowUser, getFollowers, getFollowing, checkFollow } from "@/api/userApi";
import { useAppSelector } from "./useAppSelector";

/**
 * Check if current user follows a target user
 */
export const useIsFollowing = (targetUserID?: string) => {
  const user = useAppSelector(state => state.auth.userProfile);

  return useQuery({
    queryKey: ["isFollowing", user?.userID, targetUserID],
    queryFn: () => (user?.userID && targetUserID ? checkFollow(targetUserID) : false),
    enabled: !!user?.userID && !!targetUserID,
    refetchOnWindowFocus: false,
  });
};

/**
 * Toggle follow/unfollow for a user
 */
export const useFollowAction = (targetUserID: string) => {
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: () => followUser(targetUserID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isFollowing"] });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["checkFollow"] });
    }
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUser(targetUserID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isFollowing"] });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["checkFollow"] });
    }
  });

  return { 
    follow: followMutation.mutateAsync,
    unfollow: unfollowMutation.mutateAsync,
    isLoading: followMutation.isPending || unfollowMutation.isPending
  };
};

/** Fetch followers for a user */
export const useFollowers = (userID?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["followers", userID],
    queryFn: () => (userID ? getFollowers(userID) : []),
    enabled: !!userID && enabled,
  });
};

/** Fetch users the given user is following */
export const useFollowing = (userID?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["following", userID],
    queryFn: () => (userID ? getFollowing(userID) : []),
    enabled: !!userID && enabled,
  });
};

/** Check if the current user follows a specific user */
export const useCheckFollow = (userID?: string) => {
  return useQuery({
    queryKey: ["checkFollow", userID],
    queryFn: () => (userID ? checkFollow(userID) : false),
    enabled: !!userID,
  });
};
