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
  WHOLE_CHAT,
  WHOLE_NOTIFICATION,
  GET_CHALLENGE_MIN,
  GET_PARTICIPANTS_DATA,
  CURRENT_LEADERBOARD,
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
  const challengeTokenRef = useRef<string | null>(null);

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
        // ensure join sets challengeToken on state so UI can use it for sends
        if (data?.type === JOIN_CHALLENGE && data?.payload?.challengeToken) {
          setChallenge((prev: any) => ({ ...(prev || {}), challengeToken: data.payload.challengeToken }));
        }
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
      sendWSEvent(JOIN_CHALLENGE, payload, (response) => {
        // capture backend-issued challengeToken for authenticated granular calls
        try {
          const token = response?.payload?.challengeToken;
          if (typeof token === "string" && token.length > 0) {
            challengeTokenRef.current = token;
          }
        } catch (e) {
          // ignore token capture errors
        }
        eventCallbacks[JOIN_CHALLENGE](response, {
          setChallenge,
          setError,
          setOutgoingEvents,
          setParticipantIds,
          setProblemIds,
        });
      });

      // Granular fetches: min, participants, chat, notifications, leaderboard
      // 1) Challenge Min
      sendWSEvent(GET_CHALLENGE_MIN, { ...payload, challengeToken: challengeTokenRef.current }, (resp) => {
        // merge min into challenge
        const min = resp?.payload;
        if (min) setChallenge((prev: any) => ({ ...(prev || {}), ...min }));
      });
      // 2) Participants
      sendWSEvent(GET_PARTICIPANTS_DATA, { ...payload, challengeToken: challengeTokenRef.current }, (resp) => {
        const participants = resp?.payload?.participants || {};
        setChallenge((prev: any) => ({ ...(prev || {}), participants }));
        setParticipantIds(Object.keys(participants || {}));
      });
      // 3) Chat and 4) Notifications from MongoDB
      sendWSEvent(WHOLE_CHAT, { ...payload, challengeToken: challengeTokenRef.current }, (resp) =>
        eventCallbacks[WHOLE_CHAT](resp, { setChallenge, setError, setOutgoingEvents })
      );
      sendWSEvent(WHOLE_NOTIFICATION, { ...payload, challengeToken: challengeTokenRef.current }, (resp) =>
        eventCallbacks[WHOLE_NOTIFICATION](resp, { setChallenge, setError, setOutgoingEvents })
      );
      // 5) Current leaderboard
      sendWSEvent(CURRENT_LEADERBOARD, { ...payload, challengeToken: challengeTokenRef.current }, (resp) =>
        eventCallbacks[CURRENT_LEADERBOARD](resp, { setChallenge, setOutgoingEvents })
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
      ws.removeEventListener("error", () => { });
      ws.removeEventListener("close", () => { });
      ws.close();
    };
  }, [userProfile, challengeid, password, accessToken, setParticipantIds, setProblemIds]);

  const useSubscribeToEvent = (event: string, callback: (payload: any) => void) => {
    useWSEvent(event, (message: any) => {
      const payload = message?.payload ?? message;
      setSubscribedEvents((prev) => [
        JSON.stringify({ event, payload }, null, 2),
        ...prev.slice(0, 50),
      ]);
      // On presence events, re-fetch participants
      if (event === USER_JOINED || event === USER_LEFT || event === OWNER_JOINED || event === OWNER_LEFT) {
        if (!userProfile) return;
        const base: WSPayload = {
          userId: userProfile.userId,
          challengeId: challengeid,
          password: password || "",
          token: `Bearer ${accessToken}`,
        };
        sendWSEvent(GET_PARTICIPANTS_DATA, base, (resp) => {
          const participants = resp?.payload?.participants || {};
          setChallenge((prev: any) => ({ ...(prev || {}), participants }));
          setParticipantIds(Object.keys(participants || {}));
        });
      }
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
    // Full refresh on demand
    sendWSEvent(GET_CHALLENGE_MIN, { ...payload, challengeToken: challengeTokenRef.current }, (resp) => {
      const min = resp?.payload;
      if (min) setChallenge((prev: any) => ({ ...(prev || {}), ...min }));
    });
    sendWSEvent(GET_PARTICIPANTS_DATA, { ...payload, challengeToken: challengeTokenRef.current }, (resp) => {
      const participants = resp?.payload?.participants || {};
      setChallenge((prev: any) => ({ ...(prev || {}), participants }));
      setParticipantIds(Object.keys(participants || {}));
    });
    sendWSEvent(WHOLE_CHAT, { ...payload, challengeToken: challengeTokenRef.current }, (resp) =>
      eventCallbacks[WHOLE_CHAT](resp, { setChallenge, setError, setOutgoingEvents })
    );
    sendWSEvent(WHOLE_NOTIFICATION, { ...payload, challengeToken: challengeTokenRef.current }, (resp) =>
      eventCallbacks[WHOLE_NOTIFICATION](resp, { setChallenge, setError, setOutgoingEvents })
    );
    sendWSEvent(CURRENT_LEADERBOARD, { ...payload, challengeToken: challengeTokenRef.current }, (resp) =>
      eventCallbacks[CURRENT_LEADERBOARD](resp, { setChallenge, setOutgoingEvents })
    );
  };

  const addLocalChatMessage = (message: any) => {
    setChallenge((prev: any) => {
      const next = { ...(prev || {}) };
      const existing = Array.isArray(next?.chat) ? next.chat.slice() : [];
      existing.push(message);
      next.chat = existing;
      return next;
    });
  };

  return {
    wsStatus,
    outgoingEvents,
    subscribedEvents,
    challenge,
    err,
    latency,
    sendRefetchChallenge,
    addLocalChatMessage,
  };
};