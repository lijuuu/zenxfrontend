import { useEffect, useRef, useState } from "react";
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
import { eventCallbacks } from "@/services/eventCallback";

interface WSPayload {
  userId: string;
  challengeId: string;
  password: string;
  token: string;
}

interface UseChallengeWebSocketProps {
  userProfile: any;
  challengeid: string;
  password?: string;
  accessToken?: string;
  setParticipantIds: React.Dispatch<React.SetStateAction<string[]>>;
  setProblemIds: React.Dispatch<React.SetStateAction<string[]>>;
  setAbandonOverlay: React.Dispatch<React.SetStateAction<{ visible: boolean; countdown: number }>>;
}

export const useChallengeWebSocket = ({
  userProfile,
  challengeid,
  password,
  accessToken,
  setParticipantIds,
  setProblemIds,
  setAbandonOverlay,
}: UseChallengeWebSocketProps) => {
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

    initWSHandler();
    wsRef.current = getWS();
    const ws = wsRef.current;

    const handleMessage = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        if (eventCallbacks[data.type]) {
          eventCallbacks[data.type](data, {
            setChallenge,
            setError,
            setOutgoingEvents,
            setParticipantIds,
            setProblemIds,
            setLatency,
            pingSentAtRef,
          });
        }
      } catch (err) {
        console.error("ws message parse error:", err);
        toast.error(`Something went wrong: ${(err as Error).message}`);
      }
    };

    const handleOpen = () => {
      setWsStatus("Open");
      const payload: WSPayload = {
        userId: userProfile.userId,
        challengeId: challengeid,
        password: password || "",
        token: `Bearer ${accessToken}`,
      };
      sendWSEvent(JOIN_CHALLENGE, payload, (response) =>
        eventCallbacks[JOIN_CHALLENGE](response, {
          setChallenge,
          setError,
          setOutgoingEvents,
          setParticipantIds,
          setProblemIds,
        })
      );
    };

    ws.addEventListener("open", handleOpen);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("error", () => setWsStatus("Error"));
    ws.addEventListener("close", () => setWsStatus("Closed"));

    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        pingSentAtRef.current = Date.now();
        sendWSEvent(PING_SERVER, {}, (response) =>
          eventCallbacks[PING_SERVER](response, { setLatency, pingSentAtRef })
        );
      }
    }, 3000);

    return () => {
      clearInterval(pingInterval);
      ws.removeEventListener("open", handleOpen);
      ws.removeEventListener("message", handleMessage);
      ws.removeEventListener("error", () => {});
      ws.removeEventListener("close", () => {});
      ws.close();
    };
  }, [userProfile, challengeid, password, accessToken]);

  const useSubscribeToEvent = (event: string, callback: (payload: any) => void) => {
    useWSEvent(event, (payload) => {
      setSubscribedEvents((prev) => [
        JSON.stringify({ event, payload }, null, 2),
        ...prev.slice(0, 50),
      ]);
      sendRefetchChallenge();
      callback(payload);
    });
  };

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
    setAbandonOverlay({ visible: true, countdown: 5 });
  });

  const sendRefetchChallenge = () => {
    if (!userProfile) return;
    const payload: WSPayload = {
      userId: userProfile.userId,
      challengeId: challengeid,
      password: password || "",
      token: `Bearer ${accessToken}`,
    };
    sendWSEvent(RETRIEVE_CHALLENGE, payload, (response) =>
      eventCallbacks[RETRIEVE_CHALLENGE](response, {
        setChallenge,
        setError,
        setOutgoingEvents,
        setParticipantIds,
        setProblemIds
      })
    );
  };

  return {
    wsStatus,
    outgoingEvents,
    subscribedEvents,
    challenge,
    err,
    latency,
    sendRefetchChallenge,
  };
};