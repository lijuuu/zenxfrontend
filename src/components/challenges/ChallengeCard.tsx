
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Users, FileCode, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Challenge } from "@/api/types";
import { useUserProfile, useUserProfiles } from "@/hooks/useUserProfiles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChallengeCardProps {
  challenge: Challenge;
}

const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  // Fetch creator profile
  const { data: creatorProfile } = useUserProfile(challenge.creatorId);
  
  // Fetch participant profiles
  const { profiles: participantProfiles } = useUserProfiles(challenge.participantIds || []);

  // Define difficulty class mappings
  const difficultyClasses = {
    Easy: "bg-green-500 text-white dark:bg-green-600",
    Medium: "bg-amber-500 text-white dark:bg-amber-600",
    Hard: "bg-red-500 text-white dark:bg-red-600"
  };

  // Format relative time (e.g., "2 hours ago", "1 day ago")
  const formatRelativeTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  };

  return (
    <div className="bg-card dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={creatorProfile?.profileImage} />
                <AvatarFallback>{creatorProfile?.username?.[0] || '?'}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                Created by {creatorProfile?.username || 'Unknown'}
              </span>
            </div>
          </div>
          <div className={cn(
            "text-xs font-medium px-3 py-1.5 rounded-full",
            difficultyClasses[challenge.difficulty as keyof typeof difficultyClasses]
          )}>
            {challenge.difficulty}
          </div>
        </div>
        
        <div className="grid grid-cols-2 mb-4 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-zinc-500" />
            <span>{challenge.participantIds?.length || 0} participants</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FileCode className="w-4 h-4 text-zinc-500" />
            <span>{challenge.problemIds?.length || 0} problems</span>
          </div>
          <div className="flex items-center gap-2 text-sm col-span-2">
            <Clock className="w-4 h-4 text-zinc-500" />
            <span>Created {formatRelativeTime(challenge.createdAt)}</span>
          </div>
        </div>

        {challenge.participantIds && challenge.participantIds.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex -space-x-2">
              {challenge.participantIds.slice(0, 3).map((userId) => {
                const profile = participantProfiles[userId];
                return (
                  <Avatar key={userId} className="h-6 w-6 border-2 border-background">
                    <AvatarImage src={profile?.profileImage} />
                    <AvatarFallback>{profile?.username?.[0] || '?'}</AvatarFallback>
                  </Avatar>
                );
              })}
              {challenge.participantIds.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                  +{challenge.participantIds.length - 3}
                </div>
              )}
            </div>
            <span className="text-xs text-muted-foreground">Participating</span>
          </div>
        )}
        
        <Button variant="default" className="w-full gap-2 bg-green-500 hover:bg-green-600">
          <span className="h-4 w-4" aria-hidden="true">⚡</span>
          Start Coding
        </Button>
      </div>
    </div>
  );
};

export default ChallengeCard;
