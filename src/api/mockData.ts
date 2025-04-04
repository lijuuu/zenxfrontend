import { UserProfile, Badge, HeatmapDataPoint, HeatmapData, Challenge } from './types';

// Mock data for badges
export const mockBadges: Badge[] = [
  {
    id: "b1",
    name: "Problem Solver",
    description: "Solved 10 problems",
    icon: "https://img.icons8.com/color/48/000000/medal.png",
    tier: "bronze"
  },
  {
    id: "b2",
    name: "Daily Streak",
    description: "Maintained a 7-day streak",
    icon: "https://img.icons8.com/color/48/000000/fire.png",
    tier: "silver"
  },
  {
    id: "b3",
    name: "Contest Winner",
    description: "Won a weekly contest",
    icon: "https://img.icons8.com/color/48/000000/trophy.png",
    tier: "gold"
  },
  {
    id: "b4",
    name: "Code Master",
    description: "Achieved a high ranking",
    icon: "https://img.icons8.com/color/48/000000/badge.png",
    tier: "platinum"
  },
  {
    id: "b5",
    name: "First Submission",
    description: "Made your first code submission",
    icon: "https://img.icons8.com/color/48/000000/code.png",
    tier: "bronze"
  },
  {
    id: "b6",
    name: "Active User",
    description: "Active for 30 days",
    icon: "https://img.icons8.com/color/48/000000/calendar.png",
    tier: "silver"
  }
];

// Mock data for friends
export const mockFriends: UserProfile[] = [
  {
    userID: "u234567",
    userName: "alice_coder",
    firstName: "Alice",
    lastName: "Smith",
    avatarURL: "https://i.pravatar.cc/300?img=2",
    profileImage: "https://i.pravatar.cc/300?img=2",
    email: "alice.smith@example.com",
    role: "user",
    country: "Canada",
    countryCode: "CA",
    isBanned: false,
    isVerified: true,
    primaryLanguageID: "python",
    muteNotifications: false,
    socials: {
      github: "alicesmith",
      twitter: "alicesmith",
      linkedin: "alicesmith",
      website: "https://alicesmith.com"
    },
    createdAt: Date.now() - 86400000 * 180,
    joinedDate: "2023-06-20",
    problemsSolved: 85,
    dayStreak: 5,
    ranking: 5,
    bio: "Passionate about Python and AI. Always learning!",
    followers: [],
    following: [],
    is2FAEnabled: false,
    stats: {
      easy: { solved: 40, total: 100 },
      medium: { solved: 35, total: 150 },
      hard: { solved: 10, total: 80 }
    },
    achievements: {
      weeklyContests: 8,
      monthlyContests: 3,
      specialEvents: 1
    },
    badges: mockBadges.slice(1, 4),
    activityHeatmap: generateHeatmapData(),
    currentStreak: 5,
    longestStreak: 15,
    currentRating: 1620,
    globalRank: 2850
  },
  {
    userID: "u345678",
    userName: "bob_dev",
    firstName: "Bob",
    lastName: "Johnson",
    avatarURL: "https://i.pravatar.cc/300?img=3",
    profileImage: "https://i.pravatar.cc/300?img=3",
    email: "bob.johnson@example.com",
    role: "user",
    country: "Australia",
    countryCode: "AU",
    isBanned: false,
    isVerified: true,
    primaryLanguageID: "java",
    muteNotifications: false,
    socials: {
      github: "bobjohnson",
      twitter: "bobjohnson",
      linkedin: "bobjohnson",
      website: "https://bobjohnson.com"
    },
    createdAt: Date.now() - 86400000 * 90,
    joinedDate: "2023-09-10",
    problemsSolved: 120,
    dayStreak: 20,
    ranking: 3,
    bio: "Java enthusiast and backend developer. Building scalable systems.",
    followers: [],
    following: [],
    is2FAEnabled: true,
    stats: {
      easy: { solved: 60, total: 100 },
      medium: { solved: 50, total: 150 },
      hard: { solved: 10, total: 80 }
    },
    achievements: {
      weeklyContests: 10,
      monthlyContests: 4,
      specialEvents: 2
    },
    badges: mockBadges.slice(2, 5),
    activityHeatmap: generateHeatmapData(),
    currentStreak: 20,
    longestStreak: 40,
    currentRating: 1780,
    globalRank: 1920
  }
];

