
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Challenge } from '@/api/challengeTypes';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, FileCode, Clock, Lock } from 'lucide-react';
import { useStartChallenge } from '@/services/useChallenges';
import { Badge } from '@/components/ui/badge';
import ZenXPlayground from '../playground/ZenXPlayground';

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
      <ZenXPlayground/>
    </div>
  );
};

export { ChallengeInterface };
