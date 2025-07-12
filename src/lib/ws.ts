let socket: WebSocket | null = null;

export const getWS = (url: string = "ws://localhost:7777/ws"): WebSocket => {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket(url);
  }
  return socket;
};

export const PING_SERVER = "PING_SERVER"

export const USER_JOINED = "USER_JOINED"
export const USER_LEFT = "USER_LEFT"
export const CREATOR_ABANDON = "CREATOR_ABANDON"
export const CHALLENGE_STARTED = "CHALLENGE_STARTED"
export const OWNER_LEFT = "OWNER_LEFT"
export const OWNER_JOINED = "OWNER_JOINED"

export const JOIN_CHALLENGE = "JOIN_CHALLENGE"
export const REFETCH_CHALLENGE = "REFETCH_CHALLENGE"