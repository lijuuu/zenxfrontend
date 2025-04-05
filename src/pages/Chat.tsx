// Fix username references in Chat.tsx
// Import and modify code to use userName instead of username
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { User } from '@/api/types';

interface Message {
  content: string;
  user: User;
  timestamp: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:7000', {
      transports: ['websocket'],
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    newSocket.on('chat message', (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      newSocket.off('chat message');
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages update
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (socket && newMessage) {
      socket.emit('chat message', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-900 text-white">
      <div className="p-4 border-b border-zinc-800">
        <h1 className="text-xl font-semibold">Chat</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div key={index} className="mb-2">
            <div className="font-medium text-white">{message.user.userName}</div>
            <div className="text-sm text-zinc-400">{message.content}</div>
            <div className="text-xs text-zinc-500">{message.timestamp}</div>
          </div>
        ))}
        <div ref={chatBottomRef} />
      </div>
      <div className="p-4 border-t border-zinc-800 flex">
        <input
          type="text"
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-l-md py-2 px-3 text-white focus:outline-none focus:border-blue-500"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-r-md focus:outline-none"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
