import React, { useState } from 'react';
import { Challenge } from '@/api/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface CreateChallengeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (challenge: Challenge) => void;
}

const CreateChallengeForm: React.FC<CreateChallengeFormProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [title, setTitle] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a mock challenge for demo purposes
    const challenge = {
      id: `chal-${Date.now()}`,
      title,
      difficulty: 'Medium' as const,
      createdBy: {
        id: '1',
        username: 'currentUser',
        profileImage: 'https://i.pravatar.cc/300?img=1'
      },
      participants: 1,
      participantUsers: [],
      problemCount: 3,
      createdAt: new Date().toISOString(),
      isActive: true,
      problems: [],
      isPrivate: false,
      accessCode: '',
      timeLimit: 60
    };
    
    onSuccess(challenge);
    onClose();
    setTitle('');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Challenge</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Challenge Title</Label>
              <Input 
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter challenge title"
                required
              />
            </div>
            {/* More form fields would go here */}
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={!title.trim()}>Create Challenge</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChallengeForm;
