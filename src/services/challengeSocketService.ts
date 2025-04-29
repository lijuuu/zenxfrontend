
import { Challenge } from '@/api/challengeTypes';

// Mock problems data
const MOCK_PROBLEMS = {
  "67d96452d3fe6af39801337b": {
    id: "67d96452d3fe6af39801337b",
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers and a target sum, return indices of the two numbers such that they add up to the target."
  },
  "67e16a5b48ec539e82f1622e": {
    id: "67e16a5b48ec539e82f1622e",
    title: "Add Two Numbers",
    difficulty: "Medium",
    description: "You are given two non-empty linked lists representing two non-negative integers. Add the two numbers and return the sum as a linked list."
  },
  "67d96452d3fe6af39801337d": {
    id: "67d96452d3fe6af39801337d",
    title: "Valid Parentheses",
    difficulty: "Medium",
    description: "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid."
  }
};

export { MOCK_PROBLEMS };

// WebSocket mock service
export class ChallengeSocketService {
  private ws: WebSocket | null = null;
  private listeners: Map<string, any[]> = new Map();
  private challengeId: string | null = null;
  private userId: string | null = null;
  private mockData: Challenge | null = null;
  private mockProblems: any = MOCK_PROBLEMS;
  private mockLeaderboard: any[] = [];
  private connected: boolean = false;
  private reconnectAttempts: number = 0;

  constructor() {
    this.mockLeaderboard = [
      { userId: 'user1', problemsCompleted: 2, totalScore: 150, rank: 1 },
      { userId: 'user2', problemsCompleted: 1, totalScore: 100, rank: 2 },
      { userId: 'user3', problemsCompleted: 1, totalScore: 50, rank: 3 },
    ];
  }

  public connect(challengeId: string, userId: string): Promise<{ status: boolean, message: string }> {
    return new Promise((resolve) => {
      this.challengeId = challengeId;
      this.userId = userId;

      this.mockData = {
        id: challengeId,
        title: 'Friday Night Blitz',
        creatorId: 'creator123',
        difficulty: 'Medium',
        isPrivate: false,
        status: 'active',
        problemIds: ['67d96452d3fe6af39801337b', '67e16a5b48ec539e82f1622e', '67d96452d3fe6af39801337d'],
        timeLimit: 3600,
        createdAt: Date.now() - 3600000,
        isActive: true,
        participantIds: ['user1', 'user2', 'user3', userId],
        userProblemMetadata: {},
        startTime: Date.now() - 1800000,
        endTime: Date.now() + 1800000,
        leaderboard: this.mockLeaderboard
      };

      setTimeout(() => {
        this.connected = true;
        this.emit('connect', { status: true, message: 'Connected to challenge socket' });
        resolve({ status: true, message: 'Connected to challenge socket' });

        setTimeout(() => {
          this.emit('hydrate', { challenge: this.mockData });
        }, 500);
      }, 1000);
    });
  }

  public reconnect(): Promise<{ status: boolean, message: string }> {
    if (this.reconnectAttempts >= 3) {
      return Promise.resolve({ status: false, message: 'Max reconnection attempts reached' });
    }
    this.reconnectAttempts++;
    return this.connect(this.challengeId || '', this.userId || '');
  }

  public disconnect(): void {
    this.connected = false;
    this.emit('disconnect', { status: true, message: 'Disconnected from challenge socket' });
    this.ws = null;
  }

  public on(event: string, callback: any): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  public emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  public startChallenge(): Promise<{ status: boolean, message: string }> {
    return new Promise((resolve) => {
      if (this.mockData && this.userId === this.mockData.creatorId) {
        if (this.mockData) {
          this.mockData.isActive = true;
          this.mockData.startTime = Date.now();
          this.mockData.endTime = Date.now() + this.mockData.timeLimit * 1000;
        }

        setTimeout(() => {
          this.emit('startChallenge', { status: true, message: 'Challenge started successfully' });
          this.emit('hydrate', { challenge: this.mockData });
          resolve({ status: true, message: 'Challenge started successfully' });
        }, 500);
      } else {
        resolve({ status: false, message: 'Only the creator can start the challenge' });
      }
    });
  }

  public forfeitChallenge(): Promise<{ status: boolean, message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.emit('userForfeited', { userId: this.userId, message: 'User forfeited the challenge' });
        resolve({ status: true, message: 'Forfeited the challenge' });

        if (this.mockData) {
          this.mockData.participantIds = this.mockData.participantIds.filter(id => id !== this.userId);
          this.mockLeaderboard = this.mockLeaderboard.filter(entry => entry.userId !== this.userId);
          this.mockData.leaderboard = this.mockLeaderboard;

          setTimeout(() => {
            this.emit('hydrate', { challenge: this.mockData });
          }, 500);
        }
      }, 500);
    });
  }

  public submitCode(problemId: string, code: string, language: string): Promise<{ status: boolean, message: string }> {
    return new Promise((resolve) => {
      this.emit('userSubmit', {
        userId: this.userId,
        problemId,
        code,
        language
      });

      setTimeout(() => {
        const isSuccess = Math.random() > 0.5;

        if (isSuccess) {
          this.emit('userCodeSuccess', {
            userId: this.userId,
            problemId,
            score: 100,
            timeTaken: 120
          });

          if (this.mockData) {
            const userEntry = this.mockLeaderboard.find(entry => entry.userId === this.userId);
            if (userEntry) {
              userEntry.problemsCompleted += 1;
              userEntry.totalScore += 100;
            } else {
              this.mockLeaderboard.push({
                userId: this.userId || 'unknown',
                problemsCompleted: 1,
                totalScore: 100,
                rank: this.mockLeaderboard.length + 1
              });
            }

            this.mockLeaderboard.sort((a, b) => b.totalScore - a.totalScore);
            this.mockLeaderboard.forEach((entry, index) => {
              entry.rank = index + 1;
            });

            this.mockData.leaderboard = this.mockLeaderboard;

            const userCompletedAllProblems = this.mockLeaderboard.find(
              entry => entry.userId === this.userId
            )?.problemsCompleted === this.mockData.problemIds.length;

            if (userCompletedAllProblems) {
              this.emit('userWon', { userId: this.userId });
            }

            setTimeout(() => {
              this.emit('hydrate', { challenge: this.mockData });
            }, 300);
          }

          resolve({ status: true, message: 'Code submission successful' });
        } else {
          this.emit('userCodeFail', {
            userId: this.userId,
            problemId,
            error: 'Test cases failed'
          });
          resolve({ status: false, message: 'Code submission failed' });
        }
      }, 1500);
    });
  }

  public simulateTimeExhausted(): void {
    this.emit('timeExhausted', { challengeId: this.challengeId });

    if (this.mockData) {
      this.mockData.isActive = false;

      setTimeout(() => {
        this.emit('hydrate', { challenge: this.mockData });
      }, 300);
    }
  }

  public isConnected(): boolean {
    return this.connected;
  }
}
