import { UserProfile, UsersResponse, GenericResponse } from './types';

// Mock function to simulate fetching user profile
export const getCurrentUser = async (): Promise<UserProfile> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        userID: "user-123",
        userName: "testuser",
        firstName: "Test",
        lastName: "User",
        avatarURL: "/assets/avatars/avatar-1.png",
        email: "test@example.com",
        role: "user",
        country: "US",
        isBanned: false,
        isVerified: true,
        primaryLanguageID: "en",
        muteNotifications: false,
        socials: {
          github: "github.com/testuser",
          twitter: "twitter.com/testuser",
          linkedin: "linkedin.com/in/testuser",
          website: "testuser.com"
        },
        createdAt: Date.now() - 5000000,
        profileImage: "/assets/avatars/avatar-1.png",
        stats: {
          easy: { solved: 20, total: 100 },
          medium: { solved: 10, total: 200 },
          hard: { solved: 5, total: 100 }
        },
        achievements: {
          weeklyContests: 5,
          monthlyContests: 2,
          specialEvents: 1
        },
        badges: [],
        activityHeatmap: {
          data: [],
          totalContributions: 0,
          currentStreak: 0,
          longestStreak: 0
        },
        isOnline: true,
        currentRating: 1200,
        globalRank: 50
      });
    }, 500);
  });
};

// Mock function to simulate updating user profile
export const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Mock implementation: Simulate updating the profile
      const updatedProfile: UserProfile = {
        userID: "user-123",
        userName: "testuser",
        firstName: "Updated",
        lastName: "User",
        avatarURL: "/assets/avatars/avatar-1.png",
        email: "test@example.com",
        role: "user",
        country: "CA",
        isBanned: false,
        isVerified: true,
        primaryLanguageID: "fr",
        muteNotifications: false,
        socials: {
          github: "github.com/updateduser",
          twitter: "twitter.com/updateduser",
          linkedin: "linkedin.com/in/updateduser",
          website: "updateduser.com"
        },
        createdAt: Date.now() - 5000000,
        profileImage: "/assets/avatars/avatar-1.png",
        stats: {
          easy: { solved: 25, total: 100 },
          medium: { solved: 15, total: 200 },
          hard: { solved: 8, total: 100 }
        },
        achievements: {
          weeklyContests: 6,
          monthlyContests: 3,
          specialEvents: 2
        },
        badges: [],
        activityHeatmap: {
          data: [],
          totalContributions: 0,
          currentStreak: 0,
          longestStreak: 0
        },
        ...profileData, // Apply updates
      };
      resolve(updatedProfile);
    }, 500);
  });
};

// Mock function to simulate fetching user followers
export const getUserFollowers = async (userId: string): Promise<UserProfile[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Mock implementation: Return a list of mock followers
      const followers: UserProfile[] = [
        {
          userID: "follower-1",
          userName: "follower1",
          firstName: "Follower",
          lastName: "One",
          avatarURL: "/assets/avatars/avatar-2.png",
          email: "follower1@example.com",
          role: "user",
          country: "UK",
          isBanned: false,
          isVerified: false,
          primaryLanguageID: "en",
          muteNotifications: false,
          socials: {
            github: "github.com/follower1",
            twitter: "twitter.com/follower1",
            linkedin: "linkedin.com/in/follower1",
            website: "follower1.com"
          },
          createdAt: Date.now() - 4000000,
          profileImage: "/assets/avatars/avatar-2.png",
          stats: {
            easy: { solved: 15, total: 100 },
            medium: { solved: 8, total: 200 },
            hard: { solved: 3, total: 100 }
          },
          achievements: {
            weeklyContests: 3,
            monthlyContests: 1,
            specialEvents: 0
          },
          badges: [],
          activityHeatmap: {
            data: [],
            totalContributions: 0,
            currentStreak: 0,
            longestStreak: 0
          },
          isOnline: false
        },
        {
          userID: "follower-2",
          userName: "follower2",
          firstName: "Follower",
          lastName: "Two",
          avatarURL: "/assets/avatars/avatar-3.png",
          email: "follower2@example.com",
          role: "user",
          country: "AU",
          isBanned: false,
          isVerified: true,
          primaryLanguageID: "en",
          muteNotifications: false,
          socials: {
            github: "github.com/follower2",
            twitter: "twitter.com/follower2",
            linkedin: "linkedin.com/in/follower2",
            website: "follower2.com"
          },
          createdAt: Date.now() - 3000000,
          profileImage: "/assets/avatars/avatar-3.png",
          stats: {
            easy: { solved: 30, total: 100 },
            medium: { solved: 12, total: 200 },
            hard: { solved: 7, total: 100 }
          },
          achievements: {
            weeklyContests: 7,
            monthlyContests: 4,
            specialEvents: 2
          },
          badges: [],
          activityHeatmap: {
            data: [],
            totalContributions: 0,
            currentStreak: 0,
            longestStreak: 0
          },
          isOnline: true
        }
      ];
      resolve(followers);
    }, 500);
  });
};

