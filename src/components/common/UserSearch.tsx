
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, User, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchUsers } from "@/api/challengeApi";
import { User as UserType } from "@/api/types";

interface UserSearchProps {
  onSelect?: (user: UserType) => void;
  className?: string;
  withLink?: boolean;
}

const UserSearch: React.FC<UserSearchProps> = ({ 
  onSelect, 
  className = "",
  withLink = true
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const handleSearch = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const data = await searchUsers(query);
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const timeoutId = setTimeout(handleSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setFocused(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleUserSelect = (user: UserType) => {
    if (onSelect) {
      onSelect(user);
    }
    
    setQuery("");
    setResults([]);
    setFocused(false);
  };
  
  const clearSearch = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };
  
  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="pl-10 pr-10"
          onFocus={() => setFocused(true)}
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {focused && (query.trim().length >= 2 || results.length > 0) && (
        <div className="absolute z-10 top-full mt-1 w-full bg-white dark:bg-zinc-900 shadow-lg rounded-md border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-72 overflow-y-auto">
              {results.map((user) => (
                <div
                  key={user.id}
                  className="p-2 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="relative">
                    <img
                      src={user.profileImage || "https://i.pravatar.cc/300?img=1"}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {user.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{user.fullName}</div>
                    <div className="text-sm text-zinc-500 truncate">@{user.username}</div>
                  </div>
                  {withLink && (
                    <Link
                      to={`/profile/${user.username}`}
                      className="text-xs text-blue-600 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Profile
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ) : query.trim().length >= 2 ? (
            <div className="p-4 text-center text-zinc-500">
              <User className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p>No users found</p>
              <p className="text-xs">Try a different search term</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
