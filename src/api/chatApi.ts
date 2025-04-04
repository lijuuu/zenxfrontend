
import { ChatChannel, ChatMessage } from './types';

// Mock data for chat channels
const mockChannels: ChatChannel[] = [
  {
    id: "general",
    name: "General",
    description: "Community chat for all topics",
    type: "public",
    lastMessage: "Try using a hash map to store the elements you've seen",
    lastMessageTime: "2023-04-02T13:02:00Z"
  },
  {
    id: "easy-problems",
    name: "Easy Problems",
    description: "Discussion for easy difficulty problems",
    type: "public",
    lastMessage: "Two Sum is a classic problem to start with",
    lastMessageTime: "2023-04-01T22:30:00Z"
  },
  {
    id: "medium-problems",
    name: "Medium Problems",
    description: "Discussion for medium difficulty problems",
    type: "public",
    lastMessage: "Has anyone solved the LRU Cache problem?",
    lastMessageTime: "2023-04-02T16:45:00Z"
  },
  {
    id: "hard-problems",
    name: "Hard Problems",
    description: "Discussion for hard difficulty problems",
    type: "public",
    lastMessage: "The dynamic programming approach works better here",
    lastMessageTime: "2023-04-02T14:20:00Z"
  },
  {
    id: "contests",
    name: "Contests",
    description: "Discussions about contests and competitions",
    type: "public",
    lastMessage: "Weekly contest starting in 2 hours",
    lastMessageTime: "2023-04-02T08:10:00Z"
  },
  {
    id: "job-hunting",
    name: "Job Hunting",
    description: "Career advice and job opportunities",
    type: "public",
    lastMessage: "Google is hiring for SWE positions",
    lastMessageTime: "2023-04-01T19:15:00Z"
  },
  {
    id: "interviews",
    name: "Interviews",
    description: "Interview preparation and experiences",
    type: "public",
    lastMessage: "What's your approach to system design interviews?",
    lastMessageTime: "2023-04-02T11:30:00Z"
  },
  {
    id: "dm-4",
    name: "Sophie Williams",
    type: "direct",
    isOnline: true,
    lastMessage: "I'm creating a new challenge, want to join?",
    lastMessageTime: "2023-04-02T15:30:00Z"
  },
  {
    id: "dm-5",
    name: "Taylor Smith",
    type: "direct",
    isOnline: false,
    lastMessage: "Check out this private challenge I created",
    lastMessageTime: "2023-04-03T09:45:00Z"
  },
  {
    id: "dm-3",
    name: "Mike Chen",
    type: "direct",
    isOnline: true,
    lastMessage: "Let's practice for the upcoming contest",
    lastMessageTime: "2023-04-03T11:20:00Z"
  }
];

