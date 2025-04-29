
import React from 'react';
import { Challenge } from '@/api/challengeTypes';
import { FileCode, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ChallengeTimer from './ChallengeTimer';

interface ChallengeStatusCardProps {
  challenge: Challenge;
  onTimeWarning: () => void;
  onTimeUp: () => void;
}

const ChallengeStatusCard: React.FC<ChallengeStatusCardProps> = ({
  challenge,
  onTimeWarning,
  onTimeUp
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <Badge variant={challenge.isActive ? "default" : "secondary"} className="mt-1">
            {challenge.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Difficulty</p>
          <Badge variant="outline" className={`mt-1
            ${challenge.difficulty === 'Easy' ? 'text-green-500 border-green-500/30' :
              challenge.difficulty === 'Medium' ? 'text-amber-500 border-amber-500/30' :
                'text-red-500 border-red-500/30'}
          `}>
            {challenge.difficulty}
          </Badge>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Problems</p>
          <div className="flex items-center gap-1 mt-1">
            <FileCode className="h-4 w-4 text-muted-foreground" />
            <span>{challenge.problemIds.length}</span>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Participants</p>
          <div className="flex items-center gap-1 mt-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{challenge.participantIds.length}</span>
          </div>
        </div>
      </div>
      
      {challenge.isActive && challenge.endTime && (
        <div className="mt-2">
          <p className="text-sm font-medium text-muted-foreground mb-2">Time Remaining</p>
          <ChallengeTimer 
            endTime={challenge.endTime} 
            onTimeWarning={onTimeWarning}
            onTimeUp={onTimeUp}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default ChallengeStatusCard;
