// Mock data consolidated from multiple API files

// User related mock data
export const mockUsers = [
  {
    userId: "1",
    userName: "johndoe",
    firstName: "John",
    lastName: "Doe",
    avatarURL: "https://i.pravatar.cc/300?img=1",
    email: "john.doe@example.com",
    role: "developer",
    country: "United States",
    isBanned: false,
    isVerified: true,
    primaryLanguageID: "en",
    muteNotifications: false,
    socials: {
      github: "johndoe",
      twitter: "",
      linkedin: "",
      website: "https://johndoe.dev",
    },
    createdAt: 1642243200000, // Timestamp for "2022-01-15"
    joinedDate: "2022-01-15",
    problemsSolved: 147,
    dayStreak: 26,
    ranking: 354,
    profileImage: "https://i.pravatar.cc/300?img=1",
    is2FAEnabled: false,
    followers: 78,
    following: 45,
    countryCode: "US",
    bio: "Software developer passionate about algorithms and data structures. Solving programming challenges in my free time.",
    stats: {
      easy: { solved: 50, total: 100 },
      medium: { solved: 70, total: 150 },
      hard: { solved: 27, total: 50 },
    },
    achievements: {
      weeklyContests: 5,
      monthlyContests: 2,
      specialEvents: 1,
    },
    badges: [],
    activityHeatmap: undefined,
    currentStreak: 26,
    longestStreak: 50,
    currentRating: 1200,
    globalRank: 354,
    location: "San Francisco, USA",
    isOnline: false,
  },
  {
    userId: "2",
    userName: "janedoe",
    firstName: "Jane",
    lastName: "Doe",
    avatarURL: "https://i.pravatar.cc/300?img=5",
    email: "jane.doe@example.com",
    role: "frontend-developer",
    country: "United States",
    isBanned: false,
    isVerified: true,
    primaryLanguageID: "en",
    muteNotifications: false,
    socials: {
      github: "janedoe",
      twitter: "",
      linkedin: "",
      website: "https://janedoe.dev",
    },
    createdAt: 1646870400000, // Timestamp for "2022-03-10"
    joinedDate: "2022-03-10",
    problemsSolved: 203,
    dayStreak: 42,
    ranking: 218,
    profileImage: "https://i.pravatar.cc/300?img=5",
    is2FAEnabled: true,
    followers: 93,
    following: 67,
    countryCode: "US",
    bio: "Frontend developer with a passion for UI/UX design.",
    stats: {
      easy: { solved: 80, total: 100 },
      medium: { solved: 100, total: 150 },
      hard: { solved: 23, total: 50 },
    },
    achievements: {
      weeklyContests: 8,
      monthlyContests: 3,
      specialEvents: 2,
    },
    badges: [],
    activityHeatmap: undefined,
    currentStreak: 42,
    longestStreak: 60,
    currentRating: 1300,
    globalRank: 218,
    location: "New York, USA",
    isOnline: false,
  },
  {
    userId: "3",
    userName: "mchen",
    firstName: "Mike",
    lastName: "Chen",
    avatarURL: "https://i.pravatar.cc/300?img=3",
    email: "mike@example.com",
    role: "fullstack-developer",
    country: "United States",
    isBanned: false,
    isVerified: true,
    primaryLanguageID: "en",
    muteNotifications: false,
    socials: {
      github: "",
      twitter: "",
      linkedin: "",
      website: "",
    },
    createdAt: 1644019200000, // Timestamp for "2022-02-05"
    joinedDate: "2022-02-05",
    problemsSolved: 203,
    dayStreak: 45,
    ranking: 178,
    profileImage: "https://i.pravatar.cc/300?img=3",
    is2FAEnabled: false,
    followers: 0,
    following: 0,
    countryCode: "US",
    bio: "Full-stack developer with a passion for problem-solving",
    stats: {
      easy: { solved: 90, total: 100 },
      medium: { solved: 90, total: 150 },
      hard: { solved: 23, total: 50 },
    },
    achievements: {
      weeklyContests: 10,
      monthlyContests: 5,
      specialEvents: 3,
    },
    badges: [],
    activityHeatmap: undefined,
    currentStreak: 45,
    longestStreak: 70,
    currentRating: 1400,
    globalRank: 178,
    location: "Los Angeles, USA",
    isOnline: true,
  },
  {
    userId: "4",
    userName: "sophie",
    firstName: "Sophie",
    lastName: "Williams",
    avatarURL: "https://i.pravatar.cc/300?img=9",
    email: "sophie@example.com",
    role: "software-architect",
    country: "United States",
    isBanned: false,
    isVerified: true,
    primaryLanguageID: "en",
    muteNotifications: false,
    socials: {
      github: "",
      twitter: "",
      linkedin: "",
      website: "",
    },
    createdAt: 1637366400000, // Timestamp for "2021-11-20"
    joinedDate: "2021-11-20",
    problemsSolved: 312,
    dayStreak: 86,
    ranking: 42,
    profileImage: "https://i.pravatar.cc/300?img=9",
    is2FAEnabled: false,
    followers: 0,
    following: 0,
    countryCode: "US",
    bio: "Software architect | Competitive programmer",
    stats: {
      easy: { solved: 100, total: 100 },
      medium: { solved: 150, total: 150 },
      hard: { solved: 62, total: 62 },
    },
    achievements: {
      weeklyContests: 15,
      monthlyContests: 8,
      specialEvents: 5,
    },
    badges: [],
    activityHeatmap: undefined,
    currentStreak: 86,
    longestStreak: 100,
    currentRating: 1600,
    globalRank: 42,
    location: "Seattle, USA",
    isOnline: true,
  },
  {
    userId: "5",
    userName: "taylor",
    firstName: "Taylor",
    lastName: "Smith",
    avatarURL: "https://i.pravatar.cc/300?img=5",
    email: "taylor@example.com",
    role: "frontend-developer",
    country: "United States",
    isBanned: false,
    isVerified: true,
    primaryLanguageID: "en",
    muteNotifications: false,
    socials: {
      github: "",
      twitter: "",
      linkedin: "",
      website: "",
    },
    createdAt: 1652832000000, // Timestamp for "2022-05-18"
    joinedDate: "2022-05-18",
    problemsSolved: 68,
    dayStreak: 7,
    ranking: 1254,
    profileImage: "https://i.pravatar.cc/300?img=5",
    is2FAEnabled: false,
    followers: 0,
    following: 0,
    countryCode: "US",
    bio: "Frontend developer learning algorithms",
    stats: {
      easy: { solved: 30, total: 100 },
      medium: { solved: 30, total: 150 },
      hard: { solved: 8, total: 50 },
    },
    achievements: {
      weeklyContests: 2,
      monthlyContests: 1,
      specialEvents: 0,
    },
    badges: [],
    activityHeatmap: undefined,
    currentStreak: 7,
    longestStreak: 20,
    currentRating: 1000,
    globalRank: 1254,
    location: "Austin, USA",
    isOnline: false,
  },
];

