
import React, { useEffect, useState } from 'react';
import { fetchUserChallenges } from '@/api/challengeApi';
import { Challenge } from '@/api/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChallengesListProps {
  userId: string;
}

const ChallengesList: React.FC<ChallengesListProps> = ({ userId }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const userChallenges = await fetchUserChallenges(userId);
        setChallenges(userChallenges);
      } catch (error) {
        console.error("Failed to load challenges:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChallenges();
  }, [userId]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Challenges</h3>
      
      {loading ? (
        <p className="text-sm text-zinc-500">Loading challenges...</p>
      ) : challenges.length > 0 ? (
        <div className="space-y-4">
          {challenges.map(challenge => (
            <Card key={challenge.id} className="bg-zinc-800/50">
              <CardHeader className="p-4">
                <CardTitle className="text-md">{challenge.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-zinc-400">{challenge.description}</p>
                <div className="flex justify-between mt-2 text-xs text-zinc-500">
                  <span>Difficulty: {challenge.difficulty}</span>
                  <span>
                    {typeof challenge.participants === 'number' 
                      ? `${challenge.participants} participants` 
                      : `${challenge.participants.length} participants`}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500">
          No challenges found for this user.
        </p>
      )}
    </div>
  );
};

export default ChallengesList;
