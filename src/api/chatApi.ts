
import { mockChannels, mockMessages } from './mockData';
import { ChatChannel, ChatMessage } from './types';

// API functions
export const getChannels = async (): Promise<ChatChannel[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(mockChannels), 500);
  });
};

export const getMessages = async (channelId: string, options?: { limit?: number; before?: string }): Promise<ChatMessage[]> => {
  return new Promise(resolve => {
    let messages = mockMessages[channelId] || [];
    
    if (options?.before) {
      const beforeIndex = messages.findIndex(m => m.id === options.before);
      if (beforeIndex !== -1) {
        messages = messages.slice(0, beforeIndex);
      }
    }
    
    if (options?.limit && messages.length > options.limit) {
      messages = messages.slice(messages.length - options.limit);
    }
    
    setTimeout(() => resolve(messages), 600);
  });
};

export const sendMessage = async (channelId: string, content: string, attachments?: any[]): Promise<ChatMessage> => {
  return new Promise(resolve => {
    const newMessage: ChatMessage = {
      id: `m${Date.now()}`,
      channelId,
      sender: {
        id: "1",
        username: "Me",
        profileImage: "https://i.pravatar.cc/300?img=1"
      },
      content,
      timestamp: new Date().toISOString(),
      isCurrentUser: true,
      attachments
    };
    
    setTimeout(() => resolve(newMessage), 300);
  });
};

export const sendChallengeInvite = async (channelId: string, challenge: { id: string; title: string; isPrivate: boolean; accessCode?: string }): Promise<ChatMessage> => {
  return new Promise(resolve => {
    const newMessage: ChatMessage = {
      id: `m${Date.now()}`,
      channelId,
      sender: {
        id: "1",
        username: "Me",
        profileImage: "https://i.pravatar.cc/300?img=1"
      },
      content: challenge.isPrivate 
        ? `Join my private challenge: ${challenge.title}` 
        : `Join my challenge: ${challenge.title}`,
      timestamp: new Date().toISOString(),
      isCurrentUser: true,
      attachments: [
        {
          type: "challenge-invite",
          content: challenge.title,
          challengeId: challenge.id,
          challengeTitle: challenge.title,
          isPrivate: challenge.isPrivate,
          accessCode: challenge.accessCode
        }
      ]
    };
    
    setTimeout(() => resolve(newMessage), 300);
  });
};

export const createDirectChannel = async (userId: string): Promise<ChatChannel> => {
  return new Promise((resolve, reject) => {
    // In a real app, this would create or retrieve an existing DM channel
    setTimeout(() => resolve({
      id: `dm-${userId}`,
      name: "Direct Message",
      type: "direct",
      participants: [
        {
          id: "1",
          username: "johndoe",
          fullName: "John Doe",
          email: "john.doe@example.com",
          profileImage: "https://i.pravatar.cc/300?img=1",
          joinedDate: "2022-01-15",
          problemsSolved: 147,
          dayStreak: 26,
          ranking: 354,
          isBanned: false,
          isVerified: true
        },
        {
          id: userId,
          username: userId === "4" ? "Alice" : "Bob",
          fullName: userId === "4" ? "Alice Johnson" : "Bob Smith",
          email: userId === "4" ? "alice@example.com" : "bob@example.com",
          profileImage: `https://i.pravatar.cc/300?img=${userId === "4" ? "5" : "8"}`,
          joinedDate: "2022-02-20",
          problemsSolved: 120,
          dayStreak: 15,
          ranking: 450,
          isBanned: false,
          isVerified: true
        }
      ]
    }), 700);
  });
};

export const getDirectChannels = async (): Promise<ChatChannel[]> => {
  return new Promise(resolve => {
    const directChannels = mockChannels.filter(channel => channel.type === "direct");
    setTimeout(() => resolve(directChannels), 500);
  });
};
