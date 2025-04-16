
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';
import { ProblemMetadata } from '@/api/types';

interface ProblemsFilters {
  search?: string;
  difficulty?: string;
  tags?: string;
}

// Problems hook for fetching problem metadata from real API
export const useGetProblemListing = (filters?: ProblemsFilters) => {
  return useQuery({
    queryKey: ['problems-listing', filters],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/problems/metadata/list', { 
          params: { page: 1, page_size: 100 },
          headers: { 'X-Requires-Auth': 'true' }
        });
        
        const problemList = response.data.payload?.problems || [];
        
        if (!Array.isArray(problemList)) throw new Error("Expected an array of problems");
        
        const mappedProblems: ProblemMetadata[] = problemList.map((item: any) => ({
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
        
        let filteredProblems = mappedProblems;

        // Apply filters
        if (filters) {
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredProblems = filteredProblems.filter(p => 
              p.title.toLowerCase().includes(searchLower) || 
              p.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
          }
          
          if (filters.difficulty && filters.difficulty !== 'all') {
            filteredProblems = filteredProblems.filter(p => p.difficulty === filters.difficulty);
          }
          
          if (filters.tags) {
            const tagsLower = filters.tags.toLowerCase();
            filteredProblems = filteredProblems.filter(p => 
              p.tags.some(tag => tag.toLowerCase().includes(tagsLower))
            );
          }
        }
        
        return filteredProblems;
      } catch (error) {
        console.error("Error fetching problems:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};

export default useGetProblemListing;
