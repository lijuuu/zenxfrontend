import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { initWSHandler, sendWSEvent } from "../lib/wsHandler";
import {
  getWS,
  JOIN_CHALLENGE,
  USER_JOINED,
  PING_SERVER,
  RETRIEVE_CHALLENGE,
  USER_LEFT,
  OWNER_LEFT,
  OWNER_JOINED,
  CREATOR_ABANDON,
} from "../lib/ws";
import { useWSEvent } from "../hooks/useWSEvent";
import { toast } from "sonner";
import { useGetUserProfile } from "@/services/useGetUserProfile";

// this is the data we send to server when we want to do something
interface WSPayload {
  userId: string;
  challengeId: string;
  password: string;
  token: string;
}

// this is how server sends us data
interface WSResponse {
  type: string;
  status?: string;
  payload?: any;
  error?: string;
}

// what to do when server sends us a particular event
const eventCallbacks: Record<string, (response: WSResponse, context: any) => void> = {
  // when server replies to our ping, we calculate time taken
  [PING_SERVER]: (_, { setLatency, pingSentAtRef }) => {
    setLatency(Date.now() - pingSentAtRef.current);
  },

  // server replied to our join request
  [JOIN_CHALLENGE]: (response, { setChallenge, setError, setOutgoingEvents }) => {
    console.log(response)
    setOutgoingEvents((prev: string[]) => [
      JSON.stringify({ type: JOIN_CHALLENGE, payload: response }, null, 2),
      ...prev.slice(0, 50),
    ]);
    if (response.status === "error" && response.error) {
      setError(response.error);
      toast.error(`Failed to join challenge: ${response.error}`);
    } else if (response?.payload?.challenge) {
      setChallenge(response?.payload.challenge);
      toast.success("Successfully joined challenge!");
    }
  },

  // server sent us updated challenge data
  [RETRIEVE_CHALLENGE]: (response, { setChallenge, setError, setOutgoingEvents }) => {
    setOutgoingEvents((prev: string[]) => [
      JSON.stringify({ type: RETRIEVE_CHALLENGE, payload: response?.payload }, null, 2),
      ...prev.slice(0, 50),
    ]);
    if (response.status === "error" && response.error) {
      setError(response.error);
      toast.error(`Failed to refetch challenge: ${response.error}`);
    } else if (response?.payload?.challenge) {
      setChallenge(response?.payload.challenge);
    }
  },
};

