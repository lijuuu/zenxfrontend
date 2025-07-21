import { useGetUserProfile } from "@/services/useGetUserProfile";

export const useOwner = () => {
  const { data } = useGetUserProfile();
  return {
    ownerUserID: data?.userId,
    ownerUsername: data?.userName,
  };
};