// Mock function to simulate fetching users being followed by a user
export const getUserFollowing = async (userId: string): Promise<UserProfile[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Mock implementation: Return a list of mock followed users
      const following: UserProfile[] = [
        {
          userID: "following-1",
          userName: "following1",
          firstName: "Following",
          lastName: "One",
          avatarURL: "/assets/avatars/avatar-4.png",
          email: "following1@example.com",
          role: "user",
          country: "CA",
          isBanned: false,
          isVerified: true,
          primaryLanguageID: "en",
          muteNotifications: false,
          socials: {
            github: "github.com/following1",
            twitter: "twitter.com/following1",
            linkedin: "linkedin.com/in/following1",
            website: "following1.com"
          },
          createdAt: Date.now() - 2000000,
          profileImage: "/assets/avatars/avatar-4.png",
          stats: {
            easy: { solved: 22, total: 100 },
            medium: { solved: 11, total: 200 },
            hard: { solved: 6, total: 100 }
          },
          achievements: {
            weeklyContests: 6,
            monthlyContests: 3,
            specialEvents: 1
          },
          badges: [],
          activityHeatmap: {
            data: [],
            totalContributions: 0,
            currentStreak: 0,
            longestStreak: 0
          },
          isOnline: true
        },
        {
          userID: "following-2",
          userName: "following2",
          firstName: "Following",
          lastName: "Two",
          avatarURL: "/assets/avatars/avatar-5.png",
          email: "following2@example.com",
          role: "user",
          country: "DE",
          isBanned: false,
          isVerified: false,
          primaryLanguageID: "en",
          muteNotifications: false,
          socials: {
            github: "github.com/following2",
            twitter: "twitter.com/following2",
            linkedin: "linkedin.com/in/following2",
            website: "following2.com"
          },
          createdAt: Date.now() - 1000000,
          profileImage: "/assets/avatars/avatar-5.png",
          stats: {
            easy: { solved: 18, total: 100 },
            medium: { solved: 9, total: 200 },
            hard: { solved: 4, total: 100 }
          },
          achievements: {
            weeklyContests: 4,
            monthlyContests: 2,
            specialEvents: 0
          },
          badges: [],
          activityHeatmap: {
            data: [],
            totalContributions: 0,
            currentStreak: 0,
            longestStreak: 0
          },
          isOnline: false
        }
      ];
      resolve(following);
    }, 500);
  });
};

export const isUserFollowing = (userId: string, currentUser: UserProfile | null): boolean => {
  if (!currentUser) return false;
  
  if (Array.isArray(currentUser.following)) {
    return currentUser.following.includes(userId);
  } else if (typeof currentUser.following === 'number') {
    // When following is a number, we can't determine the exact users being followed
    return false;
  }
  
  return false;
};

