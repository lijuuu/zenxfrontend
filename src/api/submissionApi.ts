
import { Submission } from '@/api/types';

// Mock data for submissions
const mockSubmissions: Submission[] = [
  {
    id: 's1',
    problemId: 'p1',
    problemTitle: 'Two Sum',
    userId: 'u1',
    language: 'JavaScript',
    code: 'function twoSum(nums, target) {...}',
    status: 'Accepted',
    runtime: '76ms',
    memory: '42MB',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    difficulty: 'Easy',
  },
  {
    id: 's2',
    problemId: 'p2',
    problemTitle: 'Valid Parentheses',
    userId: 'u1',
    language: 'TypeScript',
    code: 'function isValid(s: string) {...}',
    status: 'Wrong Answer',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    difficulty: 'Easy',
  },
  {
    id: 's3',
    problemId: 'p3',
    problemTitle: 'Merge Sorted Array',
    userId: 'u1',
    language: 'Python',
    code: 'def merge(nums1, m, nums2, n) {...}',
    status: 'Time Limit Exceeded',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    difficulty: 'Medium',
  },
  {
    id: 's4',
    problemId: 'p4',
    problemTitle: 'Binary Tree Inorder Traversal',
    userId: 'u1',
    language: 'Java',
    code: 'public List<Integer> inorderTraversal(TreeNode root) {...}',
    status: 'Accepted',
    runtime: '1ms',
    memory: '38.7MB',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    difficulty: 'Easy',
  },
  {
    id: 's5',
    problemId: 'p5',
    problemTitle: 'LRU Cache',
    userId: 'u1',
    language: 'C++',
    code: 'class LRUCache {...}',
    status: 'Runtime Error',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    difficulty: 'Hard',
  },
];

export const getUserSubmissions = async (userId: string): Promise<Submission[]> => {
  // In a real app, this would fetch from an API endpoint
  console.log(`Fetching submissions for user: ${userId}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filter submissions based on userId
  return mockSubmissions;
};

export const getSubmission = async (submissionId: string): Promise<Submission> => {
  // In a real app, this would fetch from an API endpoint
  console.log(`Fetching submission: ${submissionId}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const submission = mockSubmissions.find(s => s.id === submissionId);
  if (!submission) throw new Error('Submission not found');
  
  return submission;
};

export const submitSolution = async (
  problemId: string, 
  code: string, 
  language: string
): Promise<Submission> => {
  // In a real app, this would post to an API endpoint
  console.log(`Submitting solution for problem: ${problemId}`);
  
  // Simulate API delay and processing
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate a random result
  const statuses: Submission['status'][] = [
    'Accepted', 
    'Wrong Answer', 
    'Time Limit Exceeded', 
    'Memory Limit Exceeded', 
    'Runtime Error'
  ];
  const randomStatus = statuses[Math.floor(Math.random() * 5)];
  
  const newSubmission: Submission = {
    id: `s${Date.now()}`,
    problemId,
    problemTitle: 'Example Problem',
    userId: 'current',
    language,
    code,
    status: randomStatus,
    runtime: randomStatus === 'Accepted' ? `${Math.floor(Math.random() * 200)}ms` : undefined,
    memory: randomStatus === 'Accepted' ? `${Math.floor(Math.random() * 100)}MB` : undefined,
    timestamp: new Date().toISOString(),
  };
  
  return newSubmission;
};
