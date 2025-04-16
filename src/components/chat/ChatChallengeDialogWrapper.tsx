
import React from 'react';
import ChatChallengeDialog from './ChatChallengeDialog';
import { Challenge } from '@/hooks/useChallengeSystem';

// Create a wrapper component with correct prop types
interface ChatChallengeDialogWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (challenge: Challenge) => void;
}

const ChatChallengeDialogWrapper: React.FC<ChatChallengeDialogWrapperProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  // Transform the props to match what ChatChallengeDialog expects
  const handleCreateChallenge = (challenge: any) => {
    onSuccess(challenge as Challenge);
  };

  return (
    <ChatChallengeDialog
      isOpen={isOpen}
      onClose={onClose}
      onCreateChallenge={handleCreateChallenge}
    />
  );
};

export default ChatChallengeDialogWrapper;
