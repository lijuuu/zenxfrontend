import React from 'react';
import { UserProfile } from '@/api/types';

interface ProfileAchievementsProps {
  profile: UserProfile;
}

const ProfileAchievements: React.FC<ProfileAchievementsProps> = ({ profile }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Achievements</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="text-lg font-semibold">Solved Problems</h3>
          <p>Easy: {profile?.stats?.easy?.solved || 0}</p>
          <p>Medium: {profile?.stats?.medium?.solved || 0}</p>
          <p>Hard: {profile?.stats?.hard?.solved || 0}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Contests</h3>
          <p>Weekly: {profile?.achievements?.weeklyContests || 0}</p>
          <p>Monthly: {profile?.achievements?.monthlyContests || 0}</p>
          <p>Special Events: {profile?.achievements?.specialEvents || 0}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Badges</h3>
          <div className="flex flex-wrap">
            {profile?.badges?.map((badge, index) => (
              <div key={index} className="mr-2 mb-2">
                <img src={badge.icon} alt={badge.name} className="h-8 w-8" title={badge.description} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAchievements;
