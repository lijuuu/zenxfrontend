
// Challenge API types with snake_case for API communication and camelCase for frontend

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

export interface UserProfile {
  userID?: string;
  userName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  verificationStatus?: boolean;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  bio?: string;
  country?: string;
  status?: string; // Added status field for admin purposes
  socials?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  followingCount?: number;
  followersCount?: number;
  website?: string;
  githubProfile?: string;
  location?: string;
  globalRank?: number;
  currentRating?: number;
  referralLink?: string;
  badges?: any[];
  is2FAEnabled?: boolean;
  primaryLanguageID?: string;
  muteNotifications?: boolean;
}

// API request/response types with snake_case
export interface CreateChallengeRequest {
  title: string;
  creator_id: string;
  difficulty: string;
  is_private: boolean;
  problem_ids: string[];
  time_limit: number;
  expected_start?: number;
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

// ProblemMetadata represents metadata for a problem
export interface ProblemMetadata {
  problem_id: string;
  title: string;
  description: string;
  tags: string[];
  testcase_run: {
    run: TestCase[];
  };
  difficulty: string;
  supported_languages: string[];
  validated: boolean;
  placeholder_maps: {
    [key: string]: string;
  };
}

// TestCase represents a problem test case
export interface TestCase {
  id?: string;
  input: string;
  expected: string;
}

// TestCaseRunOnly represents a test case with only run cases
export interface TestCaseRunOnly {
  run: TestCase[];
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
  username?: string;
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

// Execution result type
export interface ExecutionResult {
  overallPass: boolean;
  totalTestCases: number;
  passedTestCases: number;
  failedTestCases: number;
  syntaxError?: string | null;
  failedTestCase?: {
    testCaseIndex: number;
    input?: any;
    expected?: any;
    received?: any;
    error?: string;
  };
}

// Test result type
export interface TestResult {
  passed: boolean;
  output?: string;
  error?: string;
  executionTime?: number;
}

// API response payload type
export interface ApiResponsePayload {
  problem_id?: string;
  language?: string;
  is_run_testcase?: boolean;
  rawoutput?: ExecutionResult;
  message?: string;
}

// Generic response type
export interface GenericResponse {
  success: boolean;
  status: number;
  payload: ApiResponsePayload;
  error?: { errorType: string; message: string };
}

// Mock two sum problem for fallback
export const twoSumProblem: ProblemMetadata = {
  problem_id: 'two-sum',
  title: 'Two Sum',
  description: '# Two Sum\n\nGiven an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\n## Example\n\n- Input: nums = [2,7,11,15], target = 9\n- Output: [0,1]\n- Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].',
  tags: ['Array', 'Hash Table'],
  testcase_run: {
    run: [
      { id: '1', input: '{"nums": [2,7,11,15], "target": 9}', expected: '[0,1]' },
      { id: '2', input: '{"nums": [3,2,4], "target": 6}', expected: '[1,2]' }
    ]
  },
  difficulty: 'Easy',
  supported_languages: ['javascript', 'python', 'go', 'cpp'],
  validated: true,
  placeholder_maps: {
    javascript: 'function twoSum(nums, target) {\n  // Write your code here\n  \n}',
    python: 'def twoSum(nums, target):\n    # Write your code here\n    \n    ',
    go: 'func twoSum(nums []int, target int) []int {\n    // Write your code here\n    \n}',
    cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n    \n}'
  }
};
