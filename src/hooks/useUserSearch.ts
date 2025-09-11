
import { useState, useCallback } from 'react';
import { searchUsers, SearchUsersResponse } from '@/api/userApi';
import { UserProfile } from '@/store/slices/authSlice';
import { useToast } from '@/hooks/useToast';

export interface UseUserSearchResult {
  query: string;
  setQuery: (query: string) => void;
  results: UserProfile[];
  loading: boolean;
  error: any;
  hasMore: boolean;
  totalCount: number;
  searchUsers: () => Promise<void>;
  loadMore: () => Promise<void>;
  clearSearch: () => void;
}

export const useUserSearch = (): UseUserSearchResult => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const performSearch = useCallback(async () => {
    if (query.trim().length < 2) {
      setResults([]);
      setNextPageToken(undefined);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await searchUsers(query);
      setResults(response.users || []);
      setNextPageToken(response.nextPageToken);
      setTotalCount(response.totalCount || 0);
    } catch (err) {
      console.error('Search error:', err);
      setError(err);
      toast({
        title: 'Search failed',
        description: 'Unable to find users at this time. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [query, toast]);

  const loadMore = useCallback(async () => {
    if (!nextPageToken || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await searchUsers(query, nextPageToken);
      setResults(prev => [...prev, ...(response.users || [])]);
      setNextPageToken(response.nextPageToken);
    } catch (err) {
      console.error('Load more error:', err);
      setError(err);
      toast({
        title: 'Failed to load more results',
        description: 'Unable to load additional users. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [nextPageToken, loading, query, toast]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setNextPageToken(undefined);
    setTotalCount(0);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    hasMore: !!nextPageToken,
    totalCount,
    searchUsers: performSearch,
    loadMore,
    clearSearch
  };
};
