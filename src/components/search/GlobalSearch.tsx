
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, User, X, Loader2, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchUsers, SearchUsersResponse } from "@/api/userApi";
import { UserProfile } from "@/store/slices/authSlice";

export interface GlobalSearchProps {
  onClose?: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [totalCount, setTotalCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Focus search input when component mounts
    inputRef.current?.focus();
    
    // Handle click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);
  
  useEffect(() => {
    const handleSearch = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setNextPageToken(undefined);
        return;
      }
      
      setLoading(true);
      try {
        const data = await searchUsers(query);
        setResults(data.users);
        setNextPageToken(data.nextPageToken);
        setTotalCount(data.totalCount);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const timeoutId = setTimeout(handleSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);
  
  const loadMoreResults = async () => {
    if (!nextPageToken || loading) return;
    
    setLoading(true);
    try {
      const data = await searchUsers(query, nextPageToken);
      setResults(prev => [...prev, ...data.users]);
      setNextPageToken(data.nextPageToken);
    } catch (error) {
      console.error("Load more error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim().length >= 2) {
      // Trigger search on Enter key
      const handleSearch = async () => {
        setLoading(true);
        try {
          const data = await searchUsers(query);
          setResults(data.users);
          setNextPageToken(data.nextPageToken);
          setTotalCount(data.totalCount);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setLoading(false);
        }
      };
      
      handleSearch();
    }
  };
  
  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setNextPageToken(undefined);
    inputRef.current?.focus();
  };
  
  return (
    <div 
      ref={searchContainerRef} 
      className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl p-4"
    >
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search users..."
          className="pl-10 pr-10 bg-zinc-800 border-zinc-700"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-zinc-400 hover:text-white"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {loading && results.length === 0 ? (
        <div className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin text-green-500" />
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          <div className="text-sm text-zinc-400">
            Found {totalCount} user{totalCount !== 1 ? 's' : ''}
          </div>
          
          <div className="max-h-96 overflow-y-auto space-y-2">
            {results.map((user) => (
              <Link
                key={user.userID}
                to={`/profile/${user.userName}`}
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-zinc-800 transition-colors"
              >
                <div className="relative">
                  <img
                    src={user.profileImage || user.avatarURL || "https://i.pravatar.cc/300?img=1"}
                    alt={user.userName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {user.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-zinc-900"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-sm text-zinc-400 truncate">@{user.userName}</div>
                </div>
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-green-500" asChild>
                  <div>
                    <UserPlus className="h-4 w-4" />
                  </div>
                </Button>
              </Link>
            ))}
          </div>
          
          {nextPageToken && (
            <div className="pt-2 flex justify-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadMoreResults}
                disabled={loading}
                className="text-zinc-400 border-zinc-700 hover:bg-zinc-800"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "See more results"
                )}
              </Button>
            </div>
          )}
        </div>
      ) : query.trim().length >= 2 ? (
        <div className="p-6 text-center">
          <User className="h-10 w-10 mx-auto mb-2 text-zinc-500 opacity-40" />
          <p className="text-zinc-400">No users found</p>
          <p className="text-xs text-zinc-500 mt-1">Try a different search term</p>
        </div>
      ) : (
        <div className="p-6 text-center">
          <Search className="h-10 w-10 mx-auto mb-2 text-zinc-500 opacity-40" />
          <p className="text-zinc-400">Type at least 2 characters to search</p>
          <p className="text-xs text-zinc-500 mt-1">Search by name, username, or email</p>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
