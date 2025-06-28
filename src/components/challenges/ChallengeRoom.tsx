
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Clock, Users, User, Play, Trophy, ArrowLeft } from "lucide-react";
import { useCurrentChallengeInfo, useIsCreator } from "@/services/useCurrentChallengeInfo";
import { useStartChallenge, useParticipantProfiles } from "@/services/useChallenges";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const ChallengeRoom = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  
  // Fetch challenge details with regular polling
  const { 
    data: challengeData, 
    isLoading, 
    error, 
    refetch 
  } = useCurrentChallengeInfo(challengeId, true, 10000);
  
  // Check if current user is the creator
  const { isCreator } = useIsCreator(
    challengeId, 
    challengeData?.challenge?.creatorId
  );
  
  // Get participant profiles
  const { data: participants } = useParticipantProfiles(
    challengeId, 
    challengeData?.challenge?.participantIds
  );
  
  // Start challenge mutation
  const startChallengeMutation = useStartChallenge();
  
  const handleStartChallenge = async () => {
    if (!challengeId) return;
    
    try {
      await startChallengeMutation.mutateAsync(challengeId);
      toast.success("Challenge started successfully");
      // You would navigate to the actual challenge interface here
      // navigate(`/challenge/${challengeId}/play`);
    } catch (error) {
      console.error("Failed to start challenge:", error);
    }
  };
  
  const handleBackToList = () => {
    navigate("/challenges");
  };
  
  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </div>
    );
  }
  
  if (error || !challengeData) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Error Loading Challenge</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't load the challenge details. Please try again.
        </p>
        <Button onClick={handleBackToList}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Challenges
        </Button>
      </div>
    );
  }
  
  const { challenge, leaderboard, userMetadata } = challengeData;
  
  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={handleBackToList}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Challenges
          </Button>
          
          {challenge.isActive && (
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
              Active
            </Badge>
          )}
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{challenge.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4" /> 
                  Time Limit: {Math.floor(challenge.timeLimit / 60)} minutes
                </CardDescription>
              </div>
              <Badge className={
                challenge.difficulty === "Easy" ? "bg-green-500/10 text-green-600 border-green-200" :
                challenge.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-600 border-yellow-200" :
                "bg-red-500/10 text-red-600 border-red-200"
              }>
                {challenge.difficulty}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {challenge.creatorId.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Created by {isCreator ? 'You' : challenge.creatorId.substring(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(challenge.createdAt * 1000).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span className="text-sm">{challenge.problemIds.length} Problems</span>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" /> Participants ({participants?.length || 0})
              </h3>
              
              {participants && participants.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {participants.map((participant) => (
                    <div key={participant.userID} className="flex items-center gap-2 p-2 rounded-md border">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>
                          {participant.firstName?.substring(0, 1) || participant.userID.substring(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm truncate">
                        {participant.firstName || participant.userID.substring(0, 8)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Waiting for participants to join...</p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center pt-2 pb-4">
            {isCreator ? (
              <Button 
                className="w-full max-w-md" 
                onClick={handleStartChallenge}
                disabled={startChallengeMutation.isPending}
              >
                {startChallengeMutation.isPending ? (
                  "Starting Challenge..."
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Start Challenge
                  </>
                )}
              </Button>
            ) : (
              <div className="text-center w-full">
                <p className="text-sm text-muted-foreground mb-2">
                  Waiting for the challenge creator to start the challenge
                </p>
                <Skeleton className="h-8 w-full max-w-md mx-auto rounded-md bg-primary/10" />
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ChallengeRoom;
