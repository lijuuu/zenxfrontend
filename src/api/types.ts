
// User related types
export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  profileImage?: string;
  bio?: string;
  website?: string;
  githubProfile?: string;
  location?: string;
  joinedDate: string;
  problemsSolved: number;
  dayStreak: number;
  ranking: number;
  isBanned: boolean;
  isVerified: boolean;
  following?: number;
  followers?: number;
  is2FAEnabled?: boolean;
  isOnline?: boolean;
  country?: string;
  countryCode?: string;
}

export interface UserProfile extends User {
  stats: {
    easy: { solved: number; total: number };
    medium: { solved: number; total: number };
    hard: { solved: number; total: number };
  };
  achievements: {
    weeklyContests: number;
    monthlyContests: number;
    specialEvents: number;
  };
  badges: Badge[];
  activityHeatmap: HeatmapData;
  currentStreak?: number;
  longestStreak?: number;
  currentRating?: number;
  globalRank?: number;
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
  participants?: User[];
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
  user: User;
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

// adminTypes.ts

// Types based on Go backend models
export interface UserProfile {
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
  };
  createdAt: number;
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

