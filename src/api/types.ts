export interface UserProfile {
  userID: string;
  userName: string;
  email?: string;
  profileImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  skills?: string[];
  interests?: string[];
  experience?: string[];
  education?: string[];
  createdAt?: number;
  updatedAt?: number;
  lastActive?: number;
  isOnline?: boolean;
  status?: string;
}

export interface Friend {
  userID: string;
  userName: string;
  profileImage: string;
  status: "online" | "offline" | "in-match" | "coding";
  lastActive: number;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: number;
  updatedAt: number;
  solution: string;
  testCases: string[];
  example: string;
}

export interface Challenge {
  id: string;
  title: string;
  creatorId: string;
  difficulty: string;
  isPrivate: boolean;
  status: string;
  password?: string;
  accessCode?: string;
  problemIds: string[];
  timeLimit: number;
  createdAt: number;
  isActive: boolean;
  participantIds: string[];
  userProblemMetadata?: { [key: string]: ProblemMetadataList };
  startTime?: number;
  endTime?: number;
  participantUsers?: Array<{
    userID: string;
    userName: string;
    avatarURL: string;
  }>;
  access_code?: string;
  created_at?: number;
  problem_ids?: string[];
  createdId?: UserProfile;
  createdBy?: UserProfile;
  participantIds?: string[];
  participantUsers?: UserProfile[];
  is_private?: boolean;
  problem_id?: string;
  problem_ids?: string[];
  time_limit?: number;
}

export interface ProblemMetadata {
  problemId: string;
  score: number;
  timeTaken: number;
  completedAt: number;
}

export interface ProblemMetadataList {
  challengeProblemMetadata: ProblemMetadata[];
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  profileImage: string;
  score: number;
  timeTaken: number;
  problemsCompleted: number;
}

export interface UserStats {
  userId: string;
  totalChallenges: number;
  challengesWon: number;
  averageScore: number;
  problemsSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

export interface SubmissionStatus {
  submissionId: string;
  status: 'pending' | 'completed' | 'error';
  score?: number;
  timeTaken?: number;
  memoryUsed?: number;
  language?: string;
  code?: string;
  submittedAt?: number;
  completedAt?: number;
  error?: string;
}
