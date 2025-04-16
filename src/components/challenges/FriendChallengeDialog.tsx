
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface FriendChallengeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const FriendChallengeDialog: React.FC<FriendChallengeDialogProps> = ({ 
  isOpen, 
  onClose 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Challenge a Friend</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>This feature will be implemented soon.</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FriendChallengeDialog;
