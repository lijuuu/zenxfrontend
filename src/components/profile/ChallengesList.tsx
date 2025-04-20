
import React, { useEffect, useState } from "react";
import { Trophy, Users, Lock, Calendar, ArrowUpRight, User } from "lucide-react";
import { Challenge, UserProfile } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { fetchParticipantProfiles } from "@/api/challengeApi";
import { useToast } from "@/hooks/use-toast";

interface ChallengesListProps {
  challenges: Challenge[];
  isLoading?: boolean;
}

const ChallengesList: React.FC<ChallengesListProps> = ({ challenges = [], isLoading = false }) => {
  const { toast } = useToast();
  const [participantProfiles, setParticipantProfiles] = useState<{[key: string]: UserProfile[]}>({});

  // Group challenges by type (public/private)
  const publicChallenges = challenges.filter((c) => !c.isPrivate);
  const privateChallenges = challenges.filter((c) => c.isPrivate);

  // Fetch participant profiles for each challenge
  useEffect(() => {
    const fetchAllParticipants = async () => {
      const profilesMap: {[key: string]: UserProfile[]} = {};
      
      for (const challenge of challenges) {
        if (challenge.participantIds && challenge.participantIds.length > 0) {
          try {
            const profiles = await fetchParticipantProfiles(challenge.participantIds);
            if (profiles.length > 0) {
              profilesMap[challenge.id] = profiles;
              
              // Update the challenge with participant users
              challenge.participantUsers = profiles;
            }
          } catch (error) {
            console.error(`Failed to fetch participants for challenge ${challenge.id}:`, error);
          }
        }
      }
      
      setParticipantProfiles(profilesMap);
    };
    
    if (challenges.length > 0) {
      fetchAllParticipants();
    }
  }, [challenges]);

  if (isLoading) {
    return (
      <div className="text-center py-6">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 bg-muted rounded-full"></div>
          <div className="h-4 w-48 bg-muted rounded"></div>
          <div className="h-3 w-36 bg-muted rounded"></div>
          <div className="h-10 w-40 bg-muted rounded-md"></div>
        </div>
      </div>
    );
  }

  if (!challenges || challenges.length === 0) {
    return (
      <div className="text-center py-6">
        <Trophy className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
        <h3 className="text-lg font-medium">No challenges yet</h3>
        <p className="text-muted-foreground mt-1">
          Create or join challenges to see them here
        </p>
        <Button asChild className="mt-4 accent-color">
          <Link to="/challenges/explore">
            <Trophy className="mr-2 h-4 w-4" />
            Explore Challenges
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium">Challenge Summary</h4>
        <div className="flex space-x-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>Public: {publicChallenges.length}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            <span>Private: {privateChallenges.length}</span>
          </Badge>
        </div>
      </div>

      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
        {challenges.slice(0, 5).map((challenge) => (
          <div
            key={challenge.id}
            className="flex flex-col gap-2 group hover:bg-accent/5 p-3 rounded-md transition-colors border border-border/50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {challenge.isPrivate ? (
                  <Lock className="h-4 w-4 text-amber-500" />
                ) : (
                  <Trophy className="h-4 w-4 text-blue-500" />
                )}
                <span className="text-sm font-medium group-hover:text-accent-color transition-colors">
                  {challenge.title}
                </span>
                {challenge.isPrivate && (
                  <Badge variant="secondary" className="text-xs py-0">
                    Private
                  </Badge>
                )}
              </div>

              <Button asChild variant="ghost" size="icon" className="h-6 w-6">
                <Link to={`/challenges/${challenge.id}`}>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(challenge.createdAt * 1000).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>
                    {challenge.participantIds?.length || 0} participants
                  </span>
                </div>
              </div>

              <Badge
                variant="outline"
                className={`
                  ${challenge.difficulty === "Easy" ? "text-green-600 dark:text-green-400" : ""}
                  ${challenge.difficulty === "Medium" ? "text-amber-600 dark:text-amber-400" : ""}
                  ${challenge.difficulty === "Hard" ? "text-red-600 dark:text-red-400" : ""}
                `}
              >
                {challenge.difficulty}
              </Badge>
            </div>

            {challenge.participantUsers && challenge.participantUsers.length > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex -space-x-2">
                  {challenge.participantUsers.slice(0, 3).map((user, idx) => (
                    user.avatarURL ? (
                      <img
                        key={idx}
                        src={user.avatarURL}
                        alt={user.userName || "Participant"}
                        className="w-6 h-6 rounded-full border-2 border-background"
                      />
                    ) : (
                      <div
                        key={idx}
                        className="w-6 h-6 rounded-full bg-accent flex items-center justify-center border-2 border-background"
                      >
                        <User className="h-3 w-3" />
                      </div>
                    )
                  ))}

                  {challenge.participantUsers.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-xs border-2 border-background">
                      +{challenge.participantUsers.length - 3}
                    </div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">Participating</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChallengesList;
