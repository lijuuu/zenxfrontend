
import React from 'react';
import { RefreshCw, CheckCircle, SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Problem, ChatMessage, UserData } from '../types';

interface ConsoleOutputProps {
  output: string[];
  isExecuting: boolean;
  activeTab: 'output' | 'tests' | 'chat';
  onTabChange: (tab: 'output' | 'tests' | 'chat') => void;
  problem: Problem;
  chatMessages: ChatMessage[];
  currentUserId: string;
  users: { [id: string]: UserData };
  newMessage: string;
  onNewMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  output,
  isExecuting,
  activeTab,
  onTabChange,
  problem,
  chatMessages,
  currentUserId,
  users,
  newMessage,
  onNewMessageChange,
  onSendMessage
}) => {
  return (
    <div className="h-full overflow-hidden flex flex-col bg-zinc-900/40 border-t border-zinc-800">
      <div className="border-b border-zinc-800 bg-zinc-900/60 p-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TabsList className="bg-zinc-800 border border-zinc-700">
            <TabsTrigger 
              value="output" 
              onClick={() => onTabChange('output')}
              className={activeTab === 'output' ? 'bg-green-700 text-white data-[state=active]:bg-green-700' : ''}
            >
              Output
            </TabsTrigger>
            <TabsTrigger 
              value="tests" 
              onClick={() => onTabChange('tests')}
              className={activeTab === 'tests' ? 'bg-green-700 text-white data-[state=active]:bg-green-700' : ''}
            >
              Test Cases
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              onClick={() => onTabChange('chat')}
              className={activeTab === 'chat' ? 'bg-green-700 text-white data-[state=active]:bg-green-700' : ''}
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
        {activeTab === 'output' && (
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
        
        {activeTab === 'tests' && (
          <div className="space-y-3">
            <h4 className="text-white font-medium">Test Cases</h4>
            {problem.examples.map((example, i) => (
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
        
        {activeTab === 'chat' && (
          <div className="h-full flex flex-col">
            <div className="flex-1 space-y-3">
              {chatMessages.map((message, i) => {
                const user = users[message.userId];
                const isCurrentUser = message.userId === currentUserId;
                
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
                onChange={(e) => onNewMessageChange(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-zinc-800 border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500/30"
                onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
              />
              <Button 
                size="sm" 
                className="bg-green-700 hover:bg-green-600"
                onClick={onSendMessage}
              >
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsoleOutput;