// Mock function to generate heatmap data
export const generateHeatmapData = (): HeatmapData => {
  const data: HeatmapDataPoint[] = [];
  const today = new Date();
  for (let i = 365; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const count = Math.floor(Math.random() * 5);
    const present = count > 0;
    data.push({
      date: date.toISOString().split('T')[0],
      count: count,
      present: present
    });
  }

  const totalContributions = data.reduce((sum, day) => sum + day.count, 0);
  const currentStreak = data.reduceRight((streak, day) => {
    if (streak === 0) return 0;
    return day.present ? streak + 1 : 0;
  }, 1);
  const longestStreak = data.reduce((longest, day) => {
    if (day.present) {
      let current = 1;
      let i = data.indexOf(day) + 1;
      while (i < data.length && data[i].present) {
        current++;
        i++;
      }
      return Math.max(longest, current);
    }
    return longest;
  }, 0);

  return {
    data: data,
    totalContributions: totalContributions,
    currentStreak: currentStreak,
    longestStreak: longestStreak
  };
};

// Mock challenges data
export const mockChallenges: Challenge[] = [
  {
    id: "c1",
    title: "7-Day Coding Challenge",
    description: "Improve your coding skills in 7 days",
    difficulty: "Easy",
    createdAt: "2024-01-01",
    startDate: "2024-02-01",
    endDate: "2024-02-07",
    type: "daily",
    status: "active",
    participants: [
      {
        userID: "u123456",
        userName: "johndoe",
        firstName: "John",
        lastName: "Doe",
        avatarURL: "https://i.pravatar.cc/300?img=1",
        rank: 1,
        score: 100,
        isFriend: true
      },
      {
        userID: "u234567",
        userName: "alice_coder",
        firstName: "Alice",
        lastName: "Smith",
        avatarURL: "https://i.pravatar.cc/300?img=2",
        rank: 2,
        score: 90,
        isFriend: true
      }
    ],
    isPrivate: false,
    ownerId: "u123456",
    problemIds: ["p1", "p2"],
    tags: ["algorithms", "data structures"]
  },
  {
    id: "c2",
    title: "Weekly Algorithm Contest",
    description: "Test your algorithm skills",
    difficulty: "Medium",
    createdAt: "2024-01-05",
    startDate: "2024-02-15",
    endDate: "2024-02-22",
    type: "weekly",
    status: "upcoming",
    participants: [
      {
        userID: "u345678",
        userName: "bob_dev",
        firstName: "Bob",
        lastName: "Johnson",
        avatarURL: "https://i.pravatar.cc/300?img=3",
        rank: 3,
        score: 80,
        isFriend: false
      }
    ],
    isPrivate: false,
    ownerId: "u345678",
    problemIds: ["p3", "p4"],
    tags: ["algorithms", "math"]
  },
  {
    id: "c3",
    title: "Monthly Data Science Challenge",
    description: "Solve data science problems",
    difficulty: "Hard",
    createdAt: "2024-01-10",
    startDate: "2024-03-01",
    endDate: "2024-03-31",
    type: "monthly",
    status: "completed",
    participants: [
      {
        userID: "u456789",
        userName: "eve_data",
        firstName: "Eve",
        lastName: "Williams",
        avatarURL: "https://i.pravatar.cc/300?img=4",
        rank: 4,
        score: 70,
        isFriend: false
      }
    ],
    isPrivate: true,
    inviteCode: "secret123",
    ownerId: "u456789",
    problemIds: ["p5", "p6"],
    tags: ["data science", "machine learning"]
  }
];

