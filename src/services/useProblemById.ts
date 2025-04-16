
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ProblemMetadata } from '@/api/types';
import { twoSumProblem } from '@/api/types';

// Helper function to map difficulty values
const mapDifficulty = (difficulty: string): string => {
  const lowerDifficulty = difficulty.toLowerCase();
  if (lowerDifficulty.includes('easy')) return 'Easy';
  if (lowerDifficulty.includes('medium')) return 'Medium';
  if (lowerDifficulty.includes('hard')) return 'Hard';
  return difficulty; // Return original if no match
};

const BASE_URL = "http://localhost:7000/api/v1";

const fetchProblemById = async (problemId: string): Promise<ProblemMetadata> => {
  try {
    const response = await axios.get(`${BASE_URL}/problems/metadata?problem_id=${problemId}`);
    if (!response.data) throw new Error('Failed to fetch problem');
    
    const problemData = response.data.payload || response.data;
    
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
    console.error("Error fetching problem:", error);
    // Fallback to the mock twoSumProblem in case of an error
    return twoSumProblem;
  }
};

export const useProblemById = (problemId: string) => {
  return useQuery({
    queryKey: ['problem', problemId],
    queryFn: () => fetchProblemById(problemId),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!problemId, // Only run the query if problemId is provided
  });
};
