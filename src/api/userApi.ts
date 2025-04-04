
import { UserProfile, AuthResponse, LoginCredentials, RegisterData } from './types';
import { mockUserProfiles, mockFriends, mockBadges, generateHeatmapData, generateFollowers } from './mockData';

// API functions
export const getCurrentUser = async (): Promise<UserProfile> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(mockUserProfiles[0]), 500);
  });
};

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  return new Promise(resolve => {
    const userProfile = mockUserProfiles.find(u => u.userID === userId) || mockUserProfiles[0];
    setTimeout(() => resolve(userProfile), 600);
  });
};

export const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
  return new Promise(resolve => {
    const updatedUser = { ...mockUserProfiles[0], ...profileData };
    setTimeout(() => resolve(updatedUser), 600);
  });
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    if (credentials.email === "john.doe@example.com" && credentials.password === "password") {
      setTimeout(() => resolve({
        token: "mock-jwt-token",
        refreshToken: "mock-refresh-token",
        user: mockUserProfiles[0]
      }), 800);
    } else {
      setTimeout(() => reject(new Error("Invalid credentials")), 800);
    }
  });
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  return new Promise(resolve => {
    // Create a basic UserProfile
    const newUser: UserProfile = {
      userID: "new-user-id",
      userName: data.username,
      firstName: data.fullName.split(' ')[0],
      lastName: data.fullName.split(' ')[1] || '',
      avatarURL: '',
      profileImage: '',
      email: data.email,
      role: 'user',
      country: '',
      isBanned: false,
      isVerified: false,
      primaryLanguageID: '',
      muteNotifications: false,
      socials: {
        github: '',
        twitter: '',
        linkedin: '',
        website: ''
      },
      createdAt: Date.now(),
      
      // UI compatibility fields
      joinedDate: new Date().toISOString().split('T')[0],
      problemsSolved: 0,
      dayStreak: 0,
      ranking: 9999,
      followers: [],
      following: [],
      
      // Additional required fields
      stats: {
        easy: { solved: 0, total: 100 },
        medium: { solved: 0, total: 150 },
        hard: { solved: 0, total: 80 }
      },
      achievements: {
        weeklyContests: 0,
        monthlyContests: 0,
        specialEvents: 0
      },
      badges: [],
      activityHeatmap: generateHeatmapData()
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
    setTimeout(() => resolve(code.length === 6), 500);
  });
};

export const disableTwoFactorAuth = async (code: string): Promise<boolean> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(true), 500);
  });
};

export const getFriends = async () => {
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

export const searchUsers = async (query: string): Promise<UserProfile[]> => {
  return new Promise(resolve => {
    const filteredUsers = mockUserProfiles.filter(user => 
      user.userName.toLowerCase().includes(query.toLowerCase()) || 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(query.toLowerCase())
    );
    setTimeout(() => resolve(filteredUsers), 500);
  });
};

// New function for fetching user followers
export const getUserFollowers = async (userId: string): Promise<UserProfile[]> => {
  return new Promise(resolve => {
    // Find the user
    const user = mockUserProfiles.find(u => u.userID === userId);
    
    if (!user || !user.followers) {
      resolve([]);
      return;
    }
    
    // Find all users that match the follower IDs
    const followers = mockUserProfiles.filter(u => user.followers?.includes(u.userID));
    setTimeout(() => resolve(followers), 500);
  });
};

// New function for fetching user following
export const getUserFollowing = async (userId: string): Promise<UserProfile[]> => {
  return new Promise(resolve => {
    // Find the user
    const user = mockUserProfiles.find(u => u.userID === userId);
    
    if (!user || !user.following) {
      resolve([]);
      return;
    }
    
    // Find all users that match the following IDs
    const following = mockUserProfiles.filter(u => user.following?.includes(u.userID));
    setTimeout(() => resolve(following), 500);
  });
};
