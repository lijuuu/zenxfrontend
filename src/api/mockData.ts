import { UserProfile, Badge, Friend, Challenge, Problem, Submission, ChatChannel, ChatMessage, LeaderboardEntry } from './types';

// Generate heatmap data for the last 365 days
export const generateHeatmapData = () => {
  const today = new Date();
  const data = [];
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 364);
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Randomly determine activity
    const present = Math.random() > 0.4;
    const count = present ? Math.floor(Math.random() * 5) + 1 : 0;
    
    data.push({
      date: dateStr,
      count,
      present
    });
  }
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    data
  };
};

// Mock badges
export const mockBadges: Badge[] = [
  {
    id: "b1",
    name: "Problem Solver",
    description: "Solved 100 problems",
    icon: "trophy",
    earnedDate: "2023-02-15",
    rarity: "common"
  },
  {
    id: "b2",
    name: "Streak Master",
    description: "Maintained a 20-day streak",
    icon: "flame",
    earnedDate: "2023-03-10",
    rarity: "uncommon"
  },
  {
    id: "b3",
    name: "Contest Champion",
    description: "Won a weekly contest",
    icon: "award",
    earnedDate: "2023-03-25",
    rarity: "rare"
  }
];

// Mock user profiles
export const mockUserProfiles: UserProfile[] = [
  {
    // Core identification
    userID: "1",
    userName: "johndoe",
    firstName: "John",
    lastName: "Doe",
    avatarURL: "https://i.pravatar.cc/300?img=1",
    email: "john.doe@example.com",
    role: "user",
    country: "USA",
    isBanned: false,
    isVerified: true,
    primaryLanguageID: "javascript",
    muteNotifications: false,
    socials: {
      github: "johndoe",
      twitter: "johndoe",
      linkedin: "john-doe",
      website: "https://johndoe.dev"
    },
    createdAt: new Date("2022-01-15").getTime(),
    
    // UI compatibility fields
    id: "1",
    username: "johndoe",
    fullName: "John Doe",
    joinedDate: "2022-01-15",
    problemsSolved: 147,
    dayStreak: 26,
    ranking: 354,
    profileImage: "https://i.pravatar.cc/300?img=1",
    is2FAEnabled: false,
    followers: 78,
    following: 45,
    countryCode: "US",
    bio: "Software developer passionate about algorithms and data structures. Solving programming challenges in my free time.",
    
    // Stats and achievements
    stats: {
      easy: { solved: 78, total: 100 },
      medium: { solved: 45, total: 150 },
      hard: { solved: 24, total: 80 }
    },
    achievements: {
      weeklyContests: 12,
      monthlyContests: 5,
      specialEvents: 2
    },
    badges: mockBadges,
    activityHeatmap: generateHeatmapData(),
    currentStreak: 26,
    longestStreak: 52,
    currentRating: 354,
    globalRank: 354
  },
  {
    // Core identification
    userID: "2",
    userName: "janedoe",
    firstName: "Jane",
    lastName: "Doe",
    avatarURL: "https://i.pravatar.cc/300?img=5",
    email: "jane.doe@example.com",
    role: "user",
    country: "USA",
    isBanned: false,
    isVerified: true,
    primaryLanguageID: "python",
    muteNotifications: false,
    socials: {
      github: "janedoe",
      twitter: "janedoe",
      linkedin: "jane-doe",
      website: "https://janedoe.dev"
    },
    createdAt: new Date("2022-03-10").getTime(),
    
    // UI compatibility fields
    id: "2",
    username: "janedoe",
    fullName: "Jane Doe",
    joinedDate: "2022-03-10",
    problemsSolved: 203,
    dayStreak: 42,
    ranking: 218,
    profileImage: "https://i.pravatar.cc/300?img=5",
    is2FAEnabled: true,
    followers: 93,
    following: 67,
    countryCode: "US",
    bio: "Frontend developer with a passion for UI/UX design.",
    
    // Stats and achievements
    stats: {
      easy: { solved: 85, total: 100 },
      medium: { solved: 86, total: 150 },
      hard: { solved: 32, total: 80 }
    },
    achievements: {
      weeklyContests: 18,
      monthlyContests: 7,
      specialEvents: 3
    },
    badges: mockBadges,
    activityHeatmap: generateHeatmapData(),
    currentStreak: 42,
    longestStreak: 60,
    currentRating: 218,
    globalRank: 218
  }
];

// Mock friends
export const mockFriends: Friend[] = [
  {
    id: "3",
    username: "mchen",
    fullName: "Michael Chen",
    profileImage: "https://i.pravatar.cc/300?img=3",
    status: "online"
  },
  {
    id: "4",
    username: "sophie",
    fullName: "Sophia Lee",
    profileImage: "https://i.pravatar.cc/300?img=9",
    status: "in-match",
    lastActive: "2023-04-02T14:30:00Z"
  },
  {
    id: "5",
    username: "alex_dev",
    fullName: "Alex Johnson",
    profileImage: "https://i.pravatar.cc/300?img=13",
    status: "coding",
    lastActive: "2023-04-02T15:10:00Z"
  },
  {
    id: "6",
    username: "maria_g",
    fullName: "Maria Garcia",
    profileImage: "https://i.pravatar.cc/300?img=16",
    status: "offline",
    lastActive: "2023-04-01T22:45:00Z"
  }
];

// Add other mock data like challenges, problems, submissions, etc. as needed
