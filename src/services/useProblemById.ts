
import { useQuery } from '@tanstack/react-query';
import { twoSumProblem } from '@/api/mockData';
import { ProblemMetadata } from './useProblemList';

// Handle difficulty mapping consistently
const mapDifficulty = (difficulty: string): string => {
  switch (difficulty) {
    case 'E': return 'Easy';
    case 'M': return 'Medium';
    case 'H': return 'Hard';
    case 'easy': return 'Easy';
    case 'medium': return 'Medium';
    case 'hard': return 'Hard';
    default: return difficulty;
  }
};

// Get base URL from environment
const environment = import.meta.env.VITE_ENVIRONMENT || 'PRODUCTION';
const ENGINE_BASE_URL =
  environment === 'DEVELOPMENT'
    ? import.meta.env.VITE_XENGINELOCALENGINEURL || 'http://localhost:7000/api/v1'
    : import.meta.env.VITE_XENGINEPRODUCTIONENGINEURL || 'https://xengine.lijuu.me/compile';

// Function to fetch a problem by ID
export const fetchProblemById = async (problemId: string): Promise<ProblemMetadata> => {
  if (!problemId) throw new Error('Problem ID is required');
  
  try {
    const response = await fetch(`${ENGINE_BASE_URL}/problems/metadata?problem_id=${problemId}`);
    if (!response.ok) throw new Error('Failed to fetch problem');
    
    const data = await response.json();
    const problemData = data.payload || data;
    
    return {
      problem_id: problemData.problem_id || '',
      title: problemData.title || 'Untitled',
      description: problemData.description || '',
      tags: problemData.tags || [],
      testcase_run: problemData.testcase_run || { run: [] },
      difficulty: mapDifficulty(problemData.difficulty || ''),
      supported_languages: problemData.supported_languages || [],
      validated: problemData.validated || false,
      placeholder_maps: problemData.placeholder_maps || {},
    };
  } catch (error) {
    console.error('Error fetching problem:', error);
    // Return the mock problem as fallback
    return twoSumProblem;
  }
};

export const useProblemById = (problemId: string | undefined) => {
  return useQuery({
    queryKey: ['problem', problemId],
    queryFn: () => problemId ? fetchProblemById(problemId) : Promise.reject('No problem ID provided'),
    enabled: !!problemId, // Only run query if problemId exists
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once
  });
};
