import { 
  UserProfile, 
  BanHistory, 
  UsersResponse, 
  GenericResponse,
  LoginResponse,
  LoginCredentials
} from '@/api/types';

// Mock admin login function
export const loginAdmin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: "admin-token-xyz",
        refreshToken: "admin-refresh-token-xyz",
        user: {
          userID: "admin-123",
          userName: "admin",
          firstName: "Admin",
          lastName: "User",
          avatarURL: "",
          email: credentials.email,
          role: "admin",
          country: "US",
          isBanned: false,
          isVerified: true,
          primaryLanguageID: "en",
          muteNotifications: false,
          socials: {
            github: "",
            twitter: "",
            linkedin: "",
            website: ""
          },
          createdAt: Date.now(),
          stats: {
            easy: { solved: 0, total: 0 },
            medium: { solved: 0, total: 0 },
            hard: { solved: 0, total: 0 }
          },
          achievements: {
            weeklyContests: 0,
            monthlyContests: 0,
            specialEvents: 0
          },
          badges: [],
          activityHeatmap: { data: [], totalContributions: 0, currentStreak: 0, longestStreak: 0 }
        },
        accessToken: "admin-access-token",
        expiresIn: 3600,
        adminID: "admin-123",
        message: "Admin login successful"
      });
    }, 1000);
  });
};

// Mock function to fetch all users
export const getAllUsers = async (page: number = 1, limit: number = 50): Promise<UsersResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockUsers: UserProfile[] = Array.from({ length: limit }, (_, i) => ({
        userID: `user-${(page - 1) * limit + i + 1}`,
        userName: `user${(page - 1) * limit + i + 1}`,
        firstName: `User`,
        lastName: `${(page - 1) * limit + i + 1}`,
        avatarURL: `/assets/avatars/avatar-${(i % 5) + 1}.png`,
        email: `user${(page - 1) * limit + i + 1}@example.com`,
        role: "user",
        country: "US",
        isBanned: false,
        isVerified: true,
        primaryLanguageID: "en",
        muteNotifications: false,
        socials: {
          github: "",
          twitter: "",
          linkedin: "",
          website: ""
        },
        createdAt: Date.now(),
        stats: {
          easy: { solved: 0, total: 0 },
          medium: { solved: 0, total: 0 },
          hard: { solved: 0, total: 0 }
        },
        achievements: {
          weeklyContests: 0,
          monthlyContests: 0,
          specialEvents: 0
        },
        badges: [],
        activityHeatmap: { data: [], totalContributions: 0, currentStreak: 0, longestStreak: 0 }
      }));

      resolve({
        users: mockUsers,
        totalCount: 500,
        nextPageToken: page < 10 ? String(page + 1) : null
      });
    }, 800);
  });
};

// Mock function to ban a user
export const banUser = async (userID: string, banReason: string, banExpiry: number): Promise<GenericResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        status: 200,
        payload: {
          userID,
          banReason,
          banExpiry
        }
      });
    }, 500);
  });
};

// Mock function to unban a user
export const unbanUser = async (userID: string): Promise<GenericResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        status: 200,
        payload: {
          userID
        }
      });
    }, 500);
  });
};

// Mock function to fetch ban history for a user
export const getBanHistory = async (userID: string): Promise<GenericResponse<BanHistory[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockBanHistory: BanHistory[] = [
        {
          id: "ban-1",
          userID: userID,
          bannedAt: Date.now() - 86400000,
          banType: "temporary",
          banReason: "Violation of community guidelines",
          banExpiry: Date.now() + 604800000
        }
      ];
      resolve({
        success: true,
        status: 200,
        payload: mockBanHistory
      });
    }, 500);
  });
};

// Mock function to update user role
export const updateUserRole = async (userID: string, newRole: string): Promise<GenericResponse> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                status: 200,
                payload: {
                    userID,
                    newRole
                }
            });
        }, 500);
    });
};
