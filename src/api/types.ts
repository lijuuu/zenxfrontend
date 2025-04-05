// Placeholder file for updating User type

export interface HeatmapData {
  [date: string]: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  earnedAt?: string;
}

// Unified UserProfile interface
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
    website?: string;
  };
  createdAt: number;
  
  // Additional UI fields
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

// Fix for Chat component that uses username by creating an alias to UserProfile
export type User = UserProfile;
