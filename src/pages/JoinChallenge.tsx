import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { initWSHandler, sendWSEvent } from "../lib/wsHandler";
import { getWS, JOIN_CHALLENGE, USER_JOINED, PING_SERVER, REFETCH_CHALLENGE, USER_LEFT, OWNER_LEFT, OWNER_JOINED } from "../lib/ws";
import { useWSEvent } from "../hooks/useWSEvent";
import { toast } from "sonner";
import { useGetUserProfile } from "@/services/useGetUserProfile";

interface WSPayload {
  userId: string;
  challengeId: string;
  password: string;
  token: string;
}

interface WSResponse {
  type: string;
  status?: string;
  payload?: any;
  error?: string;
}

//eventCallback[data.type] = func(response:payload,callback)->void
const eventCallbacks: Record<string, (response: WSResponse, context: any) => void> = {
  
  //PING_SERVER response to calculate latency
  [PING_SERVER]: (_, { setLatency, pingSentAtRef }) => {
    setLatency(Date.now() - pingSentAtRef.current);
  },

  //JOIN_CHALLENGE response to set initial challenge data
  [JOIN_CHALLENGE]: (response, { setChallenge, setError, setOutgoingEvents }) => {
    setOutgoingEvents((prev: string[]) => [
      JSON.stringify({ type: JOIN_CHALLENGE, payload: response.payload }, null, 2),
      ...prev.slice(0, 50),
    ]);
    if (response.status === "error" && response.error) {
      setError(response.error);
      toast.error(`Failed to join challenge: ${response.error}`);
    } else if (response.payload?.challenge) {
      setChallenge(response.payload.challenge);
      toast.success("Successfully joined challenge!");
    }
  },

  //REFETCH_CHALLENGE to update challenge data
  [REFETCH_CHALLENGE]: (response, { setChallenge, setError, setOutgoingEvents }) => {
    setOutgoingEvents((prev: string[]) => [
      JSON.stringify({ type: REFETCH_CHALLENGE, payload: response.payload }, null, 2),
      ...prev.slice(0, 50),
    ]);
    if (response.status === "error" && response.error) {
      setError(response.error);
      toast.error(`Failed to refetch challenge: ${response.error}`);
    } else if (response.payload?.challenge) {
      setChallenge(response.payload.challenge);
      // toast.success("Refetched challenge data");
    }
  },
};

const JoinChallenge: React.FC = () => {
  const { challengeid, password } = useParams<{ challengeid: string; password?: string }>();
  const accessToken = Cookies.get("accessToken");
  const { data: userProfile } = useGetUserProfile();
  const wsRef = useRef<WebSocket | null>(null);
  const pingSentAtRef = useRef<number>(0);


  const [wsStatus, setWsStatus] = useState("Connecting"); 
  const [outgoingEvents, setOutgoingEvents] = useState<string[]>([]);
  const [subscribedEvents, setSubscribedEvents] = useState<string[]>([]);
  const [challenge, setChallenge] = useState<any>();
  const [err, setError] = useState<string>();
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    if (!userProfile) {
      setWsStatus("Connecting");
      return;
    }

    //initialize WebSocket
    initWSHandler();
    wsRef.current = getWS();
    const ws = wsRef.current;

    //handle incoming WebSocket messages
    const handleMessage = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data) as WSResponse;
        if (eventCallbacks[data.type]) {
          eventCallbacks[data.type](data, { setChallenge, setError, setOutgoingEvents, setLatency, pingSentAtRef });
        } 

        //handle refetchChallenge logic for new user joined etc.
      } catch {
        toast.error("Something went wrong"); //Invalid WebSocket message received
      }
    };

    // When WebSocket opens, send JOIN_CHALLENGE
    const handleOpen = () => {
      setWsStatus("Open");
      const payload: WSPayload = {
        userId: userProfile.userID,
        challengeId: challengeid,
        password: password || "",
        token: `Bearer ${accessToken}`,
      };
      sendWSEvent(JOIN_CHALLENGE, payload, (response) =>
        eventCallbacks[JOIN_CHALLENGE](response, { setChallenge, setError, setOutgoingEvents })
      );
    };

    // Set up WebSocket event listeners
    ws.addEventListener("open", handleOpen);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("error", () => setWsStatus("Error"));
    ws.addEventListener("close", () => setWsStatus("Closed"));

    // Ping server every 3 seconds to check latency
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        pingSentAtRef.current = Date.now();
        sendWSEvent(PING_SERVER, {}, (response) =>
          eventCallbacks[PING_SERVER](response, { setLatency, pingSentAtRef })
        );
      }
    }, 3000);

    // Cleanup on component unmount
    return () => {
      clearInterval(pingInterval);
      ws.removeEventListener("open", handleOpen);
      ws.removeEventListener("message", handleMessage);
      ws.removeEventListener("error", () => {});
      ws.removeEventListener("close", () => {});
      ws.close();
    };
  }, [userProfile, challengeid, password, accessToken]);

  // Custom hook to handle event subscriptions
  const useSubscribeToEvent = (event: string, message: string) => {
    useWSEvent(event, (payload) => {
      setSubscribedEvents((prev) => [
        JSON.stringify({ event, payload }, null, 2),
        ...prev.slice(0, 50),
      ]);
      sendRefetchChallenge()
      toast.success(message.replace("{}", payload?.userId || "unknown"));
    });
  };

  // Subscribe to WebSocket events
  useSubscribeToEvent(USER_JOINED, "User joined: {}");
  useSubscribeToEvent(USER_LEFT, "User left: {}");
  useSubscribeToEvent(OWNER_LEFT, "Owner left: {}");
  useSubscribeToEvent(OWNER_JOINED, "Owner joined: {}");

  // Trigger refetching challenge data
  const sendRefetchChallenge = () => {
    if (!userProfile) return;
    const payload: WSPayload = {
      userId: userProfile.userID,
      challengeId: challengeid,
      password: password || "",
      token: `Bearer ${accessToken}`,
    };
    sendWSEvent(REFETCH_CHALLENGE, payload, (response) =>
      eventCallbacks[REFETCH_CHALLENGE](response, { setChallenge, setError, setOutgoingEvents })
    );
  };

  // Handle back button to close WebSocket and navigate
  const handleBack = () => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      wsRef.current.close();
    }
    window.location.href = "/";
  };

  // Color-code latency for better UX
  const latencyColor =
    latency === null
      ? "text-gray-400"
      : latency < 150
        ? "text-green-500"
        : latency < 400
          ? "text-yellow-400"
          : "text-red-500";

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
        <p><strong>Password:</strong> {password || "None"}</p>
        <p><strong>Access Token:</strong> {accessToken || "Missing"}</p>
        <p><strong>WebSocket Status:</strong> {wsStatus}</p>
        <p>
          <strong>Latency:</strong> <span className={latencyColor}>{latency !== null ? `${latency} ms` : "N/A"}</span>
        </p>
      </div>

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
    </div>
  );
};

// Display panel for event logs
const LogPanel: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div>
    <h2 className="text-sm font-semibold mb-1">{title}</h2>
    <div className="bg-gray-900 text-white p-2 rounded max-h-64 overflow-y-auto text-xs whitespace-pre-wrap">
      {items.length === 0 ? <p className="text-gray-400">None</p> : items.map((msg, i) => <pre key={i} className="mb-2">{msg}</pre>)}
    </div>
  </div>
);

export default JoinChallenge;