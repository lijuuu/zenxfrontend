
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Challenge } from '@/api/challengeTypes';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, FileCode, Clock, Lock, Timer, Trophy, Users, Play, X, ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { useStartChallenge } from '@/services/useChallenges';
import { Badge } from '@/components/ui/badge';
import ZenXPlayground from '../playground/ZenXPlayground';
import { useToast } from '@/hooks/use-toast';
import { useAppSelector } from '@/hooks/useAppSelector';
import ChallengeTimer from './ChallengeTimer';
import EventNotification from './EventNotification';
import LeaderboardCard from './LeaderboardCard';

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
  const [events, setEvents] = useState<{ type: string; message: string; username?: string; problemName?: string; id: number }[]>([]);
  const [eventId, setEventId] = useState(0);

  // Add a new event to the events list
  const addEvent = (type: string, message: string, username?: string, problemName?: string) => {
    const newEventId = eventId + 1;
    setEventId(newEventId);
    setEvents(prev => [...prev, { type, message, username, problemName, id: newEventId }].slice(-5));
  };

  // Remove an event from the events list
  const removeEvent = (id: number) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  useEffect(() => {
    if (initialChallenge && user?.userID) {
      connectToSocket(initialChallenge.id, user.userID);
    }

    return () => {
      socketService.disconnect();
    };
  }, [initialChallenge, user?.userID]);

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
      } else {
        addEvent('connect', 'Connected to challenge');
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
      addEvent('forfeit', 'forfeited the challenge', data.userId);
    });

    socketService.on('userSubmit', (data: { userId: string, problemId: string }) => {
      toast({
        title: "Code Submission",
        description: `User ${data.userId} submitted code for problem ${MOCK_PROBLEMS[data.problemId]?.title || data.problemId}`,
        variant: "default"
      });
      addEvent('submit', 'submitted code for', data.userId, MOCK_PROBLEMS[data.problemId]?.title || data.problemId);
    });

    socketService.on('userCodeSuccess', (data: { userId: string, problemId: string, score: number }) => {
      toast({
        title: "Code Success",
        description: `User ${data.userId} solved problem ${MOCK_PROBLEMS[data.problemId]?.title || data.problemId} (Score: ${data.score})`,
        variant: "default"
      });
      addEvent('success', `solved problem (Score: ${data.score})`, data.userId, MOCK_PROBLEMS[data.problemId]?.title || data.problemId);
    });

    socketService.on('userCodeFail', (data: { userId: string, problemId: string, error: string }) => {
      if (data.userId === user?.userID) {
        toast({
          title: "Code Failed",
          description: `Your solution failed: ${data.error}`,
          variant: "destructive"
        });
        addEvent('fail', `failed: ${data.error}`, 'You', MOCK_PROBLEMS[data.problemId]?.title || data.problemId);
      }
    });

    socketService.on('userWon', (data: { userId: string }) => {
      toast({
        title: "Challenge Complete",
        description: `User ${data.userId} completed all problems!`,
        variant: "default"
      });
      addEvent('win', 'completed all problems!', data.userId);
    });

    socketService.on('timeExhausted', () => {
      toast({
        title: "Time Exhausted",
        description: "Challenge time limit has been reached",
        variant: "destructive"
      });
      addEvent('timeUp', 'Time limit reached for the challenge');
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
      addEvent('disconnect', 'Disconnected from challenge');
    });
  }, [user?.userID, toast, selectedProblemId]);

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
        addEvent('start', 'started the challenge', user?.userID);
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
        addEvent('forfeit', 'forfeited the challenge', 'You');
      }
    }
  };

  const handleSubmitCode = async (code: string, language: string) => {
    if (!challenge || !selectedProblemId) return;

    if (socketService.isConnected()) {
      const result = await socketService.submitCode(selectedProblemId, code, language);

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
        addEvent('connect', 'Reconnected to challenge');
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

  const handleTimeWarning = () => {
    toast({
      title: "Time Warning",
      description: "Less than 5 minutes remaining!",
      variant: "destructive"
    });
    addEvent('timeWarning', 'Less than 5 minutes remaining!');
  };

  const handleTimeUp = () => {
    toast({
      title: "Time Up",
      description: "Challenge time is over!",
      variant: "destructive"
    });
    addEvent('timeUp', 'Challenge time is over!');
  };

  useEffect(() => {
    if (challenge && challenge.isActive && challenge.endTime) {
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
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading challenge...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center h-full p-8 text-center"
      >
        <AlertCircle className="h-10 w-10 text-destructive mb-4" />
        <h3 className="text-xl font-semibold mb-2">Error Loading Challenge</h3>
        <p className="text-muted-foreground mb-6">
          We encountered an error while loading the challenge details.
        </p>
        <Button asChild variant="outline">
          <Link to="/challenges">Return to Challenges</Link>
        </Button>
      </motion.div>
    );
  }

  if (!challenge) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center h-full p-8 text-center"
      >
        <h3 className="text-xl font-semibold mb-2">No Active Challenge</h3>
        <p className="text-muted-foreground mb-6">
          You don't have an active challenge selected. Join or create a challenge to start coding!
        </p>
        <div className="space-x-4">
          <Button asChild variant="outline">
            <Link to="/challenges">Browse Challenges</Link>
          </Button>
        </div>
      </motion.div>
    );
  }

  if (socketError) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center h-full p-8 text-center"
      >
        <AlertCircle className="h-10 w-10 text-amber-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Connection Error</h3>
        <p className="text-muted-foreground mb-6">
          {socketError}
        </p>
        <Button onClick={reconnectSocket} variant="outline">
          Reconnect
        </Button>
      </motion.div>
    );
  }

  const renderEventFeed = () => (
    <div className="space-y-1 mb-4">
      <AnimatePresence>
        {events.map((event) => (
          <EventNotification
            key={event.id}
            type={event.type as any}
            message={event.message}
            username={event.username}
            problemName={event.problemName}
            visible={true}
            onClose={() => removeEvent(event.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );

  const renderOverview = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <div className="md:col-span-2 space-y-6">
        <Card className="overflow-hidden border border-zinc-800/50 bg-gradient-to-br from-zinc-900 to-zinc-950">
          <CardHeader className="pb-2 border-b border-zinc-800/60">
            <CardTitle className="text-lg flex items-center">
              <FileCode className="h-5 w-5 text-primary mr-2" />
              Challenge Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {renderEventFeed()}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={challenge.isActive ? "default" : "secondary"} className="mt-1">
                  {challenge.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Difficulty</p>
                <Badge variant="outline" className={`mt-1
                  ${challenge.difficulty === 'Easy' ? 'text-green-500 border-green-500/30' :
                    challenge.difficulty === 'Medium' ? 'text-amber-500 border-amber-500/30' :
                      'text-red-500 border-red-500/30'}
                `}>
                  {challenge.difficulty}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Time Limit</p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{Math.floor(challenge.timeLimit / 60)} minutes</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Problems</p>
                <div className="flex items-center gap-1 mt-1">
                  <FileCode className="h-4 w-4 text-muted-foreground" />
                  <span>{challenge.problemIds.length} problems</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <div className="flex items-center gap-1 mt-1">
                  <span>{new Date(challenge.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Visibility</p>
                <div className="flex items-center gap-1 mt-1">
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
                <div className="flex items-center gap-1 mt-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{challenge.participantIds.length} participants</span>
                </div>
              </div>

              {challenge.isActive && challenge.endTime && (
                <div className="col-span-2 mt-2">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Time Remaining</p>
                  <ChallengeTimer 
                    endTime={challenge.endTime} 
                    onTimeWarning={handleTimeWarning}
                    onTimeUp={handleTimeUp}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            <div className="pt-2">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Problems</h4>
              <motion.div 
                className="space-y-2"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: { 
                    opacity: 1,
                    transition: { staggerChildren: 0.05 }
                  }
                }}
              >
                {challenge.problemIds.map((problemId, index) => (
                  <motion.div 
                    key={problemId} 
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: { opacity: 1, y: 0 }
                    }}
                    className="flex items-center justify-between p-3 rounded-md bg-zinc-800/30 border border-zinc-700/30 hover:border-zinc-700/60 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center font-mono text-xs bg-zinc-700/70 text-zinc-300 rounded-full w-6 h-6">
                        {index + 1}
                      </span>
                      <span>{MOCK_PROBLEMS[problemId]?.title || `Problem ${index + 1}`}</span>
                      <Badge variant="outline" className={`
                        ${MOCK_PROBLEMS[problemId]?.difficulty === 'Easy' ? 'text-green-500 border-green-500/30' :
                          MOCK_PROBLEMS[problemId]?.difficulty === 'Medium' ? 'text-amber-500 border-amber-500/30' :
                            'text-red-500 border-red-500/30'}
                      `}>
                        {MOCK_PROBLEMS[problemId]?.difficulty || 'Unknown'}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 hover:bg-primary/20 transition-colors"
                      onClick={() => {
                        setSelectedProblemId(problemId);
                        setCurrentTab('playground');
                      }}
                    >
                      Solve <ChevronRight className="h-3 w-3" />
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <LeaderboardCard 
          entries={challenge.leaderboard || []} 
          currentUserId={user?.userID}
          className="border border-zinc-800/50 bg-gradient-to-br from-zinc-900 to-zinc-950"
        />

        <Card className="border border-zinc-800/50 bg-gradient-to-br from-zinc-900 to-zinc-950">
          <CardHeader className="pb-2 border-b border-zinc-800/60">
            <CardTitle className="text-lg">Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {user?.userID === challenge.creatorId && !challenge.isActive && (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white group transition-all"
                  onClick={handleStartChallenge}
                >
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                    className="mr-2 text-white/70"
                  >
                    <Play className="h-4 w-4 fill-current" />
                  </motion.div>
                  Start Challenge
                </Button>
              )}

              {challenge.isActive && (
                <Button
                  variant="default"
                  className="w-full bg-primary hover:bg-primary/80 group transition-all"
                  onClick={() => {
                    setCurrentTab('playground');
                    setSelectedProblemId(challenge.problemIds[0]);
                  }}
                >
                  <Play className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Continue Challenge
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full group hover:bg-red-900/20 hover:text-red-400 hover:border-red-900/30 transition-all"
                onClick={handleForfeitChallenge}
              >
                <X className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Forfeit Challenge
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent"
        >
          {challenge.title}
        </motion.h2>
        
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="bg-zinc-800/70 p-0.5 rounded-md border border-zinc-700/30 backdrop-blur-sm">
                <Button
                  variant={currentTab === 'overview' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentTab('overview')}
                  className={currentTab === 'overview' ? 'bg-primary hover:bg-primary/90' : 'hover:bg-zinc-700/50'}
                >
                  Overview
                </Button>
                <Button
                  variant={currentTab === 'playground' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setCurrentTab('playground');
                    if (!selectedProblemId && challenge.problemIds.length > 0) {
                      setSelectedProblemId(challenge.problemIds[0]);
                    }
                  }}
                  className={currentTab === 'playground' ? 'bg-primary hover:bg-primary/90' : 'hover:bg-zinc-700/50'}
                >
                  Playground
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentTab === 'overview' ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderOverview()}
          </motion.div>
        ) : (
          <motion.div
            key="playground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mr-2"
                  onClick={() => setCurrentTab('overview')}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                
                <div className="flex items-center gap-2">
                  {challenge.problemIds.map((problemId, index) => (
                    <Button
                      key={problemId}
                      variant={selectedProblemId === problemId ? "default" : "outline"}
                      size="sm"
                      className={selectedProblemId === problemId ? "bg-primary" : ""}
                      onClick={() => setSelectedProblemId(problemId)}
                    >
                      Problem {index + 1}
                    </Button>
                  ))}
                </div>
              </div>
              
              {challenge.endTime && (
                <ChallengeTimer 
                  endTime={challenge.endTime}
                  onTimeWarning={handleTimeWarning}
                  onTimeUp={handleTimeUp}
                  className="w-64"
                />
              )}
            </div>
            
            <div className="h-[calc(100%-3rem)]">
              {selectedProblemId ? (
                <ZenXPlayground
                  propsProblemID={selectedProblemId}
                  onSubmit={handleSubmitCode}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>No problem selected. Please select a problem to solve.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
    `${minutes.toString().padStart(2, '0')}m`,
    `${seconds.toString().padStart(2, '0')}s`
  ].filter(Boolean).join(' ');
}

export { ChallengeInterface };
