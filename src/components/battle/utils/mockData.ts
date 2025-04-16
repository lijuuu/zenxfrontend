
import { Problem, UserData, LeaderboardEntry, Room, RoomData } from '../types';

// Mock users
export const mockUsers: { [id: string]: UserData } = {
  'user-1': { id: 'user-1', name: 'Alice Chen', avatar: 'https://i.pravatar.cc/150?img=1' },
  'user-2': { id: 'user-2', name: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
  'user-3': { id: 'user-3', name: 'Charlie Kim', avatar: 'https://i.pravatar.cc/150?img=3' },
  'user-4': { id: 'user-4', name: 'David Johnson', avatar: 'https://i.pravatar.cc/150?img=4' },
  'user-5': { id: 'user-5', name: 'Emma Davis', avatar: 'https://i.pravatar.cc/150?img=5' },
  'user-6': { id: 'user-6', name: 'Frank Zhang', avatar: 'https://i.pravatar.cc/150?img=6' },
};

// Mock problems data
export const mockProblemsData: { [key: string]: Problem } = {
  'prob-1': {
    id: 'prob-1',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ]
  },
  'prob-2': {
    id: 'prob-2',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    examples: [
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\''
    ]
  },
  'prob-3': {
    id: 'prob-3',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Medium',
    description: 'Merge two sorted linked lists and return it as a sorted list.',
    examples: [
      {
        input: 'l1 = [1,2,4], l2 = [1,3,4]',
        output: '[1,1,2,3,4,4]'
      }
    ],
    constraints: [
      'The number of nodes in both lists is in the range [0, 50]',
      '-100 <= Node.val <= 100',
      'Both l1 and l2 are sorted in non-decreasing order.'
    ]
  }
};

// Mock Room Status data creator
export const getMockRoomData = (roomId: string): RoomData => {
  // Sample mock room data
  const mockRoom: Room = {
    id: roomId || 'room-1',
    challengeId: 'chal-1',
    password: 'pass123',
    status: 'active',
    startTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
    participantIds: ['user-1', 'user-2', 'user-3', 'user-4'],
    problemIds: ['prob-1', 'prob-2', 'prob-3'],
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 minutes ago
  };
  
  const mockLeaderboard: LeaderboardEntry[] = [
    { userId: 'user-2', problemsCompleted: 2, totalScore: 850, rank: 1 },
    { userId: 'user-1', problemsCompleted: 1, totalScore: 450, rank: 2 },
    { userId: 'user-3', problemsCompleted: 1, totalScore: 400, rank: 3 },
    { userId: 'user-4', problemsCompleted: 0, totalScore: 0, rank: 4 }
  ];
  
  return {
    room: mockRoom,
    problemIds: mockRoom.problemIds,
    leaderboard: mockLeaderboard
  };
};

// Get mock code templates
export const getCodeTemplate = (language: string): string => {
  if (language === 'javascript') {
    return `function solution(nums, target) {
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
}`;
  } else if (language === 'python') {
    return `def solution(nums, target):
    # Write your solution here
    num_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    
    return []`;
  } else if (language === 'go') {
    return `func solution(nums []int, target int) []int {
    // Write your solution here
    numMap := make(map[int]int)
    
    for i, num := range nums {
        complement := target - num
        if j, found := numMap[complement]; found {
            return []int{j, i}
        }
        numMap[num] = i
    }
    
    return []int{}}`;
  }
  
  return '';
};
