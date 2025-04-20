
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, Trophy, User } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ChallengeBattleInviteProps {
  challengeId: string;
  challengeTitle: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  onAccept?: () => void;
  onDecline?: () => void;
}

const ChallengeBattleInvite: React.FC<ChallengeBattleInviteProps> = ({
  challengeId,
  challengeTitle,
  sender,
  onAccept,
  onDecline
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      // Here we would actually have API logic to accept the invitation
      toast({
        title: "Challenge Accepted",
        description: `You've accepted the challenge from ${sender.name}!`
      });
      if (onAccept) onAccept();
    } catch (error) {
      console.error("Error accepting challenge:", error);
      toast({
        title: "Error",
        description: "An error occurred while accepting the challenge.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4 border-amber-500/30">
      <CardHeader className="pb-2 bg-amber-50 dark:bg-amber-900/20">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Challenge Battle
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
            {sender.avatar ? (
              <img src={sender.avatar} alt={sender.name} className="h-full w-full object-cover" />
            ) : (
              <User className="h-6 w-6 text-zinc-500" />
            )}
          </div>
          <div>
            <p className="font-medium">{sender.name}</p>
            <p className="text-xs text-muted-foreground">has challenged you!</p>
          </div>
        </div>
        <p className="text-sm">
          <span className="font-semibold">{challengeTitle}</span> - Do you accept this coding challenge?
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onDecline} disabled={loading}>
          Decline
        </Button>
        <Button size="sm" className="bg-amber-500 hover:bg-amber-600" onClick={handleAccept} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Accept Challenge
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChallengeBattleInvite;
