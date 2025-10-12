import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useGetUserProfile } from "@/services/useGetUserProfile";
import { useGetUserProfileMetadataBulk } from "@/services/useGetUserProfileMetadataBulk";
import { useAuth } from "@/hooks/useAuth";
import { useChallengeWebSocket } from "@/services/useChallengeWebsocket";
import { sendWSEvent } from "@/lib/wsHandler";
import { PUSH_NEW_CHAT, CHALLENGE_STARTED } from "@/lib/ws";
import { useGetBulkProblemMetadata } from "@/services/useGetBulkProblemMetadata";
import ProblemListing from "./BulkMetaDataProblemListing";
import ChatPanel from "@/components/challenges/ChatPanel";
import LeaderboardPanel from "@/components/challenges/LeaderboardPanel";


interface LogPanelProps {
  title: string;
  items: string[];
}

const LogPanel: React.FC<LogPanelProps> = ({ title, items }) => null;
const JoinChallenge: React.FC = () => {
  const { challengeid, password } = useParams<{ challengeid: string; password?: string }>();
  const accessToken = Cookies.get("accessToken");
  const { data: userProfile } = useGetUserProfile();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [problemIds, setProblemIds] = useState<string[]>([])
  const [countdown, setCountdown] = useState<number>(0);
  const [lobbyCountdown, setLobbyCountdown] = useState<number>(0);
  const [abandonOverlay, setAbandonOverlay] = useState<{ visible: boolean; countdown: number }>({
    visible: false,
    countdown: 5,
  });
  const [chatInput, setChatInput] = useState<string>("");


  // WebSocket hook
  const { wsStatus, outgoingEvents, subscribedEvents, challenge, err, latency, sendRefetchChallenge, addLocalChatMessage } = useChallengeWebSocket({
    userProfile,
    challengeid,
    password,
    accessToken,
    setParticipantIds,
    setProblemIds,
    setAbandonOverlay,
  });

  // Fetch participant metadata
  const { data: participants } = useGetUserProfileMetadataBulk(participantIds);
  const { data: problemsMetadata } = useGetBulkProblemMetadata(problemIds);

  // Authentication check on page load
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to join a challenge.");
      navigate("/login"); // Redirect to login page
    }
  }, [isAuthenticated, navigate]);

  // Countdown timer for abandon overlay
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

  // Lobby countdown (to startTime) and challenge countdown (after start)
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

  const handleBack = () => {
    navigate("/challenges");
  };

  const latencyColor =
    latency === null
      ? "text-gray-400"
      : latency < 150
        ? "text-green-500"
        : latency < 400
          ? "text-yellow-400"
          : "text-red-500";

  const formatSeconds = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSendChat = (text: string) => {
    console.debug("handleSendChat called", { userProfile, challengeid, chatInput });
    if (!userProfile) {
      console.debug("handleSendChat: missing userProfile");
      return;
    }
    if (!challengeid) {
      console.debug("handleSendChat: missing challengeid");
      return;
    }
    if (!text.trim()) {
      console.debug("handleSendChat: chatInput is empty or whitespace", text);
      return;
    }
    const payload: any = {
      userId: userProfile.userId,
      challengeId: challengeid,
      profilePic: userProfile?.profileImage || "",
      message: text.trim(),
    };
    console.log(userProfile, challengeid, text.trim())
    // include challengeToken from JOIN_CHALLENGE if present on challenge
    if (challenge?.challengeToken) {
      payload.challengeToken = challenge.challengeToken;
    }
    console.debug('[UI] sending PUSHNEWCHAT payload', payload);
    sendWSEvent(PUSH_NEW_CHAT, payload);
    // optimistic append so sender sees the message immediately
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

  return (
    <div className="p-4 space-y-4 text-sm">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Join Challenge</h1>
        <div className="space-x-2">
          <button
            onClick={sendRefetchChallenge}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50"
            disabled={!userProfile}
          >
            Refetch Challenge
          </button>
          <button
            onClick={handleBack}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
          >
            Back & Reset
          </button>
        </div>
      </div>

      {/* Participant Bar (Battle Royale Style) */}
      <div className="w-full overflow-x-auto py-2 mb-2 border-b border-zinc-800/60 bg-zinc-900/60 rounded flex items-center gap-4">
        {participants && participants.length > 0 ? (
          participants.map((user) => (
            <div key={user.userId} className="flex flex-col items-center min-w-[60px] mx-2">
              <img
                src={user.profileImage || user.avatarURL || "/avatar.png"}
                alt={user.userName || user.firstName || user.userId?.slice(0, 8) || "-"}
                className="h-10 w-10 rounded-full border-2 border-zinc-700 shadow"
              />
              <span className="text-xs mt-1 truncate max-w-[56px] text-center text-zinc-200">
                {user.userName || user.firstName || user.userId?.slice(0, 8) || "-"}
              </span>
            </div>
          ))
        ) : (
          <div className="text-xs text-zinc-500 px-4">No participants yet.</div>
        )}
      </div>

      {/* Challenge Info */}
      <div className="space-y-1">
        <p><strong>Challenge:</strong> {challenge?.title || challengeid || "N/A"}</p>
        <p><strong>Privacy:</strong> {challenge?.isPrivate ? "Private" : "Public"}</p>
        <p><strong>WebSocket:</strong> {wsStatus} <span className={latencyColor}>({latency !== null ? `${latency} ms` : "N/A"})</span></p>
      </div>

      {/* Error Display */}
      {err && (
        <pre className="bg-gray-900 text-white p-2 rounded text-xs whitespace-pre-wrap">
          {JSON.stringify(err, null, 2)}
        </pre>
      )}

      {/* Lobby gating: show problems only after start */}
      {challenge && Date.now() < (challenge.startTime * 1000) ? (
        <div className="border border-zinc-800/50 rounded-lg p-4 bg-zinc-900/40">
          <h2 className="text-lg font-semibold mb-2">Lobby</h2>
          <p className="text-sm text-zinc-300 mb-2">Waiting for the challenge to start...</p>
          <p className="text-2xl font-bold">{`Starts in ${Math.max(0, lobbyCountdown)}s`}</p>
          {userProfile?.userId && userProfile?.userId === challenge?.creatorId && (
            <button
              onClick={handleForceStart}
              className="mt-3 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded"
            >
              Force Start (Owner)
            </button>
          )}
        </div>
      ) : (
        <ProblemListing problemsMetadata={problemsMetadata || []} />
      )}

      {/* Timers and Challenge Meta */}
      {challenge && (
        <div className="flex flex-wrap gap-4 items-center border border-zinc-800/50 rounded-lg p-3 bg-zinc-900/40">
          <div>
            <p><strong>Start Time:</strong> {new Date(challenge.startTime * 1000).toLocaleString()}</p>
            <p><strong>Time Limit:</strong> {formatSeconds(Math.floor((challenge.timeLimit || 0) / 1000))}</p>
          </div>
          <div>
            {Date.now() < (challenge.startTime * 1000) ? (
              <p><strong>Lobby Countdown:</strong> {formatSeconds(lobbyCountdown)}</p>
            ) : (
              <p><strong>Match Countdown:</strong> {formatSeconds(countdown)}</p>
            )}
          </div>
        </div>
      )}

      {/* Main Panels: Chat, Leaderboard, Notifications */}
      {challenge && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Chat Panel */}
          <div className="xl:col-span-2 space-y-4">
            <ChatPanel messages={Array.isArray(challenge?.chat) ? challenge.chat : []} onSend={handleSendChat} currentUserId={userProfile?.userId} />
          </div>

          {/* Leaderboard & Notifications */}
          <div className="space-y-4">
            <LeaderboardPanel entries={challenge?.leaderboard || []} currentUserId={userProfile?.userId} />
            {/* Notifications Panel */}
            <div className="border border-zinc-800/50 rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-950">
              <div className="px-4 py-2 border-b border-zinc-800/60 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Notifications</h2>
                <span className="text-xs text-zinc-400">{Array.isArray(challenge?.notifications) ? challenge.notifications.length : 0}</span>
              </div>
              <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
                {Array.isArray(challenge?.notifications) && challenge.notifications.length > 0 ? (
                  challenge.notifications.map((n: any, idx: number) => (
                    <div key={idx} className="p-2 rounded border border-zinc-800/60">
                      <div className="text-xs text-zinc-400 mb-1">{new Date((n.time || n.Time || 0) * 1000).toLocaleString()}</div>
                      <div className="text-sm">
                        <span className="text-amber-500 mr-1">[{n.type || n.Type}]</span>
                        {n.message || n.Message}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-zinc-500">No notifications yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Abandon Overlay Modal */}
      {abandonOverlay.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Challenge Abandoned</h2>
            <p className="mb-4">The owner has abandoned the challenge. Redirecting to challenges in {abandonOverlay.countdown} seconds...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinChallenge;