import { User, UserProfile, Friend, Badge, AuthResponse, LoginCredentials, RegisterData } from './types';

// Mock data for development
const mockUsers: User[] = [
  {
    id: "1",
    username: "johndoe",
    fullName: "John Doe",
    email: "john.doe@example.com",
    profileImage: "https://i.pravatar.cc/300?img=1",
    bio: "Software developer passionate about algorithms and data structures. Solving programming challenges in my free time.",
    website: "https://johndoe.dev",
    githubProfile: "johndoe",
    location: "San Francisco, USA",
    joinedDate: "2022-01-15",
    problemsSolved: 147,
    dayStreak: 26,
    ranking: 354,
    isBanned: false,
    isVerified: true,
    following: 45,
    followers: 78,
    is2FAEnabled: false
  },
  {
    id: "2",
    username: "janedoe",
    fullName: "Jane Doe",
    email: "jane.doe@example.com",
    profileImage: "https://i.pravatar.cc/300?img=5",
    bio: "Frontend developer with a passion for UI/UX design.",
    website: "https://janedoe.dev",
    githubProfile: "janedoe",
    location: "New York, USA",
    joinedDate: "2022-03-10",
    problemsSolved: 203,
    dayStreak: 42,
    ranking: 218,
    isBanned: false,
    isVerified: true,
    following: 67,
    followers: 93,
    is2FAEnabled: true
  }
];

const mockFriends: Friend[] = [
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

const mockBadges: Badge[] = [
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

// Generate heatmap data for the last 365 days
const generateHeatmapData = () => {
  const today = new Date();
  const data = [];
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 364);
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Randomly determine if present or absent
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

// API functions
export const getCurrentUser = async (): Promise<User> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(mockUsers[0]), 500);
  });
};

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  return new Promise(resolve => {
    const user = mockUsers.find(u => u.id === userId) || mockUsers[0];
    
    // Create a profile that matches both User and extended UserProfile properties
    const profile = {
      // Original User properties
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      profileImage: user.profileImage || '',
      bio: user.bio || '',
      website: user.website || '',
      githubProfile: user.githubProfile || '',
      location: user.location || '',
      joinedDate: user.joinedDate,
      problemsSolved: user.problemsSolved,
      dayStreak: user.dayStreak,
      ranking: user.ranking,
      isBanned: user.isBanned,
      isVerified: user.isVerified,
      following: user.following || 0,
      followers: user.followers || 0,
      is2FAEnabled: user.is2FAEnabled || false,
      
      // Additional UserProfile properties
      userID: user.id, // Map to overlapping fields
      userName: user.username,
      firstName: user.fullName.split(' ')[0],
      lastName: user.fullName.split(' ')[1] || '',
      avatarURL: user.profileImage || '',
      role: 'user',
      country: user.location?.split(', ')[1] || '',
      countryCode: 'US',
      primaryLanguageID: 'en',
      muteNotifications: false,
      socials: {
        github: user.githubProfile || '',
        twitter: '',
        linkedin: ''
      },
      createdAt: new Date(user.joinedDate).getTime(),
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
      currentStreak: user.dayStreak,
      longestStreak: user.dayStreak * 2,
      currentRating: user.ranking,
      globalRank: user.ranking
    };
    
    // Cast to UserProfile type to satisfy TypeScript
    setTimeout(() => resolve(profile as UserProfile), 600);
  });
};

export const updateUserProfile = async (profileData: Partial<User>): Promise<User> => {
  return new Promise(resolve => {
    const updatedUser = { ...mockUsers[0], ...profileData };
    setTimeout(() => resolve(updatedUser), 600);
  });
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    if (credentials.email === "john.doe@example.com" && credentials.password === "password") {
      setTimeout(() => resolve({
        token: "mock-jwt-token",
        refreshToken: "mock-refresh-token",
        user: mockUsers[0]
      }), 800);
    } else {
      setTimeout(() => reject(new Error("Invalid credentials")), 800);
    }
  });
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  return new Promise(resolve => {
    const newUser: User = {
      id: "new-user-id",
      username: data.username,
      fullName: data.fullName,
      email: data.email,
      joinedDate: new Date().toISOString().split('T')[0],
      problemsSolved: 0,
      dayStreak: 0,
      ranking: 9999,
      isBanned: false,
      isVerified: false
    };
    
    setTimeout(() => resolve({
      token: "mock-jwt-token",
      refreshToken: "mock-refresh-token",
      user: newUser
    }), 1000);
  });
};

export const logout = async (): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(resolve, 300);
  });
};

export const setUpTwoFactorAuth = async (): Promise<{ qrCodeUrl: string; secret: string }> => {
  return new Promise(resolve => {
    setTimeout(() => resolve({
      qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/ZenX:johndoe@example.com?secret=JBSWY3DPEHPK3PXP&issuer=ZenX",
      secret: "JBSWY3DPEHPK3PXP"
    }), 800);
  });
};

export const verifyTwoFactorAuth = async (code: string): Promise<boolean> => {
  return new Promise(resolve => {
    // In a real app, this would verify the code against the secret
    setTimeout(() => resolve(code.length === 6), 500);
  });
};

export const disableTwoFactorAuth = async (code: string): Promise<boolean> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(true), 500);
  });
};

export const getFriends = async (): Promise<Friend[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(mockFriends), 600);
  });
};

export const followUser = async (userId: string): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(resolve, 300);
  });
};

export const unfollowUser = async (userId: string): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(resolve, 300);
  });
};

export const searchUsers = async (query: string): Promise<User[]> => {
  return new Promise(resolve => {
    const filteredUsers = mockUsers.filter(user => 
      user.username.includes(query) || user.fullName.includes(query)
    );
    setTimeout(() => resolve(filteredUsers), 500);
  });
};
