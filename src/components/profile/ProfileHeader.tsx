import React from 'react';
import { UserProfile } from '@/api/types';

interface ProfileHeaderProps {
  profile: UserProfile | null;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  return (
    <div className="flex items-center space-x-4">
      <img
        src={profile?.avatarURL || profile?.profileImage || "https://i.pravatar.cc/150?img=7"}
        alt="Profile"
        className="w-20 h-20 rounded-full object-cover"
      />
      <div>
        <h2 className="text-2xl font-semibold">{profile?.fullName || profile?.username || 'User'}</h2>
        <p className="text-sm text-gray-500">@{profile?.userName}</p>
        {profile?.bio && <p className="mt-2">{profile.bio}</p>}
      </div>
    </div>
  );
};

export default ProfileHeader;
