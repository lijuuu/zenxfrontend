
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as challengeApi from '@/api/challengeApi';
import { useAppSelector } from '@/hooks/useAppSelector';

/**
 * Hook to fetch and poll current challenge details
 * @param challengeId The ID of the challenge to fetch
 * @param enabled Whether to enable the query
 * @param pollingInterval How frequently to poll for updates (in ms)
 */
export const useCurrentChallengeInfo = (
  challengeId?: string, 
  enabled: boolean = true,
  pollingInterval: number = 10000
) => {
  const user = useAppSelector(state => state.auth.userProfile);
  
  return useQuery({
    queryKey: ['challenge-details', challengeId],
    queryFn: () => challengeApi.getChallengeWithMetadata(challengeId!, user?.userID || ''),
    enabled: enabled && !!challengeId && !!user?.userID,
    refetchInterval: enabled ? pollingInterval : false,
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to fetch challenge details', {
          description: error.message
        });
      }
    }
  });
};

/**
 * Hook to check if the current user is the creator of the challenge
 * @param challengeId The ID of the challenge
 * @param creatorId The ID of the challenge creator
 */
export const useIsCreator = (challengeId?: string, creatorId?: string) => {
  const user = useAppSelector(state => state.auth.userProfile);
  
  return {
    isCreator: !!user?.userID && !!creatorId && user.userID === creatorId,
    userId: user?.userID
  };
};
