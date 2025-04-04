
import React from "react";
import { Trophy, Users, Lock, Calendar, ArrowUpRight, User } from "lucide-react";
import { Challenge } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ChallengesListProps {
  challenges: Challenge[];
}

const ChallengesList: React.FC<ChallengesListProps> = ({ challenges }) => {
  // Group challenges by type (public/private)
  const publicChallenges = challenges.filter(c => !c.isPrivate);
  const privateChallenges = challenges.filter(c => c.isPrivate);

  if (challenges.length === 0) {
    return (
      <div className="text-center py-6">
        <Trophy className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
        <h3 className="text-lg font-medium">No challenges yet</h3>
        <p className="text-muted-foreground mt-1">
          Create or join challenges to see them here
        </p>
        <Button className="mt-4 accent-color">
          <Trophy className="mr-2 h-4 w-4" />
          Explore Challenges
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
                  <Badge variant="secondary" className="text-xs py-0">Private</Badge>
                )}
              </div>
              
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(challenge.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{challenge.participants || 0} participants</span>
                </div>
              </div>
              
              <Badge 
                variant="outline" 
                className={`
                  ${challenge.difficulty === 'Easy' ? 'text-green-600 dark:text-green-400' : ''} 
                  ${challenge.difficulty === 'Medium' ? 'text-amber-600 dark:text-amber-400' : ''} 
                  ${challenge.difficulty === 'Hard' ? 'text-red-600 dark:text-red-400' : ''}
                `}
              >
                {challenge.difficulty}
              </Badge>
            </div>
            
            {challenge.participantUsers && challenge.participantUsers.length > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex -space-x-2">
                  {challenge.participantUsers.slice(0, 3).map((user, idx) => (
                    user?.avatar ? (
                      <img 
                        key={idx} 
                        src={user.avatar} 
                        alt={user.name || 'Participant'} 
                        className="w-6 h-6 rounded-full border-2 border-background"
                      />
                    ) : (
                      <div key={idx} className="w-6 h-6 rounded-full bg-accent flex items-center justify-center border-2 border-background">
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
