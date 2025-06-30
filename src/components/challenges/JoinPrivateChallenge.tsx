import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield, Check, Castle } from "lucide-react";
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
import { joinChallenge } from "@/api/challengeApi";
import { Challenge } from "@/api/challengeTypes";
import { useNavigate } from "react-router";

interface JoinPrivateChallengeProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (challenge: Challenge) => void;
}

const JoinPrivateChallenge: React.FC<JoinPrivateChallengeProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [accessCode, setAccessCode] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeFound, setCodeFound] = useState(false);
  const [challengeName, setChallengeName] = useState("");
  const [gameRoomLink, setGameRoomLink] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim() || !challengeId.trim()) return;

    setLoading(true);
    try {
      const result = {
        success: true,
        gameRoomLink: "https://google.com",
      };

      if (result.success) {
        setCodeFound(true);
        setChallengeName(`Challenge with code ${accessCode}`);
        setGameRoomLink(result.gameRoomLink);
        toast({
          title: "Challenge Found",
          description: `Found challenge with access code: ${accessCode}`,
          className: "bg-green-50 text-green-800",
        });
      } else {
        toast({
          title: "Invalid Code",
          description: "Could not find a challenge with that access code.",
          variant: "destructive",
          className: "bg-red-50 text-red-800",
        });
      }
    } catch (error) {
      console.error("Failed to join challenge:", error);
      toast({
        title: "Error",
        description: "Failed to join challenge. Please try again.",
        variant: "destructive",
        className: "bg-red-50 text-red-800",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    setLoading(true);
    try {
      const result = await joinChallenge(challengeId, accessCode.trim());

      if (result.success) {
        toast({
          title: "Success",
          description: "You've joined the challenge successfully!",
          className: "bg-green-50 text-green-800",
        });

        if (onSuccess) {
          const challenge: Challenge = {
            id: challengeId,
            title: challengeName,
            creatorId: "",
            difficulty: "Medium",
            isPrivate: true,
            status: "active",
            problemIds: [],
            timeLimit: 3600,
            createdAt: Date.now() / 1000,
            isActive: true,
            participantIds: [],
          };
          onSuccess(challenge);
        }
        onClose();
      } else {
        toast({
          title: "Error",
          description: "Failed to join challenge.",
          variant: "destructive",
          className: "bg-red-50 text-red-800",
        });
      }
    } catch (error) {
      console.error("Failed to join challenge:", error);
      toast({
        title: "Error",
        description: "Failed to join challenge. Please try again.",
        variant: "destructive",
        className: "bg-red-50 text-red-800",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGameRoom = () => {
    if (gameRoomLink) {
      navigate(gameRoomLink);
    }
  };

  const resetForm = () => {
    setAccessCode("");
    setChallengeId("");
    setCodeFound(false);
    setChallengeName("");
    setGameRoomLink("");
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
      <DialogContent className="sm:max-w-md p-6 bg-white dark:bg-zinc-800 rounded-lg">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Join Private Challenge
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
            Enter the challenge ID and access code to join a private coding challenge.
          </DialogDescription>
        </DialogHeader>

        {!codeFound ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="challenge-id"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Challenge ID
                </label>
                <div className="relative mt-1">
                  <Castle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    id="challenge-id"
                    value={challengeId}
                    onChange={(e) => setChallengeId(e.target.value)}
                    placeholder="Enter challenge ID"
                    className="pl-10 h-10 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    autoComplete="off"
                    maxLength={10}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="access-code"
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Access Code
                </label>
                <div className="relative mt-1">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    id="access-code"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="Enter access code"
                    className="pl-10 h-10 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    autoComplete="off"
                    maxLength={10}
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="h-10 border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !accessCode.trim() || !challengeId.trim()}
                className="h-10 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300 dark:disabled:bg-blue-900"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Verify Code"
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-5">
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-md flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-300">
                  Challenge Found!
                </h4>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {challengeName}
                </p>
              </div>
            </div>
            <p className="text-sm text-center text-zinc-600 dark:text-zinc-400">
              You can now join this private challenge.
            </p>
            {gameRoomLink && (
              <Button
                onClick={handleJoinGameRoom}
                disabled={loading}
                className="w-full h-10 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white disabled:opacity-50"
              >
                Join Game Room
              </Button>
            )}
            <DialogFooter className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={loading}
                className="h-10 border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              >
                Back
              </Button>
             
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JoinPrivateChallenge;