export const isUserFollower = (userId: string, currentUser: UserProfile | null): boolean => {
  if (!currentUser) return false;
  
  if (Array.isArray(currentUser.followers)) {
    return currentUser.followers.includes(userId);
  } else if (typeof currentUser.followers === 'number') {
    // When followers is a number, we can't determine the exact users following
    return false;
  }
  
  return false;
};

// Mock function for searching users
export const searchUsers = async (query: string): Promise<UsersResponse> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockUsers: UserProfile[] = [
                {
                    userID: "search-user-1",
                    userName: "searchuser1",
                    firstName: "Search",
                    lastName: "User1",
                    avatarURL: "/assets/avatars/avatar-6.png",
                    email: "searchuser1@example.com",
                    role: "user",
                    country: "US",
                    isBanned: false,
                    isVerified: true,
                    primaryLanguageID: "en",
                    muteNotifications: false,
                    socials: {
                        github: "github.com/searchuser1",
                        twitter: "twitter.com/searchuser1",
                        linkedin: "linkedin.com/in/searchuser1",
                        website: "searchuser1.com"
                    },
                    createdAt: Date.now() - 6000000,
                    profileImage: "/assets/avatars/avatar-6.png",
                    stats: {
                        easy: { solved: 28, total: 100 },
                        medium: { solved: 14, total: 200 },
                        hard: { solved: 7, total: 100 }
                    },
                    achievements: {
                        weeklyContests: 8,
                        monthlyContests: 4,
                        specialEvents: 2
                    },
                    badges: [],
                    activityHeatmap: {
                        data: [],
                        totalContributions: 0,
                        currentStreak: 0,
                        longestStreak: 0
                    },
                    isOnline: true
                },
                {
                    userID: "search-user-2",
                    userName: "searchuser2",
                    firstName: "Search",
                    lastName: "User2",
                    avatarURL: "/assets/avatars/avatar-7.png",
                    email: "searchuser2@example.com",
                    role: "user",
                    country: "CA",
                    isBanned: false,
                    isVerified: false,
                    primaryLanguageID: "en",
                    muteNotifications: false,
                    socials: {
                        github: "github.com/searchuser2",
                        twitter: "twitter.com/searchuser2",
                        linkedin: "linkedin.com/in/searchuser2",
                        website: "searchuser2.com"
                    },
                    createdAt: Date.now() - 5000000,
                    profileImage: "/assets/avatars/avatar-7.png",
                    stats: {
                        easy: { solved: 16, total: 100 },
                        medium: { solved: 8, total: 200 },
                        hard: { solved: 4, total: 100 }
                    },
                    achievements: {
                        weeklyContests: 4,
                        monthlyContests: 2,
                        specialEvents: 1
                    },
                    badges: [],
                    activityHeatmap: {
                        data: [],
                        totalContributions: 0,
                        currentStreak: 0,
                        longestStreak: 0
                    },
                    isOnline: false
                }
            ];

            const filteredUsers = mockUsers.filter(user =>
                user.userName.toLowerCase().includes(query.toLowerCase()) ||
                user.firstName.toLowerCase().includes(query.toLowerCase()) ||
                user.lastName.toLowerCase().includes(query.toLowerCase())
            );

            const response: UsersResponse = {
                users: filteredUsers,
                totalCount: filteredUsers.length,
                nextPageToken: ""
            };
            resolve(response);
        }, 500);
    });
};

// Mock function to simulate banning a user
export const banUser = async (userId: string, reason: string): Promise<GenericResponse> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Mock implementation: Simulate banning the user
      const response: GenericResponse = {
        success: true,
        status: 200,
        payload: {
          message: `User ${userId} has been banned for reason: ${reason}`
        }
      };
      resolve(response);
    }, 500);
  });
};

// Mock function to simulate unbanning a user
export const unbanUser = async (userId: string): Promise<GenericResponse> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Mock implementation: Simulate unbanning the user
      const response: GenericResponse = {
        success: true,
        status: 200,
        payload: {
          message: `User ${userId} has been unbanned`
        }
      };
      resolve(response);
    }, 500);
  });
};
