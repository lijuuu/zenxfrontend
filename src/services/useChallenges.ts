
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as challengeApi from '@/api/challengeApi';
import { Challenge, SubmissionStatus, UserProfile, LeaderboardEntry } from '@/api/types';
import { useAuth } from '@/hooks/useAuth';

export const useChallenges = (filters?: { 
  active?: boolean; 
  difficulty?: string; 
  page?: number; 
  pageSize?: number; 
  isPrivate?: boolean; 
  userId?: string; 
}) => {
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

export const useChallengeWithMetadata = (id?: string, userId?: string) => {
  return useQuery({
    queryKey: ['challenge-metadata', id, userId],
    queryFn: () => challengeApi.getChallengeWithMetadata(id!, userId!),
    enabled: !!id && !!userId,
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
    onSuccess: () => {
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
  
  return useMutation({
    mutationFn: challengeApi.startChallenge,
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
  
  return useMutation({
    mutationFn: challengeApi.endChallenge,
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
  
  return useMutation({
    mutationFn: challengeApi.submitSolution,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['challenge'] });
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

export const useParticipantProfiles = (challengeId?: string, participantIds?: string[]) => {
  return useQuery({
    queryKey: ['participant-profiles', challengeId, participantIds],
    queryFn: () => challengeApi.fetchParticipantProfiles(participantIds || []),
    enabled: !!challengeId && !!participantIds && participantIds.length > 0,
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to fetch participant profiles', {
          description: error.message
        });
      }
    }
  });
};