export const mockFriends = [
  {
    id: "3",
    username: "mchen",
    fullName: "Michael Chen",
    profileImage: "https://i.pravatar.cc/300?img=3",
    status: "online"
  },
  {
    id: "4",
    username: "sophie",
    fullName: "Sophia Lee",
    profileImage: "https://i.pravatar.cc/300?img=9",
    status: "in-match",
    lastActive: "2023-04-02T14:30:00Z"
  },
  {
    id: "5",
    username: "alex_dev",
    fullName: "Alex Johnson",
    profileImage: "https://i.pravatar.cc/300?img=13",
    status: "coding",
    lastActive: "2023-04-02T15:10:00Z"
  },
  {
    id: "6",
    username: "maria_g",
    fullName: "Maria Garcia",
    profileImage: "https://i.pravatar.cc/300?img=16",
    status: "offline",
    lastActive: "2023-04-01T22:45:00Z"
  }
];

export const mockBadges = [
  {
    id: "b1",
    name: "Problem Solver",
    description: "Solved 100 problems",
    icon: "trophy",
    earnedDate: "2023-02-15",
    rarity: "common"
  },
  {
    id: "b2",
    name: "Streak Master",
    description: "Maintained a 20-day streak",
    icon: "flame",
    earnedDate: "2023-03-10",
    rarity: "uncommon"
  },
  {
    id: "b3",
    name: "Contest Champion",
    description: "Won a weekly contest",
    icon: "award",
    earnedDate: "2023-03-25",
    rarity: "rare"
  }
];

