import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as challengeApi from '@/api/challengeApi';
import { ChallengeDocument, ChallengeConfig } from '@/api/challengeTypes';

// Constants for stale times
const REALTIME_STALE_TIME = 1000 * 10; // Always fresh for real-time data
const HISTORY_STALE_TIME = 1000 * 60; // 1 minute for histories
const STANDARD_STALE_TIME = 1000 * 30; // 30 seconds for general data

export const useCreateChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      title: string;
      processedProblemIds: string[];
      isPrivate?: boolean;
      timeLimit?: number;
      startTime?: number;
      config: ChallengeConfig;
      password?: string;
      inviteUserIds?: string[];
    }) => challengeApi.createChallenge(data),
    onSuccess: (data: ChallengeDocument) => {
      queryClient.invalidateQueries({ queryKey: ['active-open-challenges'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['owners-active-challenges'], exact: false });
      toast.success('Challenge created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create challenge', {
        description: error.message,
      });
    },
  });
};

export const useUserChallengeHistory = ({
  page = 1,
  pageSize = 10,
  isPrivate,
}: {
  page?: number;
  pageSize?: number;
  isPrivate?: boolean;
}) => {
  return useQuery({
    queryKey: [
      isPrivate ? 'user-challenge-private-history' : 'user-challenge-public-history',
      page,
      pageSize,
      isPrivate,
    ],
    queryFn: () =>
      challengeApi.getUserChallengeHistory({
        page,
        pageSize,
        isPrivate,
      }),
    staleTime: HISTORY_STALE_TIME,
  });
};

export const useActiveOpenChallenges = ({
  page = 1,
  pageSize = 10,
}: {
  page?: number;
  pageSize?: number;
}) => {
  return useQuery({
    queryKey: ['active-open-challenges', page, pageSize],
    queryFn: () =>
      challengeApi.getActiveOpenChallenges({
        page,
        pageSize,
      }),
    staleTime: HISTORY_STALE_TIME,
  });
};

export const useGetOwnersActiveChallenges = ({
  page = 1,
  pageSize = 10,
}: {
  page?: number;
  pageSize?: number;
}) => {
  return useQuery({
    queryKey: ['owners-active-challenges', page, pageSize],
    queryFn: () =>
      challengeApi.getOwnersActiveChallenges({
        page,
        pageSize,
      }),
    staleTime: HISTORY_STALE_TIME,
  });
};

interface AbandonPayload {
  creatorId: string;
  challengeId: string;
}

export const useAbandonChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ creatorId, challengeId }: AbandonPayload) =>
      challengeApi.abandonChallenge({ creatorId, challengeId }),
    onMutate: async ({ challengeId }) => {
      // Optimistic update: Remove the abandoned challenge from the cache
      await queryClient.cancelQueries({ queryKey: ['owners-active-challenges'], exact: false });
      const previousChallenges = queryClient.getQueryData(['owners-active-challenges', 1, 10]);
      queryClient.setQueryData(['owners-active-challenges', 1, 10], (old: any) => {
        if (!old?.challenges) return { challenges: [] };
        return {
          ...old,
          challenges: old.challenges.filter((c: any) => c.challengeId !== challengeId),
        };
      });
      return { previousChallenges }; // Store previous state for rollback
    },
    onSuccess: async () => {
      // Invalidate queries to ensure fresh data
      await queryClient.invalidateQueries({ queryKey: ['active-open-challenges'], exact: false });
      await queryClient.invalidateQueries({ queryKey: ['owners-active-challenges'], exact: false });
      toast.success('Challenge abandoned successfully');
    },
    onError: (error: Error, _variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['owners-active-challenges', 1, 10], context?.previousChallenges);
      toast.error('Failed to abandon challenge', {
        description: error.message,
      });
    },
    onSettled: () => {
      // Ensure queries are refetched after mutation
      queryClient.invalidateQueries({ queryKey: ['owners-active-challenges'], exact: false });
    },
  });
};