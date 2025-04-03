
import { Challenge, User } from './types';

// Mock data for challenges
const mockChallenges: Challenge[] = [
  {
    id: "c1",
    title: "Algorithm Sprint",
    difficulty: "Medium",
    createdBy: {
      id: "3",
      username: "mchen",
      profileImage: "https://i.pravatar.cc/300?img=3"
    },
    participants: 4,
    participantUsers: [
      { id: "1", avatar: "https://i.pravatar.cc/300?img=1", name: "johndoe" },
      { id: "2", avatar: "https://i.pravatar.cc/300?img=2", name: "sarah" },
      { id: "4", avatar: "https://i.pravatar.cc/300?img=4", name: "alex" },
      { id: "5", avatar: "https://i.pravatar.cc/300?img=5", name: "taylor" }
    ],
    problemCount: 3,
    createdAt: "2023-04-02T12:00:00Z",
    isActive: true,
    problems: ["p1", "p3", "p7"],
    isPrivate: false,
    accessCode: ""
  },
  {
    id: "c2",
    title: "Data Structure Masters",
    difficulty: "Hard",
    createdBy: {
      id: "4",
      username: "sophie",
      profileImage: "https://i.pravatar.cc/300?img=9"
    },
    participants: 6,
    participantUsers: [
      { id: "1", avatar: "https://i.pravatar.cc/300?img=1", name: "johndoe" },
      { id: "4", avatar: "https://i.pravatar.cc/300?img=4", name: "alex" },
      { id: "5", avatar: "https://i.pravatar.cc/300?img=5", name: "taylor" },
      { id: "6", avatar: "https://i.pravatar.cc/300?img=6", name: "mike" },
      { id: "7", avatar: "https://i.pravatar.cc/300?img=7", name: "jessica" },
      { id: "8", avatar: "https://i.pravatar.cc/300?img=8", name: "chris" }
    ],
    problemCount: 5,
    createdAt: "2023-04-01T15:00:00Z",
    isActive: true,
    problems: ["p4", "p5", "p6", "p8", "p9"],
    isPrivate: false,
    accessCode: ""
  },
  {
    id: "c3",
    title: "Weekly Contest #42",
    difficulty: "Medium",
    createdBy: {
      id: "1",
      username: "admin",
      profileImage: "https://i.pravatar.cc/300?img=68"
    },
    participants: 128,
    participantUsers: [],
    problemCount: 4,
    createdAt: "2023-03-28T10:00:00Z",
    isActive: false,
    problems: ["p2", "p3", "p4", "p8"],
    isPrivate: false,
    accessCode: ""
  },
  {
    id: "c4",
    title: "Private Coding Duel",
    difficulty: "Hard",
    createdBy: {
      id: "1",
      username: "johndoe",
      profileImage: "https://i.pravatar.cc/300?img=1"
    },
    participants: 2,
    participantUsers: [
      { id: "1", avatar: "https://i.pravatar.cc/300?img=1", name: "johndoe" },
      { id: "5", avatar: "https://i.pravatar.cc/300?img=5", name: "taylor" }
    ],
    problemCount: 3,
    createdAt: "2023-04-03T14:30:00Z",
    isActive: true,
    problems: ["p3", "p6", "p9"],
    isPrivate: true,
    accessCode: "XYZ123"
  }
];

// Mock users for searching
const mockUsers: User[] = [
  {
    id: "1",
    username: "johndoe",
    fullName: "John Doe",
    email: "john@example.com",
    profileImage: "https://i.pravatar.cc/300?img=1",
    bio: "Software engineer and competitive programmer",
    joinedDate: "2022-01-15",
    problemsSolved: 147,
    dayStreak: 26,
    ranking: 354,
    isBanned: false,
    isVerified: true,
    isOnline: true
  },
  {
    id: "2",
    username: "sarah",
    fullName: "Sarah Johnson",
    email: "sarah@example.com",
    profileImage: "https://i.pravatar.cc/300?img=2",
    bio: "CS student | Algorithm enthusiast",
    joinedDate: "2022-03-10",
    problemsSolved: 89,
    dayStreak: 12,
    ranking: 892,
    isBanned: false,
    isVerified: true,
    isOnline: false
  },
  {
    id: "3",
    username: "mchen",
    fullName: "Mike Chen",
    email: "mike@example.com",
    profileImage: "https://i.pravatar.cc/300?img=3",
    bio: "Full-stack developer with a passion for problem-solving",
    joinedDate: "2022-02-05",
    problemsSolved: 203,
    dayStreak: 45,
    ranking: 178,
    isBanned: false,
    isVerified: true,
    isOnline: true
  },
  {
    id: "4",
    username: "sophie",
    fullName: "Sophie Williams",
    email: "sophie@example.com",
    profileImage: "https://i.pravatar.cc/300?img=9",
    bio: "Software architect | Competitive programmer",
    joinedDate: "2021-11-20",
    problemsSolved: 312,
    dayStreak: 86,
    ranking: 42,
    isBanned: false,
    isVerified: true,
    isOnline: true
  },
  {
    id: "5",
    username: "taylor",
    fullName: "Taylor Smith",
    email: "taylor@example.com",
    profileImage: "https://i.pravatar.cc/300?img=5",
    bio: "Frontend developer learning algorithms",
    joinedDate: "2022-05-18",
    problemsSolved: 68,
    dayStreak: 7,
    ranking: 1254,
    isBanned: false,
    isVerified: true,
    isOnline: false
  }
];

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
    
    setTimeout(() => resolve(filteredChallenges), 600);
  });
};

export const getChallenge = async (id: string): Promise<Challenge | null> => {
  return new Promise(resolve => {
    const challenge = mockChallenges.find(c => c.id === id) || null;
    setTimeout(() => resolve(challenge), 500);
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

export const joinChallengeWithCode = async (accessCode: string): Promise<{ success: boolean; challenge: Challenge | null }> => {
  return new Promise(resolve => {
    const challenge = mockChallenges.find(c => c.isPrivate && c.accessCode === accessCode);
    
    if (!challenge) {
      setTimeout(() => resolve({ success: false, challenge: null }), 500);
      return;
    }
    
    const updatedChallenge = { 
      ...challenge,
      participants: challenge.participants + 1,
      participantUsers: [
        ...(challenge.participantUsers || []),
        { id: "1", avatar: "https://i.pravatar.cc/300?img=1", name: "johndoe" }
      ]
    };
    
    setTimeout(() => resolve({ success: true, challenge: updatedChallenge }), 500);
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
    setTimeout(() => resolve([
      {
        challengeId: "c2",
        challengeTitle: "Data Structure Masters",
        invitedBy: "sophie",
        isPrivate: false
      },
      {
        challengeId: "c4",
        challengeTitle: "Private Coding Duel",
        invitedBy: "taylor",
        isPrivate: true,
        accessCode: "XYZ123"
      }
    ]), 500);
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

// Generate a random access code for private challenges
const generateAccessCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for(let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// For admin users - get all challenges
export const getAllChallenges = async (): Promise<Challenge[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(mockChallenges), 400);
  });
};

// Get challenges by a specific user
export const getUserChallenges = async (userId: string): Promise<Challenge[]> => {
  return new Promise(resolve => {
    const userChallenges = mockChallenges.filter(
      c => c.createdBy.id === userId || c.participantUsers?.some(p => p.id === userId)
    );
    setTimeout(() => resolve(userChallenges), 500);
  });
};
