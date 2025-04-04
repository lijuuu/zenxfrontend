import { ChatChannel, ChatMessage, UserProfile } from './types';

// Mock API functions for chat

// Function to fetch chat channels for a user
export const fetchChatChannels = async (userId: string): Promise<ChatChannel[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const channels: ChatChannel[] = [
        {
          id: "channel-1",
          name: "General Chat",
          description: "A public channel for general discussions.",
          type: "public",
          lastMessage: "Hello everyone!",
          lastMessageTime: new Date().toISOString(),
          unreadCount: 3,
          participants: [],
        },
        {
          id: "channel-2",
          name: "Project Alpha",
          description: "A private channel for the Project Alpha team.",
          type: "private",
          lastMessage: "Progress update: UI is almost done.",
          lastMessageTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          unreadCount: 0,
          participants: [],
        },
        {
          id: "channel-3",
          name: "John Doe",
          type: "direct",
          lastMessage: "Hey, how's it going?",
          lastMessageTime: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          unreadCount: 1,
          participants: [],
          isOnline: true
        },
        {
          id: "channel-4",
          name: "Jane Smith",
          type: "direct",
          lastMessage: "I finished the task.",
          lastMessageTime: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          unreadCount: 0,
          participants: [],
          isOnline: false
        }
      ];
      resolve(channels);
    }, 500);
  });
};

// Function to fetch messages for a specific chat channel
export const fetchChatMessages = async (channelId: string): Promise<ChatMessage[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const messages: ChatMessage[] = [
        {
          id: "message-1",
          channelId: channelId,
          sender: {
            id: "user-1",
            username: "johndoe",
            profileImage: "/assets/avatars/avatar-1.png",
            isOnline: true
          },
          content: "Hello everyone!",
          timestamp: new Date().toISOString(),
          isCurrentUser: true,
          attachments: [],
          liked: true,
          likeCount: 3
        },
        {
          id: "message-2",
          channelId: channelId,
          sender: {
            id: "user-2",
            username: "janesmith",
            profileImage: "/assets/avatars/avatar-2.png",
            isOnline: false
          },
          content: "Hi John!",
          timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
          isCurrentUser: false,
          attachments: [],
          liked: false,
          likeCount: 0
        },
        {
          id: "message-3",
          channelId: channelId,
          sender: {
            id: "user-1",
            username: "johndoe",
            profileImage: "/assets/avatars/avatar-1.png",
            isOnline: true
          },
          content: "How's the project going?",
          timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
          isCurrentUser: true,
          attachments: [],
          liked: false,
          likeCount: 1
        },
        {
          id: "message-4",
          channelId: channelId,
          sender: {
            id: "user-2",
            username: "janesmith",
            profileImage: "/assets/avatars/avatar-2.png",
            isOnline: false
          },
          content: "Almost done with the UI.",
          timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
          isCurrentUser: false,
          attachments: [],
          liked: true,
          likeCount: 2
        },
        {
          id: "message-5",
          channelId: channelId,
          sender: {
            id: "user-1",
            username: "johndoe",
            profileImage: "/assets/avatars/avatar-1.png",
            isOnline: true
          },
          content: "Great!",
          timestamp: new Date().toISOString(),
          isCurrentUser: true,
          attachments: [],
          liked: false,
          likeCount: 0
        }
      ];
      resolve(messages);
    }, 300);
  });
};

// Function to send a new message to a chat channel
export const sendChatMessage = async (channelId: string, content: string): Promise<ChatMessage> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newMessage: ChatMessage = {
        id: `message-${Date.now()}`,
        channelId: channelId,
        sender: {
          id: "user-1",
          username: "johndoe",
          profileImage: "/assets/avatars/avatar-1.png",
          isOnline: true
        },
        content: content,
        timestamp: new Date().toISOString(),
        isCurrentUser: true,
        attachments: [],
        liked: false,
        likeCount: 0
      };
      resolve(newMessage);
    }, 400);
  });
};

// Function to like a message
export const likeMessage = async (messageId: string): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 200);
  });
};

