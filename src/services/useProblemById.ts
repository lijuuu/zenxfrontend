
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { twoSumProblem } from '@/api/types';
import { ProblemMetadata } from '@/api/types';

const environment = import.meta.env.VITE_ENVIRONMENT || 'PRODUCTION';
const ENGINE_BASE_URL =
  environment === 'DEVELOPMENT'
    ? import.meta.env.VITE_XENGINELOCALENGINEURL || 'http://localhost:7000/api/v1'
    : import.meta.env.VITE_XENGINEPRODUCTIONENGINEURL || 'https://xengine.lijuu.me/compile';

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

const fetchProblemById = async (problemId: string): Promise<ProblemMetadata> => {
  try {
    const response = await axios.get(`${ENGINE_BASE_URL}/problems/metadata?problem_id=${problemId}`);
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
    console.error('Error fetching problem details:', error);
    throw error;
  }
};

export const useProblemById = (problemId: string) => {
  return useQuery({
    queryKey: ['problem', problemId],
    queryFn: () => fetchProblemById(problemId),
    enabled: !!problemId,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: twoSumProblem, // Use this as fallback data if query fails
  });
};