// Add follower IDs for mock users
export const generateFollowers = () => {
  const followerIds = [
    "u123456", "u234567", "u345678", "u456789", "u567890",
    "u678901", "u789012", "u890123", "u901234", "u012345"
  ];
  
  // Randomly select 3-8 followers
  const count = Math.floor(Math.random() * 6) + 3;
  const shuffled = [...followerIds].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Update mock user profiles to include followers and following
export const mockUserProfiles: UserProfile[] = [
  {
    userID: "u123456",
    userName: "johndoe",
    firstName: "John",
    lastName: "Doe",
    avatarURL: "https://i.pravatar.cc/300?img=1",
    profileImage: "https://i.pravatar.cc/300?img=1",
    email: "john.doe@example.com",
    role: "user",
    country: "United States",
    countryCode: "US",
    isBanned: false,
    isVerified: true,
    primaryLanguageID: "javascript",
    muteNotifications: false,
    socials: {
      github: "johndoe",
      twitter: "johndoe",
      linkedin: "johndoe",
      website: "https://johndoe.com"
    },
    createdAt: Date.now() - 86400000 * 365,
    joinedDate: "2023-01-15",
    problemsSolved: 143,
    dayStreak: 12,
    ranking: 1,
    bio: "Senior Software Engineer passionate about algorithms and clean code.",
    followers: generateFollowers(),
    following: generateFollowers(),
    is2FAEnabled: true,
    stats: {
      easy: { solved: 80, total: 100 },
      medium: { solved: 58, total: 150 },
      hard: { solved: 5, total: 80 }
    },
    achievements: {
      weeklyContests: 12,
      monthlyContests: 5,
      specialEvents: 2
    },
    badges: mockBadges.slice(0, 5),
    activityHeatmap: generateHeatmapData(),
    currentStreak: 12,
    longestStreak: 30,
    currentRating: 1842,
    globalRank: 1243
  },
  {
    userID: "u234567",
    userName: "alice_coder",
    firstName: "Alice",
    lastName: "Smith",
    avatarURL: "https://i.pravatar.cc/300?img=2",
    profileImage: "https://i.pravatar.cc/300?img=2",
    email: "alice.smith@example.com",
    role: "user",
    country: "Canada",
    countryCode: "CA",
    isBanned: false,
    isVerified: true,
    primaryLanguageID: "python",
    muteNotifications: false,
    socials: {
      github: "alicesmith",
      twitter: "alicesmith",
      linkedin: "alicesmith",
      website: "https://alicesmith.com"
    },
    createdAt: Date.now() - 86400000 * 180,
    joinedDate: "2023-06-20",
    problemsSolved: 85,
    dayStreak: 5,
    ranking: 5,
    bio: "Passionate about Python and AI. Always learning!",
    followers: generateFollowers(),
    following: generateFollowers(),
    is2FAEnabled: false,
    stats: {
      easy: { solved: 40, total: 100 },
      medium: { solved: 35, total: 150 },
      hard: { solved: 10, total: 80 }
    },
    achievements: {
      weeklyContests: 8,
      monthlyContests: 3,
      specialEvents: 1
    },
    badges: mockBadges.slice(1, 4),
    activityHeatmap: generateHeatmapData(),
    currentStreak: 5,
    longestStreak: 15,
    currentRating: 1620,
    globalRank: 2850
  },
  {
    userID: "u345678",
    userName: "bob_dev",
    firstName: "Bob",
    lastName: "Johnson",
    avatarURL: "https://i.pravatar.cc/300?img=3",
    profileImage: "https://i.pravatar.cc/300?img=3",
    email: "bob.johnson@example.com",
    role: "user",
    country: "Australia",
    countryCode: "AU",
    isBanned: false,
    isVerified: true,
    primaryLanguageID: "java",
    muteNotifications: false,
    socials: {
      github: "bobjohnson",
      twitter: "bobjohnson",
      linkedin: "bobjohnson",
      website: "https://bobjohnson.com"
    },
    createdAt: Date.now() - 86400000 * 90,
    joinedDate: "2023-09-10",
    problemsSolved: 120,
    dayStreak: 20,
    ranking: 3,
    bio: "Java enthusiast and backend developer. Building scalable systems.",
    followers: generateFollowers(),
    following: generateFollowers(),
    is2FAEnabled: true,
    stats: {
      easy: { solved: 60, total: 100 },
      medium: { solved: 50, total: 150 },
      hard: { solved: 10, total: 80 }
    },
    achievements: {
      weeklyContests: 10,
      monthlyContests: 4,
      specialEvents: 2
    },
    badges: mockBadges.slice(2, 5),
    activityHeatmap: generateHeatmapData(),
    currentStreak: 20,
    longestStreak: 40,
    currentRating: 1780,
    globalRank: 1920
  },
  {
    userID: "u456789",
    userName: "eve_data",
    firstName: "Eve",
    lastName: "Williams",
    avatarURL: "https://i.pravatar.cc/300?img=4",
    profileImage: "https://i.pravatar.cc/300?img=4",
    email: "eve.williams@example.com",
    role: "user",
    country: "United Kingdom",
    countryCode: "GB",
    isBanned: false,
    isVerified: true,
    primaryLanguageID: "python",
    muteNotifications: false,
    socials: {
      github: "evewilliams",
      twitter: "evewilliams",
      linkedin: "evewilliams",
      website: "https://evewilliams.com"
    },
    createdAt: Date.now() - 86400000 * 60,
    joinedDate: "2023-10-25",
    problemsSolved: 95,
    dayStreak: 10,
    ranking: 8,
    bio: "Data scientist passionate about machine learning and AI.",
    followers: [],
    following: [],
    is2FAEnabled: false,
    stats: {
      easy: { solved: 45, total: 100 },
      medium: { solved: 40, total: 150 },
      hard: { solved: 10, total: 80 }
    },
    achievements: {
      weeklyContests: 7,
      monthlyContests: 2,
      specialEvents: 0
    },
    badges: mockBadges.slice(3, 6),
    activityHeatmap: generateHeatmapData(),
    currentStreak: 10,
    longestStreak: 25,
    currentRating: 1550,
    globalRank: 3200
  },
  {
    userID: "u567890",
    userName: "sam_coder",
    firstName: "Sam",
    lastName: "Brown",
    avatarURL: "https://i.pravatar.cc/300?img=5",
    profileImage: "https://i.pravatar.cc/300?img=5",
    email: "sam.brown@example.com",
    role: "user",
    country: "Germany",
    countryCode: "DE",
    isBanned: false,
    isVerified: true,
    primaryLanguageID: "c++",
    muteNotifications: false,
    socials: {
      github: "sambrown",
      twitter: "sambrown",
      linkedin: "sambrown",
      website: "https://sambrown.com"
    },
    createdAt: Date.now() - 86400000 * 30,
    joinedDate: "2023-11-24",
    problemsSolved: 70,
    dayStreak: 3,
    ranking: 12,
    bio: "C++ developer focused on game development and graphics.",
    followers: [],
    following: [],
    is2FAEnabled: true,
    stats: {
      easy: { solved: 35, total: 100 },
      medium: { solved: 25, total: 150 },
      hard: { solved: 10, total: 80 }
    },
    achievements: {
      weeklyContests: 5,
      monthlyContests: 1,
      specialEvents: 0
    },
    badges: mockBadges.slice(0, 3),
    activityHeatmap: generateHeatmapData(),
    currentStreak: 3,
    longestStreak: 7,
    currentRating: 1480,
    globalRank: 4100
  },
  {
    userID: "u678901",
    userName: "lisa_tech",
    firstName: "Lisa",
    lastName: "Garcia",
    avatarURL: "https://i.pravatar.cc/300?img=6",
    profileImage: "https://i.pravatar.cc/300?img=6",
    email: "lisa.garcia@example.com",
    role: "user",
    country: "Spain",
    countryCode: "ES",
    isBanned: false,
    isVerified: true,
    primaryLanguageID: "javascript",
    muteNotifications: false,
    socials: {
      github: "lisagarcia",
      twitter: "lisagarcia",
      linkedin: "lisagarcia",
      website: "https://lisagarcia.com"
    },
    createdAt: Date.now() - 86400000 * 15,
    joinedDate: "2023-12-10",
    problemsSolved: 55,
    dayStreak: 1,
    ranking: 15,
    bio: "Frontend developer passionate about UI/UX and React.",
    followers: [],
    following: [],
    is2FAEnabled: false,
    stats: {
      easy: { solved: 25, total: 100 },
      medium: { solved: 20, total: 150 },
      hard: { solved: 10, total: 80 }
    },
    achievements: {
      weeklyContests: 3,
      monthlyContests: 0,
      specialEvents: 0
    },
    badges: mockBadges.slice(1, 3),
    activityHeatmap: generateHeatmapData(),
    currentStreak: 1,
    longestStreak: 1,
    currentRating: 1350,
    globalRank: 5200
  },
  {
    userID: "u789012",
    userName: "mike_code",
    firstName: "Mike",
    lastName: "Chen",
    avatarURL: "https://i.pravatar.cc/300?img=7",
    profileImage: "https://i.pravatar.cc/300?img=7",
    email: "mike.chen@example.com",
    role: "user",
    country: "China",
    countryCode: "CN",
    isBanned: false,
    isVerified: true,
    primaryLanguageID: "python",
    muteNotifications: false,
    socials: {
      github: "mikechen",
      twitter: "mikechen",
      linkedin: "mikechen",
      website: "https://mikechen.com"
    },
    createdAt: Date.now() - 86400000 * 7,
    joinedDate: "2023-12-18",
    problemsSolved: 40,
    dayStreak: 0,
    ranking: 20,
    bio: "Backend developer specializing in Python and Django.",
    followers: [],
    following: [],
    is2FAEnabled: true,
    stats: {
      easy: { solved: 20, total: 100 },
      medium: { solved: 15, total: 150 },
      hard: { solved: 5, total: 80 }
    },
    achievements: {
      weeklyContests: 2,
      monthlyContests: 0,
      specialEvents: 0
    },
    badges: mockBadges.slice(2, 4),
    activityHeatmap: generateHeatmapData(),
    currentStreak: 0,
    longestStreak: 0,
    currentRating: 1200,
    globalRank: 6500
  },
  {
    userID: "u890123",
    userName: "sara_dev",
    firstName: "Sara",
    lastName: "Kim",
    avatarURL: "https://i.pravatar.cc/300?img=8",
    profileImage: "https://i.pravatar.cc/300?img=8",
    email: "sara.kim@example.com",
    role: "user",
    country: "South Korea",
    countryCode: "KR",
    isBanned: false,
    isVerified: true,
    primaryLanguageID: "java",
    muteNotifications: false,
    socials: {
      github: "sarakim",
      twitter: "sarakim",
      linkedin: "sarakim",
      website: "https://sarakim.com"
    },
    createdAt: Date.now() - 86400000 * 3,
    joinedDate: "2023-12-22",
    problemsSolved: 30,
    dayStreak: 0,
    ranking: 25,
    bio: "Full-stack developer with a passion for Java and Spring.",
    followers: [],
    following: [],
    is2FAEnabled: false,
    stats: {
      easy: { solved: 15, total: 100 },
      medium: { solved: 10, total: 150 },
      hard: { solved: 5, total: 80 }
    },
    achievements: {
      weeklyContests: 1,
      monthlyContests: 0,
      specialEvents: 0
    },
    badges: mockBadges.slice(3, 5),
    activityHeatmap: generateHeatmapData(),
    currentStreak: 0,
    longestStreak: 0,
    currentRating: 1100,
    globalRank: 7800
  },
  {
    userID: "u901234",
    userName: "david_code",
    firstName: "David",
    lastName: "Lee",
    avatarURL: "https://i.pravatar.cc/300?img=9",
    profileImage: "https://i.pravatar.cc/300?img=9",
    email: "david.lee@example.com",
    role: "user",
    country: "Japan",
    countryCode: "JP",
    isBanned: false,
    isVerified: true,
    primaryLanguageID: "c#",
    muteNotifications: false,
    socials: {
      github: "davidlee",
      twitter: "davidlee",
      linkedin: "davidlee",
      website: "https://davidlee.com"
    },
    createdAt: Date.now() - 86400000 * 1,
    joinedDate: "2023-12-24",
    problemsSolved: 20,
    dayStreak: 0,
    ranking: 30,
    bio: "Game developer specializing in C# and Unity.",
    followers: [],
    following: [],
    is2FAEnabled: true,
    stats: {
      easy: { solved: 10, total: 100 },
      medium: { solved: 5, total: 150 },
      hard: { solved: 5, total: 80 }
    },
    achievements: {
      weeklyContests: 0,
      monthlyContests: 0,
      specialEvents: 0
    },
    badges: mockBadges.slice(4, 6),
    activityHeatmap: generateHeatmapData(),
    currentStreak: 0,
    longestStreak: 0,
    currentRating: 1000,
    globalRank: 9100
  },
  {
    userID: "u012345",
    userName: "anna_tech",
    firstName: "Anna",
    lastName: "Ivanova",
    avatarURL: "https://i.pravatar.cc/300?img=10",
    profileImage: "https://i.pravatar.cc/300?img=10",
    email: "anna.ivanova@example.com",
    role: "user",
    country: "Russia",
    countryCode: "RU",
    isBanned: false,
    isVerified: true,
    primaryLanguageID: "go",
    muteNotifications: false,
    socials: {
      github: "annaivanova",
      twitter: "annaivanova",
      linkedin: "annaivanova",
      website: "https://annaivanova.com"
    },
    createdAt: Date.now(),
    joinedDate: "2023-12-25",
    problemsSolved: 10,
    dayStreak: 0,
    ranking: 35,
    bio: "Backend developer passionate about Go and distributed systems.",
    followers: [],
    following: [],
    is2FAEnabled: false,
    stats: {
      easy: { solved: 5, total: 100 },
      medium: { solved: 0, total: 150 },
      hard: { solved: 5, total: 80 }
    },
    achievements: {
      weeklyContests: 0,
      monthlyContests: 0,
      specialEvents: 0
    },
    badges: mockBadges.slice(5, 6),
    activityHeatmap: generateHeatmapData(),
    currentStreak: 0,
    longestStreak: 0,
    currentRating: 900,
    globalRank: 9999
  }
];
