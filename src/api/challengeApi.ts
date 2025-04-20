
import axiosInstance from '@/utils/axiosInstance';
import { Challenge, LeaderboardEntry, UserProfile, ProblemMetadataList, UserStats, SubmissionStatus } from './types';

// Interfaces for API requests
export interface CreateChallengeRequest {
  title: string;
  difficulty: string;
  problem_ids: string[];
  is_private: boolean;
  time_limit?: number;
  access_code?: string;
  start_at?: { seconds: number; nanos: number };
}

export interface JoinChallengeRequest {
  challenge_id: string;
  access_code?: string;
}

export interface StartEndChallengeRequest {
  challenge_id: string;
}

export interface SubmitSolutionRequest {
  challenge_id: string;
  problem_id: string;
  code: string;
  language: string;
}

// Challenge operations
export const createChallenge = async (data: CreateChallengeRequest): Promise<Challenge> => {
  try {
    const response = await axiosInstance.post('/challenges', data, {
      headers: {
        'X-Requires-Auth': 'true'
      }
    });
    return response.data.payload;
  } catch (error) {
    console.error('Error creating challenge:', error);
    throw error;
  }
};

export const getChallenge = async (id: string): Promise<Challenge> => {
  try {
    const response = await axiosInstance.get('/challenges/details', {
      params: { challenge_id: id },
      headers: {
        'X-Requires-Auth': 'true'
      }
    });
    
    if (!response.data?.payload?.challenge) {
      throw new Error('Challenge not found');
    }
    
    return response.data.payload.challenge;
  } catch (error) {
    console.error('Error fetching challenge:', error);
    throw error;
  }
};

export const getChallengeWithMetadata = async (id: string, userId: string): Promise<{
  challenge: Challenge;
  leaderboard: LeaderboardEntry[];
  userMetadata: ProblemMetadataList;
}> => {
  try {
    const response = await axiosInstance.get('/challenges/details', {
      params: { 
        challenge_id: id,
        user_id: userId 
      },
      headers: {
        'X-Requires-Auth': 'true'
      }
    });
    
    if (!response.data?.payload) {
      throw new Error('Challenge details not found');
    }
    
    return {
      challenge: response.data.payload.challenge,
      leaderboard: response.data.payload.leaderboard || [],
      userMetadata: response.data.payload.user_metadata || { challengeProblemMetadata: [] }
    };
  } catch (error) {
    console.error('Error fetching challenge with metadata:', error);
    throw error;
  }
};

export const getChallenges = async (filters?: {
  active?: boolean;
  difficulty?: string;
  page?: number;
  pageSize?: number;
  isPrivate?: boolean;
  userId?: string;
}): Promise<Challenge[]> => {
  try {
    const params: Record<string, any> = {};
    
    if (filters?.active !== undefined) params.is_active = filters.active;
    if (filters?.difficulty) params.difficulty = filters.difficulty;
    if (filters?.page) params.page = filters.page;
    if (filters?.pageSize) params.page_size = filters.pageSize;
    if (filters?.userId) params.user_id = filters.userId;
    if (filters?.isPrivate !== undefined) params.include_private = filters.isPrivate;
    
    const response = await axiosInstance.get('/challenges/public', { 
      params,
      headers: {
        'X-Requires-Auth': 'true'
      }
    });
    
    if (!response.data?.payload?.challenges) {
      return [];
    }
    
    return response.data.payload.challenges;
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return [];
  }
};

export const joinChallenge = async (data: JoinChallengeRequest): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axiosInstance.post('/challenges/join', {
      challenge_id: data.challenge_id,
      access_code: data.access_code
    }, {
      headers: {
        'X-Requires-Auth': 'true'
      }
    });
    
    return {
      success: response.data.payload.success,
      message: response.data.payload.message || 'Successfully joined the challenge'
    };
  } catch (error) {
    console.error('Error joining challenge:', error);
    throw error;
  }
};

