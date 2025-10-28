import { useEffect, useRef, useState } from "react";
import { initWSHandler, sendWSEvent } from "../lib/wsHandler";
import { getWS } from "../lib/ws";
import {
  JOIN_CHALLENGE,
  USER_JOINED,
  RETRIEVE_CHALLENGE,
  USER_LEFT,
  OWNER_LEFT,
  OWNER_JOINED,
  CREATOR_ABANDON,
  GET_CHALLENGE_MIN,
  GET_PARTICIPANTS_DATA,
  GET_CHAT,
  GET_NOTIFICATIONS,
  GET_LEADERBOARD,
  GAME_FINISHED,
} from "@/constants/eventTypes";
import { useWSEvent } from "../hooks/useWSEvent";
import { toast } from "sonner";
import { eventCallbacks } from "@/services/eventCallback";
import { challengeTokenService } from "@/services/challengeTokenService";

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
  setFinishedOverlay?: React.Dispatch<React.SetStateAction<{ visible: boolean; countdown: number }>>;
}

export const useChallengeWebSocket = ({
  userProfile,
  challengeid,
  password,
  accessToken,
  setParticipantIds,
  setProblemIds,
  setAbandonOverlay,
  setFinishedOverlay,
}: UseChallengeWebSocketProps) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [wsStatus, setWsStatus] = useState("Connecting");
  const [outgoingEvents, setOutgoingEvents] = useState<string[]>([]);
  const [subscribedEvents, setSubscribedEvents] = useState<string[]>([]);
  const [challenge, setChallenge] = useState<any>();
  const [err, setError] = useState<string>();
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
        // ensure join sets challengeToken on state and cookies so UI can use it for sends
        if (data?.type === JOIN_CHALLENGE && data?.payload?.challengeToken) {
          const challengeToken = data.payload.challengeToken;
          const challengeId = data.payload.challengeId || challengeid;
          //store in state
          setChallenge((prev: any) => ({ ...(prev || {}), challengeToken }));
          //store in cookies
          challengeTokenService.setChallengeToken(challengeToken, challengeId);
        }
        if (eventCallbacks[data.type]) {
          eventCallbacks[data.type](data, {
            setChallenge,
            setError,
            setOutgoingEvents,
            setParticipantIds,
            setProblemIds,
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
            //store token in cookies
            challengeTokenService.setChallengeToken(token, challengeid);
            //now that we have the token, make authenticated requests
            const authenticatedPayload = { ...payload, challengeToken: token };

            // Granular fetches: min, participants, chat, notifications, leaderboard
            // 1) Challenge Min
            sendWSEvent(GET_CHALLENGE_MIN, authenticatedPayload, (resp) => {
              // merge min into challenge
              const min = resp?.payload;
              if (min) setChallenge((prev: any) => ({ ...(prev || {}), ...min }));
            });
            // 2) Participants
            sendWSEvent(GET_PARTICIPANTS_DATA, authenticatedPayload, (resp) => {
              const participants = resp?.payload?.participants || {};
              setChallenge((prev: any) => ({ ...(prev || {}), participants }));
              setParticipantIds(Object.keys(participants || {}));
            });
            // 3) Chat and 4) Notifications from MongoDB
            sendWSEvent(GET_CHAT, authenticatedPayload, (resp) =>
              eventCallbacks[GET_CHAT](resp, { setChallenge, setError, setOutgoingEvents })
            );
            sendWSEvent(GET_NOTIFICATIONS, authenticatedPayload, (resp) =>
              eventCallbacks[GET_NOTIFICATIONS](resp, { setChallenge, setError, setOutgoingEvents })
            );
            // 5) Current leaderboard
            sendWSEvent(GET_LEADERBOARD, authenticatedPayload, (resp) =>
              eventCallbacks[GET_LEADERBOARD](resp, { setChallenge, setOutgoingEvents })
            );
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
    };

    ws.addEventListener("open", handleOpen);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("error", () => setWsStatus("Error"));
    ws.addEventListener("close", () => setWsStatus("Closed"));

    return () => {
      ws.removeEventListener("open", handleOpen);
      ws.removeEventListener("message", handleMessage);
      ws.removeEventListener("error", () => { });
      ws.removeEventListener("close", () => { });
      ws.close();
      //clear challenge token from cookies when connection is closed
      challengeTokenService.clearChallengeToken();
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
        const challengeToken = challengeTokenService.getChallengeToken();
        if (!challengeToken) return;
        const base: WSPayload = {
          userId: userProfile.userId,
          challengeId: challengeid,
          password: password || "",
          token: `Bearer ${accessToken}`,
        };
        sendWSEvent(GET_PARTICIPANTS_DATA, { ...base, challengeToken }, (resp) => {
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
  useSubscribeToEvent(GAME_FINISHED, (payload) => {
    //the event callback will handle the challenge state update and toast
    console.log("Challenge finished:", payload);
    if (setFinishedOverlay) {
      setFinishedOverlay({ visible: true, countdown: 10 });
    }
  });

  const sendRefetchChallenge = () => {
    if (!userProfile) return;
    const challengeToken = challengeTokenService.getChallengeToken();
    if (!challengeToken) return;
    const payload: WSPayload = {
      userId: userProfile.userId,
      challengeId: challengeid,
      password: password || "",
      token: `Bearer ${accessToken}`,
    };
    const authenticatedPayload = { ...payload, challengeToken };
    // Full refresh on demand
    sendWSEvent(GET_CHALLENGE_MIN, authenticatedPayload, (resp) => {
      const min = resp?.payload;
      if (min) setChallenge((prev: any) => ({ ...(prev || {}), ...min }));
    });
    sendWSEvent(GET_PARTICIPANTS_DATA, authenticatedPayload, (resp) => {
      const participants = resp?.payload?.participants || {};
      setChallenge((prev: any) => ({ ...(prev || {}), participants }));
      setParticipantIds(Object.keys(participants || {}));
    });
    sendWSEvent(GET_CHAT, authenticatedPayload, (resp) =>
      eventCallbacks[GET_CHAT](resp, { setChallenge, setError, setOutgoingEvents })
    );
    sendWSEvent(GET_NOTIFICATIONS, authenticatedPayload, (resp) =>
      eventCallbacks[GET_NOTIFICATIONS](resp, { setChallenge, setError, setOutgoingEvents })
    );
    sendWSEvent(GET_LEADERBOARD, authenticatedPayload, (resp) =>
      eventCallbacks[GET_LEADERBOARD](resp, { setChallenge, setOutgoingEvents })
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
    sendRefetchChallenge,
    addLocalChatMessage,
  };
};