const JoinChallenge: React.FC = () => {
  const { challengeid, password } = useParams<{ challengeid: string; password?: string }>();
  const accessToken = Cookies.get("accessToken");
  const { data: userProfile } = useGetUserProfile();
  const wsRef = useRef<WebSocket | null>(null);
  const pingSentAtRef = useRef<number>(0);
  const navigate = useNavigate();

  // state for ws status, logs, challenge data, etc
  const [wsStatus, setWsStatus] = useState("Connecting");
  const [outgoingEvents, setOutgoingEvents] = useState<string[]>([]);
  const [subscribedEvents, setSubscribedEvents] = useState<string[]>([]);
  const [challenge, setChallenge] = useState<any>();
  const [err, setError] = useState<string>();
  const [latency, setLatency] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number>(0); // this will show time left
  const [abandonOverlay, setAbandonOverlay] = useState<{ visible: boolean; countdown: number }>({
    visible: false,
    countdown: 5, // 5 seconds countdown for redirect
  });



  useEffect(() => {
    if (!userProfile) {
      setWsStatus("Connecting");
      return;
    }

    // start websocket
    initWSHandler();
    wsRef.current = getWS();
    const ws = wsRef.current;

    // handle incoming msg from server
    const handleMessage = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data) as WSResponse;
        if (eventCallbacks[data.type]) {
          eventCallbacks[data.type](data, { setChallenge, setError, setOutgoingEvents, setLatency, pingSentAtRef });
        }
      } catch {
        toast.error("Something went wrong");
      }
    };

    // when ws is ready, send join request
    const handleOpen = () => {
      setWsStatus("Open");
      const payload: WSPayload = {
        userId: userProfile.userId,
        challengeId: challengeid,
        password: password || "",
        token: `Bearer ${accessToken}`,
      };
      sendWSEvent(JOIN_CHALLENGE, payload, (response) =>
        eventCallbacks[JOIN_CHALLENGE](response, { setChallenge, setError, setOutgoingEvents })
      );
    };

    // attach ws listeners
    ws.addEventListener("open", handleOpen);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("error", () => setWsStatus("Error"));
    ws.addEventListener("close", () => setWsStatus("Closed"));

    // ping server every 3s
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        pingSentAtRef.current = Date.now();
        sendWSEvent(PING_SERVER, {}, (response) =>
          eventCallbacks[PING_SERVER](response, { setLatency, pingSentAtRef })
        );
      }
    }, 3000);

    // cleanup everything on unmount
    return () => {
      clearInterval(pingInterval);
      ws.removeEventListener("open", handleOpen);
      ws.removeEventListener("message", handleMessage);
      ws.removeEventListener("error", () => { });
      ws.removeEventListener("close", () => { });
      ws.close();
    };
  }, [userProfile, challengeid, password, accessToken]);

  // subscribe to any event and run a custom callback (e.g. for toast, state update, etc.)
  const useSubscribeToEvent = (
    event: string,
    callback: (payload: any) => void
  ) => {
    useWSEvent(event, (payload) => {
      setSubscribedEvents((prev) => [
        JSON.stringify({ event, payload }, null, 2),
        ...prev.slice(0, 50),
      ]);
      sendRefetchChallenge(); // still trigger refetch
      callback(payload);
    });
  };

  // usage examples
  useSubscribeToEvent(USER_JOINED, (payload) =>
    toast.success(`User joined: ${payload?.userId || "unknown"}`)
  );
  useSubscribeToEvent(USER_LEFT, (payload) =>
    toast.success(`User left: ${payload?.userId || "unknown"}`)
  );
  useSubscribeToEvent(OWNER_LEFT, (payload) =>
    toast.success(`Owner left: ${payload?.userId || "unknown"}`)
  );
  useSubscribeToEvent(OWNER_JOINED, (payload) =>
    toast.success(`Owner joined: ${payload?.userId || "unknown"}`)
  );
  useSubscribeToEvent(CREATOR_ABANDON, (payload) => {
    toast.success(`Owner abandoned: ${payload?.userId || "unknown"}`);
    setAbandonOverlay({ visible: true, countdown: 5 }); // Show overlay with 5s countdown
  });

  // Handle countdown for abandon overlay
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

  // manual refetch
  const sendRefetchChallenge = () => {
    if (!userProfile) return;
    const payload: WSPayload = {
      userId: userProfile.userId,
      challengeId: challengeid,
      password: password || "",
      token: `Bearer ${accessToken}`,
    };
    sendWSEvent(RETRIEVE_CHALLENGE, payload, (response) =>
      eventCallbacks[RETRIEVE_CHALLENGE](response, { setChallenge, setError, setOutgoingEvents })
    );
  };

  // when user clicks back
  const handleBack = () => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      wsRef.current.close();
    }
    navigate("/challenges");
  };

  // color based on latency
  const latencyColor =
    latency === null
      ? "text-gray-400"
      : latency < 150
        ? "text-green-500"
        : latency < 400
          ? "text-yellow-400"
          : "text-red-500";

  // convert 70s => 01:10
  const formatSeconds = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // this runs timer and updates countdown every sec
  useEffect(() => {
    if (!challenge?.startTime || !challenge?.timeLimit) return;

    const endTime = challenge.startTime * 1000 + challenge.timeLimit;

    const tick = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setCountdown(remaining);
    };

    tick(); // run once
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [challenge?.startTime, challenge?.timeLimit]);

  return (
    <div className="p-4 space-y-4 text-sm">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Join Challenge</h1>
        { }
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

      {/* debug info */}
      <div className="space-y-1">
        <p><strong>Challenge ID:</strong> {challengeid || "N/A"}</p>
        <p><strong>Password:</strong> {password || "None"}</p>
        <p><strong>Access Token:</strong> {accessToken || "Missing"}</p>
        <p><strong>WebSocket Status:</strong> {wsStatus}</p>
        <p>
          <strong>Latency:</strong>{" "}
          <span className={latencyColor}>{latency !== null ? `${latency} ms` : "N/A"}</span>
        </p>
      </div>

      {/* show time details if challenge is loaded */}
      {challenge && (
        <div className="space-y-1">
          <p><strong>Start Time:</strong> {new Date(challenge.startTime * 1000).toLocaleString()}</p>
          <p><strong>Time Limit:</strong> {formatSeconds(Math.floor(challenge.timeLimit / 1000))}</p>
          <p><strong>Countdown:</strong> {formatSeconds(countdown)}</p>
        </div>
      )}

      {/* show error if any */}
      {err && (
        <pre className="bg-gray-900 text-white p-2 rounded text-xs whitespace-pre-wrap">
          {JSON.stringify(err, null, 2)}
        </pre>
      )}

      {/* raw challenge dump */}
      {challenge && (
        <pre className="bg-gray-900 text-white p-2 rounded text-xs whitespace-pre-wrap">
          {JSON.stringify(challenge, null, 2)}
        </pre>
      )}

      {/* logs section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LogPanel title="📤 Outgoing Events" items={outgoingEvents} />
        <LogPanel title="📡 Subscribed Events" items={subscribedEvents} />
      </div>

      {/* Owner Abandoned Overlay */}
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

// a small component to show logs in a scrollable box
const LogPanel: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div>
    <h2 className="text-sm font-semibold mb-1">{title}</h2>
    <div className="bg-gray-900 text-white p-2 rounded max-h-64 overflow-y-auto text-xs whitespace-pre-wrap">
      {items.length === 0 ? <p className="text-gray-400">None</p> : items.map((msg, i) => <pre key={i} className="mb-2">{msg}</pre>)}
    </div>
  </div>
);

export default JoinChallenge;