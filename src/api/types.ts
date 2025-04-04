// User related types
export interface UserProfile {
  // Core identification fields
  userID: string;
  userName: string;
  firstName: string;
  lastName: string;
  avatarURL: string;
  email: string;
  role: string;
  country: string;
  isBanned: boolean;
  isVerified: boolean;
  primaryLanguageID: string;
  muteNotifications: boolean;
  socials: {
    github: string;
    twitter: string;
    linkedin: string;
    website?: string; // Added website to socials
  };
  createdAt: number;
  
  // Additional UI fields
  joinedDate?: string;
  problemsSolved?: number;
  dayStreak?: number;
  ranking?: number;
  profileImage?: string; // For compatibility with components expecting 'profileImage'
  is2FAEnabled?: boolean;
  followers?: number;
  following?: number;
  countryCode?: string;
  bio?: string;
  
  // Stats, achievements, and other data
  stats?: {
    easy: { solved: number; total: number };
    medium: { solved: number; total: number };
    hard: { solved: number; total: number };
  };
  achievements?: {
    weeklyContests: number;
    monthlyContests: number;
    specialEvents: number;
  };
  badges?: Badge[];
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

// Problem related types
export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  acceptanceRate: number;
  solved?: boolean;
  description: string;
  examples: ProblemExample[];
  constraints: string[];
  hints?: string[];
  similarProblems?: { id: string; title: string; difficulty: string }[];
  solutions?: Solution[];
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

// Challenge related types
export interface Challenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  createdBy: {
    id: string;
    username: string;
    profileImage?: string;
  };
  participants: number;
  participantUsers?: {
    id?: string;
    avatar?: string;
    name?: string;
  }[];
  problemCount: number;
  createdAt: string;
  isActive: boolean;
  problems?: string[];
  description?: string;
  date?: string;
  type?: string;
  isPrivate?: boolean;
  accessCode?: string;
  timeLimit?: number;
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
  user: {
    id: string;
    username: string;
    fullName: string;
    profileImage?: string;
    country?: string;
    countryCode?: string;
  };
  score: number;
  problemsSolved: number;
  contestsParticipated: number;
  streakDays: number;
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

// Submission related types
export interface Submission {
  id: string;
  problemId: string;
  problemTitle: string;
  userId: string;
  language: string;
  code: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Memory Limit Exceeded' | 'Runtime Error' | 'Compilation Error' | 'Processing';
  runtime?: string;
  memory?: string;
  timestamp: string;
  submittedAt?: string;
  testCases?: {
    passed: number;
    total: number;
    results?: {
      input: string;
      expectedOutput: string;
      actualOutput?: string;
      passed: boolean;
      error?: string;
    }[];
  };
  difficulty?: string;
  problem?: {
    id: string;
    title: string;
    difficulty: string;
  };
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
  userID: string;
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
  banHistories: { [userID: string]: BanHistory[] };
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

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  adminID: string;
  message: string;
}

export interface UsersResponse {
  users: UserProfile[];
  totalCount: number;
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
  problem_id: string;
  title: string;
  description: string;
  tags: string[];
  testcase_run: TestCaseRunOnly;
  difficulty: string;
  supported_languages: string[];
  validated?: boolean;
  placeholder_maps: { [key: string]: string };
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
  syntaxError?: string;
};

export type ApiResponsePayload = {
  problem_id: string;
  language: string;
  is_run_testcase: boolean;
  rawoutput: ExecutionResult;
};


export const twoSumProblem: ProblemMetadata = {
  problem_id: "67d96452d3fe6af39801337b",
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
  testcase_run: {
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
  supported_languages: ["go", "python", "javascript"],
  validated: true,
  placeholder_maps: {
    go: `func twoSum(nums []int, target int) []int {
    // Type your code
    return []int{}
}`,
    javascript: `function twoSum(nums, target) {
    // Type your code
    return [];
}`,
    python: `def two_sum(nums, target):
    # Type your code
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
