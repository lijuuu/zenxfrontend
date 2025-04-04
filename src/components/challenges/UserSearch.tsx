
import React from 'react';
import { User } from '@/api/types';

interface UserSearchProps {
  onSelectUser: (user: User) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onSelectUser }) => {
  return (
    <div>
      {/* This is a placeholder component that will be implemented later */}
      <p>User search component placeholder</p>
    </div>
  );
};

export default UserSearch;
