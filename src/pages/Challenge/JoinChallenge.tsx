import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useGetUserProfile } from "@/services/useGetUserProfile";
import { useGetUserProfileMetadataBulk } from "@/services/useGetUserProfileMetadataBulk";
import { useAuth } from "@/hooks/useAuth";
import { useChallengeWebSocket } from "@/services/useChallengeWebsocket";
import { useGetBulkProblemMetadata } from "@/services/useGetBulkProblemMetadata";

import ProblemListing from "./BulkMetaDataProblemListing";
import UserListing from "./BulkMetaDataUserListing";


interface LogPanelProps {
  title: string;
  items: string[];
}

const LogPanel: React.FC<LogPanelProps> = ({ title, items }) => (
  <div>
    <h2 className="text-sm font-semibold mb-1">{title}</h2>
    <div className="bg-gray-900 text-white p-2 rounded max-h-64 overflow-y-auto text-xs whitespace-pre-wrap">
      {items.length === 0 ? <p className="text-gray-400">None</p> : items.map((msg, i) => <pre key={i} className="mb-2">{msg}</pre>)}
    </div>
  </div>
);

const JoinChallenge: React.FC = () => {
  const { challengeid, password } = useParams<{ challengeid: string; password?: string }>();
  const accessToken = Cookies.get("accessToken");
  const { data: userProfile } = useGetUserProfile();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [problemIds, setProblemIds] = useState<string[]>([])
  const [countdown, setCountdown] = useState<number>(0);
  const [abandonOverlay, setAbandonOverlay] = useState<{ visible: boolean; countdown: number }>({
    visible: false,
    countdown: 5,
  });

  // WebSocket hook
  const { wsStatus, outgoingEvents, subscribedEvents, challenge, err, latency, sendRefetchChallenge } = useChallengeWebSocket({
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

  // Challenge countdown timer
  useEffect(() => {
    if (!challenge?.startTime || !challenge?.timeLimit) return;

    const endTime = challenge.startTime * 1000 + challenge.timeLimit;

    const tick = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setCountdown(remaining);
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

  return (
    <div className="p-4 space-y-4 text-sm">
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

      <div className="space-y-1">
        <p><strong>Challenge ID:</strong> {challengeid || "N/A"}</p>
        <p><strong>Challenge Name: </strong> {challenge?.title}</p>
        <p><strong>Private: </strong> {challenge?.isPrivate?"true":"false"}</p>
        <p><strong>Password:</strong> {password || "None"}</p>
        <p><strong>Access Token:</strong> {accessToken || "Missing"}</p>
        <p><strong>WebSocket Status:</strong> {wsStatus}</p>
        <p>
          <strong>Latency:</strong>{" "}
          <span className={latencyColor}>{latency !== null ? `${latency} ms` : "N/A"}</span>
        </p>
      </div>

      <ProblemListing problemsMetadata={problemsMetadata || []} />
      <UserListing participants={participants} challenge={challenge} />


      {challenge && (
        <div className="space-y-1">
          <p><strong>Start Time:</strong> {new Date(challenge.startTime * 1000).toLocaleString()}</p>
          <p><strong>Time Limit:</strong> {formatSeconds(Math.floor(challenge.timeLimit / 1000))}</p>
          <p><strong>Countdown:</strong> {formatSeconds(countdown)}</p>
        </div>
      )}

      {err && (
        <pre className="bg-gray-900 text-white p-2 rounded text-xs whitespace-pre-wrap">
          {JSON.stringify(err, null, 2)}
        </pre>
      )}

      {challenge && (
        <pre className="bg-gray-900 text-white p-2 rounded text-xs whitespace-pre-wrap">
          {JSON.stringify(challenge, null, 2)}
        </pre>
      )}


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LogPanel title="📤 Outgoing Events" items={outgoingEvents} />
        <LogPanel title="📡 Subscribed Events" items={subscribedEvents} />
      </div>

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