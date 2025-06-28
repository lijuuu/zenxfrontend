
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, X } from 'lucide-react';
import { Challenge } from '@/api/challengeTypes';

interface ChallengeActionsProps {
  challenge: Challenge;
  currentUserId: string | undefined;
  onStartChallenge: () => void;
  onForfeitChallenge: () => void;
}

const ChallengeActions: React.FC<ChallengeActionsProps> = ({
  challenge,
  currentUserId,
  onStartChallenge,
  onForfeitChallenge
}) => {
  return (
    <div className="space-y-3">
      {currentUserId === challenge.creatorId && !challenge.isActive && (
        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white group transition-all"
          onClick={onStartChallenge}
        >
          <motion.div 
            animate={{ rotate: [0, 15, 0] }} 
            transition={{ repeat: Infinity, duration: 3, repeatDelay: 1 }}
            className="mr-2"
          >
            <Play className="h-4 w-4" />
          </motion.div>
          Start Challenge
        </Button>
      )}

      {challenge.isActive && (
        <Button
          className="w-full bg-red-600 hover:bg-red-700 text-white group transition-all"
          onClick={onForfeitChallenge}
        >
          <motion.div 
            whileHover={{ rotate: [0, 45, 0] }}
            className="mr-2"
          >
            <X className="h-4 w-4" />
          </motion.div>
          Forfeit Challenge
        </Button>
      )}
    </div>
  );
};

export default ChallengeActions;
