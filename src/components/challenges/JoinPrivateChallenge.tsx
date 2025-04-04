
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { joinChallengeWithCode } from "@/api/challengeApi";

interface JoinPrivateChallengeProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (challenge: any) => void;
}

const JoinPrivateChallenge: React.FC<JoinPrivateChallengeProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeFound, setCodeFound] = useState(false);
  const [challengeName, setChallengeName] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) return;
    
    setLoading(true);
    try {
      const result = await joinChallengeWithCode(accessCode.trim());
      
      if (result.success && result.challenge) {
        setCodeFound(true);
        setChallengeName(result.challenge.title);
        toast({
          title: "Challenge Found",
          description: `Found challenge: ${result.challenge.title}`,
        });
      } else {
        toast({
          title: "Invalid Code",
          description: "Could not find a challenge with that access code.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to join challenge:", error);
      toast({
        title: "Error",
        description: "Failed to join challenge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleJoin = async () => {
    setLoading(true);
    try {
      const result = await joinChallengeWithCode(accessCode.trim());
      
      if (result.success && result.challenge) {
        toast({
          title: "Success",
          description: `You've joined the challenge: ${result.challenge.title}`,
        });
        
        if (onSuccess) {
          onSuccess(result.challenge);
        }
        
        onClose();
      } else {
        toast({
          title: "Error",
          description: "Failed to join the challenge.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to join challenge:", error);
      toast({
        title: "Error",
        description: "Failed to join challenge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setAccessCode("");
    setCodeFound(false);
    setChallengeName("");
  };
  
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Join Private Challenge</DialogTitle>
          <DialogDescription>
            Enter the access code to join a private coding challenge.
          </DialogDescription>
        </DialogHeader>
        
        {!codeFound ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="access-code" className="text-sm font-medium">
                Access Code
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  id="access-code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Enter access code"
                  className="pl-10"
                  autoComplete="off"
                  maxLength={10}
                />
              </div>
              <p className="text-xs text-zinc-500">
                Access codes are case sensitive. Make sure to enter exactly as provided.
              </p>
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
              <Button type="submit" disabled={loading || !accessCode.trim()}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Verify Code"
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-400">
                  Challenge Found!
                </h4>
                <p className="text-sm text-green-700 dark:text-green-500">
                  {challengeName}
                </p>
              </div>
            </div>
            
            <p className="text-sm text-center">
              You can now join this private challenge.
            </p>
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                }}
                disabled={loading}
              >
                Back
              </Button>
              <Button onClick={handleJoin} disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Join Challenge"
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JoinPrivateChallenge;
