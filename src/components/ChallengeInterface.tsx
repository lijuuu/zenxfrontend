
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  Eye, 
  EyeOff, 
  Clock, 
  Award, 
  Send, 
  MessageSquare, 
  ArrowRight,
  UserCheck,
  Zap,
  Check,
  X,
  Lock,
  Share2,
  Users,
  User,
  Copy,
  BarChart3,
  UserX,
  LucideProps,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Code,
  Trophy,
  CheckCircle,
  FileOutput,
  ListChecks
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import { Challenge } from '@/api/types';
import { toast } from 'sonner';

interface ChallengeInterfaceProps {
  challenge?: Challenge;
  isPrivate?: boolean;
  accessCode?: string;
}

const ChallengeInterface: React.FC<ChallengeInterfaceProps> = ({ challenge, isPrivate = false, accessCode }) => {
  const { toast } = useToast();
  const [timeRemaining, setTimeRemaining] = useState('30:00');
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [myProgress, setMyProgress] = useState(0);
  const [showOpponentCode, setShowOpponentCode] = useState(false);
  const [exitWarningOpen, setExitWarningOpen] = useState(false);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  
  // Simulate time decreasing
  useEffect(() => {
    const interval = setInterval(() => {
      const [minutes, seconds] = timeRemaining.split(':').map(Number);
      let newMinutes = minutes;
      let newSeconds = seconds - 1;
      
      if (newSeconds < 0) {
        newMinutes -= 1;
        newSeconds = 59;
      }
      
      if (newMinutes < 0) {
        clearInterval(interval);
        toast({
          title: "Challenge completed",
          description: "Time's up! Your results are being calculated...",
        });
        return;
      }
      
      setTimeRemaining(`${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`);
    }, 1000);
    
    // Simulate opponent progress
    const progressInterval = setInterval(() => {
      setOpponentProgress(prev => {
        const increase = Math.random() * 5;
        const newValue = prev + increase;
        return newValue > 100 ? 100 : newValue;
      });
      
      setMyProgress(prev => {
        const increase = Math.random() * 3;
        const newValue = prev + increase;
        return newValue > 100 ? 100 : newValue;
      });
    }, 3000);
    
    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [toast, timeRemaining]);
  
  const copyAccessCode = () => {
    if (accessCode) {
      navigator.clipboard.writeText(accessCode);
      toast({
        title: "Copied!",
        description: "Access code copied to clipboard",
      });
    }
  };
  
  const handleForfeitChallenge = () => {
    setExitWarningOpen(true);
  };
  
  const confirmForfeit = () => {
    toast({
      title: "Challenge forfeited",
      description: "You have exited the challenge. This will not be counted in your stats.",
      variant: "destructive"
    });
    setExitWarningOpen(false);
    // In a real app, this would navigate away from the challenge
  };
  
  const cancelForfeit = () => {
    setExitWarningOpen(false);
  };
  
  // Mock problems in the challenge
  const problems = [
    { id: 'p1', title: 'Two Sum', difficulty: 'Easy', completed: true },
    { id: 'p2', title: 'Valid Parentheses', difficulty: 'Easy', completed: false },
    { id: 'p3', title: 'Merge Two Sorted Lists', difficulty: 'Medium', completed: false },
    { id: 'p4', title: 'LRU Cache', difficulty: 'Hard', completed: false },
  ];
  
  const currentProblem = problems[currentProblemIndex];
  
  // Mock participants
  const participants = [
    { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1', progress: 75, completed: 2, status: 'active' },
    { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2', progress: 50, completed: 1, status: 'active' },
    { id: '3', name: 'Bob Johnson', avatar: 'https://i.pravatar.cc/150?img=3', progress: 25, completed: 0, status: 'active' },
    { id: '4', name: 'Alice Brown', avatar: 'https://i.pravatar.cc/150?img=4', progress: 0, completed: 0, status: 'exited' },
  ];
  
  // Mock leaderboard
  const leaderboard = participants.sort((a, b) => b.progress - a.progress);
  
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Easy</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Medium</Badge>;
      case 'hard':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Hard</Badge>;
      default:
        return <Badge variant="outline">{difficulty}</Badge>;
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Top bar with challenge info and actions */}
      <div className="border-b border-border flex justify-between p-3 bg-background sticky top-0 z-30">
        <div className="flex items-center gap-2">
          {isPrivate ? (
            <>
              <Lock className="text-amber-500 h-5 w-5" />
              <span className="font-medium text-lg">Private Challenge</span>
              {accessCode && (
                <Badge variant="outline" className="ml-2 border-amber-300 dark:border-amber-700">
                  Code: {accessCode}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 ml-1 -mr-1 p-0.5"
                    onClick={copyAccessCode}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </Badge>
              )}
            </>
          ) : (
            <>
              <Trophy className="text-blue-500 h-5 w-5" />
              <span className="font-medium text-lg">Coding Challenge</span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 border border-red-200 dark:border-red-800/50 bg-red-100/50 dark:bg-red-900/20 rounded-md">
            <Clock className="h-4 w-4 text-red-500" />
            <span className="font-medium text-red-700 dark:text-red-400">{timeRemaining}</span>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-600 border-red-200 dark:border-red-800/50 hover:bg-red-100/50 dark:hover:bg-red-900/20"
                  onClick={handleForfeitChallenge}
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Forfeit
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exit the challenge without completing</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left side - Problems list and editor */}
        <div className="lg:w-[250px] border-r border-border flex flex-col">
          <div className="p-3 border-b border-border bg-muted/30">
            <h3 className="font-medium flex items-center gap-1.5">
              <ListChecks className="h-4 w-4 text-accent-color" />
              Challenge Problems
            </h3>
          </div>
          
          <div className="flex flex-col overflow-y-auto">
            {problems.map((problem, index) => (
              <button
                key={problem.id}
                className={cn(
                  "flex flex-col p-3 border-b border-border/50 text-left hover:bg-accent/5 transition-colors",
                  index === currentProblemIndex && "bg-accent/10"
                )}
                onClick={() => setCurrentProblemIndex(index)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{problem.title}</span>
                  {problem.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>
                <div className="flex items-center justify-between mt-1">
                  {getDifficultyBadge(problem.difficulty)}
                  <span className="text-xs text-muted-foreground">#{index + 1}</span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-auto p-3 border-t border-border">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Problems Completed</h4>
              <Progress value={25} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1/4 completed</span>
                <span>25%</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Middle - Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
            <div>
              <h3 className="font-medium">{currentProblem.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Problem #{currentProblemIndex + 1}</span>
                <span>•</span>
                <span>{getDifficultyBadge(currentProblem.difficulty)}</span>
              </div>
            </div>
            
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Problem
            </Button>
          </div>
          
          <div className="flex-1 bg-muted/10 p-4 font-mono text-sm overflow-auto">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">// Write your solution here</span>
              <span className="text-muted-foreground">JavaScript</span>
            </div>
            <div className="text-foreground">
              function twoSum(nums, target) {'{'}
                <br />
              &nbsp;&nbsp;// Your code here<br />
              &nbsp;&nbsp;const map = {'{'}{'}'};
                <br />
              &nbsp;&nbsp;for (let i = 0; i &lt; nums.length; i++) {'{'}
                <br />
              &nbsp;&nbsp;&nbsp;&nbsp;const complement = target - nums[i];<br />
              &nbsp;&nbsp;&nbsp;&nbsp;if (map[complement] !== undefined) {'{'}
                <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return [map[complement], i];<br />
              &nbsp;&nbsp;&nbsp;&nbsp;{'}'}
                <br />
              &nbsp;&nbsp;&nbsp;&nbsp;map[nums[i]] = i;<br />
              &nbsp;&nbsp;{'}'}
                <br />
              {'}'}
            </div>
          </div>
          
          <div className="bg-background p-3 border-t border-border flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="default" className="bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-2" />
                Run Code
              </Button>
              
              <Button variant="outline">
                <FileOutput className="h-4 w-4 mr-2" />
                Test Cases
              </Button>
            </div>
            
            <Button variant="default" className="accent-color">
              <Send className="h-4 w-4 mr-2" />
              Submit Solution
            </Button>
          </div>
        </div>
        
        {/* Right side - Challenge Progress and Leaderboard */}
        <div className="lg:w-[300px] border-l border-border flex flex-col">
          <Tabs defaultValue="progress" className="flex-1 flex flex-col">
            <TabsList className="mx-3 mt-3 mb-0">
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>
            
            <TabsContent value="progress" className="flex-1 overflow-auto p-3 m-0">
              {isPrivate && (
                <Card className="shadow-none bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50 mb-4">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Lock className="h-4 w-4 text-amber-500" />
                      Private Challenge
                    </CardTitle>
                  </CardHeader>
                  {accessCode && (
                    <CardContent className="py-0 px-4 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-amber-100 dark:bg-amber-900/50 p-2 rounded border border-amber-200 dark:border-amber-800/50 font-mono text-center">
                          {accessCode}
                        </div>
                        <Button 
                          size="icon" 
                          variant="outline"
                          className="h-9 w-9 border-amber-200 dark:border-amber-800/50"
                          onClick={copyAccessCode}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              )}
              
              <Card className="shadow-none mb-4">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-accent-color" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-0 px-4 pb-3">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Overall</span>
                        <span className="text-sm font-medium">{Math.round(myProgress)}%</span>
                      </div>
                      <Progress value={myProgress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {problems.map((problem, index) => (
                        <div key={problem.id} className="border border-border/50 rounded-md p-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Problem #{index + 1}</span>
                            {problem.completed ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <Clock className="h-3 w-3 text-amber-500" />
                            )}
                          </div>
                          <div className="text-sm font-medium truncate mt-1">{problem.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-none mb-4">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    Participants
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-0 px-4 pb-3">
                  <div className="space-y-3">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={participant.avatar} alt={participant.name} />
                          <AvatarFallback>
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm truncate">{participant.name}</span>
                            {participant.status === 'exited' && (
                              <Badge variant="outline" className="text-muted-foreground text-xs">Exited</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Progress value={participant.progress} className="h-1.5 flex-1" />
                            <span className="text-xs">{participant.progress}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-none">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Code className="h-4 w-4 text-purple-500" />
                    Opponent's Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-0 px-4 pb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">View opponent's solutions</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowOpponentCode(!showOpponentCode)}
                    >
                      {showOpponentCode ? (
                        <>
                          <EyeOff className="h-3 w-3 mr-1.5" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3 mr-1.5" />
                          Show
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {showOpponentCode ? (
                    <pre className="text-xs bg-muted p-3 rounded overflow-x-auto mt-2">
                      <code>
                        function twoSum(nums, target) {'{'}<br />
                        &nbsp;&nbsp;for (let i = 0; i &lt; nums.length; i++) {'{'}<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;for (let j = i + 1; j &lt; nums.length; j++) {'{'}<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (nums[i] + nums[j] === target) {'{'}<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return [i, j];<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br />
                        &nbsp;&nbsp;{'}'}<br />
                        &nbsp;&nbsp;return [];<br />
                        {'}'}
                      </code>
                    </pre>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <EyeOff className="h-8 w-8 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">Code is hidden</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="leaderboard" className="flex-1 overflow-auto p-3 m-0">
              <Card className="shadow-none">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    Live Leaderboard
                  </CardTitle>
                  <CardDescription>
                    Real-time rankings of participants
                  </CardDescription>
                </CardHeader>
                <CardContent className="py-0 px-4 pb-3">
                  <div className="space-y-3">
                    {leaderboard.map((participant, index) => (
                      <div 
                        key={participant.id} 
                        className={cn(
                          "flex items-center gap-3 p-2 rounded-md",
                          index === 0 && "bg-amber-100/50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50"
                        )}
                      >
                        <div className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium",
                          index === 0 && "bg-amber-500 text-white",
                          index === 1 && "bg-zinc-400 text-white",
                          index === 2 && "bg-amber-800 text-white",
                          index > 2 && "bg-muted text-muted-foreground"
                        )}>
                          {index + 1}
                        </div>
                        
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={participant.avatar} alt={participant.name} />
                          <AvatarFallback>
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm truncate">{participant.name}</span>
                            <span className="text-sm font-medium">{participant.progress}%</span>
                          </div>
                          <div className="flex items-center justify-between mt-0.5">
                            <span className="text-xs text-muted-foreground">
                              {participant.completed} completed
                            </span>
                            <Progress value={participant.progress} className="w-24 h-1.5" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-none mt-4">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Problems Solved
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-0 px-4 pb-3">
                  <div className="space-y-3">
                    {problems.map((problem, index) => (
                      <div key={problem.id} className="border border-border/50 rounded-md p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{problem.title}</span>
                          {getDifficultyBadge(problem.difficulty)}
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-muted-foreground">
                            Solved by {index === 0 ? '2/4' : '0/4'} participants
                          </span>
                          <Progress value={index === 0 ? 50 : 0} className="w-24 h-1.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="chat" className="flex-1 flex flex-col m-0 p-0">
              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                    B
                  </div>
                  <div className="bg-muted rounded-lg p-3 max-w-[80%] text-sm">
                    <p>Hey, have you solved problems like this before?</p>
                    <span className="text-xs text-muted-foreground mt-1 block">10:30 AM</span>
                  </div>
                </div>
                
                <div className="flex gap-2 justify-end">
                  <div className="bg-accent-5 rounded-lg p-3 max-w-[80%] text-sm">
                    <p>Yeah, I think we need to use a hash map to optimize this!</p>
                    <span className="text-xs text-muted-foreground mt-1 block">10:32 AM</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-accent-color text-white flex items-center justify-center flex-shrink-0">
                    Y
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                    B
                  </div>
                  <div className="bg-muted rounded-lg p-3 max-w-[80%] text-sm">
                    <p>Good idea! I was thinking of a brute force approach but a hash map would be O(n) instead of O(n²).</p>
                    <span className="text-xs text-muted-foreground mt-1 block">10:33 AM</span>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="bg-muted/50 rounded-full px-3 py-1 text-xs text-muted-foreground">
                    System: Test case #1 passed by John Doe
                  </div>
                </div>
              </div>
              
              <div className="p-3 border-t border-border mt-auto">
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    className="flex-1 bg-muted border-none rounded-lg px-4 py-2 focus:ring-1 focus:ring-accent-color focus:outline-none text-sm"
                  />
                  <Button size="icon" className="accent-color h-9 w-9 rounded-lg">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Exit confirmation dialog */}
      {exitWarningOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg max-w-md w-full shadow-lg">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Forfeit Challenge?</h3>
                  <p className="text-muted-foreground">
                    Are you sure you want to exit this challenge? Your progress will not be saved and this will not count towards your stats.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={cancelForfeit}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={confirmForfeit}
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Forfeit Challenge
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeInterface;
