
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Users, FileCode, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChallengeCardProps {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  createdBy: {
    id: string;
    username: string;
    profileImage?: string;
  };
  participants: number;
  problemCount: number;
  createdAt: string;
}

const ChallengeCard = ({
  id,
  title,
  difficulty,
  createdBy,
  participants,
  problemCount,
  createdAt
}: ChallengeCardProps) => {
  // Define difficulty class mappings
  const difficultyClasses = {
    Easy: "bg-green-500 text-white dark:bg-green-600",
    Medium: "bg-amber-500 text-white dark:bg-amber-600",
    Hard: "bg-red-500 text-white dark:bg-red-600"
  };

  // Format relative time (e.g., "2 hours ago", "1 day ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
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
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <div className="flex items-center gap-2">
              <img 
                src={createdBy.profileImage || "https://i.pravatar.cc/150?img=1"} 
                alt={createdBy.username}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-muted-foreground">Created by {createdBy.username}</span>
            </div>
          </div>
          <div className={cn(
            "text-xs font-medium px-3 py-1.5 rounded-full",
            difficultyClasses[difficulty]
          )}>
            {difficulty}
          </div>
        </div>
        
        <div className="grid grid-cols-2 mb-4 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-zinc-500" />
            <span>{participants} participants</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FileCode className="w-4 h-4 text-zinc-500" />
            <span>{problemCount} problems</span>
          </div>
          <div className="flex items-center gap-2 text-sm col-span-2">
            <Clock className="w-4 h-4 text-zinc-500" />
            <span>Created {formatRelativeTime(createdAt)}</span>
          </div>
        </div>
        
        <Button variant="default" className="w-full gap-2 bg-green-500 hover:bg-green-600">
          <span className="h-4 w-4" aria-hidden="true">⚡</span>
          Start Coding
        </Button>
      </div>
    </div>
  );
};

export default ChallengeCard;
