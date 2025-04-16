
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { RefreshCw } from 'lucide-react';
import { useWebSocket, useProblems } from '@/hooks';

// Import components
import {
  ProblemList,
  ProblemDescription,
  CodeEditorPanel,
  ConsoleOutput,
  LeaderboardPanel,
  BattleHeader
} from './components';

// Import types and utilities
import { ChatMessage } from './types';
import { mockUsers, mockProblemsData, getCodeTemplate } from './utils/mockData';

// Import custom hooks
import { useMockRoomStatus } from './hooks/useMockRoomStatus';

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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { userId: 'user-2', content: "Hey, has anyone solved the first problem yet?", timestamp: new Date(Date.now() - 5 * 60 * 1000) },
    { userId: 'user-3', content: "I'm working on it, this is actually pretty tricky!", timestamp: new Date(Date.now() - 3 * 60 * 1000) },
    { userId: 'user-1', content: "I think we need to use a hash map for optimal solution", timestamp: new Date(Date.now() - 1 * 60 * 1000) },
  ]);
  const [newMessage, setNewMessage] = useState('');
  
  // Get mock room data
  const { data: roomData, isLoading } = useMockRoomStatus(roomId || '');
  const { connected: wsConnected, lastEvent } = useWebSocket(roomId || '');
  
  // Use real problems data with fallback to mock
  const { data: realProblems } = useProblems();
  
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
  const currentProblem = mockProblemsData[currentProblemId];
  
  // Set initial code based on language
  useEffect(() => {
    setCode(getCodeTemplate(language));
  }, [language]);
  
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
  
  const handleExitChallenge = () => {
    setExitConfirmOpen(true);
    navigate('/challenges');
  };
  
  // Create an array of problems from the problem IDs
  const problems = roomData?.problemIds?.map(id => mockProblemsData[id]) || [];
  
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
    <motion.div 
      className="h-screen flex flex-col bg-zinc-950 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Battle Header */}
      <BattleHeader 
        roomId={roomId}
        room={roomData?.room}
        timeRemaining={timeRemaining}
        onExitClick={handleExitChallenge}
      />
      
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Problem List Sidebar */}
        <ProblemList 
          problems={problems}
          currentProblemIndex={currentProblemIndex}
          onProblemSelect={setCurrentProblemIndex}
          completedCount={1}
        />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ResizablePanelGroup direction="vertical">
            {/* Problem description */}
            <ResizablePanel defaultSize={30} minSize={20}>
              <ProblemDescription problem={currentProblem} />
            </ResizablePanel>
            
            <ResizableHandle className="h-1 bg-zinc-800" />
            
            {/* Code editor */}
            <ResizablePanel defaultSize={45} minSize={30}>
              <CodeEditorPanel 
                code={code}
                language={language}
                isExecuting={isExecuting}
                onCodeChange={setCode}
                onLanguageChange={setLanguage}
                onRunCode={handleRunCode}
                onSubmitSolution={handleSubmitSolution}
              />
            </ResizablePanel>
            
            <ResizableHandle className="h-1 bg-zinc-800" />
            
            {/* Console/output */}
            <ResizablePanel defaultSize={25} minSize={15}>
              <ConsoleOutput 
                output={output}
                isExecuting={isExecuting}
                activeTab={consoleTab}
                onTabChange={setConsoleTab}
                problem={currentProblem}
                chatMessages={chatMessages}
                currentUserId={userId}
                users={mockUsers}
                newMessage={newMessage}
                onNewMessageChange={setNewMessage}
                onSendMessage={handleSendMessage}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        
        {/* Leaderboard sidebar */}
        <LeaderboardPanel 
          leaderboard={roomData?.leaderboard || []}
          users={mockUsers}
          currentUserId={userId}
        />
      </div>
    </motion.div>
  );
};

export default BattleInterface;
