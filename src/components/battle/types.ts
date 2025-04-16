
export interface UserData {
  id: string;
  name: string;
  avatar: string;
}

export interface LeaderboardEntry {
  userId: string;
  problemsCompleted: number;
  totalScore: number;
  rank: number;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  examples: ProblemExample[];
  constraints: string[];
}

export interface ChatMessage {
  userId: string;
  content: string;
  timestamp: Date;
}

export interface Room {
  id: string;
  challengeId: string;
  password: string;
  status: string;
  startTime: string;
  participantIds: string[];
  problemIds: string[];
  createdAt: string;
}

export interface RoomData {
  room: Room;
  problemIds: string[];
  leaderboard: LeaderboardEntry[];
}
