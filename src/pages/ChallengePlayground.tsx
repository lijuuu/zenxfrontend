
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from '@/components/ui/resizable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Clock, Trophy, List, CheckCircle, XCircle, ChevronRight, ChevronLeft, Users, Play, Flag } from 'lucide-react';
import { useCurrentChallengeInfo, useIsCreator } from '@/services/useCurrentChallengeInfo';
import { useEndChallenge, useSubmitSolution } from '@/services/useChallenges';
import { useGetUserProfile } from '@/services/useGetUserProfile';
import CodeEditor from '@/components/problem/CodeEditor';
import ProblemDescription from '@/components/challenge/ProblemDescription';
import ChallengeConsole from '@/components/challenge/ChallengeConsole';
import { ProblemMetadata, TestCase, ExecutionResult } from '@/types/challengeTypes';
import axiosInstance from '@/utils/axiosInstance';

// Mock data for initial development
const mockProblems: ProblemMetadata[] = [
  {
    problem_id: 'prob-001',
    title: 'Two Sum',
    description: '# Two Sum\n\nGiven an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\n## Example\n\n- Input: nums = [2,7,11,15], target = 9\n- Output: [0,1]\n- Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].',
    testcase_run: {
      run: [
        { id: '1', input: '{"nums": [2,7,11,15], "target": 9}', expected: '[0,1]' },
        { id: '2', input: '{"nums": [3,2,4], "target": 6}', expected: '[1,2]' }
      ]
    },
    difficulty: 'Easy',
    supported_languages: ['javascript', 'python', 'go', 'cpp'],
    tags: ['Array', 'Hash Table'],
    validated: true,
    placeholder_maps: {
      javascript: 'function twoSum(nums, target) {\n  // Write your code here\n  \n}',
      python: 'def twoSum(nums, target):\n    # Write your code here\n    \n    ',
      go: 'func twoSum(nums []int, target int) []int {\n    // Write your code here\n    \n}',
      cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n    \n}'
    }
  },
  {
    problem_id: 'prob-002',
    title: 'Reverse String',
    description: '# Reverse String\n\nWrite a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.\n\n## Example\n\n- Input: s = ["h","e","l","l","o"]\n- Output: ["o","l","l","e","h"]\n',
    testcase_run: {
      run: [
        { id: '1', input: '{"s": ["h","e","l","l","o"]}', expected: '["o","l","l","e","h"]' },
        { id: '2', input: '{"s": ["H","a","n","n","a","h"]}', expected: '["h","a","n","n","a","H"]' }
      ]
    },
    difficulty: 'Easy',
    supported_languages: ['javascript', 'python', 'go', 'cpp'],
    tags: ['Two Pointers', 'String'],
    validated: true,
    placeholder_maps: {
      javascript: 'function reverseString(s) {\n  // Write your code here\n  \n}',
      python: 'def reverseString(s):\n    # Write your code here\n    \n    ',
      go: 'func reverseString(s []byte) {\n    // Write your code here\n    \n}',
      cpp: 'void reverseString(vector<char>& s) {\n    // Write your code here\n    \n}'
    }
  }
];

// Mock leaderboard data
const mockLeaderboard = [
  { userId: 'user-1', username: 'AlphaCode', problemsCompleted: 2, totalScore: 200, rank: 1 },
  { userId: 'user-2', username: 'BetaCoder', problemsCompleted: 2, totalScore: 180, rank: 2 },
  { userId: 'user-3', username: 'GammaScript', problemsCompleted: 1, totalScore: 100, rank: 3 },
  { userId: 'user-4', username: 'DeltaDev', problemsCompleted: 1, totalScore: 90, rank: 4 }
];

// Fetch problem details function (will replace with real API call later)
const fetchProblemDetails = async (problemId: string): Promise<ProblemMetadata> => {
  // Simulating an API call with a mock
  return new Promise((resolve) => {
    setTimeout(() => {
      const problem = mockProblems.find(p => p.problem_id === problemId) || mockProblems[0];
      resolve(problem);
    }, 300);
  });
};

