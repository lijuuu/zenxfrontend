
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Challenge } from '@/api/challengeTypes';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, FileCode, Clock, Lock, Timer, Trophy, Users, Play, X } from 'lucide-react';
import { useStartChallenge } from '@/services/useChallenges';
import { Badge } from '@/components/ui/badge';
import ZenXPlayground from '../playground/ZenXPlayground';
import { useToast } from '@/components/ui/use-toast';
import { useAppSelector } from '@/hooks/useAppSelector';


// Mock leaderboard data
interface LeaderboardEntry {
  userId: string;
  problemsCompleted: number;
  totalScore: number;
  rank: number;
}

interface ChallengeInterfaceProps {
  challenge?: Challenge | null;
  isPrivate?: boolean;
  accessCode?: string;
  isLoading?: boolean;
  error?: Error | null;
}

const MOCK_PROBLEMS = {
  "67d96452d3fe6af39801337b": {
    id: "67d96452d3fe6af39801337b",
    title: "Two Sum",
    difficulty: "Easy"
  },
  "67e16a5b48ec539e82f1622e": {
    id: "67e16a5b48ec539e82f1622e",
    title: "Add Two Numbers",
    difficulty: "Medium"
  },
  "67d96452d3fe6af39801337d": {
    id: "67d96452d3fe6af39801337d",
    title: "Valid Parentheses",
    difficulty: "Medium"
  }
};

