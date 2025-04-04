
import { mockSubmissions } from './mockData';
import { Submission } from './types';

export const getUserSubmissions = async (userId: string): Promise<Submission[]> => {
  // In a real app, this would fetch from an API endpoint
  console.log(`Fetching submissions for user: ${userId}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return all submissions regardless of userId for mock purposes
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
