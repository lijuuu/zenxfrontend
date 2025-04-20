
// Challenge API types with snake_case for API communication and camelCase for frontend

// Import from existing types
import { UserProfile } from '@/api/types';

// Challenge represents a coding challenge
export interface Challenge {
  id: string;
  title: string;
  creatorId: string;
  difficulty: string;
  isPrivate: boolean;
  status: string;
  password?: string; // Only for private challenges
  accessCode?: string; // Frontend version of password
  problemIds: string[];
  timeLimit: number;
  createdAt: number;
  isActive: boolean;
  participantIds: string[];
  userProblemMetadata?: { [key: string]: ProblemMetadataList };
  startTime?: number;
  endTime?: number;
  participantUsers?: UserProfile[]; // Added to store participant user details
}

// API request/response types with snake_case
export interface CreateChallengeRequest {
  title: string;
  creator_id: string;
  difficulty: string;
  is_private: boolean;
  problem_ids: string[];
  time_limit: number;
  // start_at field commented out as requested
  // start_at?: { seconds: number; nanos: number };
}

export interface CreateChallengeResponse {
  id: string;
  password?: string;
  join_url?: string;
}

export interface JoinChallengeRequest {
  challenge_id: string;
  user_id: string;
  password?: string;
}

export interface JoinChallengeResponse {
  challenge_id: string;
  success: boolean;
  message: string;
}

export interface StartChallengeRequest {
  challenge_id: string;
  user_id: string;
}

export interface StartChallengeResponse {
  success: boolean;
  start_time: number;
}

export interface EndChallengeRequest {
  challenge_id: string;
  user_id: string;
}

export interface EndChallengeResponse {
  success: boolean;
  leaderboard?: LeaderboardEntry[];
}

export interface GetSubmissionStatusRequest {
  submission_id: string;
}

export interface SubmissionStatus {
  submission_id: string;
  challenge_id: string;
  problem_id: string;
  user_id: string;
  status: 'pending' | 'completed' | 'failed';
  code: string;
  language: string;
  result?: {
    output?: string;
    error?: string;
    execution_time?: number;
    memory_usage?: number;
    test_cases?: {
      passed: number;
      failed: number;
      total: number;
    };
  };
  created_at: number;
}

// ChallengeProblemMetadata represents metadata for a problem in a challenge
export interface ChallengeProblemMetadata {
  problemId: string;
  score: number;
  timeTaken: number;
  completedAt: number;
}

// Snake case version for API
export interface ChallengeProblemMetadataAPI {
  problem_id: string;
  score: number;
  time_taken: number;
  completed_at: number;
}

// ProblemMetadataList holds a list of challenge problem metadata
export interface ProblemMetadataList {
  challengeProblemMetadata: ChallengeProblemMetadata[];
}

// UserStats represents user statistics across challenges
export interface UserStats {
  userId: string;
  problemsCompleted: number;
  totalTimeTaken: number;
  challengesCompleted: number;
  score: number;
  challengeStats: { [key: string]: ChallengeStat };
}

// ChallengeStat represents user stats for a specific challenge
export interface ChallengeStat {
  rank: number;
  problemsCompleted: number;
  totalScore: number;
}

// API version of ChallengeStat
export interface ChallengeStatAPI {
  rank: number;
  problems_completed: number;
  total_score: number;
}

// Leaderboard entry for challenges
export interface LeaderboardEntry {
  userId: string;
  problemsCompleted: number;
  totalScore: number;
  rank: number;
  user?: UserProfile;
}

// API version of LeaderboardEntry
export interface LeaderboardEntryAPI {
  user_id: string;
  problems_completed: number;
  total_score: number;
  rank: number;
}

// User Challenge History interfaces
export interface GetUserChallengeHistoryRequest {
  user_id: string;
  page?: number;
  page_size?: number;
  is_private?: boolean;
}

export interface GetUserChallengeHistoryResponse {
  challenges: Challenge[];
  total_count: number;
  page: number;
  page_size: number;
  message: string;
}

export interface ChallengeHistoryParams {
  userId?: string;
  page?: number;
  pageSize?: number;
  isPrivate?: boolean;
}
