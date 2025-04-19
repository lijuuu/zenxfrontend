import { useGetUserProfile } from "@/services/useGetUserProfile";

export const useOwner = () => {
  const { data } = useGetUserProfile();
  return {
    ownerUserID: data?.userID,
    ownerUsername: data?.userName,
  };
};
