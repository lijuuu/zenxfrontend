
import React from 'react';
import { Link } from 'react-router-dom';
import { Challenge } from '@/api/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ChallengeInterfaceProps {
  challenge: Challenge | null;
  isPrivate?: boolean;
  accessCode?: string;
  isLoading?: boolean;
}

const ChallengeInterface: React.FC<ChallengeInterfaceProps> = ({
  challenge,
  isPrivate,
  accessCode,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
          <h2 className="text-xl font-bold">{challenge.title}</h2>
          <p className="text-sm text-muted-foreground">
            {challenge.problemIds.length} problem{challenge.problemIds.length !== 1 ? 's' : ''}
            {challenge.timeLimit ? ` • ${Math.floor(challenge.timeLimit / 60)} minutes` : ''}
            {isPrivate ? ' • Private Challenge' : ''}
          </p>
        </div>
        {challenge.status === 'active' ? (
          <Button variant="default" className="bg-green-500 hover:bg-green-600">
            Continue Challenge
          </Button>
        ) : (
          <Button variant="default">
            Start Challenge
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
