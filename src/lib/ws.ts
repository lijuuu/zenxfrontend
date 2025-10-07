let socket: WebSocket | null = null;

export const getWS = (url: string = (import.meta as any).env?.VITE_WS_URL || "ws://localhost:7777/ws"): WebSocket => {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket(url);
  }
  return socket;
};

// WebSocket event constants (must mirror backend constants)
export const PING_SERVER = "PING_SERVER";

export const USER_JOINED = "USER_JOINED";
export const USER_LEFT = "USER_LEFT";
export const CREATOR_ABANDON = "CREATOR_ABANDON";
export const CHALLENGE_STARTED = "CHALLENGE_STARTED";
export const OWNER_LEFT = "OWNER_LEFT";
export const OWNER_JOINED = "OWNER_JOINED";
export const NEW_OWNER_ASSIGNED = "NEW_OWNER_ASSIGNED";

export const JOIN_CHALLENGE = "JOIN_CHALLENGE";
export const RETRIEVE_CHALLENGE = "RETRIEVE_CHALLENGE";

export const CURRENT_LEADERBOARD = "CURRENT_LEADERBOARD";
export const LEADERBOARD_UPDATE = "LEADERBOARD_UPDATE";
export const NEW_SUBMISSION = "NEW_SUBMISSION";
export const PUSH_SUBMISSION = "PUSHSUBMISSION";
export const CHAT_MESSAGE = "CHAT_MESSAGE";
export const GAME_FINISHED = "GAME_FINISHED";
// Chat and Notification specific
export const WHOLE_CHAT = "WHOLECHAT";
export const PUSH_NEW_CHAT = "PUSHNEWCHAT";
export const WHOLE_NOTIFICATION = "WHOLENOTIFICATION";
export const PUSH_NEW_NOTIFICATION = "PUSHNEWNOTIFICATION";
export const GET_NOTIFICATIONS = "GET_NOTIFICATIONS";
// Granular BFF fetches
export const GET_CHALLENGE_MIN = "GET_CHALLENGE_MIN";
export const GET_CHALLENGE_DATA = "GET_CHALLENGE_DATA";
export const GET_PARTICIPANT_DATA = "GET_PARTICIPANT_DATA";
export const GET_PARTICIPANTS_DATA = "GET_PARTICIPANTS_DATA";