
import { useGetProblemListing } from '@/services/useGetProblemListing';

export interface ProblemsFilters {
  search?: string;
  difficulty?: string;
  tags?: string;
}

// Re-export the hook with the same interface to maintain compatibility
export const useProblems = (filters?: ProblemsFilters) => {
  return useGetProblemListing(filters);
};

export default useProblems;
