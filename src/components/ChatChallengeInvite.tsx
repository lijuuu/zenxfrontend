
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Trophy, ArrowRight, Lock, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { joinChallenge, joinChallengeWithCode } from "@/api/challengeApi";

interface ChatChallengeInviteProps {
  challengeId: string;
  challengeTitle: string;
  isPrivate?: boolean;
  accessCode?: string;
}

const ChatChallengeInvite: React.FC<ChatChallengeInviteProps> = ({
  challengeId,
  challengeTitle,
  isPrivate = false,
  accessCode,
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleJoinChallenge = async () => {
    setLoading(true);
    try {
      let result;

      if (isPrivate && accessCode) {
        result = await joinChallengeWithCode(accessCode);
        if (!result.success) {
          toast({
            title: "Error",
            description: "Invalid access code or challenge not found",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      } else {
        result = await joinChallenge(challengeId);
      }

      toast({
        title: "Success",
        description: `Joined challenge: ${challengeTitle}`,
      });

      // Navigate to the challenges page with the active challenge
      navigate(`/challenges?challenge=${challengeId}`);
    } catch (error) {
      console.error("Failed to join challenge:", error);
      toast({
        title: "Error",
        description: "Failed to join challenge",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`border rounded-md p-3 mt-2 ${
      isPrivate 
        ? "border-amber-200 bg-amber-50/50 dark:bg-amber-900/10 dark:border-amber-800/50" 
        : "border-blue-200 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800/50"
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <Trophy className={`h-5 w-5 ${isPrivate ? "text-amber-500" : "text-blue-500"}`} />
        <h3 className="font-medium">{challengeTitle}</h3>
        {isPrivate && (
          <Badge variant="outline" className="border-amber-300 dark:border-amber-700 ml-auto">
            <Lock className="h-3 w-3 mr-1" /> Private
          </Badge>
        )}
      </div>
      
      <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 mb-3 gap-3">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Challenge Invite</span>
        </div>
        {accessCode && (
          <div className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            <span>Code: {accessCode}</span>
          </div>
        )}
      </div>
      
      <Button 
        size="sm" 
        className={`w-full ${isPrivate ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-500 hover:bg-blue-600"}`}
        onClick={handleJoinChallenge}
        disabled={loading}
      >
        <Users className="mr-1 h-3 w-3" />
        Join Challenge
        <ArrowRight className="ml-1 h-3 w-3" />
      </Button>
    </div>
  );
};

export default ChatChallengeInvite;
