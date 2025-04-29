
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CodeEditor from '@/components/problem/CodeEditor';
import { Button } from '@/components/ui/button';
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from '@/components/ui/resizable';
import {
  Clock,
  RefreshCcw,
  Play,
  Stop,
  User,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useChallengeWebSocket } from '@/services/useChallengeWebSocket';
import { useAppSelector } from '@/hooks/useAppSelector';
import { getFullName } from '@/utils/authUtils';
import { useGetUserProfile } from '@/services/useGetUserProfile';
import Console from '@/components/problem/Console';

const ChallengePlayground = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const userProfile = useAppSelector(state => state.auth.userProfile);
  const userId = userProfile?.userID;
  
  // Connect to challenge WebSocket
  const { 
    state: { challenge, leaderboard, connected, lastEvent },
    startChallenge,
    forfeitChallenge,
    submitCode,
    hydrate,
    reconnect
  } = useChallengeWebSocket(challengeId, userId);
  
  // Local state
  const [code, setCode] = useState<string>('// Write your code here');
  const [language, setLanguage] = useState<string>('javascript');
  const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0);
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  
  // Handle remaining time countdown
  useEffect(() => {
    if (!challenge?.start_time || !challenge?.time_limit) return;
    
    const endTimeMs = (challenge.start_time + challenge.time_limit) * 1000;
    const updateTime = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTimeMs - now) / 1000));
      setRemainingTime(remaining);
      
      if (remaining <= 0) {
        clearInterval(interval);
      }
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, [challenge?.start_time, challenge?.time_limit]);
  
  // Format remaining time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Current problem data
  const currentProblemId = challenge?.problem_ids?.[currentProblemIndex] || '';
  const currentUserProblemMetadata = challenge?.user_problem_metadata?.[userId || '']?.challengeProblemMetadata || [];
  const solvedProblems = currentUserProblemMetadata.map(meta => meta.problemId);
  
  // Check if the current problem is solved
  const isCurrentProblemSolved = solvedProblems.includes(currentProblemId);
  
  // Handle code submission
  const handleSubmit = async () => {
    if (!currentProblemId || !code.trim()) {
      toast.error("Cannot submit empty code");
      return;
    }
    
    setIsSubmitting(true);
    setConsoleOutput('Evaluating submission...');
    
    try {
      submitCode(code, language, currentProblemId);
      toast.info("Your submission is being processed");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit your code");
      setConsoleOutput('Error submitting code: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Navigate to next problem
  const handleNextProblem = () => {
    if (currentProblemIndex < (challenge?.problem_ids?.length || 0) - 1) {
      setCurrentProblemIndex(prev => prev + 1);
      setCode('// Write your code here');
      setConsoleOutput('');
    }
  };
  
  // Navigate to previous problem
  const handlePrevProblem = () => {
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex(prev => prev - 1);
      setCode('// Write your code here');
      setConsoleOutput('');
    }
  };
  
  // Handle challenge forfeit
  const handleForfeit = () => {
    if (confirm('Are you sure you want to forfeit this challenge?')) {
      forfeitChallenge();
      navigate('/challenges');
      toast.info("You forfeited the challenge");
    }
  };
  
  const isCreator = userId === challenge?.creator_id;
  
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      {/* Top navigation bar */}
      <div className="h-16 border-b flex items-center justify-between px-4 bg-background">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate('/challenges')} className="h-8">
            Back to Challenges
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <h1 className="text-lg font-semibold">{challenge?.title || 'Challenge'}</h1>
          <Badge variant={challenge?.is_active ? 'success' : 'default'}>
            {challenge?.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-3">
          {remainingTime > 0 && (
            <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full">
              <Clock className="h-4 w-4 text-amber-700 dark:text-amber-400" />
              <span className="font-mono font-medium text-amber-800 dark:text-amber-300">
                {formatTime(remainingTime)}
              </span>
            </div>
          )}
          
          <Button 
            size="sm" 
            variant="ghost"
            onClick={hydrate}
            className="h-8"
          >
            <RefreshCcw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          
          {isCreator && !challenge?.start_time && (
            <Button 
              size="sm"
              onClick={startChallenge}
              className="bg-green-600 hover:bg-green-700 h-8"
            >
              <Play className="h-4 w-4 mr-1" />
              Start Challenge
            </Button>
          )}
          
          <Button 
            size="sm"
            variant="destructive"
            onClick={handleForfeit}
            className="h-8"
          >
            <Stop className="h-4 w-4 mr-1" />
            Forfeit
          </Button>
        </div>
      </div>
      
      {/* Main content area */}
      <ResizablePanelGroup direction="horizontal" className="flex-grow">
        {/* Problem statement and editor area */}
        <ResizablePanel defaultSize={70} className="flex flex-col">
          <ResizablePanelGroup direction="vertical">
            {/* Problem statement area */}
            <ResizablePanel defaultSize={40} className="p-4 overflow-auto">
              {challenge ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-semibold">
                        Problem {currentProblemIndex + 1}: {currentProblemId}
                      </h2>
                      <p className="text-muted-foreground">
                        {isCurrentProblemSolved ? (
                          <span className="text-green-600 dark:text-green-400">✓ Solved</span>
                        ) : 'Not solved yet'}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        disabled={currentProblemIndex === 0}
                        onClick={handlePrevProblem}
                      >
                        Previous
                      </Button>
                      <Button 
                        variant="outline"
                        disabled={currentProblemIndex >= (challenge?.problem_ids?.length || 0) - 1}
                        onClick={handleNextProblem}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                  
                  <div className="prose dark:prose-invert max-w-none">
                    <p>
                      Since this is a placeholder interface, we would typically load the problem 
                      description here. For now, let's assume this is a coding challenge where 
                      you need to solve the problem by writing code in the editor below.
                    </p>
                    
                    <h3>Problem Description</h3>
                    <p>
                      Write a function that solves the given problem correctly and efficiently.
                      Test your solution before submitting.
                    </p>
                    
                    <h3>Example</h3>
                    <pre className="bg-muted p-2 rounded">
                      Input: [1, 2, 3]<br/>
                      Output: 6
                    </pre>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              )}
            </ResizablePanel>
            
            <ResizableHandle />
            
            {/* Code editor area */}
            <ResizablePanel defaultSize={60} className="flex flex-col">
              <div className="flex-grow border-t overflow-hidden">
                <ResizablePanelGroup direction="vertical">
                  <ResizablePanel defaultSize={70}>
                    <div className="h-full">
                      <CodeEditor
                        value={code}
                        onChange={setCode}
                        language={language}
                      />
                    </div>
                  </ResizablePanel>
                  
                  <ResizableHandle />
                  
                  <ResizablePanel defaultSize={30}>
                    <div className="h-full">
                      <Console output={consoleOutput} />
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
              
              <div className="p-4 border-t flex justify-between items-center">
                <div className="flex gap-2">
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="border px-2 py-1 rounded bg-background"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                  </select>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="default"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Solution'}
                  </Button>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        
        <ResizableHandle />
        
        {/* Leaderboard and challenge info area */}
        <ResizablePanel defaultSize={30} className="flex flex-col border-l">
          <Tabs defaultValue="leaderboard" className="flex-grow">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="info">Challenge Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="leaderboard" className="flex-grow overflow-auto p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" /> 
                Leaderboard
              </h3>
              
              {leaderboard && leaderboard.length > 0 ? (
                <div className="space-y-2">
                  {leaderboard.map((entry, index) => (
                    <Card key={entry.user_id} className={entry.user_id === userId ? "border-primary" : ""}>
                      <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center 
                            ${index === 0 ? 'bg-amber-100 text-amber-800' : 
                              index === 1 ? 'bg-gray-100 text-gray-800' : 
                              index === 2 ? 'bg-amber-800/20 text-amber-800' : 
                              'bg-muted text-muted-foreground'}`}>
                            {entry.rank}
                          </div>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback>
                                {entry.user_id.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">
                                {entry.user_id === userId ? 'You' : `User ${entry.user_id.substring(0, 5)}`}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{entry.total_score} pts</p>
                          <p className="text-xs text-muted-foreground">
                            {entry.problems_completed} / {challenge?.problem_ids.length || 0} solved
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No leaderboard data available yet
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="info" className="flex-grow overflow-auto p-4">
              {challenge ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Challenge Details</h3>
                    <Card>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Difficulty</span>
                          <Badge variant="outline" className={
                            challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                            challenge.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {challenge.difficulty}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time Limit</span>
                          <span>{Math.floor(challenge.time_limit / 60)} minutes</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Problems</span>
                          <span>{challenge.problem_ids.length}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Created</span>
                          <span>{new Date(challenge.created_at * 1000).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status</span>
                          <Badge variant={challenge.is_active ? 'default' : 'secondary'}>
                            {challenge.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" /> Participants ({challenge.participant_ids.length})
                    </h3>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {challenge.participant_ids.map((participantId) => (
                            <div 
                              key={participantId} 
                              className="flex items-center gap-2 bg-muted p-2 rounded-md"
                              title={participantId}
                            >
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>
                                  {participantId.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">
                                {participantId === userId ? 'You' : participantId.substring(0, 5)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Your Progress</h3>
                    <Card>
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">
                              {solvedProblems.length} / {challenge.problem_ids.length} Problems
                            </span>
                            <span className="text-sm font-medium">
                              {Math.round((solvedProblems.length / challenge.problem_ids.length) * 100)}%
                            </span>
                          </div>
                          <Progress 
                            value={(solvedProblems.length / challenge.problem_ids.length) * 100} 
                            className="h-2"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {challenge.problem_ids.map((problemId, idx) => (
                            <Button
                              key={problemId}
                              variant={currentProblemIndex === idx ? "default" : "outline"}
                              className={`h-8 ${solvedProblems.includes(problemId) ? "border-green-500" : ""}`}
                              onClick={() => setCurrentProblemIndex(idx)}
                            >
                              {idx + 1}
                              {solvedProblems.includes(problemId) && " ✓"}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ChallengePlayground;