// Problem related mock data
export const mockProblems = [
  {
    id: "67d96452d3fe6af39801337b",
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table", "String", "Linked List"],
    acceptanceRate: 78,
    solved: true,
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to the target.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.\n\n## Examples\n\n### Example 1:\n- **Input**: `nums = [2,7,11,15]`, `target = 9`\n- **Output**: `[0,1]`\n- **Explanation**: Because `nums[0] + nums[1] == 9`, we return `[0, 1]`\n\n### Example 2:\n- **Input**: `nums = [3,2,4]`, `target = 6`\n- **Output**: `[1,2]`\n\n## Constraints\n- `2 <= nums.length <= 10⁴`\n- `-10⁹ <= nums[i] <= 10⁹`\n- `-10⁹ <= target <= 10⁹`\n- Only one valid answer exists\n\n## Follow-up\nCan you come up with an algorithm that is less than `O(n²)` time complexity?",
    examples: [
      {
        input: "{ \"nums\": [2,7,11,15], \"target\": 9 }",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "{   \"nums\": [2, 7, 11, 15],   \"target\": 9 }",
        output: "[0,1]"
      }
    ],
    constraints: [
      "2 <= nums.length <= 10⁴",
      "-10⁹ <= nums[i] <= 10⁹",
      "-10⁹ <= target <= 10⁹",
      "Only one valid answer exists."
    ],
    hints: [
      "A really brute force way would be to search for all possible pairs of numbers but that would be too slow.",
      "Try to use the fact that the complement of the number we need is already in the hash table."
    ]
  },
  {
    id: "67b96452d3fe6af39801337d",
    title: "Reverse a String",
    slug: "reverse-string",
    difficulty: "Easy",
    tags: ["String", "Array"],
    acceptanceRate: 82,
    solved: false,
    description: "Write a function that reverses a given string. You must return the string with its characters in reverse order.\n\n## Examples\n\n### Example 1:\n- **Input**: `\"hello\"`\n- **Output**: `\"olleh\"`\n- **Explanation**: The string \"hello\" is reversed to \"olleh\".\n\n### Example 2:\n- **Input**: `\"world\"`\n- **Output**: `\"dlrow\"`\n\n## Constraints\n- `1 <= s.length <= 10⁴`\n- `s` consists of printable ASCII characters.",
    examples: [
      {
        input: "\"hello\"",
        output: "\"olleh\"",
        explanation: "The string \"hello\" is reversed to \"olleh\"."
      },
      {
        input: "\"world\"",
        output: "\"dlrow\""
      }
    ],
    constraints: [
      "1 <= s.length <= 10⁴",
      "s consists of printable ASCII characters."
    ]
  },
  {
    id: "67e1a5b2c9f8d3e4a201b48f",
    title: "Add Two Numbers",
    slug: "add-two-numbers",
    difficulty: "Easy",
    tags: ["Math", "Basic"],
    acceptanceRate: 68,
    solved: false,
    description: "Write a function that takes two integers and returns their sum.\n\n## Examples\n\n### Example 1:\n- **Input**: `a = 3, b = 5`\n- **Output**: `8`\n- **Explanation**: `3 + 5 = 8`\n\n### Example 2:\n- **Input**: `a = -2, b = 7`\n- **Output**: `5`\n\n## Constraints\n- `-10⁹ <= a, b <= 10⁹`",
    examples: [
      {
        input: "{\"a\": 3, \"b\": 5}",
        output: "8",
        explanation: "3 + 5 = 8"
      },
      {
        input: "{\"a\": -2, \"b\": 7}",
        output: "5"
      }
    ],
    constraints: [
      "-10⁹ <= a, b <= 10⁹"
    ]
  }
];

