import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as challengeApi from '@/api/challengeApi';
import {
  ChallengeHistoryParams
} from '@/api/challengeTypes';
import { useAppSelector } from '@/hooks/useAppSelector';

// Constants for stale times
const REALTIME_STALE_TIME = 1000*10; // Always fresh for real-time data
const HISTORY_STALE_TIME = 1000 * 60; // 1 minute for histories
const STANDARD_STALE_TIME = 1000 * 30; // 30 seconds for general data

export const useChallenges = (filters?: {
  active?: boolean;
  difficulty?: string;
  page?: number;
  pageSize?: number;
  isPrivate?: boolean;
  userId?: string;
}) => {
  return useQuery({
    queryKey: ['challenges', filters?.active, filters?.difficulty, filters?.isPrivate, filters?.userId, filters?.page, filters?.pageSize],
    queryFn: () => challengeApi.getChallenges({
      active: filters?.active,
      difficulty: filters?.difficulty,
      isPrivate: false, // Always false for public challenges
      userId: filters?.userId,
      page: filters?.page || 1,
      pageSize: filters?.pageSize || 10
    }),
    staleTime: STANDARD_STALE_TIME,
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to fetch challenges', {
          description: error.message
        });
      }
    },
    placeholderData: []
  });
};

export const useChallenge = (id?: string) => {
  return useQuery({
    queryKey: ['challenge', id],
    queryFn: () => challengeApi.getChallenge(id!),
    enabled: !!id,
    staleTime: REALTIME_STALE_TIME, // Real-time challenge data
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to fetch challenge details', {
          description: error.message
        });
      }
    }
  });
};

export const useChallengeWithMetadata = (id?: string, userId?: string) => {
  return useQuery({
    queryKey: ['challenge-metadata', id, userId],
    queryFn: () => challengeApi.getChallengeWithMetadata(id!, userId!),
    enabled: !!id && !!userId,
    staleTime: REALTIME_STALE_TIME, // Real-time metadata
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to fetch challenge details', {
          description: error.message
        });
      }
    }
  });
};

export const useCreateChallenge = () => {
  const queryClient = useQueryClient();
  const user = useAppSelector(state => state.auth.userProfile);

  return useMutation({
    mutationFn: (data: {
      title: string;
      difficulty: string;
      problemIds: string[];
      isPrivate: boolean;
      timeLimit?: number;
      accessCode?: string;
    }) => challengeApi.createChallenge({
      ...data,
      // Add creator ID from auth state
      creatorId: user?.userID || ''
    }),
    onSuccess: (data) => {
      // Invalidate all relevant queries to trigger refetches
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['user-challenge-history'] });
      toast.success('Challenge created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create challenge', {
        description: error.message
      });
    }
  });
};

export const useJoinChallenge = () => {
  const queryClient = useQueryClient();
  const user = useAppSelector(state => state.auth.userProfile);

  return useMutation({
    mutationFn: ({ challengeId, accessCode }: { challengeId: string, accessCode?: string }) =>
      challengeApi.joinChallenge(challengeId, accessCode, user?.userID),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['challenge'] });
      toast.success(data.message || 'Successfully joined the challenge');
    },
    onError: (error: Error) => {
      toast.error('Failed to join challenge', {
        description: error.message
      });
    }
  });
};

export const useStartChallenge = () => {
  const queryClient = useQueryClient();
  const user = useAppSelector(state => state.auth.userProfile);

  return useMutation({
    mutationFn: (challengeId: string) =>
      challengeApi.startChallenge(challengeId, user?.userID),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['challenge'] });
      toast.success('Challenge started');
    },
    onError: (error: Error) => {
      toast.error('Failed to start challenge', {
        description: error.message
      });
    }
  });
};

