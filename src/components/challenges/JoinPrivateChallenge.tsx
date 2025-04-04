
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Challenge } from '@/api/types';
import { joinChallengeWithCode } from '@/api/challengeApi';

interface JoinPrivateChallengeProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (challenge: Challenge) => void;
}

const JoinPrivateChallenge: React.FC<JoinPrivateChallengeProps> = ({ isOpen, onClose, onSuccess }) => {
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) return;
    
    setLoading(true);
    try {
      const response = await joinChallengeWithCode(accessCode.trim());
      if (response.success && response.challenge) {
        toast({
          title: "Challenge Joined",
          description: `You have successfully joined the challenge "${response.challenge.title}"`,
        });
        
        if (onSuccess) {
          onSuccess(response.challenge);
        }
        
        onClose();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to join the challenge. Please check your access code.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to join challenge:", error);
      toast({
        title: "Error",
        description: "Failed to join the challenge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Lock className="w-5 h-5 mr-2 text-amber-500" />
            Join Private Challenge
          </DialogTitle>
          <DialogDescription>
            Enter the access code to join a private challenge.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="access-code">Access Code</Label>
            <Input
              id="access-code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Enter access code"
              className="w-full"
              required
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                "Join Challenge"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinPrivateChallenge;
