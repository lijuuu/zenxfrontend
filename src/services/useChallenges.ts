import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as challengeApi from '@/api/challengeApi';
import { ChallengeDocument, ChallengeConfig } from '@/api/challengeTypes';
import { useAppSelector } from '@/hooks/useAppSelector';

interface ChallengeHistoryParams {
  userId: string;
  isPrivate?: boolean;
  page?: number;
  pageSize?: number;
}

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
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['user-challenge-history'] });
      toast.success('Challenge created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create challenge', {
        description: error.message,
      });
    },
  });
};

export const useUserChallengeHistory = ({ page = 1, pageSize = 10, isPrivate }: { page?: number; pageSize?: number; isPrivate?: boolean }) => {

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

export const useActiveOpenChallenges = ({ page = 1, pageSize = 10 }: { page?: number; pageSize?: number; }) => {
  return useQuery({
    queryKey: ["active-open-challenges", page, pageSize],
    queryFn: () =>
      challengeApi.getActiveOpenChallenges({
        page: page,
        pageSize,
      }),
    staleTime: HISTORY_STALE_TIME,
  })
}


export const useGetOwnersActiveChallenges = ({ page = 1, pageSize = 10 }: { page?: number; pageSize?: number; }) => {
  return useQuery({
    queryKey: ["owners-active-challenges", page, pageSize],
    queryFn: () =>
      challengeApi.useGetOwnersActiveChallenges({
        page: page,
        pageSize,
      }),
    staleTime: HISTORY_STALE_TIME,
  })
}