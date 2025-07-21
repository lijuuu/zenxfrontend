
import { useQuery } from '@tanstack/react-query';
import { ProblemMetadata } from '@/api/types';
import { twoSumProblem } from '@/api/types';
import axiosInstance from '@/utils/axiosInstance';

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
    const response = await axiosInstance.get(`problems/metadata?problemId=${problemId}`);
    if (!response.data) throw new Error('Failed to fetch problem');
    
    const problemData = response.data.payload || response.data;
    
    return {
      problemId: problemData.problemId || problemData.problemId || '',
      title: problemData.title || 'Untitled',
      description: problemData.description || '',
      tags: problemData.tags || [],
      testcaseRun: problemData.testcaseRun || { run: [] },
      difficulty: mapDifficulty(problemData.difficulty || ''),
      supportedLanguages: problemData.supportedLanguages || [],
      validated: problemData.validated || false,
      placeholderMaps: problemData.placeholderMaps || {},
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
