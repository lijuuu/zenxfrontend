import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, User, Loader2, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchUsers } from "@/api/userApi";
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
    inputRef.current?.focus();
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

  const AvatarFallback = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${className}`}>
      {children}
    </div>
  );

  const getInitials = (user: UserProfile) => {
    if (user.firstName && user.lastName)
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    if (user.userName)
      return user.userName[0].toUpperCase();
    return "U";
  };

  return (
    <div
      ref={searchContainerRef}
      className="w-full max-w-2xl bg-black border border-zinc-800 rounded-lg shadow-xl p-4"
    >
      {/* search input */}
      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input
          type="text"
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search users..."
          className="pl-9 pr-9 bg-zinc-800 border-zinc-700 text-white focus:ring-0"
        />
      </div>

      {/* results */}
      {loading && results.length === 0 ? (
        <div className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin text-green-500" />
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          <div className="max-h-96 overflow-y-auto space-y-2">
            {results.map((user) => (
              <Link
                key={user.userId}
                to={`/profile/${user.userName}`}
                onClick={onClose}
                className="group flex items-center gap-3 p-3 hover:bg-zinc-800 transition-colors"
              >
                <div className="relative">
                  {user.profileImage || user.avatarURL ? (
                    <img
                      src={user.profileImage || user.avatarURL}
                      alt={user.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-green-900/30 text-green-500">{getInitials(user)}</AvatarFallback>
                  )}
                  {user.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-zinc-900"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white">
                    {user.firstName || user.lastName
                      ? `${user.firstName || ""} ${user.lastName || ""}`
                      : user.userName}
                  </div>
                  <div className="text-sm text-zinc-400 truncate">@{user.userName}</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-zinc-500 group-hover:text-white rotate-45 group-hover:rotate-6 transition-transform" />
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
