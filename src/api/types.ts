export interface UserProfile {
  //core identification fields
  userId?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  avatarURL?: string;
  email?: string;
  role?: string;
  country?: string;
  isBanned?: boolean;
  isVerified?: boolean;
  primaryLanguageID?: string;
  muteNotifications?: boolean;
  socials?: {
    github: string;
    twitter: string;
    linkedin: string;
    website?: string;
  };
  createdAt?: number;

  //additional UI fields
  joinedDate?: string;
  problemsSolved?: number;
  dayStreak?: number;
  ranking?: number;
  profileImage?: string;
  is2FAEnabled?: boolean;
  followers?: number;
  following?: number;
  countryCode?: string;
  bio?: string;

  //refer
  referralLink?: string;

  // Stats, achievements, and other data
  stats?: {
    easy: { solved: number; total: number };
    medium: { solved: number; total: number };
    hard: { solved: number; total: number };
  };
  activityHeatmap?: HeatmapData;
  currentStreak?: number;
  longestStreak?: number;
  currentRating?: number;
  globalRank?: number;
  website?: string;
  githubProfile?: string;
  location?: string;
  isOnline?: boolean;
}

export interface LoginUserResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  userId: string;
  userProfile: UserProfile;
  message: string;
}

export interface ApiResponse {
  success: boolean;
  status: number;
  payload: LoginUserResponse | UserProfile | { message: string; expiryAt?: number } | { message: string };
}

export interface AuthState {
  userId: string | null;
  isVerified?: boolean,
  isAuthenticated?: boolean;
  email: string | null;
  loading: boolean;
  error: { message: string; code?: number; type?: string } | null;
  accessToken: string | null;
  refreshToken: string | null;
  successMessage: string | null;
  userProfile: UserProfile | null;
  lastResendTimestamp: number | null;
  resendCooldown: boolean;
  expiryAt: number | null;
}


export interface Friend {
  id: string;
  username: string;
  fullName: string;
  profileImage?: string;
  status: 'online' | 'offline' | 'in-match' | 'coding';
  lastActive?: string;
  isOnline?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface HeatmapData {
  startDate: string;
  data: { date: string; count: number; present: boolean }[];
}

export interface CompilerState {
  code: string;
  language: string;
  loading: boolean;
  file: string;
  result: CompilerResponse;
  files: File[];
  currentFile: string | null;
  isRenaming: boolean;
  newFileName: string;
  fileToRename: string | null;
}

export interface Problem {
  problemId: string;
  title: string;
  description: string;
  tags: string[];
  difficulty: string;
  testcaseRun: { run: { input: string; expected: string }[] };
  supportedLanguages: string[];
  validated: boolean;
  placeholderMaps: { [key: string]: string };
}


export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface Solution {
  id: string;
  authorId: string;
  authorName: string;
  language: string;
  code: string;
  runtime: string;
  memory: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  content: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  replies?: Comment[];
}


// Chat related types
export interface ChatChannel {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  participants?: UserProfile[];
  unreadCount?: number;
  isOnline?: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  sender: {
    id: string;
    username: string;
    profileImage?: string;
    isOnline?: boolean;
  };
  content: string;
  timestamp: string;
  isCurrentUser?: boolean;
  attachments?: {
    type: 'image' | 'code' | 'link' | 'challenge-invite';
    content: string;
    challengeId?: string;
    challengeTitle?: string;
    isPrivate?: boolean;
    accessCode?: string;
  }[];
  liked?: boolean;
  likeCount?: number;
}

// Leaderboard related types
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  problemsCompleted: number;
  totalScore: number;
  user?: UserProfile;
}

// Auth related types
export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: UserProfile;
}

export interface LoginCredentials {
  email: string;
  password: string;
  code?: string; // For 2FA
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  submittedAt: string;
  status: "SUCCESS" | "FAILED" | "PENDING" | "PROCESSING";
  userCode: string;
  language: string;
  score: number;
  difficulty: "E" | "M" | "H";
  isFirst: boolean;
  title: string;
}

// Compiler related types
export interface CompileRequest {
  language: string;
  code: string;
  input?: string;
}

export interface CompileResponse {
  output: string;
  error?: string;
  executionTime?: string;
  memory?: string;
}

export interface BanHistory {
  id: string;
  userId: string;
  bannedAt: number;
  banType: string;
  banReason: string;
  banExpiry: number;
}

export interface GenericResponse<T> {
  success: boolean;
  status: number;
  payload: T;
  error?: {
    code: number;
    message: string;
    details?: string;
  };
}

// State interface for the admin slice
export interface AdminState {
  users: UserProfile[];
  totalUsers: number;
  nextPageToken: string;
  banHistories: { [userId: string]: BanHistory[] };
  loading: boolean;
  error: string | null;
  message: string;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  adminID: string | null;
  expiresIn: number | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  adminID: string;
  message: string;
}

export interface UsersResponse {
  users: UserProfile[];
  totalCount: number;
  prevPageToken: string;
  nextPageToken: string;
}

export interface File {
  id: string;
  name: string;
  language: string;
  content: string;
  createdAt: string;
  lastModified: string;
}

export interface CompilerResponse {
  output?: string;
  status_message?: string;
  error?: string;
  success?: boolean;
  execution_time?: number;
}

export type TestCase = {
  id?: string;
  input: string;
  expected: string;
};

export type TestCaseRunOnly = {
  run: TestCase[];
};

export type ProblemMetadata = {
  problemId: string;
  title: string;
  description: string;
  tags: string[];
  testcaseRun: TestCaseRunOnly;
  difficulty: string;
  supportedLanguages: string[];
  validated?: boolean;
  placeholderMaps: { [key: string]: string };
};