const ChallengePlayground: React.FC = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isProblemListOpen, setIsProblemListOpen] = useState(false);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [problems, setProblems] = useState<ProblemMetadata[]>(mockProblems);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState<string[]>([]);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [consoleTab, setConsoleTab] = useState<'output' | 'tests' | 'custom'>('tests');
  const [isMobile, setIsMobile] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  const submitMutation = useSubmitSolution();
  const endChallengeMutation = useEndChallenge();
  const { data: userProfile } = useGetUserProfile();
  
  // Get challenge info from the custom hook
  const { data: challengeData, isLoading: isLoadingChallenge, error: challengeError } = 
    useCurrentChallengeInfo(challengeId, true, 30000); // Poll every 30 seconds
  
  const { isCreator } = useIsCreator(
    challengeId,
    challengeData?.challenge?.creatorId
  );

  // Set up mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Start the timer when the challenge data is loaded
  useEffect(() => {
    if (challengeData?.challenge?.startTime && !timerInterval) {
      // Calculate the elapsed time since the challenge started
      const startTime = challengeData.challenge.startTime * 1000; // Convert seconds to milliseconds
      const now = Date.now();
      const initialElapsed = Math.floor((now - startTime) / 1000);
      
      setElapsedTime(initialElapsed > 0 ? initialElapsed : 0);
      
      // Set up the timer to update every second
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      
      setTimerInterval(interval);
    }
    
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [challengeData?.challenge?.startTime]);

  // Handle time limit
  useEffect(() => {
    if (challengeData?.challenge?.timeLimit && elapsedTime >= challengeData.challenge.timeLimit) {
      // Time's up - end the challenge
      handleEndChallenge();
      toast.warning("Time's up! Challenge ended.");
    }
  }, [elapsedTime, challengeData?.challenge?.timeLimit]);

  // Load all problem details for the challenge
  useEffect(() => {
    const loadProblems = async () => {
      if (challengeData?.challenge?.problemIds?.length) {
        const problemPromises = challengeData.challenge.problemIds.map(id => fetchProblemDetails(id));
        const loadedProblems = await Promise.all(problemPromises);
        setProblems(loadedProblems);
        
        // Set initial code based on first problem
        if (loadedProblems.length > 0) {
          setCode(loadedProblems[0].placeholder_maps[language] || '');
        }
      }
    };
    
    if (challengeData?.challenge) {
      loadProblems();
    }
  }, [challengeData, language]);

  // Update code when problem or language changes
  useEffect(() => {
    if (problems.length > 0 && currentProblemIndex < problems.length) {
      const currentProblem = problems[currentProblemIndex];
      setCode(currentProblem.placeholder_maps[language] || '');
    }
  }, [currentProblemIndex, language]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const handleNextProblem = () => {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
      setOutput([]);
      setExecutionResult(null);
    }
  };

  const handlePreviousProblem = () => {
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex(prev => prev - 1);
      setOutput([]);
      setExecutionResult(null);
    }
  };

  const handleCodeExecution = async (type: 'run' | 'submit') => {
    if (!problems.length) return;
    
    const currentProblem = problems[currentProblemIndex];
    setIsExecuting(true);
    setOutput([]);
    setExecutionResult(null);
    
    try {
      if (type === 'submit' && challengeId) {
        await submitMutation.mutateAsync({
          challengeId,
          problemId: currentProblem.problem_id,
          code,
          language
        });
      } else {
        // For now, just use a mock execution result
        setTimeout(() => {
          const mockResult = {
            overallPass: Math.random() > 0.3, // 70% chance of passing
            totalTestCases: currentProblem.testcase_run.run.length,
            passedTestCases: Math.floor(Math.random() * (currentProblem.testcase_run.run.length + 1)),
            failedTestCases: 0,
            syntaxError: null
          };
          
          mockResult.failedTestCases = mockResult.totalTestCases - mockResult.passedTestCases;
          
          setExecutionResult(mockResult);
          setOutput([
            `ProblemID: ${currentProblem.problem_id}`,
            `Language: ${language}`,
            `IsRunTestcase: ${type === 'run'}`,
            `ExecutionResult: ${JSON.stringify(mockResult, null, 2)}`
          ]);
          
          if (mockResult.overallPass) {
            toast.success(`${type === 'run' ? 'Run' : 'Submission'} Successful`, {
              description: `All ${mockResult.totalTestCases} test cases passed!`,
            });
            setConsoleTab('output');
          } else {
            toast[type === 'run' ? 'warning' : 'error'](
              `${type === 'run' ? 'Run' : 'Submission'} ${!mockResult.overallPass ? ' Successful' : 'Failed'}`,
              {
                description: `${mockResult.passedTestCases} of ${mockResult.totalTestCases} test cases passed.`,
              }
            );
            setConsoleTab('tests');
          }
        }, 1000);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error occurred';
      setOutput([`[Error] ${errorMsg}`]);
      setConsoleTab('output');
      
      toast.error(`${type === 'run' ? 'Run' : 'Submit'} Failed`, {
        description: errorMsg,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleEndChallenge = async () => {
    if (!challengeId) return;
    
    try {
      await endChallengeMutation.mutateAsync(challengeId);
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      toast.success('Challenge completed!');
      navigate(`/challenges`);
    } catch (error) {
      toast.error('Failed to end challenge', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const handleResetCode = () => {
    if (problems.length > 0) {
      const currentProblem = problems[currentProblemIndex];
      setCode(currentProblem.placeholder_maps[language] || '');
      setOutput([]);
      setExecutionResult(null);
      toast.info('Code Reset', { description: 'Editor reset to default code.' });
    }
  };

  // If there's an error or no challenge is loaded yet, show a fallback
  if (challengeError || (!isLoadingChallenge && !challengeData?.challenge)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-bold text-destructive">
            {challengeError ? 'Error Loading Challenge' : 'Challenge Not Found'}
          </h1>
          <p className="text-muted-foreground">
            {challengeError 
              ? 'There was an error loading the challenge details. Please try again later.'
              : 'We could not find the challenge you are looking for.'}
          </p>
          <Button onClick={() => navigate('/challenges')} variant="outline">
            Return to Challenges
          </Button>
        </div>
      </div>
    );
  }

  if (isLoadingChallenge) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-8 w-64 bg-muted rounded mx-auto"></div>
          <div className="h-4 w-48 bg-muted rounded mx-auto"></div>
          <div className="h-[600px] w-full max-w-screen-xl mx-auto bg-muted/50 rounded"></div>
        </div>
      </div>
    );
  }

  const currentProblem = problems.length > 0 ? problems[currentProblemIndex] : null;
  const completedProblems = challengeData?.userMetadata?.problemsCompleted || 0;
  const totalProblems = problems.length;
  const progressPercentage = totalProblems > 0 ? (completedProblems / totalProblems) * 100 : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with challenge info and navigation */}
      <div className="h-14 px-4 border-b flex items-center justify-between bg-muted/20 shadow-sm">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/challenges')}
            className="h-9 w-9 p-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div>
            <h1 className="text-base font-medium line-clamp-1">
              {challengeData?.challenge?.title || 'Challenge'}
            </h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="h-5 px-1.5">
                {challengeData?.challenge?.difficulty || 'Medium'}
              </Badge>
              <span className="flex items-center gap-1">
                <List className="h-3 w-3" />
                {totalProblems} problem{totalProblems !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Timer */}
          <div className="flex items-center gap-1.5 bg-muted/60 rounded-md px-2 py-1">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {formatTime(elapsedTime)}
            </span>
          </div>
          
          {/* Problems & Leaderboard buttons */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsProblemListOpen(true)}
            className="hidden sm:flex items-center"
          >
            <List className="h-4 w-4 mr-1" />
            Problems
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsLeaderboardOpen(true)}
            className="hidden sm:flex items-center"
          >
            <Trophy className="h-4 w-4 mr-1" />
            Leaderboard
          </Button>
          
          {/* Mobile menu button */}
          <div className="sm:hidden">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setIsProblemListOpen(true)}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          {/* End challenge button */}
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleEndChallenge}
            disabled={endChallengeMutation.isPending}
            className="flex items-center"
          >
            <Flag className="h-4 w-4 mr-1" />
            End Challenge
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"} className="h-full">
          {!isMobile && (
            <>
              <ResizablePanel defaultSize={30} minSize={25} maxSize={50} className="bg-background">
                {currentProblem && (
                  <ProblemDescription problem={currentProblem} />
                )}
              </ResizablePanel>
              <ResizableHandle className="w-1 bg-border" />
            </>
          )}

          <ResizablePanel defaultSize={isMobile ? 50 : 70} className="flex flex-col">
            {/* Problem navigation on mobile */}
            {isMobile && (
              <div className="h-10 border-b border-border flex items-center justify-between px-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handlePreviousProblem}
                  disabled={currentProblemIndex === 0}
                  className="h-8 px-2"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                
                <div className="flex items-center">
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsProblemListOpen(true)}
                    className="h-8"
                  >
                    Problem {currentProblemIndex + 1} of {totalProblems}
                  </Button>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleNextProblem}
                  disabled={currentProblemIndex === totalProblems - 1}
                  className="h-8 px-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}

            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={70}>
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between border-b border-border px-4 py-2 bg-muted/10">
                    <div className="flex items-center gap-2">
                      <select
                        value={language}
                        onChange={e => handleLanguageChange(e.target.value)}
                        className="text-xs rounded-md bg-background border border-border text-foreground px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        {currentProblem?.supported_languages.map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                      
                      {!isMobile && (
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handlePreviousProblem}
                            disabled={currentProblemIndex === 0}
                            className="h-8 px-2"
                          >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                          </Button>
                          
                          <span className="text-xs text-muted-foreground">
                            Problem {currentProblemIndex + 1} of {totalProblems}
                          </span>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleNextProblem}
                            disabled={currentProblemIndex === totalProblems - 1}
                            className="h-8 px-2"
                          >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCodeExecution('run')}
                        disabled={isExecuting}
                        className="h-8"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Run
                      </Button>
                      
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleCodeExecution('submit')}
                        disabled={isExecuting || submitMutation.isPending}
                        className="h-8"
                      >
                        {submitMutation.isPending ? 'Submitting...' : 'Submit'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <CodeEditor value={code} onChange={setCode} language={language} />
                  </div>
                </div>
              </ResizablePanel>
              
              <ResizableHandle className="h-1 bg-border" />
              
              <ResizablePanel defaultSize={30} minSize={20}>
                <ChallengeConsole
                  output={output}
                  executionResult={executionResult}
                  isMobile={isMobile}
                  onReset={handleResetCode}
                  testCases={currentProblem?.testcase_run?.run || []}
                  activeTab={consoleTab}
                  setActiveTab={setConsoleTab}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      
      {/* Problem List Dialog */}
      <Dialog open={isProblemListOpen} onOpenChange={setIsProblemListOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Challenge Problems</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-2 mb-4">
              <Progress value={progressPercentage} className="h-2" />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {completedProblems}/{totalProblems} solved
              </span>
            </div>
            
            <div className="space-y-2">
              {problems.map((problem, index) => {
                const isCompleted = challengeData?.userMetadata?.challengeProblemMetadata?.some(
                  meta => meta.problemId === problem.problem_id
                );
                
                return (
                  <div
                    key={problem.problem_id}
                    className={`p-3 rounded-md border flex items-center justify-between cursor-pointer hover:bg-muted transition-colors
                      ${currentProblemIndex === index ? 'border-primary/50 bg-muted/50' : 'border-border'}
                      ${isCompleted ? 'border-green-500/20 bg-green-500/5' : ''}
                    `}
                    onClick={() => {
                      setCurrentProblemIndex(index);
                      setIsProblemListOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-6 h-6 flex items-center justify-center rounded-full text-xs
                          ${isCompleted ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}
                        `}
                      >
                        {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-sm">
                          {problem.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Badge variant="outline" className="h-5 px-1.5">
                            {problem.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {currentProblemIndex === index && (
                      <Badge variant="secondary">Current</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Leaderboard Dialog */}
      <Dialog open={isLeaderboardOpen} onOpenChange={setIsLeaderboardOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Live Leaderboard</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="rounded-md border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Rank</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">User</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Problems</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {(challengeData?.leaderboard || mockLeaderboard).map((entry, index) => {
                    const isCurrentUser = entry.userId === userProfile?.userID;
                    
                    return (
                      <tr 
                        key={entry.userId}
                        className={`
                          border-t border-border
                          ${isCurrentUser ? 'bg-primary/10' : ''}
                          ${index === 0 ? 'bg-amber-500/5' : ''}
                        `}
                      >
                        <td className="px-4 py-3 text-sm">
                          {index === 0 ? (
                            <Trophy className="h-4 w-4 text-amber-500" />
                          ) : entry.rank}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={`https://api.dicebear.com/7.x/shapes/svg?seed=${entry.userId}`} />
                              <AvatarFallback>{entry.username?.substring(0, 2) || 'U'}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">
                              {entry.username}
                              {isCurrentUser && <span className="ml-1 text-xs text-muted-foreground">(You)</span>}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-right">{entry.problemsCompleted}</td>
                        <td className="px-4 py-3 text-sm font-medium text-right">{entry.totalScore}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="text-xs text-muted-foreground text-center">
              Leaderboard updates in real time as participants submit solutions.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChallengePlayground;
