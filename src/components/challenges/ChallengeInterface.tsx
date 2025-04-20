
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Challenge } from '@/api/challengeTypes';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, FileCode, Clock, Lock } from 'lucide-react';
import { useStartChallenge } from '@/services/useChallenges';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface ChallengeInterfaceProps {
  challenge: Challenge | null;
  isPrivate?: boolean;
  accessCode?: string;
  isLoading?: boolean;
  error?: Error | null;
}

const ChallengeInterface: React.FC<ChallengeInterfaceProps> = ({
  challenge,
  isPrivate,
  accessCode,
  isLoading = false,
  error = null
}) => {
  const navigate = useNavigate();
  const startChallengeMutation = useStartChallenge();

  const handleStartChallenge = async () => {
    if (!challenge) return;
    
    try {
      await startChallengeMutation.mutateAsync(challenge.id);
      // Navigate to the challenge playground or reload the interface
      navigate(`/challenge-playground/${challenge.id}`);
    } catch (error) {
      console.error('Failed to start challenge:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <AlertCircle className="h-10 w-10 text-destructive mb-4" />
        <h3 className="text-xl font-semibold mb-2">Error Loading Challenge</h3>
        <p className="text-muted-foreground mb-6">
          We encountered an error while loading the challenge details.
        </p>
        <Button asChild variant="outline">
          <Link to="/challenges">Return to Challenges</Link>
        </Button>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">No Active Challenge</h3>
        <p className="text-muted-foreground mb-6">
          You don't have an active challenge selected. Join or create a challenge to start coding!
        </p>
        <div className="space-x-4">
          <Button asChild variant="outline">
            <Link to="/challenges">Browse Challenges</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{challenge.title}</h2>
            {challenge.isPrivate && (
              <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                <Lock className="h-3 w-3 mr-1" />
                Private
              </Badge>
            )}
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              {challenge.difficulty}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <span className="flex items-center">
              <FileCode className="h-4 w-4 mr-1" />
              {challenge.problemIds.length} problem{challenge.problemIds.length !== 1 ? 's' : ''}
            </span>
            {challenge.timeLimit ? (
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {Math.floor(challenge.timeLimit / 60)} minutes
              </span>
            ) : null}
            <span>
              {challenge.participantIds.length} participant{challenge.participantIds.length !== 1 ? 's' : ''}
            </span>
          </p>
        </div>
        {challenge.status === 'active' ? (
          <Button 
            variant="default" 
            className="bg-green-500 hover:bg-green-600"
            onClick={() => navigate(`/challenge-playground/${challenge.id}`)}
          >
            Continue Challenge
          </Button>
        ) : (
          <Button 
            variant="default"
            onClick={handleStartChallenge}
            disabled={startChallengeMutation.isPending}
          >
            {startChallengeMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Starting...
              </>
            ) : (
              'Start Challenge'
            )}
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {challenge.problemIds.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {challenge.problemIds.map((problemId, index) => (
              <Card key={problemId} className="hover:shadow-md transition-all">
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Problem {index + 1}</h3>
                    <Button variant="ghost" size="sm">
                      Solve
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <p className="text-sm text-muted-foreground">
                    This is a problem in this challenge.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground">
              No problems found in this challenge.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export { ChallengeInterface };
