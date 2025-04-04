import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Challenge } from '@/api/types';
import { fetchUserChallenges } from '@/api/challengeApi';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export interface ChallengesListProps {
  userId: string;
}

const ChallengesList: React.FC<ChallengesListProps> = ({ userId }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('created');
  const navigate = useNavigate();

  useEffect(() => {
    const loadChallenges = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch challenges based on userId
        const data = await fetchUserChallenges(userId);
        setChallenges(data);
      } catch (error) {
        console.error('Failed to load challenges:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChallenges();
  }, [userId]);

  const createdChallenges = challenges.filter(c => c.ownerId === userId);
  const participatedChallenges = challenges.filter(c => {
    if (typeof c.participants === 'number') {
      return false; // Can't check if user participated when it's just a count
    }
    return c.participants?.some(p => p.userID === userId);
  });

  const renderChallengeCard = (challenge: Challenge) => (
    <Card key={challenge.id} className="mb-4 hover:bg-zinc-800/50 transition-colors cursor-pointer" onClick={() => navigate(`/challenges/${challenge.id}`)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{challenge.title}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {challenge.description || 'No description provided'}
            </CardDescription>
          </div>
          <Badge variant={challenge.status === 'active' ? 'default' : challenge.status === 'upcoming' ? 'secondary' : 'outline'}>
            {challenge.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-zinc-800/50">
              {challenge.difficulty}
            </Badge>
            <Badge variant="outline" className="bg-zinc-800/50">
              {challenge.type}
            </Badge>
            {challenge.isPrivate && (
              <Badge variant="outline" className="bg-zinc-800/50">
                Private
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {typeof challenge.participants === 'number' ? (
                <span className="text-sm text-zinc-400">{challenge.participants} participants</span>
              ) : (
                challenge.participants?.slice(0, 3).map((participant, i) => (
                  <Avatar key={i} className="h-6 w-6 border border-background">
                    <AvatarImage src={participant.avatarURL} alt={participant.userName} />
                    <AvatarFallback>{participant.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                ))
              )}
              {typeof challenge.participants !== 'number' && challenge.participants && challenge.participants.length > 3 && (
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-zinc-800 text-xs text-zinc-400 border border-background">
                  +{challenge.participants.length - 3}
                </div>
              )}
            </div>
            <span className="text-xs text-zinc-400">
              {challenge.createdAt && formatDistanceToNow(new Date(challenge.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardHeader>
        <CardTitle>Challenges</CardTitle>
        <CardDescription>Challenges created and participated in</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="created">Created</TabsTrigger>
            <TabsTrigger value="participated">Participated</TabsTrigger>
          </TabsList>
          
          <TabsContent value="created" className="space-y-4">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              ))
            ) : createdChallenges.length > 0 ? (
              createdChallenges.map(renderChallengeCard)
            ) : (
              <div className="text-center py-8">
                <p className="text-zinc-400 mb-4">No challenges created yet</p>
                <Button onClick={() => navigate('/challenges/create')}>Create a Challenge</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="participated" className="space-y-4">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              ))
            ) : participatedChallenges.length > 0 ? (
              participatedChallenges.map(renderChallengeCard)
            ) : (
              <div className="text-center py-8">
                <p className="text-zinc-400 mb-4">No challenges participated in yet</p>
                <Button onClick={() => navigate('/challenges')}>Explore Challenges</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ChallengesList;