// Function to unlike a message
export const unlikeMessage = async (messageId: string): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 200);
  });
};

// Function to create a new chat channel
export const createChatChannel = async (name: string, description?: string, type: 'public' | 'private' = 'public'): Promise<ChatChannel> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newChannel: ChatChannel = {
        id: `channel-${Date.now()}`,
        name: name,
        description: description,
        type: type,
        lastMessage: "",
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
        participants: []
      };
      resolve(newChannel);
    }, 500);
  });
};

// Function to add a user to a chat channel
export const addUserToChannel = async (channelId: string, userId: string): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 300);
  });
};

// Function to remove a user from a chat channel
export const removeUserFromChannel = async (channelId: string, userId: string): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 300);
  });
};

// Mock user data for testing purposes
const users: UserProfile[] = [
  {
    userID: "user-1",
    userName: "johndoe",
    firstName: "John",
    lastName: "Doe",
    avatarURL: "/assets/avatars/avatar-1.png",
    email: "john.doe@example.com",
    role: "user",
    country: "US",
    isBanned: false,
    isVerified: true,
    primaryLanguageID: "en",
    muteNotifications: false,
    socials: {
      github: "github.com/johndoe",
      twitter: "twitter.com/johndoe",
      linkedin: "linkedin.com/in/johndoe",
      website: "johndoe.com"
    },
    createdAt: Date.now(),
    
    // Backward compatibility fields
    profileImage: "/assets/avatars/avatar-1.png",
    joinedDate: "2021-01-01",
    problemsSolved: 248,
    dayStreak: 45,
    ranking: 121,
    is2FAEnabled: false,
    followers: [],
    following: [],
    isOnline: true,
    
    stats: {
      easy: { solved: 100, total: 150 },
      medium: { solved: 80, total: 200 },
      hard: { solved: 68, total: 100 }
    },
    achievements: {
      weeklyContests: 15,
      monthlyContests: 5,
      specialEvents: 3
    },
    badges: [],
    activityHeatmap: { data: [], totalContributions: 350, currentStreak: 45, longestStreak: 60 }
  },
  {
    userID: "user-2",
    userName: "janesmith",
    firstName: "Jane",
    lastName: "Smith",
    avatarURL: "/assets/avatars/avatar-2.png",
    email: "jane.smith@example.com",
    role: "user",
    country: "UK",
    isBanned: false,
    isVerified: true,
    primaryLanguageID: "en",
    muteNotifications: false,
    socials: {
      github: "github.com/janesmith",
      twitter: "twitter.com/janesmith",
      linkedin: "linkedin.com/in/janesmith",
      website: "janesmith.com"
    },
    createdAt: Date.now(),
    
    // Backward compatibility fields
    profileImage: "/assets/avatars/avatar-2.png",
    joinedDate: "2021-03-15",
    problemsSolved: 197,
    dayStreak: 23,
    ranking: 245,
    is2FAEnabled: true,
    followers: [],
    following: [],
    isOnline: false,
    
    stats: {
      easy: { solved: 85, total: 150 },
      medium: { solved: 72, total: 200 },
      hard: { solved: 40, total: 100 }
    },
    achievements: {
      weeklyContests: 10,
      monthlyContests: 3,
      specialEvents: 2
    },
    badges: [],
    activityHeatmap: { data: [], totalContributions: 280, currentStreak: 23, longestStreak: 35 }
  }
];

// Function to get user profile by ID
export const getUserProfile = async (userId: string): Promise<UserProfile | undefined> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const user = users.find(u => u.userID === userId);
      resolve(user);
    }, 300);
  });
};

// Function to simulate searching for users
export const searchUsers = async (query: string): Promise<UserProfile[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const results = users.filter(user =>
        user.userName.toLowerCase().includes(query.toLowerCase()) ||
        user.firstName.toLowerCase().includes(query.toLowerCase()) ||
        user.lastName.toLowerCase().includes(query.toLowerCase())
      );
      resolve(results);
    }, 400);
  });
};
