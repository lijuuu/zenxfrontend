
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as challengeApi from '@/api/challengeApi';
import { Challenge } from '@/api/types';

export const useChallenges = (filters?: { active?: boolean; difficulty?: string; page?: number; pageSize?: number; isPrivate?: boolean; userId?: string; }) => {
  return useQuery({
    queryKey: ['challenges', filters],
    queryFn: () => challengeApi.getChallenges(filters),
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to fetch challenges', {
          description: error.message
        });
      }
    }
  });
};

export const useChallenge = (id?: string) => {
  return useQuery({
    queryKey: ['challenge', id],
    queryFn: () => challengeApi.getChallenge(id!),
    enabled: !!id,
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
  
  return useMutation({
    mutationFn: challengeApi.createChallenge,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
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
  
  return useMutation({
    mutationFn: challengeApi.joinChallenge,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      toast.success('Successfully joined the challenge');
    },
    onError: (error: Error) => {
      toast.error('Failed to join challenge', {
        description: error.message
      });
    }
  });
};

export const useStartChallenge = () => {
  return useMutation({
    mutationFn: challengeApi.startChallenge,
    onSuccess: () => {
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
  return useMutation({
    mutationFn: challengeApi.endChallenge,
    onSuccess: () => {
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
  return useMutation({
    mutationFn: challengeApi.submitSolution,
    onSuccess: () => {
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
    // Fix: Directly return the refetchInterval value based on data state
    refetchInterval: (data) => {
      // Check if data exists and has a pending status
      if (data && 'status' in data && data.status === 'pending') {
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
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to fetch challenge submissions', {
          description: error.message
        });
      }
    }
  });
};

export const useUserChallengeStats = (userId?: string) => {
  return useQuery({
    queryKey: ['user-challenge-stats', userId],
    queryFn: () => challengeApi.getUserChallengeStats(userId!),
    enabled: !!userId,
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
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to fetch challenge user stats', {
          description: error.message
        });
      }
    }
  });
};
