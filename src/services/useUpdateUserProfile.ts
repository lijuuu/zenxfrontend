import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserProfile } from '@/api/userApi';


export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};