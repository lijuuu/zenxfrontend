
import axiosInstance from "@/utils/axiosInstance";
import { Challenge, LeaderboardEntry, UserProfile, ProblemMetadataList } from "./types";

// Transform snake_case to camelCase
const transformChallenge = (data: any): Challenge => ({
  id: data.id,
  title: data.title,
  creatorId: data.creator_id,
  difficulty: data.difficulty,
  isPrivate: data.is_private,
  status: data.status,
  password: data.password,
  problemIds: data.problem_ids || [],
  timeLimit: data.time_limit,
  createdAt: data.created_at,
  isActive: data.is_active,
  participantIds: data.participant_ids || [],
  userProblemMetadata: data.user_problem_metadata,
  startTime: data.start_time,
  endTime: data.end_time
});

export const createChallenge = async (data: {
  title: string;
  difficulty: string;
  problemIds: string[];
  isPrivate: boolean;
  timeLimit?: number;
  accessCode?: string;
  startTime?: number
}) => {
  try {
    const response = await axiosInstance.post('/challenges', {
      title: data.title,
      difficulty: data.difficulty,
      problem_ids: data.problemIds,
      is_private: data.isPrivate,
      time_limit: data.timeLimit,
      access_code: data.accessCode,
      start_time : data.startTime
    }, {
      headers: { 'X-Requires-Auth': 'true' }
    });
    return transformChallenge(response.data.payload);
  } catch (error) {
    console.error('Error creating challenge:', error);
    throw error;
  }
};

export const getChallenge = async (id: string) => {
  try {
    const response = await axiosInstance.get('/challenges/details', {
      params: { challenge_id: id },
      headers: { 'X-Requires-Auth': 'true' }
    });
    return transformChallenge(response.data.payload.challenge);
  } catch (error) {
    console.error('Error fetching challenge:', error);
    throw error;
  }
};

export const getChallenges = async (filters?: {
  active?: boolean;
  difficulty?: string;
  isPrivate?: boolean;
  userId?: string;
}) => {
  try {
    const params: Record<string, any> = {
      is_active: filters?.active,
      difficulty: filters?.difficulty,
      include_private: filters?.isPrivate,
      user_id: filters?.userId
    };

    const response = await axiosInstance.get('/challenges/public', {
      params,
      headers: { 'X-Requires-Auth': 'true' }
    });

    return (response.data?.payload?.challenges || []).map(transformChallenge);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return [];
  }
};

export const joinChallenge = async (challengeId: string, accessCode?: string) => {
  try {
    const response = await axiosInstance.post('/challenges/join', {
      challenge_id: challengeId,
      access_code: accessCode
    }, {
      headers: { 'X-Requires-Auth': 'true' }
    });

    return {
      success: response.data.payload.success,
      message: response.data.payload.message
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
    }, {
      headers: { 'X-Requires-Auth': 'true' }
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

export const endChallenge = async (challengeId: string) => {
  try {
    const response = await axiosInstance.post('/challenges/end', {
      challenge_id: challengeId
    }, {
      headers: { 'X-Requires-Auth': 'true' }
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

export const getSubmissionStatus = async (submissionId: string) => {
  try {
    const response = await axiosInstance.get('/challenges/submissions/status', {
      params: { submission_id: submissionId },
      headers: { 'X-Requires-Auth': 'true' }
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
      params: { challenge_id: challengeId },
      headers: { 'X-Requires-Auth': 'true' }
    });
    return response.data.payload.submissions || [];
  } catch (error) {
    console.error('Error fetching challenge submissions:', error);
    return [];
  }
};

export const getUserChallengeStats = async (userId: string) => {
  try {
    const response = await axiosInstance.get('/challenges/stats/user', {
      params: { user_id: userId },
      headers: { 'X-Requires-Auth': 'true' }
    });
    return response.data.payload.stats || null;
  } catch (error) {
    console.error('Error fetching user challenge stats:', error);
    return null;
  }
};

export const getChallengeUserStats = async (challengeId: string, userId: string) => {
  try {
    const response = await axiosInstance.get('/challenges/stats/challenge-user', {
      params: {
        challenge_id: challengeId,
        user_id: userId
      },
      headers: { 'X-Requires-Auth': 'true' }
    });
    return response.data.payload || null;
  } catch (error) {
    console.error('Error fetching challenge-user stats:', error);
    return null;
  }
};
