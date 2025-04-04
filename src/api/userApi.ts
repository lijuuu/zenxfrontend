import { 
  mockUsers, 
  mockFriends, 
  mockBadges, 
  generateHeatmapData 
} from './mockData';
import { User, UserProfile, Friend, Badge, AuthResponse, LoginCredentials, RegisterData } from './types';

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

// Add missing API functions that might be needed
export const getUserFollowers = async (userId: string): Promise<Friend[]> => {
  return new Promise(resolve => {
    // Return some friends as followers
    setTimeout(() => resolve(mockFriends.slice(0, 2)), 600);
  });
};

export const getUserFollowing = async (userId: string): Promise<Friend[]> => {
  return new Promise(resolve => {
    // Return some friends as following
    setTimeout(() => resolve(mockFriends.slice(2)), 600);
  });
};
