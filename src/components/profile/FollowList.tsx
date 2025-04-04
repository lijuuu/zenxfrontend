import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Check, Loader2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { followUser, unfollowUser } from '@/store/slices/userSlice';
import { getUserFollowers, getUserFollowing } from '@/api/userApi';
import { UserProfile } from '@/api/types';

export interface FollowListProps {
  userId: string;
  type: 'followers' | 'following';
}

const FollowList: React.FC<FollowListProps> = ({ userId, type }) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.profile);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        let fetchedUsers: UserProfile[] = [];
        if (type === 'followers') {
          fetchedUsers = await getUserFollowers(userId);
        } else {
          fetchedUsers = await getUserFollowing(userId);
        }
        setUsers(fetchedUsers);
        setError(null);
      } catch (err) {
        setError('Failed to load users.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userId, type]);

  const handleFollow = (userToFollowId: string) => {
    dispatch(followUser(userToFollowId));
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.userID === userToFollowId ? { ...user, isFriend: true } : user
      )
    );
  };

  const handleUnfollow = (userToUnfollowId: string) => {
    dispatch(unfollowUser(userToUnfollowId));
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.userID === userToUnfollowId ? { ...user, isFriend: false } : user
      )
    );
  };

  const isFollowing = (userId: string) => {
    if (!currentUser?.following) return false;
    
    if (Array.isArray(currentUser.following)) {
      return currentUser.following.includes(userId);
    } else if (typeof currentUser.following === 'number') {
      return false; // Can't check exact follows when it's just a number
    }
    
    return false;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">
        {type === 'followers' ? 'Followers' : 'Following'}
      </h2>
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : users.length === 0 ? (
        <p className="text-muted-foreground">No {type} found.</p>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.userID} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user.avatarURL} alt={user.userName} />
                  <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{user.fullName || `${user.firstName} ${user.lastName}`}</p>
                  <p className="text-sm text-muted-foreground">@{user.userName}</p>
                </div>
              </div>
              {currentUser?.userID !== user.userID && (
                isFollowing(user.userID) ? (
                  <Button variant="outline" size="sm" onClick={() => handleUnfollow(user.userID)}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserMinus className="h-4 w-4 mr-2" />}
                    Unfollow
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => handleFollow(user.userID)}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
                    Follow
                  </Button>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FollowList;
