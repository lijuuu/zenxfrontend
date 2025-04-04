import { Challenge, ChallengeJoinResponse } from './types';

// Add joinChallengeWithCode function
export const joinChallengeWithCode = async (code: string): Promise<ChallengeJoinResponse> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        success: true,
        challenge: {
          id: `challenge-${Math.floor(Math.random() * 1000)}`,
          title: `Private Challenge ${code}`,
          description: "This is a private challenge you've been invited to join.",
          difficulty: "Medium",
          createdAt: new Date().toISOString(),
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          type: "battle",
          status: "active",
          participants: [],
          isPrivate: true,
          inviteCode: code,
          ownerId: "user-123",
          problemIds: [],
          tags: ["algorithm", "data-structure"],

          // For backward compatibility
          createdBy: {
            id: "user-123",
            username: "user123",
            profileImage: "/assets/avatars/avatar-1.png"
          },
          participants: [],
          problemCount: 5,
          isActive: true,
          accessCode: code
        }
      });
    }, 600);
  });
};

// Add getChallenges function
export const getChallenges = async (): Promise<Challenge[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Mock implementation
      resolve([]);
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
        participants: [],
        problemCount: 5,
        isActive: true
      });
    }, 600);
  });
};