// Submission related mock data
export const mockSubmissions = [
  {
    id: "s1",
    problemId: "p1",
    problemTitle: "Two Sum",
    userId: "1",
    language: "javascript",
    code: "function twoSum(nums, target) {\n  const map = new Map();\n  \n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    \n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    \n    map.set(nums[i], i);\n  }\n  \n  return [];\n}",
    status: "Accepted",
    runtime: "76 ms",
    memory: "42.4 MB",
    timestamp: "2023-03-20T15:30:00Z",
    testCases: {
      passed: 29,
      total: 29
    }
  },
  {
    id: "s2",
    problemId: "p3",
    problemTitle: "Add Two Numbers",
    userId: "1",
    language: "python",
    code: "def addTwoNumbers(l1, l2):\n    dummy = ListNode(0)\n    current = dummy\n    carry = 0\n    \n    while l1 or l2 or carry:\n        x = l1.val if l1 else 0\n        y = l2.val if l2 else 0\n        \n        sum = x + y + carry\n        carry = sum // 10\n        \n        current.next = ListNode(sum % 10)\n        current = current.next\n        \n        if l1: l1 = l1.next\n        if l2: l2 = l2.next\n    \n    return dummy.next",
    status: "Accepted",
    runtime: "68 ms",
    memory: "14.2 MB",
    timestamp: "2023-03-18T10:15:00Z",
    testCases: {
      passed: 1568,
      total: 1568
    }
  },
  {
    id: "s3",
    problemId: "p3",
    problemTitle: "Merge Sorted Array",
    userId: "u1",
    language: "Python",
    code: "def merge(nums1, m, nums2, n) {...}",
    status: "Time Limit Exceeded",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    difficulty: "Medium",
  },
  {
    id: "s4",
    problemId: "p4",
    problemTitle: "Binary Tree Inorder Traversal",
    userId: "u1",
    language: "Java",
    code: "public List<Integer> inorderTraversal(TreeNode root) {...}",
    status: "Accepted",
    runtime: "1ms",
    memory: "38.7MB",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    difficulty: "Easy",
  },
  {
    id: "s5",
    problemId: "p5",
    problemTitle: "LRU Cache",
    userId: "u1",
    language: "C++",
    code: "class LRUCache {...}",
    status: "Runtime Error",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    difficulty: "Hard",
  }
];

// Leaderboard related mock data
export const mockLeaderboard = [
  {
    rank: 1,
    user: {
      id: "l1",
      username: "codemaster",
      fullName: "Alex Johnson",
      profileImage: "https://i.pravatar.cc/300?img=12",
      country: "United States",
      countryCode: "US"
    },
    score: 9845,
    problemsSolved: 482,
    contestsParticipated: 48,
    streakDays: 186
  },
  {
    rank: 2,
    user: {
      id: "l2",
      username: "algorithm_wizard",
      fullName: "Emma Chen",
      profileImage: "https://i.pravatar.cc/300?img=32",
      country: "Canada",
      countryCode: "CA"
    },
    score: 9782,
    problemsSolved: 463,
    contestsParticipated: 52,
    streakDays: 142
  },
  {
    rank: 3,
    user: {
      id: "l3",
      username: "code_ninja",
      fullName: "Raj Patel",
      profileImage: "https://i.pravatar.cc/300?img=11",
      country: "India",
      countryCode: "IN"
    },
    score: 9654,
    problemsSolved: 456,
    contestsParticipated: 43,
    streakDays: 205
  },
  {
    rank: 4,
    user: {
      id: "l4",
      username: "devmaster",
      fullName: "Sophie Martin",
      profileImage: "https://i.pravatar.cc/300?img=25",
      country: "France",
      countryCode: "FR"
    },
    score: 9523,
    problemsSolved: 442,
    contestsParticipated: 39,
    streakDays: 128
  },
  {
    rank: 5,
    user: {
      id: "l5",
      username: "hackerX",
      fullName: "James Wilson",
      profileImage: "https://i.pravatar.cc/300?img=15",
      country: "Australia",
      countryCode: "AU"
    },
    score: 9411,
    problemsSolved: 431,
    contestsParticipated: 41,
    streakDays: 163
  },
  {
    rank: 6,
    user: {
      id: "l6",
      username: "bytecoder",
      fullName: "Maria Garcia",
      profileImage: "https://i.pravatar.cc/300?img=23",
      country: "Spain",
      countryCode: "ES"
    },
    score: 9356,
    problemsSolved: 428,
    contestsParticipated: 37,
    streakDays: 132
  },
  {
    rank: 7,
    user: {
      id: "l7",
      username: "codegenius",
      fullName: "Hiroshi Tanaka",
      profileImage: "https://i.pravatar.cc/300?img=17",
      country: "Japan",
      countryCode: "JP"
    },
    score: 9287,
    problemsSolved: 418,
    contestsParticipated: 44,
    streakDays: 156
  },
  {
    rank: 8,
    user: {
      id: "l8",
      username: "algoexpert",
      fullName: "Anna Kowalski",
      profileImage: "https://i.pravatar.cc/300?img=29",
      country: "Poland",
      countryCode: "PL"
    },
    score: 9165,
    problemsSolved: 412,
    contestsParticipated: 36,
    streakDays: 119
  },
  {
    rank: 9,
    user: {
      id: "l9",
      username: "codehacker",
      fullName: "Luis Hernandez",
      profileImage: "https://i.pravatar.cc/300?img=14",
      country: "Mexico",
      countryCode: "MX"
    },
    score: 9042,
    problemsSolved: 405,
    contestsParticipated: 35,
    streakDays: 98
  },
  {
    rank: 10,
    user: {
      id: "l10",
      username: "devguru",
      fullName: "Sarah Kim",
      profileImage: "https://i.pravatar.cc/300?img=28",
      country: "South Korea",
      countryCode: "KR"
    },
    score: 8976,
    problemsSolved: 398,
    contestsParticipated: 33,
    streakDays: 135
  }
];

