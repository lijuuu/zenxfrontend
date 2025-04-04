
import { mockUsers, mockFriends, mockFriendRequests } from './mockData';
import { User, Friend } from './types';

export const getFriends = async (): Promise<Friend[]> => {
  return new Promise(resolve => {
    // Ensure friends have properly typed status
    const typedFriends = mockFriends.map(friend => ({
      ...friend,
      status: friend.status as "online" | "offline" | "in-match" | "coding"
    }));
    
    setTimeout(() => resolve(typedFriends), 500);
  });
};

export const getOnlineFriends = async (): Promise<Friend[]> => {
  return new Promise(resolve => {
    const onlineFriends = mockFriends.filter(f => f.status === "online");
    
    // Ensure friends have properly typed status
    const typedFriends = onlineFriends.map(friend => ({
      ...friend,
      status: friend.status as "online" | "offline" | "in-match" | "coding"
    }));
    
    setTimeout(() => resolve(typedFriends), 500);
  });
};

export const getRecentlyActiveFriends = async (): Promise<Friend[]> => {
  return new Promise(resolve => {
    // Ensure friends have properly typed status
    const typedFriends = mockFriends.map(friend => ({
      ...friend,
      status: friend.status as "online" | "offline" | "in-match" | "coding"
    }));
    
    setTimeout(() => resolve(typedFriends), 500);
  });
};
