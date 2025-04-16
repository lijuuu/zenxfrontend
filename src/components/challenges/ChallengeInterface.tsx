
import React from 'react';
import { Challenge } from '@/api/types';

export interface ChallengeInterfaceProps {
  challenge: Challenge | null;
  isPrivate?: boolean;
  accessCode?: string;
}

const ChallengeInterface: React.FC<ChallengeInterfaceProps> = ({ 
  challenge, 
  isPrivate, 
  accessCode 
}) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        {challenge?.title || "Challenge Interface"}
      </h2>
      {challenge ? (
        <div>
          <p>Challenge is loaded and ready to use.</p>
          {isPrivate && (
            <p className="mt-2">This is a private challenge. Access code: {accessCode}</p>
          )}
        </div>
      ) : (
        <p>Loading challenge details...</p>
      )}
    </div>
  );
};

export default ChallengeInterface;
