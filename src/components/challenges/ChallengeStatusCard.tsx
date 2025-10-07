
import React from 'react';
import { ChallengeDocument } from '@/api/challengeTypes';
import { FileCode, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ChallengeTimer from './ChallengeTimer';

interface ChallengeStatusCardProps {
  challenge: ChallengeDocument;
  onTimeWarning: () => void;
  onTimeUp: () => void;
}

const ChallengeStatusCard: React.FC<ChallengeStatusCardProps> = ({
  challenge,
  onTimeWarning,
  onTimeUp
}) => {
  const isActive = challenge.status === 'active';
  const participantCount = Object.keys(challenge.participants || {}).length;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <Badge variant={isActive ? "default" : "secondary"} className="mt-1">
            {challenge.status}
          </Badge>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Problems</p>
          <div className="flex items-center gap-1 mt-1">
            <FileCode className="h-4 w-4 text-muted-foreground" />
            <span>{challenge.processedProblemIds?.length || 0}</span>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Participants</p>
          <div className="flex items-center gap-1 mt-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{participantCount}</span>
          </div>
        </div>
      </div>
      
      {isActive && challenge.startTime && challenge.timeLimit && (
        <div className="mt-2">
          <p className="text-sm font-medium text-muted-foreground mb-2">Time Remaining</p>
          <ChallengeTimer 
            endTime={(challenge.startTime * 1000) + challenge.timeLimit}
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
