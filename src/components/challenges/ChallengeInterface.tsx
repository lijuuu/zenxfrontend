import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Challenge } from '@/api/challengeTypes';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStartChallenge } from '@/services/useChallenges';
import { useToast } from '@/hooks/use-toast';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChallengeSocketService, MOCK_PROBLEMS } from '../../services/challengeSocketService';
import ChallengeOverview from './ChallengeOverview';
import ZenXPlayground from '../playground/ZenXPlayground';
import ChallengeTimer from './ChallengeTimer';
import ProblemCard from './ProblemCard';

const socketService = new ChallengeSocketService();

interface ChallengeInterfaceProps {
  challenge?: Challenge | null;
  isPrivate?: boolean;
  accessCode?: string;
  isLoading?: boolean;
  error?: Error | null;
}

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

  // For demo/development purposes
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
  const [problems, setProblems] = useState<any[]>([]);

  // Add a new event to the events list (limited to recent 10)
  const addEvent = (type: string, message: string, username?: string, problemName?: string) => {
    const newEventId = eventId + 1;
    setEventId(newEventId);
    setEvents(prev => [...prev, { type, message, username, problemName, id: newEventId }].slice(-10));
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

  // Prepare problem data for the interface
  useEffect(() => {
    if (challenge) {
      // Map problem IDs to actual problem objects
      const problemsData = challenge.problemIds.map(id => MOCK_PROBLEMS[id] || {
        id,
        title: `Problem ${id.substring(0, 5)}...`,
        difficulty: 'Medium',
        description: 'Description not available'
      });
      
      setProblems(problemsData);
      
      // Select the first problem by default if none is selected
      if (!selectedProblemId && problemsData.length > 0) {
        setSelectedProblemId(problemsData[0].id);
      }
    }
  }, [challenge, selectedProblemId]);

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

  // Get the current problem object
  const currentProblem = problems.find(p => p.id === selectedProblemId) || null;

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-4">
        {/* Header with tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold">{challenge.title}</h1>
            <p className="text-muted-foreground">
              {challenge.isActive
                ? "Challenge is active"
                : "Challenge is not yet started"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {challenge.isActive && challenge.endTime && currentTab === 'playground' && (
              <div className="mr-4">
                <ChallengeTimer
                  endTime={challenge.endTime}
                  compact={true}
                  className="bg-zinc-800/60 px-3 py-1.5 rounded-md"
                />
              </div>
            )}

            <Tabs
              value={currentTab}
              onValueChange={(value) => setCurrentTab(value as 'overview' | 'playground')}
              className="w-[400px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="playground" disabled={!selectedProblemId}>
                  Playground
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Content area */}
        <div className="w-full">
          {currentTab === 'overview' && (
            <ChallengeOverview
              challenge={challenge}
              events={events}
              selectedProblemId={selectedProblemId}
              onRemoveEvent={removeEvent}
              onTimeWarning={handleTimeWarning}
              onTimeUp={handleTimeUp}
              onProblemSelect={(problemId) => {
                setSelectedProblemId(problemId);
                setCurrentTab('playground');
              }}
              onStartChallenge={handleStartChallenge}
              onForfeitChallenge={handleForfeitChallenge}
            />
          )}

          {currentTab === 'playground' && selectedProblemId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setCurrentTab('overview')}
                >
                  <ChevronLeft className="h-4 w-4" /> Back to Overview
                </Button>
                
                <div className="flex items-center gap-2">
                  {problems.map((p, index) => (
                    <ProblemCard
                      key={p.id}
                      problem={p}
                      index={index}
                      isSelected={selectedProblemId === p.id}
                      isCompleted={
                        challenge.userProblemMetadata?.[user?.userID || '']?.challengeProblemMetadata?.some(
                          meta => meta.problemId === p.id
                        ) || false
                      }
                      onClick={() => setSelectedProblemId(p.id)}
                      compact={true}
                    />
                  ))}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">
                    {currentProblem?.title || `Problem ${selectedProblemId}`}
                  </h3>
                </div>
              </div>
              
              <ZenXPlayground
                propsProblemID={selectedProblemId}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeInterface;