// Friends leaderboard
export const mockFriendsLeaderboard = [
  {
    ...mockLeaderboard[2],
    rank: 1 // Rank among friends
  },
  {
    ...mockLeaderboard[4],
    rank: 2 // Rank among friends
  },
  {
    rank: 3, // Rank among friends
    user: {
      id: "1",
      username: "johndoe",
      fullName: "John Doe",
      profileImage: "https://i.pravatar.cc/300?img=1",
      country: "United States",
      countryCode: "US"
    },
    score: 6542,
    problemsSolved: 147,
    contestsParticipated: 12,
    streakDays: 26
  },
  {
    ...mockLeaderboard[7],
    rank: 4 // Rank among friends
  }
];

// Challenge related mock data
export const mockChallenges = [
  {
    id: "c1",
    title: "Algorithm Sprint",
    difficulty: "Medium",
    createdBy: {
      id: "3",
      username: "mchen",
      profileImage: "https://i.pravatar.cc/300?img=3"
    },
    participants: 4,
    participantUsers: [
      { id: "1", avatar: "https://i.pravatar.cc/300?img=1", name: "johndoe" },
      { id: "2", avatar: "https://i.pravatar.cc/300?img=2", name: "sarah" },
      { id: "4", avatar: "https://i.pravatar.cc/300?img=4", name: "alex" },
      { id: "5", avatar: "https://i.pravatar.cc/300?img=5", name: "taylor" }
    ],
    problemCount: 3,
    createdAt: "2023-04-02T12:00:00Z",
    isActive: true,
    problems: ["p1", "p3", "p7"],
    isPrivate: false,
    accessCode: ""
  },
  {
    id: "c2",
    title: "Data Structure Masters",
    difficulty: "Hard",
    createdBy: {
      id: "4",
      username: "sophie",
      profileImage: "https://i.pravatar.cc/300?img=9"
    },
    participants: 6,
    participantUsers: [
      { id: "1", avatar: "https://i.pravatar.cc/300?img=1", name: "johndoe" },
      { id: "4", avatar: "https://i.pravatar.cc/300?img=4", name: "alex" },
      { id: "5", avatar: "https://i.pravatar.cc/300?img=5", name: "taylor" },
      { id: "6", avatar: "https://i.pravatar.cc/300?img=6", name: "mike" },
      { id: "7", avatar: "https://i.pravatar.cc/300?img=7", name: "jessica" },
      { id: "8", avatar: "https://i.pravatar.cc/300?img=8", name: "chris" }
    ],
    problemCount: 5,
    createdAt: "2023-04-01T15:00:00Z",
    isActive: true,
    problems: ["p4", "p5", "p6", "p8", "p9"],
    isPrivate: false,
    accessCode: ""
  },
  {
    id: "c3",
    title: "Weekly Contest #42",
    difficulty: "Medium",
    createdBy: {
      id: "1",
      username: "admin",
      profileImage: "https://i.pravatar.cc/300?img=68"
    },
    participants: 128,
    participantUsers: [],
    problemCount: 4,
    createdAt: "2023-03-28T10:00:00Z",
    isActive: false,
    problems: ["p2", "p3", "p4", "p8"],
    isPrivate: false,
    accessCode: ""
  },
  {
    id: "c4",
    title: "Private Coding Duel",
    difficulty: "Hard",
    createdBy: {
      id: "1",
      username: "johndoe",
      profileImage: "https://i.pravatar.cc/300?img=1"
    },
    participants: 2,
    participantUsers: [
      { id: "1", avatar: "https://i.pravatar.cc/300?img=1", name: "johndoe" },
      { id: "5", avatar: "https://i.pravatar.cc/300?img=5", name: "taylor" }
    ],
    problemCount: 3,
    createdAt: "2023-04-03T14:30:00Z",
    isActive: true,
    problems: ["p3", "p6", "p9"],
    isPrivate: true,
    accessCode: "XYZ123"
  }
];

