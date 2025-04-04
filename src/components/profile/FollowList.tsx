
import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/api/types';
import { getUserFollowers, getUserFollowing } from '@/api/userApi';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { followUser, unfollowUser } from '@/store/slices/userSlice';
import { toast } from 'sonner';
import { Loader2, Check, UserPlus, X } from 'lucide-react';

interface FollowListProps {
  userId: string;
}

const FollowList: React.FC<FollowListProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('followers');
  const [followers, setFollowers] = useState<UserProfile[]>([]);
  const [following, setFollowing] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.profile);
  
  useEffect(() => {
    setLoading(true);
    if (activeTab === 'followers') {
      getUserFollowers(userId)
        .then(data => {
          setFollowers(data);
          setLoading(false);
        })
        .catch(() => {
          toast.error('Failed to load followers');
          setLoading(false);
        });
    } else {
      getUserFollowing(userId)
        .then(data => {
          setFollowing(data);
          setLoading(false);
        })
        .catch(() => {
          toast.error('Failed to load following');
          setLoading(false);
        });
    }
  }, [userId, activeTab]);
  
  const handleFollow = async (targetUserId: string) => {
    if (!currentUser) return;
    
    setActionLoading(prev => ({ ...prev, [targetUserId]: true }));
    
    try {
      await followUser(targetUserId);
      dispatch(followUser(targetUserId));
      toast.success('User followed successfully');
    } catch (error) {
      toast.error('Failed to follow user');
    } finally {
      setActionLoading(prev => ({ ...prev, [targetUserId]: false }));
    }
  };
  
  const handleUnfollow = async (targetUserId: string) => {
    if (!currentUser) return;
    
    setActionLoading(prev => ({ ...prev, [targetUserId]: true }));
    
    try {
      await unfollowUser(targetUserId);
      dispatch(unfollowUser(targetUserId));
      toast.success('User unfollowed successfully');
    } catch (error) {
      toast.error('Failed to unfollow user');
    } finally {
      setActionLoading(prev => ({ ...prev, [targetUserId]: false }));
    }
  };
  
  const isFollowing = (userId: string) => {
    return currentUser?.following?.includes(userId) || false;
  };
  
  return (
    <div className="bg-zinc-900/40 rounded-lg border border-zinc-800 p-4">
      <Tabs defaultValue="followers" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="followers">
            Followers <Badge className="ml-2">{followers.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="following">
            Following <Badge className="ml-2">{following.length}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="followers" className="mt-0">
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : followers.length === 0 ? (
            <div className="text-center py-6 text-zinc-500">
              <p>No followers yet</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {followers.map(user => (
                <div key={user.userID} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-zinc-800/50">
                  <Link to={`/profile/${user.userName}`} className="flex items-center gap-3">
                    <img 
                      src={user.avatarURL || user.profileImage || "https://i.pravatar.cc/300"} 
                      alt={`${user.firstName} ${user.lastName}`}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
                      <p className="text-sm text-zinc-500">@{user.userName}</p>
                    </div>
                  </Link>
                  
                  {currentUser && currentUser.userID !== user.userID && (
                    isFollowing(user.userID) ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUnfollow(user.userID)}
                        disabled={actionLoading[user.userID]}
                      >
                        {actionLoading[user.userID] ? (
                          <Loader2 className="h-3 w-3 animate-spin mr-2" />
                        ) : (
                          <Check className="h-3 w-3 mr-2" />
                        )}
                        Following
                      </Button>
                    ) : (
                      <Button 
                        size="sm"
                        className="accent-color" 
                        onClick={() => handleFollow(user.userID)}
                        disabled={actionLoading[user.userID]}
                      >
                        {actionLoading[user.userID] ? (
                          <Loader2 className="h-3 w-3 animate-spin mr-2" />
                        ) : (
                          <UserPlus className="h-3 w-3 mr-2" />
                        )}
                        Follow
                      </Button>
                    )
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="following" className="mt-0">
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : following.length === 0 ? (
            <div className="text-center py-6 text-zinc-500">
              <p>Not following anyone yet</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {following.map(user => (
                <div key={user.userID} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-zinc-800/50">
                  <Link to={`/profile/${user.userName}`} className="flex items-center gap-3">
                    <img 
                      src={user.avatarURL || user.profileImage || "https://i.pravatar.cc/300"} 
                      alt={`${user.firstName} ${user.lastName}`}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
                      <p className="text-sm text-zinc-500">@{user.userName}</p>
                    </div>
                  </Link>
                  
                  {currentUser && currentUser.userID !== user.userID && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-950/20"
                      onClick={() => handleUnfollow(user.userID)}
                      disabled={actionLoading[user.userID]}
                    >
                      {actionLoading[user.userID] ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-2" />
                      ) : (
                        <X className="h-3 w-3 mr-2" />
                      )}
                      Unfollow
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FollowList;
