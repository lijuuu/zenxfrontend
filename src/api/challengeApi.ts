
import axios from 'axios';
import { Challenge, UserProfile } from './types';

// Mock data for development
const mockChallenges: Challenge[] = [
  {
    id: "1",
    title: "Daily Algorithm Challenge",
    description: "Solve today's algorithm problem to maintain your streak!",
    difficulty: "Easy",
    createdAt: "2023-11-01T12:00:00Z",
    startDate: "2023-11-01T12:00:00Z",
    endDate: "2023-11-01T23:59:59Z",
    type: "daily",
    status: "active",
    participants: [
      {
        userID: "user1",
        userName: "johndoe",
        firstName: "John",
        lastName: "Doe",
        avatarURL: "https://i.pravatar.cc/150?img=1",
        rank: 1,
        score: 100
      },
      {
        userID: "user2",
        userName: "janedoe",
        firstName: "Jane",
        lastName: "Doe",
        avatarURL: "https://i.pravatar.cc/150?img=2",
        rank: 2,
        score: 95
      }
    ],
    isPrivate: false,
    problemIds: ["prob1", "prob2"],
    tags: ["arrays", "dynamic-programming"]
  },
  {
    id: "2",
    title: "Weekly Challenge: Graph Algorithms",
    description: "Test your skills with these graph-based problems.",
    difficulty: "Medium",
    createdAt: "2023-10-28T00:00:00Z",
    startDate: "2023-10-28T00:00:00Z",
    endDate: "2023-11-03T23:59:59Z",
    type: "weekly",
    status: "active",
    participants: [
      {
        userID: "user1",
        userName: "johndoe",
        firstName: "John",
        lastName: "Doe",
        avatarURL: "https://i.pravatar.cc/150?img=1",
        rank: 3,
        score: 85
      }
    ],
    isPrivate: false,
    problemIds: ["prob3", "prob4", "prob5"],
    tags: ["graphs", "bfs", "dfs"]
  },
  {
    id: "3",
    title: "Battle: Speed Coding",
    description: "Race against another coder to solve problems faster!",
    difficulty: "Hard",
    createdAt: "2023-11-02T14:00:00Z",
    startDate: "2023-11-02T15:00:00Z",
    endDate: "2023-11-02T16:00:00Z",
    type: "battle",
    status: "upcoming",
    participants: [
      {
        userID: "user1",
        userName: "johndoe",
        firstName: "John",
        lastName: "Doe",
        avatarURL: "https://i.pravatar.cc/150?img=1"
      },
      {
        userID: "user3",
        userName: "alexsmith",
        firstName: "Alex",
        lastName: "Smith",
        avatarURL: "https://i.pravatar.cc/150?img=3"
      }
    ],
    isPrivate: true,
    inviteCode: "BATTLE123",
    problemIds: ["prob6"],
    tags: ["competitive", "timed"]
  }
];

// Add backward compatibility properties
mockChallenges.forEach(challenge => {
  // @ts-ignore - Adding backward compatibility fields
  challenge.isActive = challenge.status === 'active';
  // @ts-ignore
  challenge.problemCount = challenge.problemIds?.length || 0;
  // @ts-ignore
  challenge.accessCode = challenge.inviteCode;
  // @ts-ignore
  challenge.createdBy = {
    id: "admin1",
    username: "admin",
    profileImage: "https://i.pravatar.cc/150?img=8"
  };
  // @ts-ignore
  challenge.participantUsers = challenge.participants?.map(p => ({
    id: p.userID,
    name: `${p.firstName} ${p.lastName}`,
    avatar: p.avatarURL
  }));
});

export const fetchChallenges = async (): Promise<Challenge[]> => {
  // In a real app, this would be an API call:
  // return axios.get('/api/challenges').then(res => res.data);
  return Promise.resolve(mockChallenges);
};

export const fetchChallengeById = async (id: string): Promise<Challenge> => {
  // In a real app, this would be an API call:
  // return axios.get(`/api/challenges/${id}`).then(res => res.data);
  const challenge = mockChallenges.find(c => c.id === id);
  if (!challenge) {
    throw new Error('Challenge not found');
  }
  return Promise.resolve(challenge);
};

