import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchUserProfile } from '@/store/slices/userSlice';
import { UserProfile } from '@/api/types';
import MainNavbar from '@/components/MainNavbar';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileAchievements from '@/components/profile/ProfileAchievements';
import ChallengesList from '@/components/profile/ChallengesList';
import FollowList from '@/components/profile/FollowList';

const Profile = () => {
  const { userId } = useParams<{ userId?: string }>();
  const dispatch = useAppDispatch();
  const { profile: currentUser, status } = useAppSelector(state => state.user);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (userId) {
        // Fetch profile for the specified userId
        dispatch(fetchUserProfile(userId));
      } else if (!currentUser) {
        // If no userId and no current user, fetch current user's profile
        dispatch(fetchUserProfile(currentUser?.userID || ''));
      }
    };

    loadProfile();
  }, [dispatch, userId, currentUser]);

  useEffect(() => {
    // Update profileData when currentUser changes
    if (currentUser) {
      setProfileData(currentUser);
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-zinc-950">
      <MainNavbar />
      <div className="container mx-auto px-4 py-8">
        {status === 'loading' ? (
          <div className="text-center">Loading profile...</div>
        ) : (
          <>
            <ProfileHeader user={profileData} />

            {profileData && (
              <>
                <ProfileAchievements 
                  user={profileData} // Changed from profile to user
                />
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div>
                <ChallengesList userId={userId || currentUser?.userID || ''} />
              </div>
              <div>
                <FollowList 
                  userId={userId || currentUser?.userID || ''} 
                  type="followers" // Added type prop
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
