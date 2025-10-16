let socket: WebSocket | null = null;

export const getWS = (url: string = (import.meta as any).env?.VITE_WS_URL || "ws://localhost:7777/ws"): WebSocket => {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket(url);
  }
  return socket;
};

//websocket connection utility - event constants moved to @/constants/eventTypes.ts