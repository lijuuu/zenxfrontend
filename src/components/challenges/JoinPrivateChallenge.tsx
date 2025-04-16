
import React, { useState } from 'react';
import { Challenge } from '@/api/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface JoinPrivateChallengeProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (challenge: Challenge) => void;
}

const JoinPrivateChallenge: React.FC<JoinPrivateChallengeProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [accessCode, setAccessCode] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a mock challenge for demo purposes
    const challenge = {
      id: `chal-${Date.now()}`,
      title: 'Private Challenge',
      difficulty: 'Medium' as const,
      createdBy: {
        id: '1',
        username: 'otherUser',
        profileImage: 'https://i.pravatar.cc/300?img=2'
      },
      participants: 2,
      participantUsers: [],
      problemCount: 3,
      createdAt: new Date().toISOString(),
      isActive: true,
      problems: [],
      isPrivate: true,
      accessCode,
      timeLimit: 60
    };
    
    onSuccess(challenge);
    onClose();
    setAccessCode('');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Private Challenge</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="accessCode">Access Code</Label>
              <Input 
                id="accessCode"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Enter access code"
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={!accessCode.trim()}>Join Challenge</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinPrivateChallenge;
