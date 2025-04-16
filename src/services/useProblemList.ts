
import { useQuery } from '@tanstack/react-query';
import { getProblems } from '@/api/problemApi';

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

interface ProblemFilters {
  difficulty?: string;
  tags?: string[];
  search?: string;
  solved?: boolean;
}

export const useProblemList = (filters?: ProblemFilters) => {
  return useQuery({
    queryKey: ['problems', filters],
    queryFn: async () => {
      // Use the existing getProblems API function
      const problems = await getProblems(filters);
      
      // Map the API response to match our Problem interface
      return problems.map(p => ({
        problem_id: p.id,
        title: p.title,
        description: p.description,
        tags: p.tags,
        difficulty: p.difficulty,
        testcase_run: {
          run: p.examples.map(example => ({
            input: example.input,
            expected: example.output,
          }))
        },
        supported_languages: ['javascript', 'python', 'java', 'cpp', 'go'],
        validated: true,
        placeholder_maps: {
          javascript: '// Write your JavaScript solution here',
          python: '# Write your Python solution here',
          java: '// Write your Java solution here',
          cpp: '// Write your C++ solution here',
          go: '// Write your Go solution here',
        }
      })) as Problem[];
    },
    refetchOnWindowFocus: false,
  });
};