export const useEndChallenge = () => {
  const queryClient = useQueryClient();
  const user = useAppSelector(state => state.auth.userProfile);

  return useMutation({
    mutationFn: (challengeId: string) =>
      challengeApi.endChallenge(challengeId, user?.userID),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['challenge'] });
      toast.success('Challenge ended');
    },
    onError: (error: Error) => {
      toast.error('Failed to end challenge', {
        description: error.message
      });
    }
  });
};

export const useSubmitSolution = () => {
  const queryClient = useQueryClient();
  const user = useAppSelector(state => state.auth.userProfile);

  return useMutation({
    mutationFn: (data: {
      challengeId: string;
      problemId: string;
      code: string;
      language: string;
    }) => challengeApi.submitSolution({
      ...data,
      userId: user?.userID
    }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['challenge'] });
      queryClient.invalidateQueries({ queryKey: ['challenge-submissions'] });
      toast.success('Solution submitted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to submit solution', {
        description: error.message
      });
    }
  });
};

export const useSubmissionStatus = (submissionId?: string) => {
  return useQuery({
    queryKey: ['submission-status', submissionId],
    queryFn: () => challengeApi.getSubmissionStatus(submissionId!),
    enabled: !!submissionId,
    staleTime: REALTIME_STALE_TIME, // Always fresh for submission status
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === 'pending') {
        return 2000; // Refetch every 2 seconds if pending
      }
      return false; // Stop refetching if completed or error
    },
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to fetch submission status', {
          description: error.message
        });
      }
    }
  });
};

export const useChallengeSubmissions = (challengeId?: string) => {
  return useQuery({
    queryKey: ['challenge-submissions', challengeId],
    queryFn: () => challengeApi.getChallengeSubmissions(challengeId!),
    enabled: !!challengeId,
    staleTime: REALTIME_STALE_TIME, // Real-time submissions data
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to fetch challenge submissions', {
          description: error.message
        });
      }
    },
    placeholderData: []
  });
};

export const useUserChallengeStats = (userId?: string) => {
  return useQuery({
    queryKey: ['user-challenge-stats', userId],
    queryFn: () => challengeApi.getUserChallengeStats(userId!),
    enabled: !!userId,
    staleTime: STANDARD_STALE_TIME,
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to fetch user stats', {
          description: error.message
        });
      }
    }
  });
};

export const useChallengeUserStats = (challengeId?: string, userId?: string) => {
  return useQuery({
    queryKey: ['challenge-user-stats', challengeId, userId],
    queryFn: () => challengeApi.getChallengeUserStats(challengeId!, userId!),
    enabled: !!challengeId && !!userId,
    staleTime: REALTIME_STALE_TIME, // Real-time user stats during challenge
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to fetch challenge user stats', {
          description: error.message
        });
      }
    }
  });
};

export const useParticipantProfiles = (challengeId?: string, participantIds?: string[]) => {
  return useQuery({
    queryKey: ['participant-profiles', challengeId, participantIds?.length],
    queryFn: () => challengeApi.fetchParticipantProfiles(participantIds || []),
    enabled: !!challengeId && !!participantIds && participantIds.length > 0,
    staleTime: STANDARD_STALE_TIME,
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to fetch participant profiles', {
          description: error.message
        });
      }
    },
    placeholderData: []
  });
};

export const useUserChallengeHistory = (params?: ChallengeHistoryParams) => {
  return useQuery({
    queryKey: ['user-challenge-history', params?.isPrivate, params?.page, params?.pageSize],
    queryFn: () => challengeApi.getUserChallengeHistory({
      isPrivate: params?.isPrivate,
      page: params?.page || 1,
      pageSize: params?.pageSize || 10
    }),
    staleTime: HISTORY_STALE_TIME, // 1 minute stale time for history data
    meta: {
      onError: (error: Error) => {
        // Handle error gracefully without showing toast
        console.error('Failed to fetch challenge history:', error);
      }
    },
    placeholderData: {
      challenges: [],
      total_count: 0,
      page: 1,
      page_size: 10,
      message: ""
    }
  });
};