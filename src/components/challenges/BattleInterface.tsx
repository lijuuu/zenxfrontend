
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Editor } from '@monaco-editor/react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import {
  Trophy,
  RefreshCw,
  Globe,
  Flag,
  Medal,
  Clock,
  Play,
  Code,
  SendHorizontal,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Users,
  User,
  AlertTriangle,
  MessageSquare,
  Bolt,
  Cpu,
  Zap,
} from 'lucide-react';

import {
  useWebSocket,
  useMockRoomStatus,
  useMockProblems,
  Problem,
  LeaderboardEntry
} from '@/hooks/useChallengeSystem';

interface UserData {
  id: string;
  name: string;
  avatar: string;
}

// Mock users
const mockUsers: { [id: string]: UserData } = {
  'user-1': { id: 'user-1', name: 'Alice Chen', avatar: 'https://i.pravatar.cc/150?img=1' },
  'user-2': { id: 'user-2', name: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
  'user-3': { id: 'user-3', name: 'Charlie Kim', avatar: 'https://i.pravatar.cc/150?img=3' },
  'user-4': { id: 'user-4', name: 'David Johnson', avatar: 'https://i.pravatar.cc/150?img=4' },
  'user-5': { id: 'user-5', name: 'Emma Davis', avatar: 'https://i.pravatar.cc/150?img=5' },
  'user-6': { id: 'user-6', name: 'Frank Zhang', avatar: 'https://i.pravatar.cc/150?img=6' },
};

const BattleInterface: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const authState = useSelector((state: any) => state.auth);
  const userId = authState?.userProfile?.userID || 'user-1'; // Default for mock
  
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');
  const [output, setOutput] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [consoleTab, setConsoleTab] = useState<'output' | 'tests' | 'chat'>('output');
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{
    userId: string;
    content: string;
    timestamp: Date;
  }>>([
    { userId: 'user-2', content: "Hey, has anyone solved the first problem yet?", timestamp: new Date(Date.now() - 5 * 60 * 1000) },
    { userId: 'user-3', content: "I'm working on it, this is actually pretty tricky!", timestamp: new Date(Date.now() - 3 * 60 * 1000) },
    { userId: 'user-1', content: "I think we need to use a hash map for optimal solution", timestamp: new Date(Date.now() - 1 * 60 * 1000) },
  ]);
  const [newMessage, setNewMessage] = useState('');
  
  // Get mock room data
  const { data: roomData, isLoading } = useMockRoomStatus(roomId || '');
  const problemsData = useMockProblems();
  const { connected: wsConnected, lastEvent } = useWebSocket(roomId || '');
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState('');
  const roomStartTime = roomData?.room?.startTime ? new Date(roomData.room.startTime) : null;
  const timeLimit = 60; // minutes, should come from challenge
  
  useEffect(() => {
    if (roomStartTime) {
      const endTime = new Date(roomStartTime.getTime() + timeLimit * 60 * 1000);
      
      const updateTimer = () => {
        const now = new Date();
        const diff = endTime.getTime() - now.getTime();
        
        if (diff <= 0) {
          setTimeRemaining('00:00');
          return;
        }
        
        const minutes = Math.floor(diff / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeRemaining(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      };
      
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      
      return () => clearInterval(interval);
    }
  }, [roomStartTime, timeLimit]);
  
  // Get current problem
  const currentProblemId = roomData?.problemIds?.[currentProblemIndex] || 'prob-1';
  const currentProblem = problemsData[currentProblemId];
  
  // Set initial code based on language
  useEffect(() => {
    if (language === 'javascript') {
      setCode(`function solution(nums, target) {
  // Write your solution here
  const map = {};
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map[complement] !== undefined) {
      return [map[complement], i];
    }
    map[nums[i]] = i;
  }
  
  return [];
}`);
    } else if (language === 'python') {
      setCode(`def solution(nums, target):
    # Write your solution here
    num_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    
    return []`);
    } else if (language === 'go') {
      setCode(`func solution(nums []int, target int) []int {
    // Write your solution here
    numMap := make(map[int]int)
    
    for i, num := range nums {
        complement := target - num
        if j, found := numMap[complement]; found {
            return []int{j, i}
        }
        numMap[num] = i
    }
    
    return []int{}
}`);
    }
  }, [language]);
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-600';
      case 'medium':
        return 'bg-amber-600';
      case 'hard':
        return 'bg-red-600';
      default:
        return 'bg-zinc-600';
    }
  };
  
  const handleRunCode = () => {
    setIsExecuting(true);
    setOutput([]);
    setConsoleTab('output');
    
    // Simulate code execution
    setTimeout(() => {
      setOutput([
        '> Running solution with test cases...',
        '> Test case 1: nums = [2,7,11,15], target = 9',
        '> Your output: [0,1]',
        '> Expected: [0,1]',
        '> ✓ Test case 1 PASSED',
        '> Test case 2: nums = [3,2,4], target = 6',
        '> Your output: [1,2]',
        '> Expected: [1,2]',
        '> ✓ Test case 2 PASSED',
        '> All test cases PASSED!',
        '> Execution time: 5ms'
      ]);
      setIsExecuting(false);
      
      toast.success('Tests passed!', {
        description: 'Your solution passed all test cases.'
      });
    }, 1500);
  };
  
  const handleSubmitSolution = () => {
    setIsExecuting(true);
    setOutput([]);
    setConsoleTab('output');
    
    // Simulate code submission
    setTimeout(() => {
      setOutput([
        '> Submitting solution...',
        '> Running against all test cases...',
        '> Test case 1: PASSED',
        '> Test case 2: PASSED',
        '> Test case 3: PASSED (hidden)',
        '> Test case 4: PASSED (hidden)',
        '> All test cases PASSED!',
        '> Execution time: 7ms',
        '> Memory used: 3.4 MB',
        '> Solution accepted!'
      ]);
      setIsExecuting(false);
      
      // Simulate updating the leaderboard
      toast.success('Solution accepted!', {
        description: 'Your solution was accepted and your score has been updated.'
      });
    }, 2000);
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      userId: userId,
      content: newMessage,
      timestamp: new Date()
    };
    
    setChatMessages([...chatMessages, message]);
    setNewMessage('');
  };
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center">
          <RefreshCw className="animate-spin h-10 w-10 text-green-500 mb-4" />
          <p className="text-zinc-400">Loading challenge room...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen flex flex-col bg-zinc-950 overflow-hidden">
      {/* Top bar with challenge info and actions */}
      <div className="border-b border-zinc-800 flex justify-between p-3 bg-zinc-900/80 backdrop-blur sticky top-0 z-30">
        <div className="flex items-center gap-2 overflow-hidden">
          <Trophy className="text-amber-500 h-5 w-5 flex-shrink-0" />
          <div className="truncate">
            <span className="font-medium text-lg truncate">Coding Battle: {roomData?.room?.challengeId}</span>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>Room: {roomId}</span>
              <span>•</span>
              <span className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {roomData?.room?.participantIds.length} Participants
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 border border-red-800/50 bg-red-900/20 rounded-md">
            <Clock className="h-4 w-4 text-red-500" />
            <span className="font-medium text-red-400">{timeRemaining}</span>
          </div>
          
          <Button 
            variant="destructive" 
            size="sm"
            className="bg-red-900/30 hover:bg-red-800 border border-red-800/50 text-red-400"
            onClick={() => setExitConfirmOpen(true)}
          >
            Exit Challenge
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left sidebar - Problems */}
        <div className="w-full md:w-[250px] md:min-w-[250px] border-r border-zinc-800 flex flex-col bg-zinc-900/40">
          <div className="p-3 border-b border-zinc-800">
            <h3 className="font-medium flex items-center gap-1.5">
              <Code className="h-4 w-4 text-green-500" />
              Challenge Problems
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {Object.values(problemsData).map((problem, index) => (
              <button
                key={problem.id}
                className={`flex flex-col p-3 border-b border-zinc-800/50 text-left hover:bg-zinc-800/50 transition-colors w-full
                  ${currentProblemIndex === index ? 'bg-zinc-800/70' : ''}`}
                onClick={() => setCurrentProblemIndex(index)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{problem.title}</span>
                  {index === 0 && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <Badge className={`${getDifficultyColor(problem.difficulty)} text-white`}>
                    {problem.difficulty}
                  </Badge>
                  <span className="text-xs text-zinc-500">#{index + 1}</span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="p-3 border-t border-zinc-800 bg-zinc-900/60">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Your Progress</h4>
                <span className="text-xs text-zinc-400">1/3 completed</span>
              </div>
              <Progress value={33} className="h-2" />
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ResizablePanelGroup direction="vertical">
            {/* Problem description */}
            <ResizablePanel defaultSize={30} minSize={20}>
              <div className="overflow-y-auto h-full p-4 bg-zinc-900/30 border-b border-zinc-800">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-green-500">
                      {currentProblem.title}
                    </h2>
                    <Badge className={`${getDifficultyColor(currentProblem.difficulty)} text-white`}>
                      {currentProblem.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="prose prose-invert prose-sm max-w-none">
                    {/* FIX: Remove className from ReactMarkdown */}
                    <ReactMarkdown>
                      {currentProblem.description}
                    </ReactMarkdown>
                    
                    <h3 className="text-lg font-semibold mt-4 mb-2">Examples</h3>
                    {currentProblem.examples.map((example, i) => (
                      <div key={i} className="mb-4 bg-zinc-800/50 p-3 rounded-md border border-zinc-700/50">
                        <div className="mb-1">
                          <span className="text-zinc-400 text-sm">Input:</span>
                          <pre className="bg-zinc-900/70 p-2 rounded mt-1 text-green-500 text-sm overflow-x-auto">
                            {example.input}
                          </pre>
                        </div>
                        <div className="mb-1">
                          <span className="text-zinc-400 text-sm">Output:</span>
                          <pre className="bg-zinc-900/70 p-2 rounded mt-1 text-green-500 text-sm overflow-x-auto">
                            {example.output}
                          </pre>
                        </div>
                        {example.explanation && (
                          <div>
                            <span className="text-zinc-400 text-sm">Explanation:</span>
                            <p className="text-zinc-300 text-sm mt-1">{example.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <h3 className="text-lg font-semibold mt-4 mb-2">Constraints</h3>
                    <ul className="list-disc list-inside space-y-1 text-zinc-300">
                      {currentProblem.constraints.map((constraint, i) => (
                        <li key={i}>{constraint}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </ResizablePanel>
            
            <ResizableHandle className="h-1 bg-zinc-800" />
            
            {/* Code editor */}
            <ResizablePanel defaultSize={45} minSize={30}>
              <div className="flex flex-col h-full">
                <div className="border-b border-zinc-800 bg-zinc-900/60 p-2 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <select
                      value={language}
                      onChange={e => setLanguage(e.target.value)}
                      className="text-xs rounded-md bg-zinc-800 border-zinc-700 text-zinc-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500/30"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="go">Go</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-zinc-700 text-zinc-300"
                      onClick={handleRunCode}
                      disabled={isExecuting}
                    >
                      <Play className="h-3.5 w-3.5 mr-1.5" />
                      Run Code
                    </Button>
                    
                    <Button
                      size="sm"
                      className="bg-green-700 hover:bg-green-600 text-white"
                      onClick={handleSubmitSolution}
                      disabled={isExecuting}
                    >
                      <SendHorizontal className="h-3.5 w-3.5 mr-1.5" />
                      Submit
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <Editor
                    value={code}
                    onChange={value => setCode(value || '')}
                    language={language}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      lineHeight: 22,
                      fontFamily: 'JetBrains Mono, monospace, Consolas, "Courier New"',
                      tabSize: 2,
                      wordWrap: 'on',
                      cursorBlinking: 'smooth',
                      cursorSmoothCaretAnimation: 'on',
                      smoothScrolling: true,
                      padding: { top: 12, bottom: 12 },
                    }}
                  />
                </div>
              </div>
            </ResizablePanel>
            
            <ResizableHandle className="h-1 bg-zinc-800" />
            
            {/* Console/output */}
            <ResizablePanel defaultSize={25} minSize={15}>
              <div className="h-full overflow-hidden flex flex-col bg-zinc-900/40 border-t border-zinc-800">
                <div className="border-b border-zinc-800 bg-zinc-900/60 p-2 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TabsList className="bg-zinc-800 border border-zinc-700">
                      <TabsTrigger 
                        value="output" 
                        onClick={() => setConsoleTab('output')}
                        className={consoleTab === 'output' ? 'bg-green-700 text-white data-[state=active]:bg-green-700' : ''}
                      >
                        Output
                      </TabsTrigger>
                      <TabsTrigger 
                        value="tests" 
                        onClick={() => setConsoleTab('tests')}
                        className={consoleTab === 'tests' ? 'bg-green-700 text-white data-[state=active]:bg-green-700' : ''}
                      >
                        Test Cases
                      </TabsTrigger>
                      <TabsTrigger 
                        value="chat" 
                        onClick={() => setConsoleTab('chat')}
                        className={consoleTab === 'chat' ? 'bg-green-700 text-white data-[state=active]:bg-green-700' : ''}
                      >
                        Chat
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <div>
                    {isExecuting && (
                      <div className="flex items-center text-zinc-400 text-xs">
                        <RefreshCw className="animate-spin h-3 w-3 mr-1.5" />
                        Running...
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 font-mono text-sm">
                  {consoleTab === 'output' && (
                    <div>
                      {output.length > 0 ? (
                        <div className="space-y-1">
                          {output.map((line, i) => (
                            <div key={i} className="whitespace-pre-wrap break-all">
                              {line.includes('PASSED') ? (
                                <span className="text-green-500">{line}</span>
                              ) : line.includes('FAILED') ? (
                                <span className="text-red-500">{line}</span>
                              ) : (
                                <span className="text-zinc-300">{line}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-zinc-500 italic">Run your code to see output here...</div>
                      )}
                    </div>
                  )}
                  
                  {consoleTab === 'tests' && (
                    <div className="space-y-3">
                      <h4 className="text-white font-medium">Test Cases</h4>
                      {currentProblem.examples.map((example, i) => (
                        <div key={i} className="p-2.5 rounded-md bg-zinc-800/70 border border-zinc-700/50">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-zinc-300 font-medium">Test Case {i + 1}</span>
                            {i === 0 && <CheckCircle className="h-4 w-4 text-green-500" />}
                          </div>
                          <div className="ml-4 space-y-2 text-xs">
                            <div className="flex flex-col">
                              <span className="text-zinc-500 mb-1">Input:</span>
                              <pre className="text-green-500 font-mono bg-zinc-900/60 p-2 rounded overflow-x-auto">
                                {example.input}
                              </pre>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-zinc-500 mb-1">Expected:</span>
                              <pre className="text-green-500 font-mono bg-zinc-900/60 p-2 rounded overflow-x-auto">
                                {example.output}
                              </pre>
                            </div>
                            {i === 0 && (
                              <div className="flex flex-col">
                                <span className="text-zinc-500 mb-1">Your output:</span>
                                <pre className="text-green-500 font-mono bg-zinc-900/60 p-2 rounded overflow-x-auto">
                                  [0,1]
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {consoleTab === 'chat' && (
                    <div className="h-full flex flex-col">
                      <div className="flex-1 space-y-3">
                        {chatMessages.map((message, i) => {
                          const user = mockUsers[message.userId];
                          const isCurrentUser = message.userId === userId;
                          
                          return (
                            <div key={i} className={`flex gap-2 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarImage src={user?.avatar} />
                                <AvatarFallback>
                                  {user?.name.substr(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className={`max-w-[75%] ${isCurrentUser ? 'bg-green-900/30 border-green-800/50' : 'bg-zinc-800/70 border-zinc-700/50'} rounded-lg p-3 border`}>
                                <div className="flex items-center gap-1 mb-1">
                                  <span className={`text-xs font-medium ${isCurrentUser ? 'text-green-400' : 'text-zinc-400'}`}>
                                    {isCurrentUser ? 'You' : user?.name}
                                  </span>
                                </div>
                                <p className="text-sm text-zinc-300">{message.content}</p>
                                <span className="text-xs text-zinc-500 mt-1 block">
                                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="mt-3 flex items-center gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 bg-zinc-800 border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500/30"
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button 
                          size="sm" 
                          className="bg-green-700 hover:bg-green-600"
                          onClick={handleSendMessage}
                        >
                          <SendHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        
        {/* Right sidebar - Leaderboard */}
        <div className="w-full md:w-[250px] md:min-w-[250px] border-l border-zinc-800 flex flex-col bg-zinc-900/40 overflow-hidden">
          <div className="p-3 border-b border-zinc-800">
            <h3 className="font-medium flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-amber-500" />
              Live Leaderboard
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-2">
              {roomData?.leaderboard?.map((entry: LeaderboardEntry, index: number) => {
                const user = mockUsers[entry.userId];
                const isCurrentUser = entry.userId === userId;
                
                return (
                  <div 
                    key={entry.userId} 
                    className={`flex items-center gap-2 p-2 rounded-md border ${isCurrentUser ? 'bg-green-900/20 border-green-800/50' : 'bg-zinc-800/40 border-zinc-700/50'} ${index === 0 ? 'bg-amber-900/20 border-amber-800/50' : ''}`}
                  >
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium
                      ${index === 0 ? 'bg-amber-500 text-white' : index === 1 ? 'bg-zinc-400 text-white' : index === 2 ? 'bg-amber-800 text-white' : 'bg-zinc-700 text-zinc-300'}`}>
                      {entry.rank}
                    </div>
                    
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>{user?.name.substr(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-medium truncate ${isCurrentUser ? 'text-green-400' : 'text-zinc-300'}`}>
                          {isCurrentUser ? 'You' : user?.name}
                        </span>
                        <span className="text-xs font-medium text-amber-400">{entry.totalScore}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 mt-1">
                        <Progress value={(entry.problemsCompleted / 3) * 100} className="h-1 flex-1" />
                        <span className="text-xs text-zinc-500">{entry.problemsCompleted}/3</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="p-3 border-t border-zinc-800 bg-zinc-900/60">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Bolt className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">Battle Stats</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-zinc-800/50 rounded-md p-2 border border-zinc-700/50">
                  <div className="text-xs text-zinc-500">Problems</div>
                  <div className="text-lg font-bold text-white">1/3</div>
                </div>
                <div className="bg-zinc-800/50 rounded-md p-2 border border-zinc-700/50">
                  <div className="text-xs text-zinc-500">Score</div>
                  <div className="text-lg font-bold text-amber-400">450</div>
                </div>
                <div className="bg-zinc-800/50 rounded-md p-2 border border-zinc-700/50">
                  <div className="text-xs text-zinc-500">Time</div>
                  <div className="text-lg font-bold text-green-400">12:35</div>
                </div>
                <div className="bg-zinc-800/50 rounded-md p-2 border border-zinc-700/50">
                  <div className="text-xs text-zinc-500">Rank</div>
                  <div className="text-lg font-bold text-white">#2</div>
                </div>
              </div>
              
              <div className="bg-zinc-800/50 rounded-md p-2 border border-zinc-700/50">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-zinc-500">Connection Status</span>
                  {wsConnected ? (
                    <Badge className="bg-green-900/30 text-green-400 border-green-800/50 text-xs">Connected</Badge>
                  ) : (
                    <Badge className="bg-amber-900/30 text-amber-400 border-amber-800/50 text-xs">Reconnecting...</Badge>
                  )}
                </div>
                <div className="text-xs text-zinc-500">
                  {wsConnected ? 'Real-time updates active' : 'Attempting to reconnect...'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Exit confirmation modal */}
      {exitConfirmOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-900/30 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Exit Challenge?</h3>
                  <p className="text-zinc-400 mt-1">
                    Are you sure you want to exit this challenge? Your progress will be saved, but you'll forfeit your position in the challenge.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setExitConfirmOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => navigate('/')}
                >
                  Exit Challenge
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleInterface;
