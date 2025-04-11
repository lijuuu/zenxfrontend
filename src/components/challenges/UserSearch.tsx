
import React from 'react';
import { UserProfile } from '@/api/types';

interface UserSearchProps {
  onSelectUser: (user: UserProfile) => void;
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
