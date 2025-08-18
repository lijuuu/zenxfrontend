// http://localhost:7000/api/v1/problems/bulk/metadata

import { useQuery } from '@tanstack/react-query';
import { getBulkProblemMetadata } from '@/api/problem';

export const useGetBulkProblemMetadata = (problemIds: string[]) => {
  const queryKey = ['bulkProblemMetadata:', problemIds];

  return useQuery({
    queryKey,
    queryFn: () => getBulkProblemMetadata(problemIds),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: true,
  });
};