export type TestResult = {
  testCaseIndex: number;
  input: any;
  expected: any;
  received: any;
  passed: boolean;
  error?: string;
};

export type ExecutionResult = {
  totalTestCases: number;
  passedTestCases: number;
  failedTestCases: number;
  overallPass: boolean;
  failedTestCase?: TestResult;
  error?: string;
};

export type ApiResponsePayload = {
  problemId: string;
  language: string;
  isRunTestcase: boolean;
  rawoutput: ExecutionResult;
};


export const twoSumProblem: ProblemMetadata = {
  problemId: "67d96452d3fe6af39801337b",
  title: "Two Sum",
  description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to the target.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.

## Examples

### Example 1:
- **Input**: \`nums = [2,7,11,15]\`, \`target = 9\`
- **Output**: \`[0,1]\`
- **Explanation**: Because \`nums[0] + nums[1] == 9\`, we return \`[0, 1]\`

### Example 2:
- **Input**: \`nums = [3,2,4]\`, \`target = 6\`
- **Output**: \`[1,2]\`

## Constraints
- \`2 <= nums.length <= 10⁴\`
- \`-10⁹ <= nums[i] <= 10⁹\`
- \`-10⁹ <= target <= 10⁹\`
- Only one valid answer exists

## Follow-up
Can you come up with an algorithm that is less than \`O(n²)\` time complexity?`,
  tags: ["Array", "Hash Table", "String", "Linked List"],
  testcaseRun: {
    run: [
      {
        id: "67e16a5a48ec539e82f1622c",
        input: '{ "nums": [2,7,11,15], "target": 9 }',
        expected: "[0,1]",
      },
      {
        id: "67e216734e8f4ccb4fda6635",
        input: '{ "nums": [2, 7, 11, 15], "target": 9 }',
        expected: "[0,1]",
      },
    ],
  },
  difficulty: "Easy",
  supportedLanguages: ["go", "python", "javascript"],
  validated: true,
  placeholderMaps: {
    go: `func twoSum(nums []int, target int) []int {
    // Type your code
    return []int{}
}`,
    javascript: `function twoSum(nums, target) {
    // Type your code
    return [];
}`,
    python: `def two_sum(nums, target):
    // Type your code
    return []`,
  },
};


export interface File {
  id: string;
  name: string;
  language: string;
  content: string;
  createdAt: string;
  lastModified: string;
}

export interface CompilerResponse {
  output?: string;
  status_message?: string;
  error?: string;
  success?: boolean;
  execution_time?: number;
}

// Adding SubmissionStatus type - ensuring it's properly exported
export interface SubmissionStatus {
  submission_id: string;
  challenge_id: string;
  problemId: string;
  userId: string;
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

// CreateChallengeRequest represents the request to create a challenge
export interface CreateChallengeRequest {
  title: string;
  creatorId: string;
  difficulty: string;
  isPrivate: boolean;
  problemIds: string[];
  timeLimit: number;
  startAt: { seconds: number; nanos: number };
}

// CreateChallengeResponse represents the response for creating a challenge
export interface CreateChallengeResponse {
  id: string;
  password: string; // Only for private challenges
  joinUrl: string;
}

// GetChallengeDetailsRequest represents the request to get challenge details
export interface GetChallengeDetailsRequest {
  id: string;
  userId: string;
}



// GetPublicChallengesRequest represents the request to get public challenges
export interface GetPublicChallengesRequest {
  difficulty: string;
  isActive: boolean;
  page: number;
  pageSize: number;
  userId: string;
  includePrivate: boolean;
}



// JoinChallengeRequest represents the request to join a challenge
export interface JoinChallengeRequest {
  challengeId: string;
  userId: string;
  password?: string; // Optional, required for private challenges
}

// JoinChallengeResponse represents the response for joining a challenge
export interface JoinChallengeResponse {
  challengeId: string;
  success: boolean;
  message: string;
}

// StartChallengeRequest represents the request to start a challenge
export interface StartChallengeRequest {
  challengeId: string;
  userId: string;
}

// StartChallengeResponse represents the response for starting a challenge
export interface StartChallengeResponse {
  success: boolean;
  startTime: number;
}

// EndChallengeRequest represents the request to end a challenge
export interface EndChallengeRequest {
  challengeId: string;
  userId: string;
}

// EndChallengeResponse represents the response for ending a challenge
export interface EndChallengeResponse {
  success: boolean;
  leaderboard: LeaderboardEntry[];
}

// GetSubmissionStatusRequest represents the request to get submission status
export interface GetSubmissionStatusRequest {
  submissionId: string;
}

// GetSubmissionStatusResponse represents the response for getting submission status
export interface GetSubmissionStatusResponse {
  submission: Submission;
}

// GetChallengeSubmissionsRequest represents the request to get challenge submissions
export interface GetChallengeSubmissionsRequest {
  challengeId: string;
}

// GetChallengeSubmissionsResponse represents the response for getting challenge submissions
export interface GetChallengeSubmissionsResponse {
  submissions: Submission[];
}

// GetUserStatsRequest represents the request to get user stats
export interface GetUserStatsRequest {
  userId: string;
}

// GetUserStatsResponse represents the response for getting user stats
export interface GetUserStatsResponse {
  stats: UserStats;
}

// GetChallengeUserStatsRequest represents the request to get challenge-specific user stats
export interface GetChallengeUserStatsRequest {
  challengeId: string;
  userId: string;
}


