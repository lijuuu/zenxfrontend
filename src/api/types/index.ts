
// Re-export all types from existing files
export * from './compiler';
export * from './problem-execution';

// Define common response types
export interface LoginResponse {
  token: string;
  user: UserProfile;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: UserProfile;
}

export interface LoginCredentials {
  email: string;
  password: string;
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
}

// Badge types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  acquiredAt?: string;
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

// Leaderboard types
export interface LeaderboardState {
  globalLeaderboard: UserProfile[];
  friendsLeaderboard: UserProfile[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
