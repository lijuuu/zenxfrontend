
import { Challenge, UserProfile } from "@/api/types";

// Mock challenge creator
const mockCreator: UserProfile = {
  userID: "usr_1",
  userName: "codemaster",
  firstName: "Code",
  lastName: "Master",
  profileImage: "https://i.pravatar.cc/300?img=1",
  isOnline: true
};

// Generate a random access code
const generateAccessCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Generate mock challenges
export const generateMockChallenges = (count: number = 10): Challenge[] => {
  const challenges: Challenge[] = [];
  
  for (let i = 0; i < count; i++) {
    const isPrivate = Math.random() > 0.6;
    const isActive = Math.random() > 0.5;
    const diff = Math.random();
    const difficulty = diff < 0.4 ? "Easy" : diff < 0.8 ? "Medium" : "Hard";
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    challenges.push({
      id: `ch_${Math.random().toString(36).substring(2, 10)}`,
      title: `${isPrivate ? "Private" : "Public"} ${["Algorithm", "Data Structure", "Coding", "Weekend", "Sprint"][Math.floor(Math.random() * 5)]} Challenge ${i + 1}`,
      createdBy: {
        id: mockCreator.userID!,
        username: mockCreator.userName!,
        profileImage: mockCreator.profileImage,
      },
      participants: Math.floor(Math.random() * 20) + 1,
      problemCount: Math.floor(Math.random() * 5) + 1,
      createdAt: date.toISOString(),
      isActive,
      difficulty,
      isPrivate,
      accessCode: isPrivate ? generateAccessCode() : undefined,
      timeLimit: [15, 30, 60][Math.floor(Math.random() * 3)],
      participantUsers: Array(Math.floor(Math.random() * 5) + 1).fill(null).map((_, i) => ({
        id: `usr_${i + 2}`,
        avatar: `https://i.pravatar.cc/300?img=${i + 5}`,
        name: `User ${i + 2}`,
      })),
      problems: Array(Math.floor(Math.random() * 5) + 1).fill(null).map((_, i) => 
        `p${Math.floor(Math.random() * 9) + 1}`
      ),
    });
  }
  
  return challenges;
};

// Mock submission data
export const mockSubmission = {
  id: "sub_123456",
  roomId: "room_123456",
  userId: "user_123456",
  problemId: "prob_123456",
  code: "function solution(input) { return input.sort(); }",
  language: "javascript",
  status: "COMPLETED",
  submittedAt: new Date().toISOString(),
  completedAt: new Date().toISOString(),
  executionTime: 150,
  memory: 5242,
  timeTaken: 120000, // 2 minutes in milliseconds
  score: 85
};

// Mock room data
export const mockRoom = {
  id: "room_123456",
  challengeId: "challenge_123456",
  password: "secret123",
  status: "ACTIVE",
  startTime: new Date().toISOString(),
  endTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
  participantIds: ["user_1", "user_2", "user_3"],
  problemIds: ["prob_1", "prob_2", "prob_3"],
  createdAt: new Date().toISOString()
};

// Mock user stats
export const mockUserStats = {
  userId: "user_123456",
  problemsCompleted: 42,
  totalTimeTaken: 7200000, // 2 hours in milliseconds
  challengesCompleted: 15,
  score: 85.5,
  roomStats: {
    "room_1": {
      rank: 2,
      problemsCompleted: 3,
      totalScore: 280
    },
    "room_2": {
      rank: 1,
      problemsCompleted: 4,
      totalScore: 320
    }
  }
};