// Chat related mock data
export const mockChannels = [
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
export const mockMessages = {
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

// Two-Sum Problem Data for ZenXPlayground
export const twoSumProblem = {
  problemId: "67d96452d3fe6af39801337b",
  title: "Two Sum",
  description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to the target.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.

## Examples

### Example 1:
- **Input**: \`nums = [2,7,11,15]\`, \`target = 9\`
- **Output**: \`[0,1]\`
- **Explanation**: Because \`nums[0] + nums[1] == 9\`, we return \`[0, 1]\`

### Example 2:
- **Input**: \`nums = [3,2,4]\`, \`target = 6\`
- **Output**: \`[1,2]\`

## Constraints
- \`2 <= nums.length <= 10⁴\`
- \`-10⁹ <= nums[i] <= 10⁹\`
- \`-10⁹ <= target <= 10⁹\`
- Only one valid answer exists

## Follow-up
Can you come up with an algorithm that is less than \`O(n²)\` time complexity?`,
  tags: ["Array", "Hash Table", "String", "Linked List"],
  testcaseRun: {
    run: [
      {
        id: "67e16a5a48ec539e82f1622c",
        input: '{ "nums": [2,7,11,15], "target": 9 }',
        expected: "[0,1]",
      },
      {
        id: "67e216734e8f4ccb4fda6635",
        input: '{ "nums": [2, 7, 11, 15], "target": 9 }',
        expected: "[0,1]",
      },
    ],
  },
  difficulty: "Easy",
  supportedLanguages: ["go", "python", "javascript"],
  validated: true,
  placeholderMaps: {
    go: `func twoSum(nums []int, target int) []int {
    // Type your code
    return []int{}
}`,
    javascript: `function twoSum(nums, target) {
    // Type your code
    return [];
}`,
    python: `def two_sum(nums, target):
    # Type your code
    return []`,
  },
};

// Challenge invite mock data
export const mockChallengeInvites = [
  {
    challengeId: "c2",
    challengeTitle: "Data Structure Masters",
    invitedBy: "sophie",
    isPrivate: false
  },
  {
    challengeId: "c4",
    challengeTitle: "Private Coding Duel",
    invitedBy: "taylor",
    isPrivate: true,
    accessCode: "XYZ123"
  }
];

// Utility function to generate a random access code for private challenges
export const generateAccessCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Utility function to generate heatmap data for the last 365 days
export const generateHeatmapData = () => {
  const today = new Date();
  const data = [];
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 364);

  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    // Randomly determine if present or absent
    const present = Math.random() > 0.4;
    const count = present ? Math.floor(Math.random() * 5) + 1 : 0;

    data.push({
      date: dateStr,
      count,
      present
    });
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    data
  };
};
