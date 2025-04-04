
// Instead of re-exporting all types, we'll selectively re-export to avoid conflicts
import { ActivityDay } from './problem-execution';
export type { ActivityDay } from './problem-execution';

// Define common response types
export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: UserProfile;
  accessToken?: string; // Added for admin API compatibility
  expiresIn?: number;
  adminID?: string;
  message?: string;
}

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

// Challenge related types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  createdAt: string;
  startDate: string;
  endDate: string;
  type: 'daily' | 'weekly' | 'monthly' | 'battle' | 'special';
  status: 'upcoming' | 'active' | 'completed';
  participants?: {
    userID: string;
    userName: string;
    firstName: string;
    lastName: string;
    avatarURL: string;
    rank?: number;
    score?: number;
    isFriend?: boolean;
  }[];
  isPrivate?: boolean;
  inviteCode?: string;
  ownerId?: string;
  problemIds?: string[];
  tags?: string[];
  
  // Backward compatibility fields
  accessCode?: string;
  isActive?: boolean;
  problemCount?: number;
  createdBy?: {
    id: string;
    username: string;
    profileImage?: string;
  };
  participantUsers?: {
    id?: string;
    avatar?: string;
    name?: string;
  }[];
  problems?: string[];
  date?: string;
  timeLimit?: number;
}

// Badge types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  acquiredAt?: string;
  // Backward compatibility fields
  earnedDate?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

// Heatmap data
export interface HeatmapDataPoint {
  date: string;
  count: number;
  present: boolean;
}

export interface HeatmapData {
  data: HeatmapDataPoint[];
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  startDate?: string; // For backward compatibility
}

// Types based on Go backend models
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
    website: string;
  };
  createdAt: number;
  
  // UI compatibility fields
  joinedDate?: string;
  problemsSolved?: number;
  dayStreak?: number;
  ranking?: number;
  profileImage?: string;
  is2FAEnabled?: boolean;
  followers?: string[];
  following?: string[];
  countryCode?: string;
  bio?: string;
  
  // Stats, achievements, and other data
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

// For backward compatibility
export interface User extends UserProfile {}

// For backwards compatibility with admin types
export interface BanHistory {
  id: string;
  userID: string;
  bannedAt: number;
  banType: string;
  banReason: string;
  banExpiry: number;
}

export interface GenericResponse {
  success: boolean;
  status: number;
  payload: any;
  error?: {
    code: number;
    message: string;
    details?: string;
  };
}

export interface UsersResponse {
  users: UserProfile[];
  totalCount: number;
  nextPageToken: string;
}

// Admin state interface
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

// Leaderboard state
export interface LeaderboardState {
  globalLeaderboard: UserProfile[];
  friendsLeaderboard: UserProfile[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
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

// For backwards compatibility - define joinChallengeWithCode function in challengeApi
export interface ChallengeJoinResponse {
  success: boolean;
  challenge: Challenge;
}

export function joinChallengeWithCode(code: string): Promise<ChallengeJoinResponse> {
  return Promise.resolve({ 
    success: true,
    challenge: {
      id: "mock-challenge-id",
      title: "Mock Challenge",
      description: "This is a mock challenge",
      difficulty: "Medium",
      type: "battle",
      accessCode: code,
      createdAt: new Date().toISOString(),
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
      isPrivate: true,
      inviteCode: code,
      
      // For backward compatibility
      createdBy: {
        id: "user-123",
        username: "user123",
        profileImage: "/assets/avatars/avatar-1.png"
      },
      participants: [],
      problemCount: 5,
      isActive: true
    }
  });
}