export const startChallenge = async (challengeId: string): Promise<{ success: boolean; startTime: number }> => {
  try {
    const response = await axiosInstance.post('/challenges/start', {
      challenge_id: challengeId
    }, {
      headers: {
        'X-Requires-Auth': 'true'
      }
    });
    
    return {
      success: response.data.payload.success,
      startTime: response.data.payload.start_time
    };
  } catch (error) {
    console.error('Error starting challenge:', error);
    throw error;
  }
};

export const endChallenge = async (challengeId: string): Promise<{ 
  success: boolean; 
  leaderboard: LeaderboardEntry[] 
}> => {
  try {
    const response = await axiosInstance.post('/challenges/end', {
      challenge_id: challengeId
    }, {
      headers: {
        'X-Requires-Auth': 'true'
      }
    });
    
    return {
      success: response.data.payload.success,
      leaderboard: response.data.payload.leaderboard || []
    };
  } catch (error) {
    console.error('Error ending challenge:', error);
    throw error;
  }
};

export const submitSolution = async (data: SubmitSolutionRequest): Promise<{ 
  submissionId: string 
}> => {
  try {
    const response = await axiosInstance.post('/challenges/submit', {
      challenge_id: data.challenge_id,
      problem_id: data.problem_id,
      code: data.code,
      language: data.language
    }, {
      headers: {
        'X-Requires-Auth': 'true'
      }
    });
    
    return {
      submissionId: response.data.payload.submission_id
    };
  } catch (error) {
    console.error('Error submitting solution:', error);
    throw error;
  }
};

export const getSubmissionStatus = async (submissionId: string): Promise<SubmissionStatus> => {
  try {
    const response = await axiosInstance.get('/challenges/submissions/status', {
      params: { submission_id: submissionId },
      headers: {
        'X-Requires-Auth': 'true'
      }
    });
    
    if (!response.data?.payload) {
      throw new Error('No submission data received');
    }
    
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching submission status:', error);
    throw error;
  }
};

export const getChallengeSubmissions = async (challengeId: string): Promise<SubmissionStatus[]> => {
  try {
    const response = await axiosInstance.get('/challenges/submissions', {
      params: { challenge_id: challengeId },
      headers: {
        'X-Requires-Auth': 'true'
      }
    });
    
    if (!response.data?.payload?.submissions) {
      return [];
    }
    
    return response.data.payload.submissions;
  } catch (error) {
    console.error('Error fetching challenge submissions:', error);
    return [];
  }
};

export const getUserChallengeStats = async (userId: string): Promise<UserStats | null> => {
  try {
    const response = await axiosInstance.get('/challenges/stats/user', {
      params: { user_id: userId },
      headers: {
        'X-Requires-Auth': 'true'
      }
    });
    
    if (!response.data?.payload?.stats) {
      return null;
    }
    
    return response.data.payload.stats;
  } catch (error) {
    console.error('Error fetching user challenge stats:', error);
    return null;
  }
};

export const getChallengeUserStats = async (challengeId: string, userId: string): Promise<{
  userId: string;
  problemsCompleted: number;
  totalScore: number;
  rank: number;
  challengeProblemMetadata: Array<{
    problemId: string;
    score: number;
    timeTaken: number;
    completedAt: number;
  }>;
} | null> => {
  try {
    const response = await axiosInstance.get('/challenges/stats/challenge-user', {
      params: {
        challenge_id: challengeId,
        user_id: userId
      },
      headers: {
        'X-Requires-Auth': 'true'
      }
    });
    
    if (!response.data?.payload) {
      return null;
    }
    
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching challenge-user stats:', error);
    return null;
  }
};

// Utility to fetch user profiles for challenge participants
export const fetchParticipantProfiles = async (participantIds: string[]): Promise<UserProfile[]> => {
  if (!participantIds.length) return [];
  
  try {
    // This assumes there's an API endpoint to get multiple user profiles
    // You might need to adjust this based on your actual API
    const response = await axiosInstance.get('/users/batch', {
      params: { user_ids: participantIds.join(',') },
      headers: {
        'X-Requires-Auth': 'true'
      }
    });
    
    if (!response.data?.payload?.users) {
      return [];
    }
    
    return response.data.payload.users;
  } catch (error) {
    console.error('Error fetching participant profiles:', error);
    return [];
  }
};
