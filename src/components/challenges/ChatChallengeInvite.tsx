
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { joinChallenge } from "@/api/challengeApi";

interface ChatChallengeInviteProps {
  challengeId: string;
  challengeTitle: string;
  accessCode?: string;
  onJoin?: () => void;
  onDecline?: () => void;
}

const ChatChallengeInvite: React.FC<ChatChallengeInviteProps> = ({
  challengeId,
  challengeTitle,
  accessCode,
  onJoin,
  onDecline
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setLoading(true);
    try {
      const result = await joinChallenge(challengeId, accessCode);

      if (result.success) {
        toast({
          title: "Joined Challenge",
          description: `You've successfully joined "${challengeTitle}"!`
        });
        if (onJoin) onJoin();
      } else {
        toast({
          title: "Failed to Join",
          description: result.message || "Could not join the challenge.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error joining challenge:", error);
      toast({
        title: "Error",
        description: "An error occurred while joining the challenge.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Challenge Invitation</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          You've been invited to join the challenge: <strong>{challengeTitle}</strong>
        </p>
        {accessCode && (
          <p className="text-xs text-muted-foreground mt-1">
            This is a private challenge. The access code will be applied automatically.
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onDecline} disabled={loading}>
          Decline
        </Button>
        <Button size="sm" onClick={handleJoin} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Join Challenge
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChatChallengeInvite;
