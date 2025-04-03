
import { LeaderboardEntry } from './types';

// Mock data for leaderboard
const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    user: {
      id: "l1",
      username: "codemaster",
      fullName: "Alex Johnson",
      profileImage: "https://i.pravatar.cc/300?img=12",
      country: "United States",
      countryCode: "US"
    },
    score: 9845,
    problemsSolved: 482,
    contestsParticipated: 48,
    streakDays: 186
  },
  {
    rank: 2,
    user: {
      id: "l2",
      username: "algorithm_wizard",
      fullName: "Emma Chen",
      profileImage: "https://i.pravatar.cc/300?img=32",
      country: "Canada",
      countryCode: "CA"
    },
    score: 9782,
    problemsSolved: 463,
    contestsParticipated: 52,
    streakDays: 142
  },
  {
    rank: 3,
    user: {
      id: "l3",
      username: "code_ninja",
      fullName: "Raj Patel",
      profileImage: "https://i.pravatar.cc/300?img=11",
      country: "India",
      countryCode: "IN"
    },
    score: 9654,
    problemsSolved: 456,
    contestsParticipated: 43,
    streakDays: 205
  },
  {
    rank: 4,
    user: {
      id: "l4",
      username: "devmaster",
      fullName: "Sophie Martin",
      profileImage: "https://i.pravatar.cc/300?img=25",
      country: "France",
      countryCode: "FR"
    },
    score: 9523,
    problemsSolved: 442,
    contestsParticipated: 39,
    streakDays: 128
  },
  {
    rank: 5,
    user: {
      id: "l5",
      username: "hackerX",
      fullName: "James Wilson",
      profileImage: "https://i.pravatar.cc/300?img=15",
      country: "Australia",
      countryCode: "AU"
    },
    score: 9411,
    problemsSolved: 431,
    contestsParticipated: 41,
    streakDays: 163
  },
  {
    rank: 6,
    user: {
      id: "l6",
      username: "bytecoder",
      fullName: "Maria Garcia",
      profileImage: "https://i.pravatar.cc/300?img=23",
      country: "Spain",
      countryCode: "ES"
    },
    score: 9356,
    problemsSolved: 428,
    contestsParticipated: 37,
    streakDays: 132
  },
  {
    rank: 7,
    user: {
      id: "l7",
      username: "codegenius",
      fullName: "Hiroshi Tanaka",
      profileImage: "https://i.pravatar.cc/300?img=17",
      country: "Japan",
      countryCode: "JP"
    },
    score: 9287,
    problemsSolved: 418,
    contestsParticipated: 44,
    streakDays: 156
  },
  {
    rank: 8,
    user: {
      id: "l8",
      username: "algoexpert",
      fullName: "Anna Kowalski",
      profileImage: "https://i.pravatar.cc/300?img=29",
      country: "Poland",
      countryCode: "PL"
    },
    score: 9165,
    problemsSolved: 412,
    contestsParticipated: 36,
    streakDays: 119
  },
  {
    rank: 9,
    user: {
      id: "l9",
      username: "codehacker",
      fullName: "Luis Hernandez",
      profileImage: "https://i.pravatar.cc/300?img=14",
      country: "Mexico",
      countryCode: "MX"
    },
    score: 9042,
    problemsSolved: 405,
    contestsParticipated: 35,
    streakDays: 98
  },
  {
    rank: 10,
    user: {
      id: "l10",
      username: "devguru",
      fullName: "Sarah Kim",
      profileImage: "https://i.pravatar.cc/300?img=28",
      country: "South Korea",
      countryCode: "KR"
    },
    score: 8976,
    problemsSolved: 398,
    contestsParticipated: 33,
    streakDays: 135
  }
];

// API functions
export const getLeaderboard = async (options?: { limit?: number; page?: number; period?: 'all' | 'monthly' | 'weekly' }): Promise<{ leaderboard: LeaderboardEntry[]; total: number }> => {
  return new Promise(resolve => {
    const limit = options?.limit || 10;
    const page = options?.page || 1;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // In a real app, sorting would be done server-side based on the period
    const sortedLeaderboard = [...mockLeaderboard];
    
    const paginatedLeaderboard = sortedLeaderboard.slice(startIndex, endIndex);
    
    setTimeout(() => resolve({
      leaderboard: paginatedLeaderboard,
      total: sortedLeaderboard.length
    }), 700);
  });
};

export const getGlobalRank = async (userId: string): Promise<{ rank: number; total: number }> => {
  return new Promise(resolve => {
    // For demo purposes, return a random rank for any user except the mock leaderboard users
    const userInLeaderboard = mockLeaderboard.find(entry => entry.user.id === userId);
    
    if (userInLeaderboard) {
      setTimeout(() => resolve({
        rank: userInLeaderboard.rank,
        total: 10000
      }), 500);
    } else {
      setTimeout(() => resolve({
        rank: 354, // For the default user
        total: 10000
      }), 500);
    }
  });
};

export const getFriendsLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  return new Promise(resolve => {
    // Return a subset of the leaderboard as "friends"
    const friendsLeaderboard = [
      {
        ...mockLeaderboard[2],
        rank: 1 // Rank among friends
      },
      {
        ...mockLeaderboard[4],
        rank: 2 // Rank among friends
      },
      {
        rank: 3, // Rank among friends
        user: {
          id: "1",
          username: "johndoe",
          fullName: "John Doe",
          profileImage: "https://i.pravatar.cc/300?img=1",
          country: "United States",
          countryCode: "US"
        },
        score: 6542,
        problemsSolved: 147,
        contestsParticipated: 12,
        streakDays: 26
      },
      {
        ...mockLeaderboard[7],
        rank: 4 // Rank among friends
      }
    ];
    
    setTimeout(() => resolve(friendsLeaderboard), 600);
  });
};
