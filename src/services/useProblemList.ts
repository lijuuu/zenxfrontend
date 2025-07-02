
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { mockProblems } from '@/api/mockData';

// Define the Problem interface based on the provided structure
export interface Problem {
  problem_id: string;
  title: string;
  description: string;
  tags: string[];
  difficulty: string;
  testcase_run: { run: { input: string; expected: string; id?: string }[] };
  supported_languages: string[];
  validated: boolean;
  placeholder_maps: { [key: string]: string };
}
export interface ProblemMetadata {
  problem_id: string;
  title: string;
  tags: string[];
  difficulty: string;

}

interface ProblemFilters {
  difficulty?: string;
  tags?: string[];
  search?: string;
  solved?: boolean;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api/v1/problems`
  : 'http://localhost:7000/api/v1/problems';


const fetchProblems = async (filters?: ProblemFilters) => {
  try {
    // For production/deployed app
    const res = await axios.get(`${BASE_URL}/metadata/list`, { params: { page: 1, page_size: 100, ...filters } });
    const problemList = res.data.payload?.problems || [];

    if (!Array.isArray(problemList)) throw new Error("Expected an array of problems");

    const mappedProblems: Problem[] = problemList.map((item: any) => ({
      problem_id: item.problem_id || '',
      title: item.title || 'Untitled',
      description: item.description || '',
      tags: item.tags || [],
      difficulty: item.difficulty || '',
      testcase_run: item.testcase_run || { run: [] },
      supported_languages: item.supported_languages || [],
      validated: item.validated || false,
      placeholder_maps: item.placeholder_maps || {},
    }));

    return mappedProblems;
  } catch (error) {
    console.error("Error fetching problems:", error);

    // Map the mock data to match the Problem interface
    return mockProblems.map(p => ({
      problem_id: p.id,
      title: p.title,
      description: p.description,
      tags: p.tags,
      difficulty: p.difficulty,
      testcase_run: {
        run: p.examples.map(ex => ({
          input: ex.input,
          expected: ex.output
        }))
      },
      supported_languages: ['javascript', 'python', 'java', 'cpp', 'go'],
      validated: true,
      placeholder_maps: {
        javascript: '// Write your solution here',
        python: '# Write your solution here'
      }
    }));
  }
};

export const useProblemList = (filters?: ProblemFilters) => {
  return useQuery({
    queryKey: ['problems', filters],
    queryFn: () => fetchProblems(filters),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};




export const fetchBulkProblemMetadata = async (problemIds: string[]): Promise<any[]> => {
  try {
    const queryString = problemIds.map(id => `problem_ids=${id}`).join('&');
    const url = `${BASE_URL}/bulk/metadata?${queryString}`;

    const res = await axios.get(url);
    const problemList = res.data.payload?.BulkProblemMetadata || [];

    if (!Array.isArray(problemList)) throw new Error("Expected an array of problems");

    const mappedProblems: ProblemMetadata[] = problemList.map((item: any) => ({
      problem_id: item.problem_id || '',
      title: item.title || 'Untitled',
      difficulty: item.difficulty || '',
      tags: item.tags || [],
    }));

    return mappedProblems;
  } catch (error) {
    console.error("Error fetching problems:", error);
    return [];
  }
};

