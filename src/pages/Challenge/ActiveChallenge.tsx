import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Code, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useChallengeWebSocket } from "@/services/useChallengeWebsocket";
import { useAuth } from "@/hooks/useAuth";
import { sendWSEvent } from "@/lib/wsHandler";
import { PUSH_NEW_CHAT } from "@/lib/ws";
import Cookies from "js-cookie";
import Loader3 from "@/components/ui/loader3";
import ParticipantGrid from "@/components/challenges/ParticipantGrid";
import ChallengeSidebar from "@/components/challenges/ChallengeSidebar";
import ProblemCard from "@/components/challenges/ProblemCard";

const ActiveChallenge = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [problemIds, setProblemIds] = useState<string[]>([]);
  const [abandonOverlay, setAbandonOverlay] = useState({ visible: false, countdown: 5 });
  
  const accessToken = Cookies.get("accessToken");
  const challengeToken = Cookies.get(`challenge_token_${challengeId}`);
  
  const {
    wsStatus,
    challenge,
    err,
    latency,
    addLocalChatMessage,
  } = useChallengeWebSocket({
    userProfile,
    challengeid: challengeId || "",
    password: "",
    accessToken,
    setParticipantIds,
    setProblemIds,
    setAbandonOverlay,
  });

  // Countdown for abandon overlay
  useEffect(() => {
    if (!abandonOverlay.visible) return;
    if (abandonOverlay.countdown <= 0) {
      navigate("/challenges");
      return;
    }
    const timer = setTimeout(() => {
      setAbandonOverlay((prev) => ({ ...prev, countdown: prev.countdown - 1 }));
    }, 1000);
    return () => clearTimeout(timer);
  }, [abandonOverlay, navigate]);

  const handleSendMessage = (text: string) => {
    if (!userProfile || !challengeId || !challengeToken) return;
    
    const payload = {
      userId: userProfile.userId,
      challengeId,
      challengeToken,
      message: text,
    };
    
    sendWSEvent(PUSH_NEW_CHAT, payload, (response) => {
      if (response?.success) {
        addLocalChatMessage({
          userId: userProfile.userId,
          profilePic: userProfile.profileImage,
          message: text,
          time: Math.floor(Date.now() / 1000),
        });
      }
    });
  };

  const handleProblemClick = (problemId: string) => {
    navigate(`/playground?problemId=${problemId}&challengeId=${challengeId}`);
  };

  // Loading state
  if (wsStatus === "Connecting" || !challenge) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader3 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-zinc-400">Connecting to challenge...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (err || wsStatus === "Error") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-5 w-5" />
              Connection Error
            </CardTitle>
            <CardDescription>{err || "Failed to connect to challenge"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/challenges")} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Challenges
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Abandon overlay
  if (abandonOverlay.visible) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Card className="max-w-md w-full bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-center">Challenge Abandoned</CardTitle>
            <CardDescription className="text-center">
              The challenge creator has abandoned this challenge
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-4xl font-bold text-primary mb-4">{abandonOverlay.countdown}</p>
            <p className="text-sm text-zinc-400">Redirecting to challenges...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const participants = Object.entries(challenge?.participants || {}).map(([userId, data]: [string, any]) => ({
    userId,
    firstName: data?.firstName,
    profileImage: data?.profileImage,
  }));

  const chatMessages = Array.isArray(challenge?.chat) ? challenge.chat : [];
  const notifications = Array.isArray(challenge?.notifications) ? challenge.notifications : [];
  const leaderboard = Array.isArray(challenge?.leaderboard) ? challenge.leaderboard : [];
  const problems = challenge?.processedProblemIds || [];

  const timeRemaining = challenge?.startTime && challenge?.timeLimit
    ? Math.max(0, (challenge.startTime * 1000 + challenge.timeLimit) - Date.now())
    : 0;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <div className="h-14 border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-sm px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/challenges")}
            className="text-zinc-400 hover:text-zinc-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="font-semibold text-lg">{challenge?.title || "Challenge"}</h1>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Clock className="h-3 w-3" />
              {Math.floor(timeRemaining / 60000)}:{String(Math.floor((timeRemaining % 60000) / 1000)).padStart(2, '0')} remaining
              {latency !== null && (
                <span className="ml-2">• Latency: {latency}ms</span>
              )}
            </div>
          </div>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
          {challenge?.status || "Active"}
        </Badge>
      </div>

      {/* Main Content */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Main Content */}
        <ResizablePanel defaultSize={70} minSize={50}>
          <div className="h-full overflow-auto p-4 space-y-4">
            {/* Participant Grid */}
            <ParticipantGrid participants={participants} maxParticipants={30} />

            {/* Problems Section */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Problems
                </CardTitle>
                <CardDescription>
                  Solve {problems.length} problems to win this challenge
                </CardDescription>
              </CardHeader>
              <CardContent>
                {problems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {problems.map((problemId: string) => (
                      <ProblemCard
                        key={problemId}
                        problemId={problemId}
                        userProgress={challenge?.participants?.[userProfile?.userId]?.problemsDone?.[problemId]}
                        onClick={() => handleProblemClick(problemId)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-zinc-500">
                    <Code className="h-12 w-12 mx-auto mb-3 text-zinc-700" />
                    <p>No problems assigned yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ResizablePanel>

        <ResizableHandle className="w-1 bg-zinc-800 hover:bg-zinc-700" />

        {/* Right Panel - Sidebar */}
        <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
          <ChallengeSidebar
            notifications={notifications}
            leaderboard={leaderboard}
            chatMessages={chatMessages}
            currentUserId={userProfile?.userId}
            onSendMessage={handleSendMessage}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ActiveChallenge;
