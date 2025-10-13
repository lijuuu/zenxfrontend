import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Send, Bot, User, Loader2, Trash2, Code, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { chatStorage, ChatMessage, ChatConversation } from '@/services/chatStorage';
import { geminiService, ChatResponse } from '@/services/geminiService';
import { ProblemMetadata, ExecutionResult } from '@/api/types';
import { useGetUserProfile } from '@/services/useGetUserProfile';

interface AIChatInterfaceProps {
  problem: ProblemMetadata;
  code?: string;
  language?: string;
  output?: string[];
  executionResult?: ExecutionResult | null;
  setCode?: (code: string) => void;
}

export interface AIChatInterfaceRef {
  scrollToLatest: () => void;
}

export const AIChatInterface = forwardRef<AIChatInterfaceRef, AIChatInterfaceProps>(({
  problem,
  code = '',
  language = 'javascript',
  output = [],
  executionResult,
  setCode
}, ref) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [pendingCodeUpdate, setPendingCodeUpdate] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: userProfile } = useGetUserProfile();

  //expose scroll function to parent component
  useImperativeHandle(ref, () => ({
    scrollToLatest: () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }));

  //init chat storage and load conversation
  useEffect(() => {
    const initChat = async () => {
      try {
        await chatStorage.init();
        const existingConversation = await chatStorage.getConversation(problem.problemId);

        if (existingConversation) {
          setConversation(existingConversation);
          setMessages(existingConversation.messages);
        } else {
          //create new conversation
          const newConversation: ChatConversation = {
            id: `conv_${problem.problemId}_${Date.now()}`,
            problemId: problem.problemId,
            title: `Chat for ${problem.title}`,
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          await chatStorage.saveConversation(newConversation);
          setConversation(newConversation);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initChat();
  }, [problem.problemId, problem.title]);

  //auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !conversation || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: Date.now(),
      problemId: problem.problemId,
    };

    setMessages(prev => [...prev, userMessage]);
    await chatStorage.addMessage(conversation.id, userMessage);
    setInputMessage('');
    setIsLoading(true);

    try {
      //build conversation history from recent messages last 10 messages
      const recentMessages = messages.slice(-10);
      const conversationHistory = recentMessages.map(msg =>
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      );

      const context = {
        code,
        language,
        output,
        conversationHistory,
        executionResult,
      };

      const response = await geminiService.chatWithAI(userMessage.content, context);

      const aiMessage: ChatMessage = {
        id: `msg_${Date.now()}_ai`,
        role: 'assistant',
        content: response.message,
        timestamp: Date.now(),
        problemId: problem.problemId,
        metadata: {
          language,
        },
      };

      setMessages(prev => [...prev, aiMessage]);
      await chatStorage.addMessage(conversation.id, aiMessage);

      //check if the ai response contains code that can be applied and if replacement is needed
      if (response.replacementCode && setCode && response.shouldReplaceCode) {
        setPendingCodeUpdate(response.replacementCode);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_error`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
        problemId: problem.problemId,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  const formatMessage = (content: string) => {
    //simple markdown like formatting for code blocks
    return content
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-zinc-800 p-3 rounded text-green-400 text-sm overflow-x-auto my-2"><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-zinc-800 text-green-400 px-1 rounded text-sm">$1</code>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-zinc-300">$1</em>');
  };

  const handleClearChat = async () => {
    if (!conversation) return;

    try {
      //delete all messages from storage
      await chatStorage.deleteConversation(conversation.id);

      //create new conversation
      const newConversation: ChatConversation = {
        id: `conv_${problem.problemId}_${Date.now()}`,
        problemId: problem.problemId,
        title: `Chat for ${problem.title}`,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await chatStorage.saveConversation(newConversation);
      setConversation(newConversation);
      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  const handleApplyCodeUpdate = () => {
    if (pendingCodeUpdate && setCode) {
      setCode(pendingCodeUpdate);
      setPendingCodeUpdate(null);
    }
  };

  const handleRejectCodeUpdate = () => {
    setPendingCodeUpdate(null);
  };


  return (
    <div className="h-full flex flex-col">
      {/*header*/}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
        </div>
        {messages.length > 0 && (
          <Button
            onClick={handleClearChat}
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-red-400 hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/*messages area*/}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Bot className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
            <h4 className="text-zinc-300 font-medium mb-2">Start a conversation</h4>
            <p className="text-zinc-500 text-sm">
              Ask me about your code, get help with errors, or request analysis.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user'
                ? 'bg-green-600 text-white'
                : 'bg-zinc-800 text-zinc-200'
                }`}
            >
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
              />
              {/* <div className="text-xs opacity-70 mt-2">
                {new Date(message.timestamp).toLocaleDateString()}
              </div> */}
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {userProfile?.avatarURL || userProfile?.profileImage ? (
                  <img
                    src={userProfile.avatarURL || userProfile.profileImage}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      //fallback to icon if image fails to load
                      e.currentTarget.style.display = 'none';
                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                      if (nextElement) {
                        nextElement.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <User className="h-4 w-4 text-white" style={{ display: userProfile?.avatarURL || userProfile?.profileImage ? 'none' : 'flex' }} />
              </div>
            )}
          </div>
        ))}

        {/* Code Update Prompt */}
        {pendingCodeUpdate && (
          <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center gap-3 mb-3">
              <Code className="h-5 w-5 text-blue-400" />
              <span className="text-sm font-medium text-white">AI Suggested Code Update</span>
            </div>
            <div className="bg-zinc-800 rounded-lg p-3 mb-3 max-h-32 overflow-y-auto">
              <pre className="text-green-400 text-sm whitespace-pre-wrap">
                <code>{pendingCodeUpdate}</code>
              </pre>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleApplyCodeUpdate}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="h-4 w-4 mr-1" />
                Apply Code
              </Button>
              <Button
                onClick={handleRejectCodeUpdate}
                size="sm"
                variant="outline"
                className="border-zinc-700 text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4 mr-1" />
                Dismiss
              </Button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-zinc-800 rounded-lg p-3 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-green-500" />
              <span className="text-zinc-400">AI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/*input area*/}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me about your code..."
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:border-green-500"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

    </div>
  );
});
