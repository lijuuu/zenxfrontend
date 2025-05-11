import { useQuery } from "@tanstack/react-query";
import { getUserSubmissions } from "@/api/submissionApi";
import { Submission } from "@/api/types";


// Updated useRecentSubmissions hook
interface UseRecentSubmissionsOptions {
  userId: string;
  page?: number;
  limit?:number;
}

export const useRecentSubmissions = ({
  userId,
  page = 1,
  limit
}: UseRecentSubmissionsOptions) => {
  return useQuery<Submission[], Error>({
    queryKey: ['submissions', userId, page],
    queryFn: () => getUserSubmissions(userId, "", page, limit),
    enabled: !!userId,
    refetchOnMount: true, // refetches when component remounts
    refetchOnWindowFocus: 'always', // refetches every time window regains focus
  });
};