export const createChallenge = async (challengeData: Partial<Challenge>): Promise<Challenge> => {
  // In a real app, this would be an API call:
  // return axios.post('/api/challenges', challengeData).then(res => res.data);
  const newChallenge: Challenge = {
    id: `${mockChallenges.length + 1}`,
    title: challengeData.title || 'Untitled Challenge',
    description: challengeData.description || '',
    difficulty: challengeData.difficulty || 'Medium',
    createdAt: new Date().toISOString(),
    startDate: challengeData.startDate || new Date().toISOString(),
    endDate: challengeData.endDate || new Date(Date.now() + 86400000).toISOString(),
    type: challengeData.type || 'daily',
    status: 'upcoming',
    participants: [],
    isPrivate: challengeData.isPrivate || false,
    inviteCode: challengeData.isPrivate ? Math.random().toString(36).substr(2, 8).toUpperCase() : undefined,
    problemIds: challengeData.problemIds || [],
    tags: challengeData.tags || [],
    
    // Backward compatibility fields
    accessCode: challengeData.isPrivate ? Math.random().toString(36).substr(2, 8).toUpperCase() : undefined,
    isActive: false,
    problemCount: challengeData.problemIds?.length || 0,
    createdBy: {
      id: "admin1",
      username: "admin",
      profileImage: "https://i.pravatar.cc/150?img=8"
    },
    participantUsers: []
  };
  
  return Promise.resolve(newChallenge);
};

export const joinChallenge = async (challengeId: string): Promise<Challenge> => {
  // In a real app, this would be an API call:
  // return axios.post(`/api/challenges/${challengeId}/join`).then(res => res.data);
  const challenge = mockChallenges.find(c => c.id === challengeId);
  if (!challenge) {
    throw new Error('Challenge not found');
  }
  
  // Simulate joining the challenge
  const updatedChallenge = { ...challenge };
  
  return Promise.resolve(updatedChallenge);
};

export const joinChallengeWithCode = async (code: string): Promise<Challenge> => {
  // In a real app, this would be an API call:
  // return axios.post(`/api/challenges/join-with-code`, { code }).then(res => res.data);
  const challenge = mockChallenges.find(c => c.inviteCode === code || c.accessCode === code);
  if (!challenge) {
    throw new Error('Invalid invite code');
  }
  
  // Simulate joining the challenge
  const updatedChallenge = { ...challenge };
  
  return Promise.resolve(updatedChallenge);
};

export const searchUsers = async (query: string): Promise<UserProfile[]> => {
  // Mock implementation
  const mockUsers: UserProfile[] = [
    {
      userID: "user1",
      userName: "johndoe",
      firstName: "John",
      lastName: "Doe",
      avatarURL: "https://i.pravatar.cc/150?img=1",
      email: "john@example.com",
      role: "user",
      country: "USA",
      isBanned: false,
      isVerified: true,
      primaryLanguageID: "js",
      muteNotifications: false,
      socials: {
        github: "johndoe",
        twitter: "johndoe",
        linkedin: "johndoe",
        website: "johndoe.com"
      },
      createdAt: Date.now() - 10000000,
      stats: {
        easy: { solved: 15, total: 20 },
        medium: { solved: 10, total: 30 },
        hard: { solved: 5, total: 15 }
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
    },
    {
      userID: "user2",
      userName: "janedoe",
      firstName: "Jane",
      lastName: "Doe",
      avatarURL: "https://i.pravatar.cc/150?img=2",
      email: "jane@example.com",
      role: "user",
      country: "UK",
      isBanned: false,
      isVerified: true,
      primaryLanguageID: "python",
      muteNotifications: true,
      socials: {
        github: "janedoe",
        twitter: "janedoe",
        linkedin: "janedoe",
        website: "janedoe.com"
      },
      createdAt: Date.now() - 20000000,
      stats: {
        easy: { solved: 20, total: 20 },
        medium: { solved: 15, total: 30 },
        hard: { solved: 8, total: 15 }
      },
      achievements: {
        weeklyContests: 8,
        monthlyContests: 3,
        specialEvents: 2
      },
      badges: [],
      activityHeatmap: {
        data: [],
        totalContributions: 0,
        currentStreak: 0,
        longestStreak: 0
      }
    }
  ];
  
  // Filter users based on query
  const filteredUsers = mockUsers.filter(user => 
    user.userName.toLowerCase().includes(query.toLowerCase()) ||
    user.firstName.toLowerCase().includes(query.toLowerCase()) ||
    user.lastName.toLowerCase().includes(query.toLowerCase())
  );
  
  return Promise.resolve(filteredUsers);
};
