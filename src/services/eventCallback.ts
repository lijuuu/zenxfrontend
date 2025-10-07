import { toast } from "sonner";
import { PING_SERVER, JOIN_CHALLENGE, RETRIEVE_CHALLENGE, LEADERBOARD_UPDATE, PUSH_SUBMISSION, CHAT_MESSAGE, GAME_FINISHED, WHOLE_CHAT, PUSH_NEW_CHAT, WHOLE_NOTIFICATION, PUSH_NEW_NOTIFICATION, GET_NOTIFICATIONS, CURRENT_LEADERBOARD, CHALLENGE_STARTED } from "@/lib/ws";

interface WSResponse {
  type: string;
  payload?: any;
  success?: boolean;
  error?: string;
}

export const eventCallbacks: Record<string, (response: WSResponse, context: any) => void> = {
  [PING_SERVER]: (_, { setLatency, pingSentAtRef }) => {
    setLatency(Date.now() - pingSentAtRef.current);
  },
  [JOIN_CHALLENGE]: (response, { setChallenge, setError, setOutgoingEvents, setParticipantIds, setProblemIds }) => {
    setOutgoingEvents((prev: string[]) => [
      JSON.stringify({ type: JOIN_CHALLENGE, payload: response }, null, 2),
      ...prev.slice(0, 50),
    ]);
    if (response.success === false && response.error) {
      setError(response.error);
      toast.error(`Failed to join challenge: ${response.error}`);
    } else if (response?.payload?.challenge) {
      setChallenge(response?.payload.challenge);
      const participantIds = Object.keys(response?.payload?.challenge?.participants || []);
      setParticipantIds(participantIds);
      const problemIds = response?.payload?.challenge?.processedProblemIds || [];
      setProblemIds(problemIds)
      toast.success("Successfully joined challenge!");
    }
  },
  [RETRIEVE_CHALLENGE]: (response, { setChallenge, setError, setOutgoingEvents, setParticipantIds, setProblemIds }) => {
    setOutgoingEvents((prev: string[]) => [
      JSON.stringify({ type: RETRIEVE_CHALLENGE, payload: response?.payload }, null, 2),
      ...prev.slice(0, 50),
    ]);
    if (response.success === false && response.error) {
      setError(response.error);
      toast.error(`Failed to refetch challenge: ${response.error}`);
    } else if (response?.payload?.challenge) {
      const participantIds = Object.keys(response?.payload?.challenge?.participants || []);
      setParticipantIds(participantIds);
      const problemIds = response?.payload?.challenge?.processedProblemIds || [];
      setProblemIds(problemIds)
      setChallenge(response?.payload.challenge);
    }
  },
  [LEADERBOARD_UPDATE]: (response, { setOutgoingEvents, setChallenge }) => {
    setOutgoingEvents((prev: string[]) => [
      JSON.stringify({ type: LEADERBOARD_UPDATE, payload: response?.payload }, null, 2),
      ...prev.slice(0, 50),
    ]);
    if (response?.payload?.leaderboard) {
      setChallenge((prev: any) => ({ ...(prev || {}), leaderboard: response.payload.leaderboard }));
    }
  },
  [CURRENT_LEADERBOARD]: (response, { setOutgoingEvents, setChallenge }) => {
    setOutgoingEvents((prev: string[]) => [
      JSON.stringify({ type: CURRENT_LEADERBOARD, payload: response?.payload }, null, 2),
      ...prev.slice(0, 50),
    ]);
    if (response?.payload?.leaderboard) {
      setChallenge((prev: any) => ({ ...(prev || {}), leaderboard: response.payload.leaderboard }));
    }
  },
  [PUSH_SUBMISSION]: (response, { setOutgoingEvents }) => {
    setOutgoingEvents((prev: string[]) => [
      JSON.stringify({ type: PUSH_SUBMISSION, payload: response?.payload }, null, 2),
      ...prev.slice(0, 50),
    ]);
  },
  [CHAT_MESSAGE]: (response, { setOutgoingEvents }) => {
    setOutgoingEvents((prev: string[]) => [
      JSON.stringify({ type: CHAT_MESSAGE, payload: response?.payload }, null, 2),
      ...prev.slice(0, 50),
    ]);
  },
  [GAME_FINISHED]: (response, { setOutgoingEvents }) => {
    setOutgoingEvents((prev: string[]) => [
      JSON.stringify({ type: GAME_FINISHED, payload: response?.payload }, null, 2),
      ...prev.slice(0, 50),
    ]);
  },
  [CHALLENGE_STARTED]: (response, { setOutgoingEvents, setChallenge }) => {
    setOutgoingEvents((prev: string[]) => [
      JSON.stringify({ type: CHALLENGE_STARTED, payload: response?.payload }, null, 2),
      ...prev.slice(0, 50),
    ]);
    const startTime = response?.payload?.startTime;
    if (typeof startTime === 'number') {
      setChallenge((prev: any) => ({ ...(prev || {}), status: 'CHALLENGESTARTED', startTime }));
    }
  },
  // Chat incremental push: append the new chat to state
  [PUSH_NEW_CHAT]: (response, { setChallenge, setOutgoingEvents }) => {
    setOutgoingEvents((prev: string[]) => [
      JSON.stringify({ type: PUSH_NEW_CHAT, payload: response?.payload }, null, 2),
      ...prev.slice(0, 50),
    ]);
    const msg = response?.payload;
    if (!msg) return;
    // Ignore ack payloads like { message: "sent" }
    if (typeof msg === 'object' && 'message' in msg && !('userId' in msg) && !('time' in msg) && (msg.message === 'sent')) {
      return;
    }
    setChallenge((prev: any) => {
      const next = { ...(prev || {}) };
      const existing = Array.isArray(next?.chat) ? next.chat.slice() : [];
      // Deduplicate: skip if same user, same message, within 2s of last match
      const isDuplicate = existing.some((m: any) => (
        (m.userId || '') === (msg.userId || '') &&
        (m.message || m.Message || '') === (msg.message || msg.Message || '') &&
        Math.abs(((m.time || m.Time || 0) - (msg.time || msg.Time || 0))) <= 2
      ));
      if (isDuplicate) return next;
      existing.push(msg);
      next.chat = existing;
      return next;
    });
  },
  // Chat full sync: replace entire chat list
  [WHOLE_CHAT]: (response, { setChallenge, setOutgoingEvents }) => {
    setOutgoingEvents((prev: string[]) => [
      JSON.stringify({ type: WHOLE_CHAT, payload: response?.payload }, null, 2),
      ...prev.slice(0, 50),
    ]);
    const chat = response?.payload?.chat;
    if (!Array.isArray(chat)) return;
    setChallenge((prev: any) => ({ ...(prev || {}), chat }));
  },
  // Notification incremental push: append
  [PUSH_NEW_NOTIFICATION]: (response, { setChallenge, setOutgoingEvents }) => {
    setOutgoingEvents((prev: string[]) => [
      JSON.stringify({ type: PUSH_NEW_NOTIFICATION, payload: response?.payload }, null, 2),
      ...prev.slice(0, 50),
    ]);
    const notif = response?.payload;
    if (!notif) return;
    setChallenge((prev: any) => {
      const next = { ...(prev || {}) };
      const existing = Array.isArray(next?.notifications) ? next.notifications.slice() : [];
      existing.unshift(notif);
      next.notifications = existing;
      return next;
    });
    try {
      toast.success(`${notif?.type || 'Notification'}: ${notif?.message || ''}`);
    } catch (e) {
      // ignore toast failures
    }
  },
  // Notification full sync: replace
  [WHOLE_NOTIFICATION]: (response, { setChallenge, setOutgoingEvents }) => {
    setOutgoingEvents((prev: string[]) => [
      JSON.stringify({ type: WHOLE_NOTIFICATION, payload: response?.payload }, null, 2),
      ...prev.slice(0, 50),
    ]);
    const notifs = response?.payload?.notifications;
    if (!Array.isArray(notifs)) return;
    setChallenge((prev: any) => ({ ...(prev || {}), notifications: notifs }));
  },
  // Optional: GET_NOTIFICATIONS handler mirrors WHOLE_NOTIFICATION
  [GET_NOTIFICATIONS]: (response, ctx) => {
    const payload = { payload: { notifications: response?.payload?.notifications } } as WSResponse;
    (eventCallbacks[WHOLE_NOTIFICATION] as any)(payload, ctx);
  },
};