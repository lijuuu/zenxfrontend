
import axiosInstance from '@/utils/axiosInstance';
import { Challenge, UserProfile } from './types';

export interface CreateChallengeOptions {
  title: string;
  difficulty: string;
  problemIds: string[];
  isPrivate: boolean;
  timeLimit?: number; // in seconds
  accessCode?: string;
  startAt?: Date;
}

export interface ChallengeJoinRequest {
  challengeId: string;
  accessCode?: string;
}

export interface ChallengeSubmission {
  challengeId: string;
  problemId: string;
  code: string;
  language: string;
}

export interface SubmissionStatus {
  status: 'pending' | 'completed' | 'error';
  result?: {
    success: boolean;
    message: string;
    testCases?: Array<{
      passed: boolean;
      input: string;
      expectedOutput: string;
      actualOutput: string;
    }>;
  };
}

export interface ChallengeInvite {
  challengeId: string;
  challengeTitle: string;
  invitedBy: string;
  isPrivate: boolean;
  accessCode?: string;
}

export const getChallenges = async (filters?: { active?: boolean; difficulty?: string; page?: number; pageSize?: number; isPrivate?: boolean; }) => {
  try {
    const response = await axiosInstance.get('/challenges/public', { params: filters });
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching challenges:', error);
    throw error;
  }
};

// This function can be used as getUserChallenges with a userId filter
export const getUserChallenges = async (userId: string) => {
  try {
    const response = await axiosInstance.get('/challenges/public', {
      params: { user_id: userId }
    });
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    throw error;
  }
};

export const getChallenge = async (id: string): Promise<Challenge> => {
  try {
    const response = await axiosInstance.get('/challenges', {
      params: { id }
    });
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching challenge:', error);
    throw error;
  }
};

export const createChallenge = async (data: CreateChallengeOptions): Promise<Challenge> => {
  try {
    const payload = {
      title: data.title,
      difficulty: data.difficulty,
      problem_ids: data.problemIds,
      is_private: data.isPrivate,
      time_limit: data.timeLimit || 3600, // Default 1 hour
      access_code: data.accessCode,
      start_at: data.startAt ? {
        seconds: Math.floor(data.startAt.getTime() / 1000),
        nanos: 0
      } : undefined
    };

    const response = await axiosInstance.post('/challenges', payload);
    return response.data.payload;
  } catch (error) {
    console.error('Error creating challenge:', error);
    throw error;
  }
};

export const joinChallenge = async (data: ChallengeJoinRequest): Promise<{ success: boolean; challenge: Challenge }> => {
  try {
    const response = await axiosInstance.post('/challenges/join', {
      challenge_id: data.challengeId,
      access_code: data.accessCode
    });
    return {
      success: true,
      challenge: response.data.payload
    };
  } catch (error) {
    console.error('Error joining challenge:', error);
    throw error;
  }
};

export const startChallenge = async (challengeId: string) => {
  try {
    const response = await axiosInstance.post('/challenges/start', {
      challenge_id: challengeId
    });
    return response.data.payload;
  } catch (error) {
    console.error('Error starting challenge:', error);
    throw error;
  }
};

export const endChallenge = async (challengeId: string) => {
  try {
    const response = await axiosInstance.post('/challenges/end', {
      challenge_id: challengeId
    });
    return response.data.payload;
  } catch (error) {
    console.error('Error ending challenge:', error);
    throw error;
  }
};

export const submitSolution = async (submission: ChallengeSubmission) => {
  try {
    const response = await axiosInstance.post('/challenges/submit', {
      challenge_id: submission.challengeId,
      problem_id: submission.problemId,
      code: submission.code,
      language: submission.language
    });
    return response.data.payload;
  } catch (error) {
    console.error('Error submitting solution:', error);
    throw error;
  }
};

export const getSubmissionStatus = async (submissionId: string): Promise<SubmissionStatus> => {
  try {
    const response = await axiosInstance.get('/challenges/submissions/status', {
      params: { submission_id: submissionId }
    });
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching submission status:', error);
    throw error;
  }
};

export const getChallengeSubmissions = async (challengeId: string) => {
  try {
    const response = await axiosInstance.get('/challenges/submissions', {
      params: { challenge_id: challengeId }
    });
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching challenge submissions:', error);
    throw error;
  }
};

export const getUserChallengeStats = async (userId: string) => {
  try {
    const response = await axiosInstance.get('/challenges/stats/user', {
      params: { user_id: userId }
    });
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching user challenge stats:', error);
    throw error;
  }
};

export const getChallengeUserStats = async (challengeId: string, userId: string) => {
  try {
    const response = await axiosInstance.get('/challenges/stats/challenge-user', {
      params: {
        challenge_id: challengeId,
        user_id: userId
      }
    });
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching challenge-user stats:', error);
    throw error;
  }
};

// Mock function since API might not be implemented yet
export const getChallengeInvites = async (): Promise<ChallengeInvite[]> => {
  try {
    const response = await axiosInstance.get('/challenges/invites');
    return response.data.payload || [];
  } catch (error) {
    console.error('Error fetching challenge invites:', error);
    // Return empty array to not break UI
    return [];
  }
};

// Add function for searching users
export const searchUsers = async (query: string): Promise<UserProfile[]> => {
  try {
    const response = await axiosInstance.get('/users/search', {
      params: { query }
    });
    return response.data.payload || [];
  } catch (error) {
    console.error('Error searching users:', error);
    return []; // Return empty array on error to prevent UI breaks
  }
};

// Utility function for accessing private challenges via code
export const joinChallengeWithCode = async (accessCode: string): Promise<{ success: boolean; challenge: Challenge }> => {
  try {
    const response = await axiosInstance.post('/challenges/join', {
      access_code: accessCode
    });
    return {
      success: true,
      challenge: response.data.payload
    };
  } catch (error) {
    console.error('Error joining challenge with code:', error);
    throw error;
  }
};