// WebSocket mock service
class ChallengeSocketService {
  private ws: WebSocket | null = null;
  private listeners: Map<string, any[]> = new Map();
  private challengeId: string | null = null;
  private userId: string | null = null;
  private mockData: Challenge | null = null;
  private mockProblems: any = MOCK_PROBLEMS;
  private mockLeaderboard: LeaderboardEntry[] = [];
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
        title: 'Mock Challenge',
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

const socketService = new ChallengeSocketService();



const ChallengeInterface: React.FC<ChallengeInterfaceProps> = ({
  challenge: initialChallenge,
  isPrivate,
  accessCode,
  isLoading = false,
  error = null
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const startChallengeMutation = useStartChallenge();
  const user = useAppSelector(state => state.auth.userProfile);

  initialChallenge = {
    id: 'ch_123',
    title: 'Friday Night Blitz',
    creatorId: 'user_001',
    difficulty: 'Medium',
    isPrivate: true,
    status: 'ongoing',
    password: 'secret123',
    problemIds: [
      '67d96452d3fe6af39801337b',
      '67e16a5b48ec539e82f1622e',
      '67d96452d3fe6af39801337d',
    ],
    timeLimit: 1800,
    createdAt: Date.now(),
    isActive: true,
    participantIds: ['user_001', 'user_002'],
    userProblemMetadata: {
      user_001: {
        challengeProblemMetadata: [
          {
            problemId: '67d96452d3fe6af39801337d',
            score: 100,
            timeTaken: 240,
            completedAt: Date.now() - 60000,
          },
        ],
      },
      user_002: {
        challengeProblemMetadata: [
          {
            problemId: '67d96452d3fe6af39801337b',
            score: 80,
            timeTaken: 300,
            completedAt: Date.now() - 45000,
          },
        ],
      },
    },
    startTime: Date.now() - 60000,
    endTime: Date.now() + 1740 * 1000,
    leaderboard: [
      {
        userId: 'user_001',
        problemsCompleted: 1,
        totalScore: 100,
        rank: 1,
      },
      {
        userId: 'user_002',
        problemsCompleted: 1,
        totalScore: 80,
        rank: 2,
      },
    ],
  };

  const [challenge, setChallenge] = useState<Challenge | null>(initialChallenge);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [socketError, setSocketError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<'overview' | 'playground'>('overview');

  useEffect(() => {
    if (initialChallenge && user?.userID) {
      connectToSocket(initialChallenge.id, user.userID);
    }

    return () => {
      socketService.disconnect();
    };
  }, [initialChallenge, user?.userID]);

  // setChallenge(mockChallenge)

  const connectToSocket = async (challengeId: string, userId: string) => {
    try {
      const result = await socketService.connect(challengeId, userId);
      setConnected(result.status);

      if (!result.status) {
        setSocketError(result.message);
        toast({
          title: "Connection Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      setSocketError("Failed to connect to challenge socket");
      toast({
        title: "Connection Error",
        description: "Failed to connect to challenge socket",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    socketService.on('hydrate', (data: { challenge: Challenge }) => {
      setChallenge(data.challenge);

      if (!selectedProblemId && data.challenge.problemIds.length > 0) {
        setSelectedProblemId(data.challenge.problemIds[0]);
      }
    });

    socketService.on('userForfeited', (data: { userId: string, message: string }) => {
      toast({
        title: "User Forfeited",
        description: `User ${data.userId} forfeited the challenge`,
        variant: "default"
      });
    });

    socketService.on('userSubmit', (data: { userId: string, problemId: string }) => {
      toast({
        title: "Code Submission",
        description: `User ${data.userId} submitted code for problem ${MOCK_PROBLEMS[data.problemId]?.title || data.problemId}`,
        variant: "default"
      });
    });

    socketService.on('userCodeSuccess', (data: { userId: string, problemId: string, score: number }) => {
      toast({
        title: "Code Success",
        description: `User ${data.userId} solved problem ${MOCK_PROBLEMS[data.problemId]?.title || data.problemId} (Score: ${data.score})`,
        variant: "default"
      });
    });

    socketService.on('userCodeFail', (data: { userId: string, problemId: string, error: string }) => {
      if (data.userId === user?.userID) {
        toast({
          title: "Code Failed",
          description: `Your solution failed: ${data.error}`,
          variant: "destructive"
        });
      }
    });

    socketService.on('userWon', (data: { userId: string }) => {
      toast({
        title: "Challenge Complete",
        description: `User ${data.userId} completed all problems!`,
        variant: "default"
      });
    });

    socketService.on('timeExhausted', () => {
      toast({
        title: "Time Exhausted",
        description: "Challenge time limit has been reached",
        variant: "destructive"
      });
    });

    socketService.on('connect', (data: { status: boolean, message: string }) => {
      toast({
        title: "Socket Connected",
        description: data.message,
        variant: "default"
      });
    });

    socketService.on('disconnect', (data: { status: boolean, message: string }) => {
      toast({
        title: "Socket Disconnected",
        description: data.message,
        variant: "default"
      });
    });
  }, [user?.userID, toast]);

  const handleStartChallenge = async () => {
    if (!challenge) return;

    if (socketService.isConnected()) {
      const result = await socketService.startChallenge();

      if (result.status) {
        toast({
          title: "Challenge Started",
          description: "Challenge has been started successfully",
          variant: "default"
        });
      } else {
        toast({
          title: "Failed to Start",
          description: result.message,
          variant: "destructive"
        });
      }
    } else {
      try {
        await startChallengeMutation.mutateAsync(challenge.id);
        navigate(`/challenge-playground/${challenge.id}`);
      } catch (error) {
        console.error('Failed to start challenge:', error);
      }
    }
  };

  const handleForfeitChallenge = async () => {
    if (!challenge) return;

    if (socketService.isConnected()) {
      const result = await socketService.forfeitChallenge();

      if (result.status) {
        toast({
          title: "Challenge Forfeited",
          description: "You have forfeited the challenge",
          variant: "default"
        });
      }
    }
  };

  const handleSubmitCode = async (problemId: string, code: string, language: string) => {
    if (!challenge) return;

    if (socketService.isConnected()) {
      const result = await socketService.submitCode(problemId, code, language);

      if (!result.status) {
        toast({
          title: "Submission Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    }
  };

  const reconnectSocket = async () => {
    if (!challenge || !user?.userID) return;

    try {
      const result = await socketService.reconnect();
      setConnected(result.status);

      if (!result.status) {
        setSocketError(result.message);
        toast({
          title: "Reconnection Failed",
          description: result.message,
          variant: "destructive"
        });
      } else {
        setSocketError(null);
        toast({
          title: "Reconnected",
          description: "Successfully reconnected to challenge socket",
          variant: "default"
        });
      }
    } catch (error) {
      setSocketError("Failed to reconnect to challenge socket");
      toast({
        title: "Reconnection Error",
        description: "Failed to reconnect to challenge socket",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (challenge && challenge.isActive) {
      const timeLeft = (challenge.endTime - Date.now()) / 1000;

      if (timeLeft > 0) {
        const timer = setTimeout(() => {
          socketService.simulateTimeExhausted();
        }, timeLeft * 1000);

        return () => clearTimeout(timer);
      }
    }
  }, [challenge]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <AlertCircle className="h-10 w-10 text-destructive mb-4" />
        <h3 className="text-xl font-semibold mb-2">Error Loading Challenge</h3>
        <p className="text-muted-foreground mb-6">
          We encountered an error while loading the challenge details.
        </p>
        <Button asChild variant="outline">
          <Link to="/challenges">Return to Challenges</Link>
        </Button>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">No Active Challenge</h3>
        <p className="text-muted-foreground mb-6">
          You don't have an active challenge selected. Join or create a challenge to start coding!
        </p>
        <div className="space-x-4">
          <Button asChild variant="outline">
            <Link to="/challenges">Browse Challenges</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (socketError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <AlertCircle className="h-10 w-10 text-amber-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Connection Error</h3>
        <p className="text-muted-foreground mb-6">
          {socketError}
        </p>
        <Button onClick={reconnectSocket} variant="outline">
          Reconnect
        </Button>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">Challenge Information</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={challenge.isActive ? "default" : "secondary"}>
                  {challenge.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Difficulty</p>
                <Badge variant="outline" className={`
                  ${challenge.difficulty === 'Easy' ? 'text-green-500 border-green-500' :
                    challenge.difficulty === 'Medium' ? 'text-amber-500 border-amber-500' :
                      'text-red-500 border-red-500'}
                `}>
                  {challenge.difficulty}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Time Limit</p>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{Math.floor(challenge.timeLimit / 60)} minutes</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Problems</p>
                <div className="flex items-center gap-1">
                  <FileCode className="h-4 w-4 text-muted-foreground" />
                  <span>{challenge.problemIds.length} problems</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <div className="flex items-center gap-1">
                  <span>{new Date(challenge.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Visibility</p>
                <div className="flex items-center gap-1">
                  {challenge.isPrivate ? (
                    <>
                      <Lock className="h-4 w-4 text-amber-500" />
                      <span>Private</span>
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Public</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Participants</p>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{challenge.participantIds.length} participants</span>
                </div>
              </div>

              {challenge.isActive && (
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Time Remaining</p>
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {challenge.endTime > Date.now()
                        ? formatTimeRemaining(challenge.endTime - Date.now())
                        : 'Time exhausted'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Problems</h4>
              <div className="space-y-2">
                {challenge.problemIds.map((problemId, index) => (
                  <div key={problemId} className="flex items-center justify-between p-2 rounded-md bg-secondary/30">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs bg-secondary/50 rounded-full w-5 h-5 flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span>{MOCK_PROBLEMS[problemId]?.title || `Problem ${index + 1}`}</span>
                      <Badge variant="outline" className={`
                        ${MOCK_PROBLEMS[problemId]?.difficulty === 'Easy' ? 'text-green-500 border-green-500' :
                          MOCK_PROBLEMS[problemId]?.difficulty === 'Medium' ? 'text-amber-500 border-amber-500' :
                            'text-red-500 border-red-500'}
                      `}>
                        {MOCK_PROBLEMS[problemId]?.difficulty || 'Unknown'}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedProblemId(problemId);
                        setCurrentTab('playground');
                      }}
                    >
                      Solve
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold flex items-center">
              <Trophy className="h-5 w-5 text-amber-500 mr-2" />
              Leaderboard
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {challenge.leaderboard?.map((entry) => {
                const isCurrentUser = entry.userId === user?.userID;

                return (
                  <div
                    key={entry.userId}
                    className={`flex items-center justify-between p-2 rounded-md ${isCurrentUser ? 'bg-primary/10' : 'bg-secondary/20'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs rounded-full w-5 h-5 flex items-center justify-center ${entry.rank === 1 ? 'bg-amber-500 text-black' :
                          entry.rank === 2 ? 'bg-zinc-400 text-black' :
                            entry.rank === 3 ? 'bg-amber-700 text-white' :
                              'bg-secondary/50'
                        }`}>
                        {entry.rank}
                      </span>
                      <span>
                        {isCurrentUser ? 'You' : `User ${entry.userId.substring(0, 6)}...`}
                      </span>
                    </div>
                    <div className="flex flex-col items-end text-xs">
                      <span className="text-sm font-semibold">{entry.totalScore} pts</span>
                      <span className="text-muted-foreground">
                        {entry.problemsCompleted}/{challenge.problemIds.length} problems
                      </span>
                    </div>
                  </div>
                );
              })}

              {!challenge.leaderboard?.length && (
                <div className="text-center py-4 text-muted-foreground">
                  No scores yet. Be the first to solve a problem!
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">Actions</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {user?.userID === challenge.creatorId && !challenge.isActive && (
                <Button
                  className="w-full"
                  onClick={handleStartChallenge}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Challenge
                </Button>
              )}

              {challenge.isActive && (
                <Button
                  variant="default"
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setCurrentTab('playground');
                    setSelectedProblemId(challenge.problemIds[0]);
                  }}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Continue Challenge
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={handleForfeitChallenge}
              >
                <X className="h-4 w-4 mr-2" />
                Forfeit Challenge
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <h2 className="text-2xl font-bold">{challenge.title}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant={currentTab === 'overview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentTab('overview')}
          >
            Overview
          </Button>
          <Button
            variant={currentTab === 'playground' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setCurrentTab('playground');
              if (!selectedProblemId && challenge.problemIds.length > 0) {
                setSelectedProblemId(challenge.problemIds[0]);
              }
            }}
          >
            Playground
          </Button>
        </div>
      </div>

      {currentTab === 'overview' ? (
        renderOverview()
      ) : (
        <div className="flex-1">
          {selectedProblemId ? (
            <ZenXPlayground
              propsProblemID={selectedProblemId}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>No problem selected. Please select a problem to solve.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function formatTimeRemaining(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    hours > 0 ? `${hours}h` : '',
    `${minutes}m`,
    `${seconds}s`
  ].filter(Boolean).join(' ');
}

export { ChallengeInterface };