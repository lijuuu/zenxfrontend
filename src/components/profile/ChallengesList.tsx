import React from 'react';

interface ChallengesListProps {
  userId: string;
}

const ChallengesList: React.FC<ChallengesListProps> = ({ userId }) => {
  return (
    <div>
      {/* Challenges List Content */}
      <h3 className="text-lg font-semibold mb-4">Challenges</h3>
      <p className="text-sm text-zinc-500">
        This is a placeholder for the challenges list.
        Implementation will follow in subsequent tasks.
      </p>
    </div>
  );
};

export default ChallengesList;
