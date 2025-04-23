
import { Link } from "react-router-dom";
import { format, fromUnixTime } from "date-fns";
import { Users, FileCode, Clock, Lock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Challenge } from "@/api/challengeTypes";
import { useUserProfiles } from "@/hooks/useUserProfiles";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/utils/formattedDate";


interface ChallengeCardProps {
  challenge: Challenge;
  onJoin?: () => void;
  variant?: "default" | "private";
  isLoading?: boolean;
}

export const ChallengeCard = ({ challenge, onJoin, variant = "default", isLoading = false }: ChallengeCardProps) => {
  const { data: userProfiles, isLoading: profilesLoading } = useUserProfiles([challenge.creatorId, ...(challenge.participantIds || [])]);

  const creator = userProfiles?.find(profile => profile.userID === challenge.creatorId);


  const formattedDate = formatDate(challenge.createdAt);
  console.log(formattedDate)


  if (isLoading) {
    return (
      <Card className="hover:shadow-md transition-shadow animate-pulse">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-5 w-16 rounded" />
          </div>
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16 mt-2" />
              </div>
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20 mt-2" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Skeleton className="h-8 w-32" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "hover:shadow-md transition-shadow",
      variant === "private" && "border-amber-200/30 dark:border-amber-800/30"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {challenge.title}
            {challenge.isPrivate && <Lock className="h-4 w-4 text-amber-500" />}
          </CardTitle>
          <div className={cn(
            "px-2 py-1 text-xs font-medium rounded",
            variant === "private" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" :
              "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
          )}>
            {challenge.difficulty}
          </div>
        </div>
        <CardDescription className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {challenge.createdAt ? `Created: ${formattedDate}` : "Recently created"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {profilesLoading ? (
              <Skeleton className="w-8 h-8 rounded-full" />
            ) : (
              <img
                src={creator?.avatarURL || "https://github.com/shadcn.png"}
                alt={creator?.userName || "Unknown"}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div>
              {profilesLoading ? (
                <>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16 mt-1" />
                </>
              ) : (
                <>
                  <p className="text-sm font-medium">{creator?.userName || "Unknown"}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Created by</p>
                </>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="text-sm">{challenge.participantIds?.length || 0} participants</span>
              <Users className="h-4 w-4 text-zinc-500" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{challenge.problemIds?.length || 0} problems</span>
              <FileCode className="h-4 w-4 text-zinc-500" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          size="sm"
          onClick={onJoin}
          className={cn(
            variant === "private" ? "bg-amber-500 hover:bg-amber-600" : "bg-green-500 hover:bg-green-600"
          )}
        >
          {challenge.isActive ? "Continue" : "Join"} Challenge
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChallengeCard;
