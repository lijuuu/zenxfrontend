
import axiosInstance from '@/utils/axiosInstance';
import { Challenge, UserProfile, SubmissionStatus } from './types';

export interface CreateChallengeOptions {
  title: string;
  difficulty: string;
  problem_ids: string[];
  is_private: boolean;
  time_limit?: number;
  access_code?: string;
  start_at?: Date;
}

export interface ChallengeJoinRequest {
  challenge_id: string;
  access_code?: string;
}

export interface ChallengeSubmission {
  challenge_id: string;
  problem_id: string;
  code: string;
  language: string;
}

export const getChallenges = async (filters?: {
  active?: boolean;
  difficulty?: string;
  page?: number;
  pageSize?: number;
  isPrivate?: boolean;
  userId?: string;
}) => {
  try {
    const params: Record<string, any> = {};
    if (filters?.active !== undefined) params.is_active = filters.active;
    if (filters?.difficulty) params.difficulty = filters.difficulty;
    if (filters?.page) params.page = filters.page;
    if (filters?.pageSize) params.page_size = filters.pageSize;
    if (filters?.isPrivate !== undefined) params.is_private = filters.isPrivate;
    if (filters?.userId) params.userid = filters.userId;

    const response = await axiosInstance.get('/challenges/public', { params });
    return response.data.payload.challenges;
  } catch (error) {
    console.error('Error fetching challenges:', error);
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
      problem_ids: data.problem_ids,
      is_private: data.is_private,
      time_limit: data.time_limit || 3600,
      access_code: data.access_code,
      start_at: data.start_at ? {
        seconds: Math.floor(data.start_at.getTime() / 1000),
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

export const joinChallenge = async (data: ChallengeJoinRequest): Promise<Challenge> => {
  try {
    const response = await axiosInstance.post('/challenges/join', {
      challenge_id: data.challenge_id,
      access_code: data.access_code
    });
    return response.data.payload;
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
      challenge_id: submission.challenge_id,
      problem_id: submission.problem_id,
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

export const getChallengeInvites = async () => {
  try {
    const response = await axiosInstance.get('/challenges/invites');
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching challenge invites:', error);
    return [];
  }
};
