import { Challenge, ChallengeJoinResponse, UserProfile, joinChallengeWithCode as importedJoinChallengeWithCode } from './types';

// Re-export from types to avoid duplication
export const joinChallengeWithCode = importedJoinChallengeWithCode;

// Add joinChallenge function
export const joinChallenge = async (challengeId: string): Promise<Challenge> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        id: challengeId,
        title: `Challenge ${challengeId}`,
        description: "This is a challenge you've joined.",
        difficulty: "Medium",
        createdAt: new Date().toISOString(),
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: "battle",
        status: "active",
        participants: [],
        isPrivate: false,
        ownerId: "user-123",
        problemIds: [],
        tags: ["algorithm", "data-structure"],
        
        // For backward compatibility
        createdBy: {
          id: "user-123",
          username: "user123",
          profileImage: "/assets/avatars/avatar-1.png"
        },
        isActive: true,
        problemCount: 5
      });
    }, 600);
  });
};

// Add getChallenges function for MinimalChallenges.tsx and other components
export const getChallenges = async (options?: { active?: boolean; private?: boolean }): Promise<Challenge[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Mock implementation
      const challenges: Challenge[] = [
        {
          id: "challenge-1",
          title: "Weekly Algorithm Challenge",
          description: "Solve algorithms in a week",
          difficulty: "Medium",
          createdAt: new Date().toISOString(),
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          type: "weekly",
          status: "active",
          participants: [],
          isPrivate: false,
          ownerId: "user-123",
          problemIds: [],
          tags: ["algorithm"],
          
          // For backward compatibility
          createdBy: {
            id: "user-123",
            username: "user123",
            profileImage: "/assets/avatars/avatar-1.png"
          },
          isActive: true,
          problemCount: 5
        }
      ];
      
      let filteredChallenges = challenges;
      
      if (options?.active !== undefined) {
        filteredChallenges = filteredChallenges.filter(c => c.isActive === options.active);
      }
      
      if (options?.private !== undefined) {
        filteredChallenges = filteredChallenges.filter(c => c.isPrivate === options.private);
      }
      
      resolve(filteredChallenges);
    }, 600);
  });
};

// Add getChallenge function
export const getChallenge = async (id: string): Promise<Challenge> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Mock implementation
      resolve({
        id,
        title: `Challenge ${id}`,
        description: "Challenge description",
        difficulty: "Medium",
        createdAt: new Date().toISOString(),
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: "battle",
        status: "active",
        participants: [],
        isPrivate: false,
        ownerId: "user-123",
        problemIds: [],
        tags: ["algorithm", "data-structure"],
        
        // For backward compatibility
        createdBy: {
          id: "user-123",
          username: "user123",
          profileImage: "/assets/avatars/avatar-1.png"
        },
        isActive: true,
        problemCount: 5
      });
    }, 600);
  });
};

// Add createChallenge function
export const createChallenge = async (challengeData: Partial<Challenge>): Promise<{ success: boolean; challenge?: Challenge }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newChallenge: Challenge = {
        id: `challenge-${Math.floor(Math.random() * 1000)}`,
        title: challengeData.title || "New Challenge",
        description: challengeData.description || "Challenge description",
        difficulty: challengeData.difficulty || "Medium",
        createdAt: new Date().toISOString(),
        startDate: challengeData.startDate || new Date().toISOString(),
        endDate: challengeData.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: "battle",
        status: "active",
        participants: [],
        isPrivate: challengeData.isPrivate || false,
        ownerId: "user-123",
        problemIds: [],
        tags: ["algorithm", "data-structure"],
        
        // For backward compatibility
        createdBy: {
          id: "user-123",
          username: "user123",
          profileImage: "/assets/avatars/avatar-1.png"
        },
        isActive: true,
        problemCount: 5
      };
      resolve({ success: true, challenge: newChallenge });
    }, 600);
  });
};

// Add searchUsers function
export const searchUsers = async (query: string): Promise<UserProfile[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          userID: "user-1",
          userName: "john_doe",
          firstName: "John",
          lastName: "Doe",
          fullName: "John Doe",
          avatarURL: "https://i.pravatar.cc/300?img=1",
          email: "john@example.com",
          role: "user",
          country: "US",
          isBanned: false,
          isVerified: true,
          primaryLanguageID: "js",
          muteNotifications: false,
          isOnline: true,
          socials: {
            github: "",
            twitter: "",
            linkedin: ""
          },
          createdAt: Date.now() - 5000000,
          profileImage: "https://i.pravatar.cc/300?img=1",
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
          }
        }
      ]);
    }, 300);
  });
};

// Add fetchUserChallenges function
export const fetchUserChallenges = async (userId: string): Promise<Challenge[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          id: "challenge-1",
          title: "Weekly Algorithm Challenge",
          description: "Solve algorithms in a week",
          difficulty: "Medium",
          createdAt: new Date().toISOString(),
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          type: "weekly",
          status: "active",
          participants: [],
          isPrivate: false,
          ownerId: "user-123",
          problemIds: [],
          tags: ["algorithm"],
          
          // For backward compatibility
          createdBy: {
            id: "user-123",
            username: "user123",
            profileImage: "/assets/avatars/avatar-1.png"
          },
          isActive: true,
          problemCount: 5
        }
      ]);
    }, 600);
  });
};

// For compatibility with previous fetchChallenges API
export const fetchChallenges = getChallenges;
