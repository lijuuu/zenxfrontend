import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Clock, Users, ArrowLeft, RefreshCw, Play, MessageSquare, Trophy, Bell } from "lucide-react";
import { useGetUserProfile } from "@/services/useGetUserProfile";
import { useGetUserProfileMetadataBulk } from "@/services/useGetUserProfileMetadataBulk";
import { useAuth } from "@/hooks/useAuth";
import { useChallengeWebSocket } from "@/services/useChallengeWebsocket";
import { sendWSEvent } from "@/lib/wsHandler";
import { PUSH_NEW_CHAT, CHALLENGE_STARTED } from "@/constants/eventTypes";
import { useGetBulkProblemMetadata } from "@/services/useGetBulkProblemMetadata";
import ProblemListing from "./BulkMetaDataProblemListing";
import ChatPanel from "@/components/challenges/ChatPanel";
import LeaderboardPanel from "@/components/challenges/LeaderboardPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChallengeLobby: React.FC = () => {
  const { challengeid, password } = useParams<{ challengeid: string; password?: string }>();
  const accessToken = Cookies.get("accessToken");
  const { data: userProfile } = useGetUserProfile();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  //state management
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [problemIds, setProblemIds] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number>(0);
  const [lobbyCountdown, setLobbyCountdown] = useState<number>(0);
  const [abandonOverlay, setAbandonOverlay] = useState<{ visible: boolean; countdown: number }>({
    visible: false,
    countdown: 5,
  });
  const [finishedOverlay, setFinishedOverlay] = useState<{ visible: boolean; countdown: number }>({
    visible: false,
    countdown: 10,
  });
  const [chatInput, setChatInput] = useState<string>("");

  //websocket connection
  const {
    wsStatus,
    outgoingEvents,
    subscribedEvents,
    challenge,
    err,
    latency,
    sendRefetchChallenge,
    addLocalChatMessage
  } = useChallengeWebSocket({
    userProfile,
    challengeid,
    password,
    accessToken,
    setParticipantIds,
    setProblemIds,
    setAbandonOverlay,
    setFinishedOverlay,
  });

  //data fetching
  const { data: participants } = useGetUserProfileMetadataBulk(participantIds);
  const { data: problemsMetadata } = useGetBulkProblemMetadata(problemIds);

  //authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to join a challenge.");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  //abandon overlay countdown
  useEffect(() => {
    if (!abandonOverlay.visible) return;

    if (abandonOverlay.countdown <= 0) {
      navigate("/challenges");
      return;
    }

    const timer = setInterval(() => {
      setAbandonOverlay((prev) => ({
        ...prev,
        countdown: prev.countdown - 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [abandonOverlay, navigate]);

  //finished overlay countdown
  useEffect(() => {
    if (!finishedOverlay.visible) return;

    if (finishedOverlay.countdown <= 0) {
      navigate("/challenges");
      return;
    }

    const timer = setInterval(() => {
      setFinishedOverlay((prev) => ({
        ...prev,
        countdown: prev.countdown - 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [finishedOverlay, navigate]);

  //lobby and challenge countdown timers
  useEffect(() => {
    if (!challenge?.startTime) return;
    const startMs = challenge.startTime * 1000;
    const endMs = challenge.timeLimit ? startMs + challenge.timeLimit : undefined;

    const tick = () => {
      const now = Date.now();
      const untilStart = Math.max(0, Math.floor((startMs - now) / 1000));
      setLobbyCountdown(untilStart);
      if (endMs && now >= startMs) {
        const remaining = Math.max(0, Math.floor((endMs - now) / 1000));
        setCountdown(remaining);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [challenge?.startTime, challenge?.timeLimit]);

  //utility functions
  const handleBack = () => {
    navigate("/challenges");
  };

  const getLatencyColor = () => {
    if (latency === null) return "text-gray-400";
    if (latency < 150) return "text-green-500";
    if (latency < 400) return "text-yellow-400";
    return "text-red-500";
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  const handleSendChat = (text: string) => {
    if (!userProfile || !challengeid || !text.trim()) return;

    const payload: any = {
      userId: userProfile.userId,
      challengeId: challengeid,
      profilePic: userProfile?.profileImage || "",
      message: text.trim(),
    };

    if (challenge?.challengeToken) {
      payload.challengeToken = challenge.challengeToken;
    }

    sendWSEvent(PUSH_NEW_CHAT, payload);
    addLocalChatMessage({
      userId: payload.userId,
      profilePic: payload.profilePic,
      message: payload.message,
      time: Math.floor(Date.now() / 1000),
    });
    setChatInput("");
  };

  const handleForceStart = () => {
    if (!userProfile || !challengeid) return;
    const payload: any = {
      userId: userProfile.userId,
      challengeId: challengeid,
    };
    if (challenge?.challengeToken) payload.challengeToken = challenge.challengeToken;
    sendWSEvent(CHALLENGE_STARTED, payload);
  };

  const isChallengeStarted = challenge && Date.now() >= (challenge.startTime * 1000);
  const isChallengeFinished = challenge?.status === 'FINISHED';
  const isCreator = userProfile?.userId === challenge?.creatorId;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/*header section*/}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleBack}
              variant="outline"
              size="sm"
              className="border-zinc-700 text-zinc-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Challenges
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">{challenge?.title || "Challenge Lobby"}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={challenge?.isPrivate ? "destructive" : "secondary"}>
                  {challenge?.isPrivate ? "Private" : "Public"}
                </Badge>
                {isChallengeFinished && (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200">
                    Finished
                  </Badge>
                )}
                <span className="text-sm text-zinc-400">
                  Connection: {wsStatus} <span className={getLatencyColor()}>
                    ({latency !== null ? `${latency}ms` : "N/A"})
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={sendRefetchChallenge}
              variant="outline"
              size="sm"
              disabled={!userProfile}
              className="border-zinc-700 text-zinc-300 hover:text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/*participants section - main priority during join phase*/}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="h-6 w-6" />
              Participants ({participants?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {participants && participants.length > 0 ? (
                participants.map((user) => (
                  <div key={user.userId} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={user.profileImage || user.avatarURL || "/avatar.png"}
                        alt={user.userName || user.firstName || "User"}
                      />
                      <AvatarFallback className="bg-zinc-700 text-zinc-300 text-lg">
                        {(user.userName || user.firstName || "U").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <p className="text-sm font-medium text-white truncate max-w-[80px]">
                        {user.userName || user.firstName || user.userId?.slice(0, 8) || "Unknown"}
                      </p>
                      {user.userId === challenge?.creatorId && (
                        <Badge variant="outline" className="text-xs mt-1">
                          Creator
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <Users className="h-12 w-12 text-zinc-500 mx-auto mb-3" />
                  <p className="text-zinc-400 text-sm">No participants yet.</p>
                  <p className="text-zinc-500 text-xs mt-1">Waiting for players to join...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/*error display*/}
        {err && (
          <Card className="bg-red-900/20 border-red-800">
            <CardContent className="pt-6">
              <pre className="text-red-300 text-sm whitespace-pre-wrap">
                {JSON.stringify(err, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/*lobby vs challenge content*/}
        {isChallengeFinished ? (
          <Card className="bg-gradient-to-br from-amber-900/80 to-amber-800/60 border-amber-700">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl text-amber-400">
                <Trophy className="h-6 w-6" />
                Challenge Finished
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-amber-300 mb-6 text-lg">The challenge has ended!</p>
                {challenge?.finalLeaderboard && challenge.finalLeaderboard.length > 0 && (
                  <div className="bg-amber-800/50 rounded-2xl p-6 border border-amber-700/50">
                    <h3 className="font-semibold text-white mb-4">Final Results</h3>
                    <div className="space-y-2">
                      {challenge.finalLeaderboard.slice(0, 5).map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-amber-700/30 rounded">
                          <span className="text-sm font-medium">
                            {index === 0 && "🥇"} {index === 1 && "🥈"} {index === 2 && "🥉"}
                            {index > 2 && `${index + 1}.`} {entry.userName || entry.userId}
                          </span>
                          <span className="text-sm font-bold text-amber-300">{entry.score || 0} pts</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : !isChallengeStarted ? (
          <Card className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/60 border-zinc-700">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Clock className="h-6 w-6" />
                Challenge Starting Soon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-zinc-300 mb-6 text-lg">Waiting for the challenge to start...</p>
                <div className="bg-zinc-800/50 rounded-2xl p-8 border border-zinc-700/50">
                  <div className="text-6xl font-bold text-green-400 mb-4 font-mono">
                    {formatTime(Math.max(0, lobbyCountdown))}
                  </div>
                  <p className="text-lg text-zinc-400">Challenge starts in</p>
                </div>
              </div>

              {isCreator && (
                <div className="flex justify-center">
                  <Button
                    onClick={handleForceStart}
                    size="lg"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Force Start Challenge
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <ProblemListing problemsMetadata={problemsMetadata || []} />
        )}

        {/*challenge details and chat - side by side layout*/}
        {challenge && (
          <div className={`grid gap-6 ${isChallengeStarted && !isChallengeFinished ? 'grid-cols-1 xl:grid-cols-3' : 'grid-cols-1 lg:grid-cols-2'}`}>
            {/*challenge details - left side during join phase*/}
            <div className={isChallengeStarted && !isChallengeFinished ? 'xl:col-span-2' : ''}>
              <Card className="bg-zinc-900/50 border-zinc-800 h-96">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Challenge Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full flex flex-col">
                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <p className="text-sm text-zinc-400">Start Time</p>
                        <p className="text-white font-medium">
                          {new Date(challenge.startTime * 1000).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-zinc-400">Time Limit</p>
                        <p className="text-white font-medium">
                          {formatTime(Math.floor((challenge.timeLimit || 0) / 1000))}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-zinc-400">
                          {isChallengeStarted ? "Time Remaining" : "Starts In"}
                        </p>
                        <p className="text-white font-medium text-lg">
                          {formatTime(isChallengeStarted ? countdown : lobbyCountdown)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/*chat panel - right side during join phase*/}
            <div>
              <Card className="bg-zinc-900/50 border-zinc-800 h-96">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Chat
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <ChatPanel
                    messages={Array.isArray(challenge?.chat) ? challenge.chat : []}
                    onSend={handleSendChat}
                    currentUserId={userProfile?.userId}
                  />
                </CardContent>
              </Card>
            </div>

            {/*leaderboard and notifications - only show when game starts but not finished*/}
            {isChallengeStarted && !isChallengeFinished && (
              <div className="space-y-6">
                {/*leaderboard - only visible after game starts*/}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Leaderboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LeaderboardPanel
                      entries={challenge?.leaderboard || []}
                      currentUserId={userProfile?.userId}
                    />
                  </CardContent>
                </Card>

                {/*notifications*/}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notifications
                      <Badge variant="secondary" className="ml-auto">
                        {Array.isArray(challenge?.notifications) ? challenge.notifications.length : 0}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {Array.isArray(challenge?.notifications) && challenge.notifications.length > 0 ? (
                        challenge.notifications.map((notification: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                            <div className="text-xs text-zinc-400 mb-1">
                              {new Date((notification.time || notification.Time || 0) * 1000).toLocaleString()}
                            </div>
                            <div className="text-sm">
                              <Badge variant="outline" className="mr-2 text-xs">
                                {notification.type || notification.Type}
                              </Badge>
                              {notification.message || notification.Message}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-zinc-400 text-sm text-center py-4">No notifications yet.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/*abandon overlay modal*/}
        {abandonOverlay.visible && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <Card className="bg-zinc-900 border-zinc-700 max-w-md mx-4">
              <CardHeader>
                <CardTitle className="text-center text-red-400">Challenge Abandoned</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-zinc-300">
                  The challenge owner has abandoned the challenge.
                </p>
                <p className="text-lg font-semibold text-white">
                  Redirecting in {abandonOverlay.countdown} seconds...
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/*finished overlay modal*/}
        {finishedOverlay.visible && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <Card className="bg-zinc-900 border-zinc-700 max-w-lg mx-4">
              <CardHeader>
                <CardTitle className="text-center text-green-500 flex items-center justify-center gap-2">
                  <Trophy className="h-6 w-6" />
                  Challenge Finished!
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-zinc-300">
                  The challenge has ended. Check the final results below.
                </p>
                {challenge?.finalLeaderboard && challenge.finalLeaderboard.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-white">Final Results</h3>
                    <div className="space-y-1">
                      {challenge.finalLeaderboard.slice(0, 3).map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-zinc-800 rounded">
                          <span className="text-sm">
                            {index === 0 && "🥇"} {index === 1 && "🥈"} {index === 2 && "🥉"}
                            {entry.userName || entry.userId}
                          </span>
                          <span className="text-sm font-medium">{entry.score || 0} pts</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-lg font-semibold text-white">
                  Redirecting in {finishedOverlay.countdown} seconds...
                </p>
                <Button
                  onClick={() => navigate("/challenges")}
                  className="w-full mt-4"
                  variant="outline"
                >
                  Go to Challenges Now
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeLobby;
