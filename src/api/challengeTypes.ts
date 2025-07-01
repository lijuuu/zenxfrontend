// types/challenge.ts

export type Submission = {
  submissionId: string;
  timeTaken: number; // milliseconds
  points: number;
  userCode: string;
};

export type ChallengeProblemMetadata = {
  problemId: string;
  score: number;
  timeTaken: number; // milliseconds
  completedAt: number; // unix timestamp
};

export type ParticipantMetadata = {
  problemsDone: Record<string, ChallengeProblemMetadata>;
  problemsAttempted: number;
  totalScore: number;
  joinTime: number; // unix timestamp
  lastConnected: number; // unix timestamp
};

export type LeaderboardEntry = {
  userId: string;
  problemsCompleted: number;
  totalScore: number;
  rank: number;
};

export type ChallengeConfig = {
  maxUsers: number;
  maxEasyQuestions: number;
  maxMediumQuestions: number;
  maxHardQuestions: number;
};

export type ChallengeDocument = {
  challengeId: string;
  creatorId: string;
  title: string;
  isPrivate: boolean;
  password: string;
  status: "pending" | "active" | "completed"; // match Go `ChallengeStatus` enum
  timeLimit: number; // milliseconds
  startTime: number; // unix timestamp
  participants: Record<string, ParticipantMetadata>;
  submissions: Record<string, Record<string, Submission>>;
  leaderboard: LeaderboardEntry[];
  config: ChallengeConfig;
  processedProblemIds: string[];
};

export type Session = {
  userId: string;
  challengeId: string;
  lastActive: number; // unix timestamp
  sessionHash: string;
};