// Mock message data for different channels
const mockMessages: Record<string, ChatMessage[]> = {
  "general": [
    {
      id: "m1",
      channelId: "general",
      sender: {
        id: "4",
        username: "Alice",
        profileImage: "https://i.pravatar.cc/300?img=5"
      },
      content: "Hey, anyone working on the Two Sum problem?",
      timestamp: "2023-04-02T12:47:00Z"
    },
    {
      id: "m2",
      channelId: "general",
      sender: {
        id: "5",
        username: "Bob",
        profileImage: "https://i.pravatar.cc/300?img=8"
      },
      content: "Yeah, I solved it using a hash map. What approach are you using?",
      timestamp: "2023-04-02T12:52:00Z"
    },
    {
      id: "m3",
      channelId: "general",
      sender: {
        id: "1",
        username: "Me",
        profileImage: "https://i.pravatar.cc/300?img=1"
      },
      content: "I'm struggling with the time complexity. My brute force approach is O(n²) but I think there's a more efficient way.",
      timestamp: "2023-04-02T12:57:00Z",
      isCurrentUser: true
    },
    {
      id: "m4",
      channelId: "general",
      sender: {
        id: "4",
        username: "Alice",
        profileImage: "https://i.pravatar.cc/300?img=5"
      },
      content: "Try using a hash map to store the elements you've seen. It can reduce time complexity to O(n).",
      timestamp: "2023-04-02T13:02:00Z"
    },
    {
      id: "m5",
      channelId: "general",
      sender: {
        id: "5",
        username: "Bob",
        profileImage: "https://i.pravatar.cc/300?img=8"
      },
      content: "Exactly. As you iterate through the array, check if the complement (target - current element) exists in the hash map. If it does, you've found your pair.",
      timestamp: "2023-04-02T13:07:00Z"
    }
  ],
  "dm-4": [
    {
      id: "dm4-1",
      channelId: "dm-4",
      sender: {
        id: "4",
        username: "Sophie",
        profileImage: "https://i.pravatar.cc/300?img=9",
        isOnline: true
      },
      content: "Hey! How's your practice going?",
      timestamp: "2023-04-02T14:45:00Z"
    },
    {
      id: "dm4-2",
      channelId: "dm-4",
      sender: {
        id: "1",
        username: "Me",
        profileImage: "https://i.pravatar.cc/300?img=1"
      },
      content: "Pretty good! Working on dynamic programming problems this week.",
      timestamp: "2023-04-02T14:48:00Z",
      isCurrentUser: true
    },
    {
      id: "dm4-3",
      channelId: "dm-4",
      sender: {
        id: "4",
        username: "Sophie",
        profileImage: "https://i.pravatar.cc/300?img=9",
        isOnline: true
      },
      content: "Nice! I'm creating a new challenge focused on graph algorithms.",
      timestamp: "2023-04-02T14:52:00Z"
    },
    {
      id: "dm4-4",
      channelId: "dm-4",
      sender: {
        id: "4",
        username: "Sophie",
        profileImage: "https://i.pravatar.cc/300?img=9",
        isOnline: true
      },
      content: "I'm creating a new challenge, want to join?",
      timestamp: "2023-04-02T15:30:00Z",
      attachments: [
        {
          type: "challenge-invite",
          content: "Data Structure Masters",
          challengeId: "c2",
          challengeTitle: "Data Structure Masters",
          isPrivate: false
        }
      ]
    }
  ],
  "dm-5": [
    {
      id: "dm5-1",
      channelId: "dm-5",
      sender: {
        id: "5",
        username: "Taylor",
        profileImage: "https://i.pravatar.cc/300?img=5",
        isOnline: false
      },
      content: "Hi there! Would you be interested in a 1v1 coding challenge?",
      timestamp: "2023-04-03T09:30:00Z"
    },
    {
      id: "dm5-2",
      channelId: "dm-5",
      sender: {
        id: "1",
        username: "Me",
        profileImage: "https://i.pravatar.cc/300?img=1"
      },
      content: "Absolutely! What kind of problems are you thinking?",
      timestamp: "2023-04-03T09:33:00Z",
      isCurrentUser: true
    },
    {
      id: "dm5-3",
      channelId: "dm-5",
      sender: {
        id: "5",
        username: "Taylor",
        profileImage: "https://i.pravatar.cc/300?img=5",
        isOnline: false
      },
      content: "I was thinking hard difficulty, focused on dynamic programming and backtracking.",
      timestamp: "2023-04-03T09:38:00Z"
    },
    {
      id: "dm5-4",
      channelId: "dm-5",
      sender: {
        id: "5",
        username: "Taylor",
        profileImage: "https://i.pravatar.cc/300?img=5",
        isOnline: false
      },
      content: "Check out this private challenge I created",
      timestamp: "2023-04-03T09:45:00Z",
      attachments: [
        {
          type: "challenge-invite",
          content: "Private Coding Duel",
          challengeId: "c4",
          challengeTitle: "Private Coding Duel",
          isPrivate: true,
          accessCode: "XYZ123"
        }
      ]
    }
  ],
  "dm-3": [
    {
      id: "dm3-1",
      channelId: "dm-3",
      sender: {
        id: "3",
        username: "Mike",
        profileImage: "https://i.pravatar.cc/300?img=3",
        isOnline: true
      },
      content: "Hey! Are you preparing for the upcoming weekly contest?",
      timestamp: "2023-04-03T10:45:00Z"
    },
    {
      id: "dm3-2",
      channelId: "dm-3",
      sender: {
        id: "1",
        username: "Me",
        profileImage: "https://i.pravatar.cc/300?img=1"
      },
      content: "Yes! Looking forward to it. How about you?",
      timestamp: "2023-04-03T10:50:00Z",
      isCurrentUser: true
    },
    {
      id: "dm3-3",
      channelId: "dm-3",
      sender: {
        id: "3",
        username: "Mike",
        profileImage: "https://i.pravatar.cc/300?img=3",
        isOnline: true
      },
      content: "Same here. We should practice together before the contest.",
      timestamp: "2023-04-03T10:55:00Z"
    },
    {
      id: "dm3-4",
      channelId: "dm-3",
      sender: {
        id: "3",
        username: "Mike",
        profileImage: "https://i.pravatar.cc/300?img=3",
        isOnline: true
      },
      content: "Let's practice for the upcoming contest",
      timestamp: "2023-04-03T11:20:00Z"
    }
  ]
};

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
