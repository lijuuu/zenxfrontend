
import { mockChallenges, mockUsers, mockChallengeInvites, generateAccessCode } from './mockData';
import { Challenge, User } from './types';

// API functions
export const getChallenges = async (filters?: { active?: boolean; participated?: boolean; private?: boolean }): Promise<Challenge[]> => {
  return new Promise(resolve => {
    let filteredChallenges = [...mockChallenges];
    
    if (filters) {
      if (filters.active !== undefined) {
        filteredChallenges = filteredChallenges.filter(c => c.isActive === filters.active);
      }
      
      // In a real app, this would filter challenges the current user has participated in
      if (filters.participated) {
        filteredChallenges = filteredChallenges.filter(c => c.participantUsers?.some(p => p.id === "1"));
      }
      
      // Filter private/public challenges
      if (filters.private !== undefined) {
        filteredChallenges = filteredChallenges.filter(c => c.isPrivate === filters.private);
      }
    }
    
    // Ensure all challenges have properly typed difficulties
    const typedChallenges = filteredChallenges.map(challenge => ({
      ...challenge,
      difficulty: challenge.difficulty as "Easy" | "Medium" | "Hard"
    }));
    
    setTimeout(() => resolve(typedChallenges), 600);
  });
};

export const getChallenge = async (id: string): Promise<Challenge | null> => {
  return new Promise(resolve => {
    const challenge = mockChallenges.find(c => c.id === id) || null;
    
    // Ensure challenge has properly typed difficulty if found
    const typedChallenge = challenge ? {
      ...challenge,
      difficulty: challenge.difficulty as "Easy" | "Medium" | "Hard"
    } : null;
    
    setTimeout(() => resolve(typedChallenge), 500);
  });
};

export interface CreateChallengeOptions {
  title: string; 
  difficulty: string; 
  problemIds: string[];
  isPrivate: boolean;
  timeLimit?: number; // in minutes
  invitedUsers?: string[];
}

export const createChallenge = async (data: CreateChallengeOptions): Promise<Challenge> => {
  return new Promise(resolve => {
    const accessCode = data.isPrivate ? generateAccessCode() : "";
    
    const newChallenge: Challenge = {
      id: `c${Date.now()}`,
      title: data.title,
      difficulty: data.difficulty as "Easy" | "Medium" | "Hard",
      createdBy: {
        id: "1",
        username: "johndoe",
        profileImage: "https://i.pravatar.cc/300?img=1"
      },
      participants: data.invitedUsers?.length || 1,
      participantUsers: [
        { id: "1", avatar: "https://i.pravatar.cc/300?img=1", name: "johndoe" }
      ],
      problemCount: data.problemIds.length,
      createdAt: new Date().toISOString(),
      isActive: true,
      problems: data.problemIds,
      isPrivate: data.isPrivate,
      accessCode,
      timeLimit: data.timeLimit || 30 // Default 30 minutes
    };
    
    setTimeout(() => resolve(newChallenge), 800);
  });
};

// Interface for the response to joinChallengeWithCode
export interface ChallengeJoinResponse {
  success: boolean;
  challenge: Challenge | null;
  message?: string;
}

export const joinChallengeWithCode = async (accessCode: string): Promise<ChallengeJoinResponse> => {
  return new Promise(resolve => {
    const challenge = mockChallenges.find(c => c.isPrivate && c.accessCode === accessCode);
    
    if (!challenge) {
      setTimeout(() => resolve({ 
        success: false, 
        challenge: null,
        message: "Invalid access code or challenge not found"
      }), 500);
      return;
    }
    
    const updatedChallenge: Challenge = { 
      ...challenge,
      difficulty: challenge.difficulty as "Easy" | "Medium" | "Hard",
      participants: challenge.participants + 1,
      participantUsers: [
        ...(challenge.participantUsers || []),
        { id: "1", avatar: "https://i.pravatar.cc/300?img=1", name: "johndoe" }
      ]
    };
    
    setTimeout(() => resolve({ 
      success: true, 
      challenge: updatedChallenge,
      message: "Successfully joined the challenge" 
    }), 500);
  });
};

export const joinChallenge = async (id: string): Promise<{ success: boolean }> => {
  return new Promise(resolve => {
    setTimeout(() => resolve({ success: true }), 500);
  });
};

export const leaveChallenge = async (id: string): Promise<{ success: boolean }> => {
  return new Promise(resolve => {
    setTimeout(() => resolve({ success: true }), 500);
  });
};

export const inviteToChallenge = async (challengeId: string, userIds: string[]): Promise<{ success: boolean; invitedCount: number }> => {
  return new Promise(resolve => {
    setTimeout(() => resolve({ 
      success: true,
      invitedCount: userIds.length
    }), 600);
  });
};

export const getChallengeInvites = async (): Promise<{ challengeId: string; challengeTitle: string; invitedBy: string; isPrivate: boolean; accessCode?: string }[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(mockChallengeInvites), 500);
  });
};

export const respondToInvite = async (challengeId: string, accept: boolean): Promise<{ success: boolean }> => {
  return new Promise(resolve => {
    setTimeout(() => resolve({ success: true }), 400);
  });
};

export const searchUsers = async (query: string): Promise<User[]> => {
  return new Promise(resolve => {
    const results = mockUsers.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.fullName.toLowerCase().includes(query.toLowerCase())
    );
    setTimeout(() => resolve(results), 400);
  });
};

// For admin users - get all challenges
export const getAllChallenges = async (): Promise<Challenge[]> => {
  return new Promise(resolve => {
    // Ensure all challenges have properly typed difficulties
    const typedChallenges = mockChallenges.map(challenge => ({
      ...challenge,
      difficulty: challenge.difficulty as "Easy" | "Medium" | "Hard"
    }));
    
    setTimeout(() => resolve(typedChallenges), 400);
  });
};

// Get challenges by a specific user
export const getUserChallenges = async (userId: string): Promise<Challenge[]> => {
  return new Promise(resolve => {
    const userChallenges = mockChallenges.filter(
      c => c.createdBy.id === userId || c.participantUsers?.some(p => p.id === userId)
    );
    
    // Ensure all challenges have properly typed difficulties
    const typedChallenges = userChallenges.map(challenge => ({
      ...challenge,
      difficulty: challenge.difficulty as "Easy" | "Medium" | "Hard"
    }));
    
    setTimeout(() => resolve(typedChallenges), 500);
  });
};
