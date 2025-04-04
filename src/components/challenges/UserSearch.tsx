
import React, { useState } from 'react';
import { User } from '@/api/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface UserSearchProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const UserSearch: React.FC<UserSearchProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim().length >= 2) {
      onSearch(query);
    }
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      <Button
        onClick={handleSearch}
        className="accent-color"
        disabled={query.length < 2 || isLoading}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </Button>
    </div>
  );
};

export default UserSearch;
