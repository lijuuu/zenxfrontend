// Generate heatmap data function defined first
export function generateHeatmapData() {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 365);
  
  const data = [];
  const startDateStr = startDate.toISOString().split('T')[0];
  
  // Generate 365 days of data
  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Random contribution count
    const count = Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0;
    
    data.push({
      date: dateStr,
      count,
      present: true
    });
  }
  
  return {
    startDate: startDateStr,
    data,
    totalContributions: data.reduce((sum, day) => sum + day.count, 0),
    currentStreak: Math.floor(Math.random() * 30) + 1,
    longestStreak: Math.floor(Math.random() * 100) + 30
  };
}

// Generate followers function
export const generateFollowers = (count: number) => {
  const followers = [];
  for (let i = 1; i <= count; i++) {
    followers.push(`user-${Math.floor(Math.random() * 1000)}`);
  }
  return followers;
};

import { UserProfile, Badge } from './types';

// Mock user profiles
export const mockUserProfiles: UserProfile[] = [
  {
    userID: "user-1",
    userName: "johndoe",
    firstName: "John",
    lastName: "Doe",
    avatarURL: "/assets/avatars/avatar-1.png",
    email: "john.doe@example.com",
    role: "user",
    country: "US",
    isBanned: false,
    isVerified: true,
    primaryLanguageID: "en",
    muteNotifications: false,
    socials: {
      github: "github.com/johndoe",
      twitter: "twitter.com/johndoe",
      linkedin: "linkedin.com/in/johndoe",
      website: "johndoe.com"
    },
    createdAt: Date.now(),
    
    // Backward compatibility fields
    profileImage: "/assets/avatars/avatar-1.png",
    joinedDate: "2021-01-01",
    problemsSolved: 248,
    dayStreak: 45,
    ranking: 121,
    is2FAEnabled: false,
    followers: generateFollowers(20),
    following: generateFollowers(15),
    isOnline: true,
    countryCode: "US",
    bio: "Software Engineer",
    
    stats: {
      easy: { solved: 100, total: 150 },
      medium: { solved: 80, total: 200 },
      hard: { solved: 68, total: 100 }
    },
    achievements: {
      weeklyContests: 15,
      monthlyContests: 5,
      specialEvents: 3
    },
    badges: [],
    activityHeatmap: generateHeatmapData()
  },
  {
    userID: "user-2",
    userName: "janesmith",
    firstName: "Jane",
    lastName: "Smith",
    avatarURL: "/assets/avatars/avatar-2.png",
    email: "jane.smith@example.com",
    role: "user",
    country: "UK",
    isBanned: false,
    isVerified: true,
    primaryLanguageID: "en",
    muteNotifications: false,
    socials: {
      github: "github.com/janesmith",
      twitter: "twitter.com/janesmith",
      linkedin: "linkedin.com/in/janesmith",
      website: "janesmith.com"
    },
    createdAt: Date.now(),
    
    // Backward compatibility fields
    profileImage: "/assets/avatars/avatar-2.png",
    joinedDate: "2021-03-15",
    problemsSolved: 197,
    dayStreak: 23,
    ranking: 245,
    is2FAEnabled: true,
    followers: generateFollowers(12),
    following: generateFollowers(18),
    isOnline: false,
    countryCode: "GB",
    bio: "Frontend Developer",
    
    stats: {
      easy: { solved: 85, total: 150 },
      medium: { solved: 72, total: 200 },
      hard: { solved: 40, total: 100 }
    },
    achievements: {
      weeklyContests: 10,
      monthlyContests: 3,
      specialEvents: 2
    },
    badges: [],
    activityHeatmap: generateHeatmapData()
  },
  {
    userID: "user-3",
    userName: "robertjones",
    firstName: "Robert",
    lastName: "Jones",
    avatarURL: "/assets/avatars/avatar-3.png",
    email: "robert.jones@example.com",
    role: "user",
    country: "CA",
    isBanned: false,
    isVerified: false,
    primaryLanguageID: "fr",
    muteNotifications: false,
    socials: {
      github: "github.com/robertjones",
      twitter: "twitter.com/robertjones",
      linkedin: "linkedin.com/in/robertjones",
      website: "robertjones.com"
    },
    createdAt: Date.now(),
    
    // Backward compatibility fields
    profileImage: "/assets/avatars/avatar-3.png",
    joinedDate: "2021-05-20",
    problemsSolved: 153,
    dayStreak: 12,
    ranking: 382,
    is2FAEnabled: false,
    followers: generateFollowers(8),
    following: generateFollowers(5),
    isOnline: true,
    countryCode: "CA",
    bio: "Data Scientist",
    
    stats: {
      easy: { solved: 70, total: 150 },
      medium: { solved: 50, total: 200 },
      hard: { solved: 33, total: 100 }
    },
    achievements: {
      weeklyContests: 7,
      monthlyContests: 2,
      specialEvents: 1
    },
    badges: [],
    activityHeatmap: generateHeatmapData()
  },
  {
    userID: "user-4",
    userName: "emilywilliams",
    firstName: "Emily",
    lastName: "Williams",
    avatarURL: "/assets/avatars/avatar-4.png",
    email: "emily.williams@example.com",
    role: "user",
    country: "AU",
    isBanned: false,
    isVerified: true,
    primaryLanguageID: "en",
    muteNotifications: false,
    socials: {
      github: "github.com/emilywilliams",
      twitter: "twitter.com/emilywilliams",
      linkedin: "linkedin.com/in/emilywilliams",
      website: "emilywilliams.com"
    },
    createdAt: Date.now(),
    
    // Backward compatibility fields
    profileImage: "/assets/avatars/avatar-4.png",
    joinedDate: "2021-07-01",
    problemsSolved: 212,
    dayStreak: 58,
    ranking: 95,
    is2FAEnabled: true,
    followers: generateFollowers(25),
    following: generateFollowers(20),
    isOnline: false,
    countryCode: "AU",
    bio: "Mobile App Developer",
    
    stats: {
      easy: { solved: 92, total: 150 },
      medium: { solved: 78, total: 200 },
      hard: { solved: 42, total: 100 }
    },
    achievements: {
      weeklyContests: 12,
      monthlyContests: 4,
      specialEvents: 2
    },
    badges: [],
    activityHeatmap: generateHeatmapData()
  },
  {
    userID: "user-5",
    userName: "michaelbrown",
    firstName: "Michael",
    lastName: "Brown",
    avatarURL: "/assets/avatars/avatar-5.png",
    email: "michael.brown@example.com",
    role: "user",
    country: "DE",
    isBanned: false,
    isVerified: false,
    primaryLanguageID: "de",
    muteNotifications: false,
    socials: {
      github: "github.com/michaelbrown",
      twitter: "twitter.com/michaelbrown",
      linkedin: "linkedin.com/in/michaelbrown",
      website: "michaelbrown.com"
    },
    createdAt: Date.now(),
    
    // Backward compatibility fields
    profileImage: "/assets/avatars/avatar-5.png",
    joinedDate: "2021-09-10",
    problemsSolved: 185,
    dayStreak: 31,
    ranking: 168,
    is2FAEnabled: false,
    followers: generateFollowers(15),
    following: generateFollowers(10),
    isOnline: true,
    countryCode: "DE",
    bio: "AI Researcher",
    
    stats: {
      easy: { solved: 80, total: 150 },
      medium: { solved: 65, total: 200 },
      hard: { solved: 40, total: 100 }
    },
    achievements: {
      weeklyContests: 9,
      monthlyContests: 3,
      specialEvents: 1
    },
    badges: [],
    activityHeatmap: generateHeatmapData()
  }
];

// Mock friends list
export const mockFriends = [
  mockUserProfiles[1],
  mockUserProfiles[2],
  mockUserProfiles[3]
];

// Mock badges
export const mockBadges: Badge[] = [
  {
    id: "badge-1",
    name: "Problem Solver",
    description: "Solved 100 problems",
    icon: "/assets/badges/badge-1.png",
    tier: "bronze"
  },
  {
    id: "badge-2",
    name: "Daily Streak",
    description: "Maintained a 30-day streak",
    icon: "/assets/badges/badge-2.png",
    tier: "silver"
  },
  {
    id: "badge-3",
    name: "Contest Master",
    description: "Participated in 10 contests",
    icon: "/assets/badges/badge-3.png",
    tier: "gold"
  }
];
