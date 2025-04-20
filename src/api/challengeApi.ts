import axiosInstance from "@/utils/axiosInstance";
import { 
  Challenge, 
  LeaderboardEntry, 
  LeaderboardEntryAPI, 
  UserStats, 
  ChallengeProblemMetadata, 
  ChallengeProblemMetadataAPI,
  GetUserChallengeHistoryResponse
} from "./challengeTypes";
import { UserProfile } from "./types";

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

// Transform camelCase to snake_case for API requests
const transformLeaderboardEntry = (entry: LeaderboardEntryAPI): LeaderboardEntry => ({
  userId: entry.user_id,
  problemsCompleted: entry.problems_completed,
  totalScore: entry.total_score,
  rank: entry.rank
});

const transformChallengeProblemMetadata = (metadata: ChallengeProblemMetadataAPI): ChallengeProblemMetadata => ({
  problemId: metadata.problem_id,
  score: metadata.score,
  timeTaken: metadata.time_taken,
  completedAt: metadata.completed_at
});

export const createChallenge = async (data: {
  title: string;
  difficulty: string;
  problemIds: string[];
  isPrivate: boolean;
  timeLimit?: number;
  accessCode?: string;
  creatorId: string;
}) => {
  try {
    const response = await axiosInstance.post('/challenges', {
      title: data.title,
      difficulty: data.difficulty,
      problem_ids: data.problemIds,
      is_private: data.isPrivate,
      time_limit: data.timeLimit,
      access_code: data.accessCode,
      creator_id: data.creatorId
      // start_at commented out as requested
      // start_at: data.startTime ? { seconds: data.startTime, nanos: 0 } : undefined
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
  page?: number;
  pageSize?: number;
}) => {
  try {
    const params: Record<string, any> = {
      is_active: filters?.active,
      difficulty: filters?.difficulty,
      include_private: filters?.isPrivate,
      user_id: filters?.userId,
      page: filters?.page,
      page_size: filters?.pageSize
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

export const joinChallenge = async (challengeId: string, accessCode?: string, userId?: string) => {
  try {
    const response = await axiosInstance.post('/challenges/join', {
      challenge_id: challengeId,
      password: accessCode, // Using password instead of access_code based on API spec
      user_id: userId
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

export const startChallenge = async (challengeId: string, userId?: string) => {
  try {
    const response = await axiosInstance.post('/challenges/start', {
      challenge_id: challengeId,
      user_id: userId
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

export const endChallenge = async (challengeId: string, userId?: string) => {
  try {
    const response = await axiosInstance.post('/challenges/end', {
      challenge_id: challengeId,
      user_id: userId
    }, {
      headers: { 'X-Requires-Auth': 'true' }
    });

    const leaderboard = response.data.payload.leaderboard || [];
    return {
      success: response.data.payload.success,
      leaderboard: leaderboard.map(transformLeaderboardEntry)
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
    
    // Transform response to match frontend expected types
    const submission = response.data.payload;
    return {
      submissionId: submission.submission_id,
      challengeId: submission.challenge_id,
      problemId: submission.problem_id,
      userId: submission.user_id,
      status: submission.status,
      code: submission.code,
      language: submission.language,
      result: submission.result,
      createdAt: submission.created_at
    };
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
    
    // Transform submissions to match frontend expected types
    return (response.data.payload.submissions || []).map((submission: any) => ({
      id: submission.id,
      problemId: submission.problem_id,
      userId: submission.user_id,
      challengeId: submission.challenge_id,
      submittedAt: submission.submitted_at,
      score: submission.score,
      status: submission.status,
      output: submission.output,
      language: submission.language,
      executionTime: submission.execution_time,
      difficulty: submission.difficulty,
      isFirst: submission.is_first,
      title: submission.title,
      userCode: submission.user_code
    }));
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
    
    const apiStats = response.data.payload.stats || null;
    if (!apiStats) return null;
    
    // Transform to frontend format
    const challengeStats: { [key: string]: any } = {};
    
    // Convert challenge stats from snake_case to camelCase
    Object.keys(apiStats.challenge_stats || {}).forEach(challengeId => {
      const stat = apiStats.challenge_stats[challengeId];
      challengeStats[challengeId] = {
        rank: stat.rank,
        problemsCompleted: stat.problems_completed,
        totalScore: stat.total_score
      };
    });
    
    return {
      userId: apiStats.user_id,
      problemsCompleted: apiStats.problems_completed,
      totalTimeTaken: apiStats.total_time_taken,
      challengesCompleted: apiStats.challenges_completed,
      score: apiStats.score,
      challengeStats
    };
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
    
    const apiData = response.data.payload || null;
    if (!apiData) return null;
    
    return {
      userId: apiData.user_id,
      problemsCompleted: apiData.problems_completed,
      totalScore: apiData.total_score,
      rank: apiData.rank,
      challengeProblemMetadata: (apiData.challenge_problem_metadata || [])
        .map(transformChallengeProblemMetadata)
    };
  } catch (error) {
    console.error('Error fetching challenge-user stats:', error);
    return null;
  }
};

export const getChallengeWithMetadata = async (id: string, userId: string) => {
  try {
    const response = await axiosInstance.get('/challenges/details', {
      params: { 
        challenge_id: id,
        user_id: userId 
      },
      headers: { 'X-Requires-Auth': 'true' }
    });
    
    const data = response.data.payload;
    return {
      challenge: transformChallenge(data.challenge),
      leaderboard: (data.leaderboard || []).map(transformLeaderboardEntry),
      userMetadata: data.user_metadata
    };
  } catch (error) {
    console.error('Error fetching challenge with metadata:', error);
    throw error;
  }
};

export const submitSolution = async (data: { 
  challengeId: string;
  problemId: string;
  code: string;
  language: string;
  userId?: string;
}) => {
  try {
    const response = await axiosInstance.post('/challenges/submit', {
      challenge_id: data.challengeId,
      problem_id: data.problemId,
      code: data.code,
      language: data.language,
      user_id: data.userId
    }, {
      headers: { 'X-Requires-Auth': 'true' }
    });
    return response.data.payload;
  } catch (error) {
    console.error('Error submitting solution:', error);
    throw error;
  }
};

export const fetchParticipantProfiles = async (userIds: string[]) => {
  try {
    if (!userIds.length) return [];
    
    const response = await axiosInstance.get('/users/batch', {
      params: { user_ids: userIds.join(',') },
      headers: { 'X-Requires-Auth': 'true' }
    });
    
    return response.data?.payload?.users || [];
  } catch (error) {
    console.error('Error fetching participant profiles:', error);
    return [];
  }
};

// Add the new user challenge history function
export const getUserChallengeHistory = async (params: {
  isPrivate?: boolean;
  page?: number;
  pageSize?: number;
}) => {
  try {
    const response = await axiosInstance.get('/challenges/history', {
      params: {
        is_private: params.isPrivate,
        page: params.page,
        page_size: params.pageSize
      },
      headers: { 'X-Requires-Auth': 'true' }
    });
    
    const data = response.data.payload;
    return {
      challenges: (data.challenges || []).map(transformChallenge),
      total_count: data.total_count,
      page: data.page,
      page_size: data.page_size,
      message: data.message
    };
  } catch (error) {
    console.error('Error fetching user challenge history:', error);
    // Return empty data instead of throwing
    return {
      challenges: [],
      total_count: 0,
      page: 1,
      page_size: 10,
      message: "Failed to load challenge history"
    };
  }
};
