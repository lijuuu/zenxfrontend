
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Check } from 'lucide-react';

interface ChatBattleNotificationProps {
  challengeId: string;
  challengeTitle: string;
  senderName: string;
  onAccept: () => void;
  onDecline: () => void;
}

const ChatBattleNotification: React.FC<ChatBattleNotificationProps> = ({
  challengeId,
  challengeTitle,
  senderName,
  onAccept,
  onDecline
}) => {
  return (
    <div className="border border-border rounded-lg p-4 mb-4 bg-card">
      <h4 className="font-medium mb-2">Challenge Invitation</h4>
      <p className="text-sm text-muted-foreground mb-4">
        <span className="font-medium">{senderName}</span> invites you to join the challenge: <span className="font-medium">{challengeTitle}</span>
      </p>
      <div className="flex space-x-2">
        <Button 
          size="sm" 
          variant="default"
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={onAccept}
        >
          <Check className="h-4 w-4 mr-1" /> Accept
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          className="w-full"
          onClick={onDecline}
        >
          <X className="h-4 w-4 mr-1" /> Decline
        </Button>
      </div>
    </div>
  );
};

export default ChatBattleNotification;
